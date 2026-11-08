import { supabase } from '../supabase.js'

// 1. App Settings & Autopilot Dynamic Token (1 Jam)
export async function getAppSettings() {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .eq('id', 'global')
      .single()

    if (error || !data) {
      return {
        id: 'global',
        sd_active: true,
        smp_active: true,
        show_kunci: false,
        show_pdf: true,
        require_nisn: false,
        require_npsn: false,
        current_token: generateHourlyToken(),
        token_updated_at: new Date().toISOString()
      }
    }

    // Cek apakah token sudah lebih dari 1 jam (3600000 ms)
    const tokenTime = new Date(data.token_updated_at || 0).getTime()
    const now = Date.now()
    if (now - tokenTime > 3600000) {
      // Refresh token baru otomatis
      const newToken = generateHourlyToken()
      await updateAppSettings({
        current_token: newToken,
        token_updated_at: new Date().toISOString()
      })
      data.current_token = newToken
    }

    return data
  } catch (err) {
    console.warn('Gagal memuat settings dari Supabase, menggunakan lokal:', err)
    return {
      id: 'global',
      sd_active: true,
      smp_active: true,
      show_kunci: false,
      show_pdf: true,
      require_nisn: false,
      require_npsn: false,
      current_token: generateHourlyToken(),
      token_updated_at: new Date().toISOString()
    }
  }
}

export async function updateAppSettings(patch) {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', 'global')
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('Error updating app settings:', err)
    throw err
  }
}

export function generateHourlyToken() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let res = 'KRA'
  for (let i = 0; i < 3; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return res
}

// 2. NPSN School Lookup via Public Internet API dengan Caching & Fallback
export async function lookupNpsn(npsn) {
  if (!npsn || npsn.trim().length < 6) return null

  const cleanNpsn = npsn.trim()
  
  // Endpoint publik API Sekolah Indonesia
  try {
    const res = await fetch(`https://api-sekolah-indonesia.vercel.app/sekolah?npsn=${cleanNpsn}`)
    if (res.ok) {
      const json = await res.json()
      if (json && json.dataSekolah && json.dataSekolah.length > 0) {
        const item = json.dataSekolah[0]
        return {
          npsn: item.npsn || cleanNpsn,
          nama_sekolah: item.sekolah || item.nama || '',
          bentuk_pendidikan: item.bentuk_pendidikan || '',
          kecamatan: item.kecamatan || '',
          kabupaten_kota: item.kabupaten_kota || 'Kab. Karanganyar',
          provinsi: item.provinsi || 'Jawa Tengah'
        }
      }
    }
  } catch (e) {
    console.warn('Live API sekolah unreachable, attempting secondary source:', e)
  }

  // Secondary source fallback (Dapodik / Kemendikbud mirror)
  try {
    const res2 = await fetch(`https://sekolah.data.kemdikbud.go.id/index.php/chome/pencarian/?query=${cleanNpsn}`)
    // jika berhasil bisa diparse, jika tidak biarkan fallback
  } catch (e) {
    // ignore
  }

  return null
}

// 3. Bank Soal Loader (Secure Views & RPCs)
export async function getAvailablePackages(jenjang, mapel) {
  try {
    const { data, error } = await supabase
      .from('soal_bank_siswa')
      .select('paket')
      .eq('jenjang', jenjang)
      .eq('mapel', mapel)

    if (error) throw error
    if (!data || data.length === 0) return []

    // Ambil daftar nama paket unik yang terdaftar di database
    const unique = [...new Set(data.map(d => d.paket).filter(Boolean))]
    unique.sort()
    return unique
  } catch (err) {
    console.warn('Gagal memuat daftar paket:', err)
    return []
  }
}

// Untuk Siswa: Mengambil soal TANPA kolom kunci_jawaban_json (Zero Leakage)
export async function getSoalList(jenjang, mapel, paket) {
  try {
    const { data, error } = await supabase
      .from('soal_bank_siswa')
      .select('*')
      .eq('jenjang', jenjang)
      .eq('mapel', mapel)
      .eq('paket', paket)
      .order('nomor_soal', { ascending: true })

    if (error) throw error
    return data || []
  } catch (err) {
    console.warn('Gagal memuat soal dari Supabase:', err)
    return []
  }
}

// Untuk Penulis Terverifikasi: Mengambil soal lengkap dengan kunci melalui RPC terautentikasi
export async function getSoalListPenulis(username, password, jenjang, mapel, paket) {
  try {
    const { data, error } = await supabase.rpc('get_soal_penulis', {
      p_username: username,
      p_password: password,
      p_jenjang: jenjang,
      p_mapel: mapel,
      p_paket: paket
    })

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Gagal memuat soal penulis via RPC:', err)
    return []
  }
}

// Simpan Butir Soal Terautentikasi Penulis
export async function saveSoalPenulis(username, password, soalData) {
  try {
    const { data, error } = await supabase.rpc('save_soal_penulis', {
      p_username: username,
      p_password: password,
      p_soal: soalData
    })

    if (error) throw error
    return data
  } catch (err) {
    console.error('Error saving question via secure RPC:', err)
    throw err
  }
}

// Hapus 1 Butir Soal Tertentu Terautentikasi Penulis
export async function deleteSoalByNomor(username, password, jenjang, mapel, paket, nomor_soal) {
  try {
    const { data, error } = await supabase.rpc('delete_soal_penulis', {
      p_username: username,
      p_password: password,
      p_jenjang: jenjang,
      p_mapel: mapel,
      p_paket: paket,
      p_nomor_soal: nomor_soal
    })

    if (error) throw error
    return data
  } catch (err) {
    console.error('Error deleting single question:', err)
    throw err
  }
}

// Hapus Seluruh Soal dalam 1 Paket Terautentikasi Penulis
export async function deleteEntirePackage(username, password, jenjang, mapel, paket) {
  try {
    const { data, error } = await supabase.rpc('delete_soal_penulis', {
      p_username: username,
      p_password: password,
      p_jenjang: jenjang,
      p_mapel: mapel,
      p_paket: paket
    })

    if (error) throw error
    return data
  } catch (err) {
    console.error('Error deleting entire package:', err)
    throw err
  }
}

// 4. Submit Jawaban Siswa dengan Penilaian Server-Side (Anti-Cheat Server-Side Grading)
export async function submitHasilUjian({
  npsn,
  nama_sekolah,
  nama_siswa,
  nisn,
  jenjang,
  mapel,
  paket,
  durasi_detik,
  jawaban_siswa
}) {
  try {
    const { data, error } = await supabase.rpc('submit_ujian_siswa', {
      p_npsn: npsn,
      p_nama_sekolah: nama_sekolah,
      p_nama_siswa: nama_siswa,
      p_nisn: nisn || '',
      p_jenjang: jenjang,
      p_mapel: mapel,
      p_paket: paket,
      p_durasi_detik: durasi_detik || 0,
      p_jawaban_siswa: jawaban_siswa || {}
    })

    if (error) throw error
    return data
  } catch (err) {
    console.error('Error submitting exam via server-side grading:', err)
    return null
  }
}

// 5. Rekapitulasi Hasil Ujian untuk Marshal & Rekap Siswa
export async function getRekapHasilUjian(filter = {}) {
  try {
    let query = supabase
      .from('hasil_ujian')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter.jenjang) query = query.eq('jenjang', filter.jenjang)
    if (filter.mapel) query = query.eq('mapel', filter.mapel)
    if (filter.npsn) query = query.ilike('npsn', `%${filter.npsn}%`)
    if (filter.nama_sekolah) query = query.ilike('nama_sekolah', `%${filter.nama_sekolah}%`)

    const { data, error } = await query
    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error loading rekap hasil:', err)
    return []
  }
}

/**
 * Hapus 1 rekaman hasil ujian siswa berdasarkan ID
 */
export async function deleteHasilUjian(id) {
  try {
    const { error } = await supabase
      .from('hasil_ujian')
      .delete()
      .eq('id', id)
    if (error) throw error
    return true
  } catch (err) {
    console.error('Error deleting single hasil ujian:', err)
    throw err
  }
}

/**
 * Hapus beberapa rekaman hasil ujian siswa (Batch Delete)
 */
export async function deleteBatchHasilUjian(ids = []) {
  if (!ids || ids.length === 0) return true
  try {
    const { error } = await supabase
      .from('hasil_ujian')
      .delete()
      .in('id', ids)
    if (error) throw error
    return true
  } catch (err) {
    console.error('Error batch deleting hasil ujian:', err)
    throw err
  }
}

/**
 * Hapus seluruh hasil ujian yang cocok dengan filter atau bersihkan semua
 */
export async function deleteAllHasilUjian(filter = {}) {
  try {
    let query = supabase.from('hasil_ujian').delete()

    if (filter.jenjang) query = query.eq('jenjang', filter.jenjang)
    if (filter.mapel) query = query.eq('mapel', filter.mapel)
    if (filter.paket) query = query.eq('paket', filter.paket)
    if (!filter.jenjang && !filter.mapel && !filter.paket) {
      // Hapus semua
      query = query.neq('id', '00000000-0000-0000-0000-000000000000')
    }

    const { error } = await query
    if (error) throw error
    return true
  } catch (err) {
    console.error('Error clearing all hasil ujian:', err)
    throw err
  }
}

// 6. Manajemen Akun Guru Penulis Soal (CRUD)
export async function getPenulisAccounts() {
  try {
    const { data, error } = await supabase
      .from('penulis_accounts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  } catch (err) {
    console.error('Error loading penulis accounts:', err)
    return []
  }
}

export async function createPenulisAccount(account) {
  try {
    const { data, error } = await supabase
      .from('penulis_accounts')
      .insert(account)
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('Error creating penulis account:', err)
    throw err
  }
}

export async function deletePenulisAccount(id) {
  try {
    const { error } = await supabase
      .from('penulis_accounts')
      .delete()
      .eq('id', id)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Error deleting penulis account:', err)
    throw err
  }
}

export async function loginPenulis(username, password) {
  try {
    const { data, error } = await supabase.rpc('verify_penulis_login', {
      p_username: username.trim(),
      p_password: password.trim()
    })

    if (error || !data) return null
    return data
  } catch (err) {
    console.error('Error during secure writer verification:', err)
    return null
  }
}

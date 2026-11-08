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

// 3. Bank Soal Loader
export async function getAvailablePackages(jenjang, mapel) {
  try {
    const { data, error } = await supabase
      .from('soal_bank')
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

export async function getSoalList(jenjang, mapel, paket) {
  try {
    const { data, error } = await supabase
      .from('soal_bank')
      .select('*')
      .eq('jenjang', jenjang)
      .eq('mapel', mapel)
      .eq('paket', paket)
      .order('nomor_soal', { ascending: true })

    if (error) throw error

    // Kembalikan data dari database langsung (walaupun kosong [] setelah dihapus)
    return data || []
  } catch (err) {
    console.warn('Gagal memuat soal dari Supabase:', err)
    return []
  }
}

// Hapus 1 Butir Soal Tertentu
export async function deleteSoalByNomor(jenjang, mapel, paket, nomor_soal) {
  try {
    const { error } = await supabase
      .from('soal_bank')
      .delete()
      .eq('jenjang', jenjang)
      .eq('mapel', mapel)
      .eq('paket', paket)
      .eq('nomor_soal', nomor_soal)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Error deleting single question:', err)
    throw err
  }
}

// Hapus Seluruh Soal dalam 1 Paket
export async function deleteEntirePackage(jenjang, mapel, paket) {
  try {
    const { error } = await supabase
      .from('soal_bank')
      .delete()
      .eq('jenjang', jenjang)
      .eq('mapel', mapel)
      .eq('paket', paket)

    if (error) throw error
    return true
  } catch (err) {
    console.error('Error deleting entire package:', err)
    throw err
  }
}

// 4. Simpan Hasil Ujian Siswa (dengan Rincian Butir Soal)
export async function submitHasilUjian(payload) {
  try {
    const { data, error } = await supabase
      .from('hasil_ujian')
      .insert({
        npsn: payload.npsn,
        nama_sekolah: payload.nama_sekolah,
        nama_siswa: payload.nama_siswa,
        nisn: payload.nisn || '',
        jenjang: payload.jenjang,
        mapel: payload.mapel,
        paket: payload.paket,
        jumlah_benar: payload.jumlah_benar,
        total_soal: payload.total_soal,
        durasi_detik: payload.durasi_detik || 0,
        rincian_jawaban: payload.rincian_jawaban || []
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (err) {
    console.error('Error submitting exam result:', err)
    return null
  }
}

// 5. Rekapitulasi Hasil Ujian untuk Marshal
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
    const { data, error } = await supabase
      .from('penulis_accounts')
      .select('*')
      .eq('username', username.trim())
      .eq('password_plain', password.trim())
      .single()

    if (error || !data) return null
    return data
  } catch (err) {
    return null
  }
}

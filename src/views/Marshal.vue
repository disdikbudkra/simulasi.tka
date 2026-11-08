<template>
  <div class="min-h-screen bg-[#f1f5f9] flex flex-col font-sans">
    <!-- Header CBT Resmi Disdikbud Karanganyar -->
    <CBTHeader />

    <!-- 1. LOGIN SCREEN MARSHAL -->
    <div v-if="!isLoggedIn" class="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-amber-600 to-amber-700 p-6 text-white text-center">
          <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h2 class="text-xl font-bold tracking-wide">PORTAL MARSHAL</h2>
          <p class="text-xs text-amber-100 mt-1">Dinas Pendidikan dan Kebudayaan Kab. Karanganyar</p>
        </div>

        <form @submit.prevent="handleLogin" class="p-6 sm:p-8 space-y-4">
          <div v-if="authError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
            {{ authError }}
          </div>

          <div v-if="resetSuccessMsg" class="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-700 font-medium">
            {{ resetSuccessMsg }}
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Email Resmi Admin</label>
            <input 
              v-model="loginEmail" 
              type="email" 
              required 
              placeholder="Masukkan email resmi admin"
              class="w-full border-gray-300 rounded-lg p-2.5 text-sm focus:ring-amber-500 focus:border-amber-500 bg-white"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Kata Sandi</label>
            <div class="relative">
              <input 
                v-model="loginPassword" 
                :type="showLoginPassword ? 'text' : 'password'" 
                required 
                placeholder="Masukkan kata sandi"
                class="w-full border-gray-300 rounded-lg p-2.5 text-sm focus:ring-amber-500 focus:border-amber-500 pr-10 bg-white"
              />
              <button 
                type="button" 
                @click="showLoginPassword = !showLoginPassword"
                class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <!-- Ikon Mata Terbuka -->
                <svg v-if="!showLoginPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                <!-- Ikon Mata Tertutup -->
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-end text-xs pt-1">
            <button 
              type="button" 
              @click="handleForgotPassword"
              class="text-amber-700 font-semibold hover:underline"
            >
              Lupa Password?
            </button>
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 text-sm mt-4"
          >
            <span v-if="isLoading">Memproses...</span>
            <span v-else>MASUK KE DASHBOARD</span>
          </button>
        </form>
      </div>
    </div>

    <!-- 2. DASHBOARD MARSHAL (LOGGED IN) -->
    <div v-else class="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
      
      <!-- Top Bar Profile & Logout -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-wrap items-center justify-between gap-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
            M
          </div>
          <div>
            <h2 class="text-base font-bold text-gray-800">Marshal Disdikbud Karanganyar</h2>
            <p class="text-xs text-gray-500">{{ userEmail }} • Super Administrator</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span class="text-xs bg-green-100 text-green-800 font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
            <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Server Terhubung Supabase
          </span>
          <button 
            @click="handleLogout"
            class="text-xs bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 font-bold px-3.5 py-2 rounded-lg border border-gray-200 transition-colors"
          >
            Keluar
          </button>
        </div>
      </div>

      <!-- KARTU 1: CONTROL SWITCHES & TOKEN DINAMIS -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Sakelar Sistem (Col Span 2) -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
          <div class="flex items-center justify-between pb-3 border-b">
            <div>
              <h3 class="text-base font-bold text-gray-800">Pusat Kendali Sistem Simulasi</h3>
              <p class="text-xs text-gray-500">Atur ketersediaan jenjang, kunci jawaban, dan berkas laporan</p>
            </div>
            <span class="text-xs text-blue-600 font-semibold">Tersimpan Real-Time</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Switch Jenjang SD -->
            <div class="p-4 rounded-xl border flex items-center justify-between" :class="settings.sd_active ? 'border-blue-200 bg-blue-50/40' : 'border-gray-200 bg-gray-50'">
              <div>
                <div class="font-bold text-sm text-gray-800">Aktivasi Jenjang SD</div>
                <div class="text-xs text-gray-500">{{ settings.sd_active ? 'Siswa SD dapat mengakses tes' : 'Jenjang SD ditutup' }}</div>
              </div>
              <button 
                type="button" 
                @click="toggleSetting('sd_active')"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                :class="settings.sd_active ? 'bg-blue-600' : 'bg-gray-300'"
              >
                <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out" :class="settings.sd_active ? 'translate-x-5' : 'translate-x-0'"></span>
              </button>
            </div>

            <!-- Switch Jenjang SMP -->
            <div class="p-4 rounded-xl border flex items-center justify-between" :class="settings.smp_active ? 'border-blue-200 bg-blue-50/40' : 'border-gray-200 bg-gray-50'">
              <div>
                <div class="font-bold text-sm text-gray-800">Aktivasi Jenjang SMP</div>
                <div class="text-xs text-gray-500">{{ settings.smp_active ? 'Siswa SMP dapat mengakses tes' : 'Jenjang SMP ditutup' }}</div>
              </div>
              <button 
                type="button" 
                @click="toggleSetting('smp_active')"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                :class="settings.smp_active ? 'bg-blue-600' : 'bg-gray-300'"
              >
                <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out" :class="settings.smp_active ? 'translate-x-5' : 'translate-x-0'"></span>
              </button>
            </div>

            <!-- Switch Toggle NISN (Baru Sesuai Arahan Mas Bos) -->
            <div class="p-4 rounded-xl border flex items-center justify-between" :class="settings.require_nisn ? 'border-purple-200 bg-purple-50/40' : 'border-gray-200 bg-gray-50'">
              <div>
                <div class="font-bold text-sm text-gray-800">Minta / Tampilkan NISN</div>
                <div class="text-xs text-gray-500">{{ settings.require_nisn ? 'Siswa diminta mengisi NISN' : 'Data NISN tidak diminta (dilewati)' }}</div>
              </div>
              <button 
                type="button" 
                @click="toggleSetting('require_nisn')"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                :class="settings.require_nisn ? 'bg-purple-600' : 'bg-gray-300'"
              >
                <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out" :class="settings.require_nisn ? 'translate-x-5' : 'translate-x-0'"></span>
              </button>
            </div>

            <!-- Switch Toggle NPSN & Asal Sekolah (Baru Sesuai Arahan Mas Bos) -->
            <div class="p-4 rounded-xl border flex items-center justify-between" :class="settings.require_npsn ? 'border-indigo-200 bg-indigo-50/40' : 'border-gray-200 bg-gray-50'">
              <div>
                <div class="font-bold text-sm text-gray-800">Minta / Tampilkan NPSN</div>
                <div class="text-xs text-gray-500">{{ settings.require_npsn ? 'Siswa mengisi NPSN (auto sekolah)' : 'Data NPSN tidak diminta (dilewati)' }}</div>
              </div>
              <button 
                type="button" 
                @click="toggleSetting('require_npsn')"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                :class="settings.require_npsn ? 'bg-indigo-600' : 'bg-gray-300'"
              >
                <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out" :class="settings.require_npsn ? 'translate-x-5' : 'translate-x-0'"></span>
              </button>
            </div>

            <!-- Switch Perbandingan Kunci -->
            <div class="p-4 rounded-xl border flex items-center justify-between" :class="settings.show_kunci ? 'border-amber-200 bg-amber-50/40' : 'border-gray-200 bg-gray-50'">
              <div>
                <div class="font-bold text-sm text-gray-800">Perbandingan Kunci Jawaban</div>
                <div class="text-xs text-gray-500">{{ settings.show_kunci ? 'Siswa dapat melihat kunci di web' : 'Kunci disembunyikan dari siswa' }}</div>
              </div>
              <button 
                type="button" 
                @click="toggleSetting('show_kunci')"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                :class="settings.show_kunci ? 'bg-amber-600' : 'bg-gray-300'"
              >
                <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out" :class="settings.show_kunci ? 'translate-x-5' : 'translate-x-0'"></span>
              </button>
            </div>

            <!-- Switch Tombol Unduh PDF Lembar Hasil (Bukan Pop-Up) -->
            <div class="p-4 rounded-xl border flex items-center justify-between" :class="settings.show_pdf ? 'border-green-200 bg-green-50/40' : 'border-gray-200 bg-gray-50'">
              <div>
                <div class="font-bold text-sm text-gray-800">Tombol Unduh Lembar Hasil PDF</div>
                <div class="text-xs text-gray-500">{{ settings.show_pdf ? 'Tombol unduh PDF aktif jika siswa butuh' : 'Tombol unduh PDF disembunyikan' }}</div>
              </div>
              <button 
                type="button" 
                @click="toggleSetting('show_pdf')"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none"
                :class="settings.show_pdf ? 'bg-green-600' : 'bg-gray-300'"
              >
                <span class="inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ease-in-out" :class="settings.show_pdf ? 'translate-x-5' : 'translate-x-0'"></span>
              </button>
            </div>
          </div>
        </div>

        <!-- Token Dinamis Autopilot (1 Jam) -->
        <div class="bg-gradient-to-br from-blue-900 to-[#326698] text-white rounded-2xl shadow-sm p-6 flex flex-col justify-between">
          <div>
            <span class="text-xs uppercase font-bold tracking-wider text-blue-200">Autopilot Token Dinamis (1 Jam)</span>
            <div class="mt-4 text-center bg-white/10 rounded-xl p-4 border border-white/20 backdrop-blur-sm">
              <span class="text-xs text-blue-200 block">TOKEN AKTIF</span>
              <div class="text-4xl font-black tracking-widest text-white font-mono my-1 select-all">
                {{ settings.current_token || 'KRA26' }}
              </div>
              <span class="text-[11px] text-blue-300 block">Tampil otomatis di layar login siswa</span>
            </div>
          </div>

          <div class="pt-4">
            <button
              @click="generateNewToken"
              class="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold rounded-xl text-xs shadow transition-all flex items-center justify-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              <span>Refresh Token Baru Sekarang</span>
            </button>
          </div>
        </div>
      </div>

      <!-- KARTU 2: REKAPITULASI HASIL UJIAN SISWA & DOWNLOAD EXCEL -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-3 border-b">
          <div>
            <h3 class="text-base font-bold text-gray-800">Rekapitulasi Hasil Ujian Siswa Se-Kabupaten</h3>
            <p class="text-xs text-gray-500">Data hasil pengerjaan siswa Karanganyar tersimpan real-time di Supabase</p>
          </div>

          <button
            @click="exportToExcel"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow flex items-center gap-2 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span>Download Rekap Excel (.xlsx)</span>
          </button>
        </div>

        <!-- Filter Pencarian -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input 
            v-model="filterNpsn" 
            type="text" 
            placeholder="Cari NPSN / Sekolah..."
            class="border-gray-300 rounded-lg p-2 text-xs focus:ring-blue-500 focus:border-blue-500 bg-white" 
          />
          <select v-model="filterJenjang" class="border-gray-300 rounded-lg p-2 text-xs bg-white">
            <option value="">Semua Jenjang</option>
            <option value="SD">Jenjang SD</option>
            <option value="SMP">Jenjang SMP</option>
          </select>
          <button @click="loadRekap" class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs">
            Muat Ulang Data
          </button>
        </div>

        <!-- Tabel Hasil Ujian -->
        <div class="overflow-x-auto border border-gray-200 rounded-xl">
          <table class="min-w-full divide-y divide-gray-200 text-xs">
            <thead class="bg-gray-50 text-gray-600 font-bold uppercase">
              <tr>
                <th class="py-3 px-3 text-left">Waktu</th>
                <th class="py-3 px-3 text-left">NPSN</th>
                <th class="py-3 px-3 text-left">Nama Sekolah</th>
                <th class="py-3 px-3 text-left">Nama Siswa</th>
                <th class="py-3 px-3 text-center">Jenjang</th>
                <th class="py-3 px-3 text-left">Mapel / Paket</th>
                <th class="py-3 px-3 text-center">Benar</th>
                <th class="py-3 px-3 text-center">Durasi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-if="filteredHasilList.length === 0">
                <td colspan="8" class="text-center py-8 text-gray-400">Belum ada data pengerjaan ujian.</td>
              </tr>
              <tr v-for="row in filteredHasilList" :key="row.id" class="hover:bg-gray-50">
                <td class="py-2.5 px-3 text-gray-500 whitespace-nowrap">{{ formatDate(row.created_at) }}</td>
                <td class="py-2.5 px-3 font-mono font-semibold text-blue-700">{{ row.npsn }}</td>
                <td class="py-2.5 px-3 font-medium text-gray-800">{{ row.nama_sekolah }}</td>
                <td class="py-2.5 px-3 font-bold text-gray-900">{{ row.nama_siswa }}</td>
                <td class="py-2.5 px-3 text-center">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="row.jenjang === 'SD' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'">
                    {{ row.jenjang }}
                  </span>
                </td>
                <td class="py-2.5 px-3 text-gray-700">{{ row.mapel }} ({{ row.paket }})</td>
                <td class="py-2.5 px-3 text-center font-bold text-green-700">
                  {{ row.jumlah_benar }} / {{ row.total_soal }}
                </td>
                <td class="py-2.5 px-3 text-center text-gray-500">
                  {{ Math.floor(row.durasi_detik / 60) }}m {{ row.durasi_detik % 60 }}s
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- KARTU 3: MANAJEMEN AKUN GURU PENULIS SOAL -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
        <div class="flex items-center justify-between pb-3 border-b">
          <div>
            <h3 class="text-base font-bold text-gray-800">Manajemen Akun Guru Penulis Soal</h3>
            <p class="text-xs text-gray-500">Daftarkan akun penulis soal sesuai jenjang dan mata pelajaran yang ditugaskan</p>
          </div>
          <button 
            @click="showAddPenulisModal = true"
            class="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow flex items-center gap-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            <span>Tambah Penulis Baru</span>
          </button>
        </div>

        <div class="overflow-x-auto border border-gray-200 rounded-xl">
          <table class="min-w-full divide-y divide-gray-200 text-xs">
            <thead class="bg-gray-50 text-gray-600 font-bold uppercase">
              <tr>
                <th class="py-3 px-3 text-left">Nama Guru / Tim</th>
                <th class="py-3 px-3 text-left">Username</th>
                <th class="py-3 px-3 text-left">Password</th>
                <th class="py-3 px-3 text-center">Jenjang</th>
                <th class="py-3 px-3 text-left">Mapel Ditugaskan</th>
                <th class="py-3 px-3 text-left">Asal Sekolah</th>
                <th class="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-for="acc in penulisList" :key="acc.id" class="hover:bg-gray-50">
                <td class="py-2.5 px-3 font-bold text-gray-900">{{ acc.nama_guru }}</td>
                <td class="py-2.5 px-3 font-mono text-blue-700 font-semibold">{{ acc.username }}</td>
                <td class="py-2.5 px-3 font-mono text-gray-600">{{ acc.password_plain }}</td>
                <td class="py-2.5 px-3 text-center">
                  <span class="px-2 py-0.5 rounded text-[10px] font-bold" :class="acc.jenjang === 'SD' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'">
                    {{ acc.jenjang }}
                  </span>
                </td>
                <td class="py-2.5 px-3 font-semibold text-gray-800">{{ acc.mapel }}</td>
                <td class="py-2.5 px-3 text-gray-500">{{ acc.asal_sekolah || '-' }}</td>
                <td class="py-2.5 px-3 text-center">
                  <button @click="confirmDeletePenulis(acc)" class="text-red-600 hover:text-red-800 font-bold">Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- CUSTOM MODAL: TAMBAH PENULIS -->
    <div v-if="showAddPenulisModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <h3 class="text-base font-bold text-gray-800 mb-4">Tambah Guru Penulis Soal</h3>
        <form @submit.prevent="submitAddPenulis" class="space-y-3 text-xs">
          <div>
            <label class="block font-bold text-gray-700 mb-1">Nama Guru / Tim</label>
            <input v-model="newPenulis.nama_guru" type="text" required class="w-full border-gray-300 rounded-lg p-2" placeholder="Nama Guru Penulis" />
          </div>
          <div>
            <label class="block font-bold text-gray-700 mb-1">Asal Sekolah</label>
            <input v-model="newPenulis.asal_sekolah" type="text" class="w-full border-gray-300 rounded-lg p-2" placeholder="Contoh: SMPN 1 Karanganyar" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block font-bold text-gray-700 mb-1">Jenjang</label>
              <select v-model="newPenulis.jenjang" class="w-full border-gray-300 rounded-lg p-2">
                <option value="SD">SD</option>
                <option value="SMP">SMP</option>
              </select>
            </div>
            <div>
              <label class="block font-bold text-gray-700 mb-1">Mata Pelajaran</label>
              <select v-model="newPenulis.mapel" class="w-full border-gray-300 rounded-lg p-2">
                <option value="Matematika">Matematika</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block font-bold text-gray-700 mb-1">Username Login</label>
            <input v-model="newPenulis.username" type="text" required class="w-full border-gray-300 rounded-lg p-2 font-mono" placeholder="guru.matematika" />
          </div>
          <div>
            <label class="block font-bold text-gray-700 mb-1">Password</label>
            <input v-model="newPenulis.password_plain" type="text" required class="w-full border-gray-300 rounded-lg p-2 font-mono" placeholder="PasswordLogin123" />
          </div>
          <div class="flex justify-end gap-2 pt-3">
            <button type="button" @click="showAddPenulisModal = false" class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-bold">Batal</button>
            <button type="submit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold">Simpan Akun</button>
          </div>
        </form>
      </div>
    </div>

    <!-- CUSTOM MODAL: KONFIRMASI HAPUS PENULIS (BUKAN BROWSER ALERT) -->
    <div v-if="accountToDelete" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
        <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </div>
        <div>
          <h3 class="text-base font-bold text-gray-800">Hapus Akun Penulis?</h3>
          <p class="text-xs text-gray-500 mt-1">
            Akun <strong>{{ accountToDelete.nama_guru }}</strong> ({{ accountToDelete.username }}) akan dihapus secara permanen dari sistem.
          </p>
        </div>
        <div class="flex gap-2 pt-2">
          <button @click="accountToDelete = null" class="w-1/2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs">
            Batal
          </button>
          <button @click="executeDeletePenulis" class="w-1/2 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- CUSTOM MODAL: SETEL KATA SANDI BARU (DARI EMAIL RESET) -->
    <div v-if="showResetModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div class="text-center mb-4">
          <div class="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800">Setel Kata Sandi Baru Admin</h3>
          <p class="text-xs text-gray-500 mt-1">Masukkan kata sandi baru untuk akun {{ userEmail || 'disdik.karanganyar@gmail.com' }}</p>
        </div>

        <form @submit.prevent="submitNewPassword" class="space-y-4 text-xs">
          <div>
            <label class="block font-bold text-gray-700 mb-1">Kata Sandi Baru</label>
            <input 
              v-model="newPasswordInput" 
              type="password" 
              required 
              minlength="6"
              placeholder="Minimal 6 karakter"
              class="w-full border-gray-300 rounded-lg p-2.5 text-sm"
            />
          </div>

          <button 
            type="submit" 
            class="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg shadow text-sm"
          >
            Simpan Kata Sandi Baru
          </button>
        </form>
      </div>
    </div>

    <!-- CUSTOM TOAST NOTIFICATION -->
    <div v-if="toastMsg" class="fixed bottom-6 right-6 z-50 bg-gray-900/95 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-fade-in">
      <span class="w-2 h-2 rounded-full bg-green-400"></span>
      <span>{{ toastMsg }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import CBTHeader from '../components/CBTHeader.vue'
import { supabase } from '../supabase.js'
import { 
  getAppSettings, 
  updateAppSettings, 
  generateHourlyToken, 
  getRekapHasilUjian, 
  getPenulisAccounts, 
  createPenulisAccount, 
  deletePenulisAccount 
} from '../services/apiService.js'
import * as XLSX from 'xlsx'

// Auth State (Kosong secara default tanpa prefill)
const isLoggedIn = ref(false)
const userEmail = ref('')
const loginEmail = ref('')
const loginPassword = ref('')
const showLoginPassword = ref(false)
const isLoading = ref(false)
const authError = ref('')
const resetSuccessMsg = ref('')
const showResetModal = ref(false)
const newPasswordInput = ref('')
const toastMsg = ref('')

// Settings
const settings = ref({
  sd_active: true,
  smp_active: true,
  show_kunci: false,
  show_pdf: true,
  require_nisn: false,
  require_npsn: false,
  current_token: 'KRA26'
})

// Rekap Hasil
const hasilList = ref([])
const filterNpsn = ref('')
const filterJenjang = ref('')

// Penulis
const penulisList = ref([])
const showAddPenulisModal = ref(false)
const accountToDelete = ref(null)
const newPenulis = reactive({
  nama_guru: '',
  asal_sekolah: '',
  jenjang: 'SMP',
  mapel: 'Matematika',
  username: '',
  password_plain: ''
})

onMounted(async () => {
  // Listen for recovery event
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      showResetModal.value = true
    }
  })

  // Check active Supabase session
  const { data: { session } } = await supabase.auth.getSession()
  if (session && session.user) {
    isLoggedIn.value = true
    userEmail.value = session.user.email
    await initDashboard()
  }
})

async function initDashboard() {
  settings.value = await getAppSettings()
  await loadRekap()
  await loadPenulis()
}

function showToast(msg) {
  toastMsg.value = msg
  setTimeout(() => {
    toastMsg.value = ''
  }, 3500)
}

// Login
async function handleLogin() {
  isLoading.value = true
  authError.value = ''
  resetSuccessMsg.value = ''

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail.value.trim(),
      password: loginPassword.value.trim()
    })

    if (error) throw error

    isLoggedIn.value = true
    userEmail.value = data.user.email
    await initDashboard()
  } catch (err) {
    authError.value = 'Gagal masuk: Email atau kata sandi salah. Silakan periksa kembali.'
  } finally {
    isLoading.value = false
  }
}

// Forgot Password Flow
async function handleForgotPassword() {
  const targetEmail = loginEmail.value.trim()
  if (!targetEmail) {
    authError.value = 'Ketikkan alamat email admin terlebih dahulu pada kolom email di atas.'
    return
  }

  isLoading.value = true
  authError.value = ''
  resetSuccessMsg.value = ''

  try {
    const redirectUrl = window.location.origin + import.meta.env.BASE_URL + 'marshal'
    const { error } = await supabase.auth.resetPasswordForEmail(targetEmail, {
      redirectTo: redirectUrl
    })

    if (error) throw error
    resetSuccessMsg.value = `Tautan ganti password telah berhasil dikirim ke ${targetEmail}. Silakan periksa kotak masuk (Inbox atau folder Spam) email Anda.`
  } catch (err) {
    authError.value = 'Gagal mengirim email reset: ' + err.message
  } finally {
    isLoading.value = false
  }
}

async function handleLogout() {
  await supabase.auth.signOut()
  isLoggedIn.value = false
  loginEmail.value = ''
  loginPassword.value = ''
}

async function submitNewPassword() {
  if (!newPasswordInput.value || newPasswordInput.value.length < 6) {
    authError.value = 'Kata sandi minimal 6 karakter.'
    return
  }
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPasswordInput.value
    })
    if (error) throw error
    showToast('Kata sandi berhasil diperbarui! Selamat datang di Dashboard.')
    showResetModal.value = false
    isLoggedIn.value = true
    await initDashboard()
  } catch (err) {
    authError.value = 'Gagal memperbarui kata sandi: ' + err.message
  }
}

// Toggle Settings Real-Time
async function toggleSetting(field) {
  settings.value[field] = !settings.value[field]
  await updateAppSettings({ [field]: settings.value[field] })
  showToast(`Pengaturan ${field} berhasil diperbarui.`)
}

// Generate Token Baru
async function generateNewToken() {
  const t = generateHourlyToken()
  settings.value.current_token = t
  await updateAppSettings({ current_token: t, token_updated_at: new Date().toISOString() })
  showToast(`Token ujian baru berhasil dibuat: ${t}`)
}

// Load Rekap
async function loadRekap() {
  hasilList.value = await getRekapHasilUjian()
}

const filteredHasilList = computed(() => {
  return hasilList.value.filter(r => {
    const matchNpsn = !filterNpsn.value || (r.npsn && r.npsn.includes(filterNpsn.value)) || (r.nama_sekolah && r.nama_sekolah.toLowerCase().includes(filterNpsn.value.toLowerCase()))
    const matchJenjang = !filterJenjang.value || r.jenjang === filterJenjang.value
    return matchNpsn && matchJenjang
  })
})

// Export to Excel XLSX
function exportToExcel() {
  const exportData = filteredHasilList.value.map((r, i) => ({
    'No': i + 1,
    'Tanggal Pelaksanaan': formatDate(r.created_at),
    'NPSN': r.npsn,
    'Nama Sekolah': r.nama_sekolah,
    'Nama Siswa': r.nama_siswa,
    'NISN': r.nisn || '-',
    'Jenjang': r.jenjang,
    'Mata Pelajaran': r.mapel,
    'Paket Soal': r.paket,
    'Jumlah Jawaban Benar': r.jumlah_benar,
    'Total Soal': r.total_soal,
    'Durasi (Menit)': Math.round((r.durasi_detik || 0) / 60)
  }))

  const worksheet = XLSX.utils.json_to_sheet(exportData)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Hasil Simulasi TKA')
  XLSX.writeFile(workbook, `Rekap_Hasil_TKA_Karanganyar_${new Date().toISOString().slice(0, 10)}.xlsx`)
  showToast('File Excel rekapitulasi nilai berhasil diunduh.')
}

// Load Penulis
async function loadPenulis() {
  penulisList.value = await getPenulisAccounts()
}

async function submitAddPenulis() {
  try {
    await createPenulisAccount(newPenulis)
    showAddPenulisModal.value = false
    newPenulis.nama_guru = ''
    newPenulis.asal_sekolah = ''
    newPenulis.username = ''
    newPenulis.password_plain = ''
    await loadPenulis()
    showToast('Akun guru penulis baru berhasil ditambahkan!')
  } catch (e) {
    authError.value = 'Gagal menambah akun: Username mungkin sudah digunakan.'
  }
}

function confirmDeletePenulis(acc) {
  accountToDelete.value = acc
}

async function executeDeletePenulis() {
  if (!accountToDelete.value) return
  try {
    await deletePenulisAccount(accountToDelete.value.id)
    showToast(`Akun ${accountToDelete.value.nama_guru} berhasil dihapus.`)
    accountToDelete.value = null
    await loadPenulis()
  } catch (e) {
    showToast('Gagal menghapus akun penulis.')
  }
}

function formatDate(iso) {
  if (!iso) return '-'
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

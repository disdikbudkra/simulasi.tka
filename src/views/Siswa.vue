<template>
  <div class="min-h-screen bg-[#f3f6fa] flex flex-col font-sans select-none">
    <!-- Header Pusmendik Resmi Disdikbud Karanganyar -->
    <CBTHeader :student-identity="studentHeaderIdentity" />

    <!-- Notifikasi Pemeliharaan Jika SD & SMP Keduanya Dimatikan -->
    <div v-if="!settings.sd_active && !settings.smp_active" class="flex-1 flex items-center justify-center p-6">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-lg border border-amber-200 p-8 text-center">
        <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">Simulasi Sedang Ditutup</h2>
        <p class="text-sm text-gray-600 mb-2 leading-relaxed">
          Saat ini portal simulasi TKA sedang dinonaktifkan sementara oleh Proktor Dinas Pendidikan dan Kebudayaan Kabupaten Karanganyar untuk pemeliharaan sistem.
        </p>
      </div>
    </div>

    <!-- MAIN FLOW CONTAINER -->
    <main v-else class="flex-1 flex flex-col">

      <!-- ========================================== -->
      <!-- STEP 0: PEMILIHAN JENJANG, MAPEL, & PAKET -->
      <!-- ========================================== -->
      <section v-if="currentStep === 0" class="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div class="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-[#326698] to-[#4a7fb8] p-6 text-white text-center">
            <h2 class="text-xl font-bold tracking-wide">PILIH PAKET SIMULASI TKA</h2>
            <p class="text-xs text-blue-100 mt-1">Pilih jenjang sekolah, mata pelajaran, dan paket soal yang ingin dikerjakan</p>
          </div>

          <div class="p-6 sm:p-8 space-y-6">
            <!-- Jenjang Pendidikan Dinamis Sesuai Kontrol Marshal -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Jenjang Pendidikan</label>
              
              <!-- Kondisi 1: Keduanya Aktif (2 Kolom) -->
              <div v-if="settings.sd_active && settings.smp_active" class="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  @click="selectedJenjang = 'SD'"
                  class="p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-1.5"
                  :class="selectedJenjang === 'SD' ? 'border-blue-600 bg-blue-50/70 text-blue-800 font-bold shadow-sm' : 'border-gray-200 text-gray-600 hover:border-blue-300'"
                >
                  <span class="text-2xl">🎒</span>
                  <span class="text-base font-bold">Jenjang SD</span>
                </button>

                <button
                  type="button"
                  @click="selectedJenjang = 'SMP'"
                  class="p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-1.5"
                  :class="selectedJenjang === 'SMP' ? 'border-blue-600 bg-blue-50/70 text-blue-800 font-bold shadow-sm' : 'border-gray-200 text-gray-600 hover:border-blue-300'"
                >
                  <span class="text-2xl">🏫</span>
                  <span class="text-base font-bold">Jenjang SMP</span>
                </button>
              </div>

              <!-- Kondisi 2: Hanya SD yang Aktif (Tampil 1 di Tengah) -->
              <div v-else-if="settings.sd_active && !settings.smp_active" class="max-w-xs mx-auto">
                <div class="p-4 rounded-xl border-2 border-blue-600 bg-blue-50/70 text-blue-800 font-bold shadow-sm text-center flex flex-col items-center gap-1.5">
                  <span class="text-3xl">🎒</span>
                  <span class="text-base font-bold">Jenjang SD</span>
                  <span class="text-[11px] text-blue-600 font-medium">Aktif untuk Simulasi</span>
                </div>
              </div>

              <!-- Kondisi 3: Hanya SMP yang Aktif (Tampil 1 di Tengah) -->
              <div v-else-if="!settings.sd_active && settings.smp_active" class="max-w-xs mx-auto">
                <div class="p-4 rounded-xl border-2 border-blue-600 bg-blue-50/70 text-blue-800 font-bold shadow-sm text-center flex flex-col items-center gap-1.5">
                  <span class="text-3xl">🏫</span>
                  <span class="text-base font-bold">Jenjang SMP</span>
                  <span class="text-[11px] text-blue-600 font-medium">Aktif untuk Simulasi</span>
                </div>
              </div>
            </div>

            <!-- Mata Pelajaran -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Mata Pelajaran</label>
              <select v-model="selectedMapel" class="w-full border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white">
                <option value="Matematika">Matematika (Numerasi Akademik)</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia (Literasi Membaca)</option>
              </select>
            </div>

            <!-- Pilihan Paket Dinamis Sesuai Isi Studio / Database -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Pilihan Paket Ujian</label>
              
              <div v-if="isLoadingPackages" class="p-4 text-center text-xs text-gray-500 bg-gray-50 rounded-lg border">
                Memeriksa ketersediaan paket soal...
              </div>

              <div v-else-if="availablePackages.length === 0" class="p-4 bg-amber-50 border border-amber-200 rounded-xl text-center space-y-1">
                <div class="text-amber-800 font-bold text-xs flex items-center justify-center gap-1.5">
                  <svg class="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                  <span>Paket Soal Belum Siap / Belum Tersedia</span>
                </div>
                <p class="text-[11px] text-amber-700">
                  Belum ada paket soal yang didaftarkan untuk {{ selectedJenjang }} {{ selectedMapel }}.
                </p>
              </div>

              <div v-else class="grid gap-3" :class="availablePackages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'">
                <label 
                  v-for="p in availablePackages" 
                  :key="p"
                  class="p-3.5 rounded-lg border cursor-pointer flex items-center gap-3 transition-all"
                  :class="selectedPaket === p ? 'border-blue-600 bg-blue-50 font-bold text-blue-900 shadow-xs' : 'border-gray-200 text-gray-700 hover:bg-gray-50'"
                >
                  <input type="radio" v-model="selectedPaket" :value="p" class="text-blue-600 focus:ring-blue-500" />
                  <span>{{ p }}</span>
                </label>
              </div>
            </div>

            <button
              @click="goToStep(1)"
              :disabled="availablePackages.length === 0 || !selectedPaket"
              class="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              :class="availablePackages.length === 0 || !selectedPaket ? 'opacity-50 cursor-not-allowed' : ''"
            >
              <span>{{ availablePackages.length === 0 ? 'Paket Soal Belum Siap' : 'Lanjut ke Halaman Login' }}</span>
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- STEP 1: LOGIN SISWA (IDENTIK PUSMENDIK)   -->
      <!-- ========================================== -->
      <section v-else-if="currentStep === 1" class="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="p-8 sm:p-10 space-y-6">
            
            <!-- Heading Pusmendik Asli -->
            <div>
              <h2 class="text-xl font-bold text-gray-900 tracking-tight">Selamat Datang</h2>
              <p class="text-xs text-gray-500 mt-1 leading-relaxed">
                Silakan login dengan menggunakan username dan password yang anda miliki
              </p>
            </div>

            <form @submit.prevent="handleStudentLogin" class="space-y-6 pt-2">
              <!-- Input Username dengan Ikon Pusmendik -->
              <div class="relative flex items-center border-b border-gray-300 focus-within:border-blue-600 transition-colors pb-1">
                <span class="text-gray-700 mr-3">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
                </span>
                <input 
                  v-model="inputStudentUsername" 
                  type="text" 
                  placeholder="Username" 
                  class="w-full text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none py-1"
                />
              </div>

              <!-- Input Password dengan Ikon Gembok & Mata Pusmendik -->
              <div class="relative flex items-center border-b border-gray-300 focus-within:border-blue-600 transition-colors pb-1">
                <span class="text-gray-700 mr-3">
                  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>
                </span>
                <input 
                  v-model="inputStudentPassword" 
                  :type="showStudentPassword ? 'text' : 'password'" 
                  placeholder="Password" 
                  class="w-full text-sm text-gray-800 placeholder-gray-400 bg-transparent focus:outline-none py-1 pr-8"
                />
                <button 
                  type="button" 
                  @click="showStudentPassword = !showStudentPassword"
                  class="absolute right-0 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <!-- Mata Terbuka -->
                  <svg v-if="!showStudentPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  <!-- Mata Tertutup -->
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>
                </button>
              </div>

              <!-- Tombol Login Melengkung Pusmendik -->
              <div class="pt-3">
                <button
                  type="submit"
                  class="w-full py-3 bg-[#1d7bf2] hover:bg-blue-600 text-white font-bold rounded-full shadow-md transition-all text-sm tracking-wide"
                >
                  Login
                </button>
              </div>
            </form>

            <div class="text-center pt-2">
              <button @click="goToStep(0)" class="text-xs text-blue-600 hover:underline">
                ← Kembali / Ganti Paket ({{ selectedJenjang }} {{ selectedMapel }} - {{ selectedPaket }})
              </button>
            </div>

          </div>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- STEP 2: KONFIRMASI DATA PESERTA (IDENTIK SCREENSHOT 5)   -->
      <!-- ======================================================== -->
      <section v-else-if="currentStep === 2" class="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 max-w-6xl mx-auto w-full">
        
        <div class="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- SISI KIRI: TOKEN CARD DENGAN REFRESH PILL (SESUAI GAMBAR 5) -->
          <div class="lg:col-span-4 bg-white rounded-xl shadow-md border border-gray-100 p-4 flex items-center justify-between">
            <div class="text-sm font-bold text-gray-800">
              Token : <span class="font-mono font-black text-gray-900 tracking-wider text-base ml-1">{{ settings.current_token || '377HW8' }}</span>
            </div>
            <button 
              @click="refreshActiveToken" 
              type="button"
              class="px-3.5 py-1 bg-[#0d6efd] hover:bg-blue-700 text-white text-xs font-bold rounded-full shadow transition-colors flex items-center gap-1"
            >
              Refresh
            </button>
          </div>

          <!-- SISI KANAN: FLOATING CARD KONFIRMASI DATA PESERTA -->
          <div class="lg:col-span-8 bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
            <h2 class="text-xl font-bold text-gray-800 mb-5">Konfirmasi data Peserta</h2>

            <form @submit.prevent="handleKonfirmasiData" class="space-y-4">
              
              <!-- 1. Username (Read-Only) -->
              <div class="space-y-1">
                <label class="block text-xs text-gray-500 font-medium">username</label>
                <div class="text-sm font-bold text-gray-800 font-mono">{{ dummyUsername }}</div>
              </div>

              <!-- 2. Nama Peserta Display -->
              <div class="space-y-1">
                <label class="block text-xs text-gray-500 font-medium">Nama Peserta</label>
                <div class="text-sm font-bold text-gray-800">{{ dummyUsername }} - PESERTA TKA</div>
              </div>

              <!-- 3. Jenis Kelamin -->
              <div class="space-y-1">
                <label class="block text-xs text-gray-500 font-medium">Jenis Kelamin</label>
                <div class="text-sm font-medium text-gray-800">Laki-Laki</div>
              </div>

              <!-- 4. Mata Ujian -->
              <div class="space-y-1">
                <label class="block text-xs text-gray-500 font-medium">Mata Ujian</label>
                <div class="text-sm font-medium text-gray-800">
                  {{ selectedMapel }} - {{ selectedJenjang }} Sederajat ({{ selectedPaket }})
                </div>
              </div>

              <!-- 5. Nama Peserta Input Field (Underlined Sesuai Gambar 5) -->
              <div class="pt-2">
                <label class="block text-xs text-gray-500 font-medium mb-1">Nama Peserta <span class="text-red-500">*</span></label>
                <input 
                  v-model="studentData.nama_siswa"
                  type="text" 
                  required
                  placeholder="Ketikkan nama Peserta"
                  class="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-blue-600 px-0 py-1.5 text-sm font-medium text-gray-800 placeholder-gray-400 bg-transparent"
                />
              </div>

              <!-- 6. NISN (Di Atas NPSN, Di Bawah Nama Peserta - Hanya Tampil Jika Toggle NISN Aktif di Marshal) -->
              <div v-if="settings.require_nisn" class="pt-2">
                <label class="block text-xs text-gray-500 font-medium mb-1">NISN (Nomor Induk Siswa Nasional) <span class="text-red-500">*</span></label>
                <input 
                  v-model="studentData.nisn"
                  type="text" 
                  maxlength="10"
                  required
                  placeholder="NISN (10 Digit)"
                  class="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-blue-600 px-0 py-1.5 text-sm font-mono text-gray-800 placeholder-gray-400 bg-transparent"
                />
              </div>

              <!-- 7. NPSN & Asal Sekolah (Hanya Tampil Jika Toggle NPSN Aktif di Marshal) -->
              <div v-if="settings.require_npsn" class="pt-2">
                <label class="block text-xs text-gray-500 font-medium mb-1">NPSN & Asal Sekolah <span class="text-red-500">*</span></label>
                <div class="flex flex-col sm:flex-row gap-2">
                  <input 
                    v-model="studentData.npsn"
                    @input="handleNpsnInput"
                    type="text" 
                    maxlength="8"
                    placeholder="NPSN (8 digit)"
                    required
                    class="w-full sm:w-36 border border-gray-300 rounded-lg p-2 text-xs font-mono font-bold text-gray-800 focus:ring-blue-500 focus:border-blue-500 bg-white"
                  />
                  <div class="relative flex-1">
                    <input 
                      :value="studentData.nama_sekolah"
                      readonly
                      tabindex="-1"
                      type="text" 
                      placeholder="Nama Sekolah (Otomatis dari NPSN)"
                      class="w-full border border-gray-200 rounded-lg p-2 text-xs text-gray-600 bg-gray-100 font-semibold cursor-not-allowed select-none"
                    />
                    <span v-if="isSearchingNpsn" class="absolute right-2.5 top-2.5 text-[10px] text-blue-600 font-bold animate-pulse">
                      Mencari...
                    </span>
                  </div>
                </div>
              </div>

              <!-- 8. Tanggal Lahir (Hari, Bulan, Tahun - Awalnya Kosong & Wajib Dipilih) -->
              <div class="pt-2">
                <label class="block text-xs text-gray-500 font-medium mb-1.5">Tanggal Lahir <span class="text-red-500">*</span></label>
                <div class="grid grid-cols-3 gap-3">
                  <div class="bg-gray-100 rounded-md p-1 border border-gray-200">
                    <select v-model="studentData.tgl" required class="w-full bg-transparent border-0 text-xs text-gray-700 py-1.5 px-2 focus:ring-0">
                      <option value="" disabled selected>- Hari -</option>
                      <option v-for="d in 31" :key="d" :value="d">{{ d }}</option>
                    </select>
                  </div>
                  <div class="bg-gray-100 rounded-md p-1 border border-gray-200">
                    <select v-model="studentData.bln" required class="w-full bg-transparent border-0 text-xs text-gray-700 py-1.5 px-2 focus:ring-0">
                      <option value="" disabled selected>- Bulan -</option>
                      <option v-for="m in bulanList" :key="m" :value="m">{{ m }}</option>
                    </select>
                  </div>
                  <div class="bg-gray-100 rounded-md p-1 border border-gray-200">
                    <select v-model="studentData.thn" required class="w-full bg-transparent border-0 text-xs text-gray-700 py-1.5 px-2 focus:ring-0">
                      <option value="" disabled selected>- Tahun -</option>
                      <option v-for="y in tahunList" :key="y" :value="y">{{ y }}</option>
                    </select>
                  </div>
                </div>
              </div>

              <!-- 9. Token (Label Biru Sesuai Gambar 5) -->
              <div class="pt-2">
                <label class="block text-xs font-bold text-blue-600 mb-1">Token</label>
                <input 
                  v-model="inputToken"
                  type="text" 
                  placeholder="Ketikkan token di sini"
                  required
                  class="w-full border-0 border-b border-gray-300 focus:ring-0 focus:border-blue-600 px-0 py-1.5 text-sm font-mono tracking-wider uppercase text-gray-800 placeholder-gray-400 bg-transparent"
                />
                <span v-if="tokenError" class="text-xs text-red-600 font-semibold mt-1 block">
                  Token yang Anda masukkan salah atau sudah berganti! Silakan periksa token di sebelah kiri.
                </span>
              </div>

              <!-- 9. Tombol Submit (Biru Pill Sesuai Gambar 5) -->
              <div class="pt-6">
                <button
                  type="submit"
                  class="w-full py-2.5 px-6 bg-[#0d6efd] hover:bg-blue-700 text-white font-bold rounded-full shadow text-sm transition-all"
                >
                  Submit
                </button>
              </div>

            </form>
          </div>

        </div>

      </section>

      <!-- ========================================== -->
      <!-- STEP 3: KONFIRMASI TES (ATURAN & MULAI)   -->
      <!-- ========================================== -->
      <section v-else-if="currentStep === 3" class="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div class="max-w-xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-[#326698] p-5 text-white">
            <h2 class="text-lg font-bold">KONFIRMASI TES</h2>
            <p class="text-xs text-blue-100">Periksa rincian tes sebelum memulai pengerjaan</p>
          </div>

          <div class="p-6 sm:p-8 space-y-4">
            <div class="divide-y divide-gray-200 text-sm">
              <div class="py-2.5 flex justify-between">
                <span class="text-gray-500">Nama Peserta:</span>
                <span class="font-bold text-gray-800">{{ studentData.nama_siswa }}</span>
              </div>
              <div v-if="studentData.nisn" class="py-2.5 flex justify-between">
                <span class="text-gray-500">NISN:</span>
                <span class="font-bold text-gray-800 font-mono">{{ studentData.nisn }}</span>
              </div>
              <div v-if="studentData.nama_sekolah || studentData.npsn" class="py-2.5 flex justify-between">
                <span class="text-gray-500">Asal Sekolah:</span>
                <span class="font-bold text-gray-800">{{ studentData.nama_sekolah || '-' }} {{ studentData.npsn ? `(${studentData.npsn})` : '' }}</span>
              </div>
              <div class="py-2.5 flex justify-between">
                <span class="text-gray-500">Nama Tes:</span>
                <span class="font-bold text-blue-700">Simulasi TKA {{ selectedJenjang }} - {{ selectedMapel }}</span>
              </div>
              <div class="py-2.5 flex justify-between">
                <span class="text-gray-500">Paket Soal:</span>
                <span class="font-bold text-gray-800">{{ selectedPaket }}</span>
              </div>
              <div class="py-2.5 flex justify-between">
                <span class="text-gray-500">Jumlah Soal:</span>
                <span class="font-bold text-gray-800">{{ questions.length }} Butir Soal</span>
              </div>
              <div class="py-2.5 flex justify-between">
                <span class="text-gray-500">Alokasi Waktu:</span>
                <span class="font-bold text-emerald-600">60 Menit</span>
              </div>
            </div>

            <div class="pt-4 flex gap-3">
              <button
                @click="goToStep(2)"
                class="w-1/3 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-full hover:bg-gray-50 text-sm"
              >
                Kembali
              </button>
              <button
                @click="startExam"
                class="w-2/3 py-2.5 bg-[#0d6efd] hover:bg-blue-700 text-white font-bold rounded-full shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>MULAI MENGERJAKAN</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ======================================================== -->
      <!-- STEP 4: RUANG UJIAN CBT (PERSIS SCREENSHOT 2, 3, 4, 7, 8)-->
      <!-- ======================================================== -->
      <section v-else-if="currentStep === 4" class="flex-1 flex flex-col p-3 sm:p-6 max-w-7xl mx-auto w-full">
        
        <!-- MAIN CBT CONTAINER CARD -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-7 flex-1 flex flex-col justify-between">
          
          <div>
            <!-- CBT HEADER BAR DALAM CARD (SESUAI SCREENSHOT PUSMENDIK) -->
            <div class="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-200">
              
              <!-- SISI KIRI: SOAL NOMOR X + UKURAN FONT A A A -->
              <div>
                <div class="text-lg sm:text-xl font-bold text-gray-900">
                  Soal nomor {{ currentQuestion ? currentQuestion.nomor_soal : currentIndex + 1 }}
                </div>
                <div class="flex items-center gap-1.5 text-xs text-gray-700 mt-1">
                  <span>Ukuran font soal:</span>
                  <button 
                    type="button"
                    @click="fontSizeLevel = 'sm'" 
                    class="px-1 text-xs transition-all"
                    :class="fontSizeLevel === 'sm' ? 'font-black underline border-b-2 border-black' : 'text-gray-500 hover:text-black'"
                  >
                    A
                  </button>
                  <button 
                    type="button"
                    @click="fontSizeLevel = 'md'" 
                    class="px-1 text-sm transition-all"
                    :class="fontSizeLevel === 'md' ? 'font-black underline border-b-2 border-black' : 'text-gray-500 hover:text-black'"
                  >
                    A
                  </button>
                  <button 
                    type="button"
                    @click="fontSizeLevel = 'lg'" 
                    class="px-1 text-base transition-all"
                    :class="fontSizeLevel === 'lg' ? 'font-black underline border-b-2 border-black' : 'text-gray-500 hover:text-black'"
                  >
                    A
                  </button>
                </div>
              </div>

              <!-- SISI KANAN: 3 TOMBOL PILL + LABEL MATA UJIAN (SESUAI GAMBAR 2, 3, 4) -->
              <div class="flex flex-col items-end gap-1.5">
                <div class="flex items-center gap-2">
                  <button 
                    type="button"
                    @click="showInfoModal = true"
                    class="px-3.5 py-1 bg-[#0d6efd] hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-sm transition-colors uppercase tracking-wider"
                  >
                    INFORMASI SOAL
                  </button>
                  
                  <div class="px-3 py-1 bg-white border border-gray-300 rounded-full text-xs font-mono font-bold text-gray-800 shadow-sm">
                    Sisa Waktu : {{ timerFormatted }}
                  </div>

                  <button 
                    type="button"
                    @click="showDaftarSoal = true"
                    class="px-3.5 py-1 bg-[#0d6efd] hover:bg-blue-700 text-white font-bold text-xs rounded-full shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <span>Daftar Soal</span>
                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 4h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 10h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4zM4 16h4v4H4zm6 0h4v4h-4zm6 0h4v4h-4z"/>
                    </svg>
                  </button>
                </div>

                <div class="text-xs font-semibold text-gray-700 text-right">
                  {{ selectedMapel }} - {{ selectedJenjang }} Sederajat ({{ selectedPaket }})
                </div>
              </div>

            </div>

            <!-- CBT QUESTION BODY -->
            <div v-if="currentQuestion" class="pt-5">
              <CBTQuestionItem 
                :question="currentQuestion"
                v-model="userAnswers[currentQuestion.nomor_soal]"
                :font-size-level="fontSizeLevel"
              />
            </div>
            <div v-else class="text-center py-16 text-gray-400 text-sm">
              Memuat butir soal...
            </div>
          </div>

          <!-- CBT BOTTOM NAVIGATION BAR (PERSIS SCREENSHOT PUSMENDIK) -->
          <div class="pt-8 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100 mt-6">
            
            <!-- 1. Tombol Merah: Soal Sebelumnya -->
            <button
              type="button"
              :disabled="currentIndex === 0"
              @click="prevQuestion"
              class="px-5 py-2 rounded-full font-bold text-xs sm:text-sm text-white shadow transition-all flex items-center gap-1.5"
              :class="currentIndex === 0 ? 'bg-gray-300 cursor-not-allowed text-gray-500' : 'bg-[#dc3545] hover:bg-red-700'"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
              <span>Soal sebelumnya</span>
            </button>

            <!-- 2. Tombol Kuning: Ragu-Ragu -->
            <label class="flex items-center gap-2 cursor-pointer bg-[#ffc107] hover:bg-yellow-400 px-6 py-2 rounded-full text-gray-900 font-bold text-xs sm:text-sm shadow border border-yellow-500 select-none transition-colors">
              <input 
                type="checkbox" 
                :checked="raguRagu[currentQuestion?.nomor_soal]" 
                @change="toggleRaguRagu"
                class="w-4 h-4 text-amber-600 rounded border-gray-400 focus:ring-0 cursor-pointer" 
              />
              <span>Ragu-ragu</span>
            </label>

            <!-- 3. Tombol Biru: Soal Berikutnya / Selesai Tes -->
            <button
              v-if="currentIndex < questions.length - 1"
              type="button"
              @click="nextQuestion"
              class="px-5 py-2 rounded-full font-bold text-xs sm:text-sm bg-[#0d6efd] hover:bg-blue-700 text-white shadow transition-all flex items-center gap-1.5"
            >
              <span>Soal berikutnya</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
            <button
              v-else
              type="button"
              @click="showConfirmFinishModal = true"
              class="px-6 py-2 rounded-full font-bold text-xs sm:text-sm bg-[#0d6efd] hover:bg-blue-700 text-white shadow transition-all flex items-center gap-1.5"
            >
              <span>Selesai Tes</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
            </button>

          </div>

        </div>

        <!-- CUSTOM MODAL: DAFTAR SOAL GRID -->
        <div v-if="showDaftarSoal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl overflow-hidden animate-fade-in">
            <div class="flex items-center justify-between pb-3 border-b">
              <h3 class="text-base font-bold text-gray-800">Daftar Nomor Soal</h3>
              <button @click="showDaftarSoal = false" class="text-gray-400 hover:text-gray-600">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <!-- Legenda Warna Pusmendik -->
            <div class="flex items-center gap-4 py-3 text-xs border-b">
              <div class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded bg-green-600"></span> Sudah Dijawab</div>
              <div class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded bg-amber-400"></span> Ragu-Ragu</div>
              <div class="flex items-center gap-1.5"><span class="w-3.5 h-3.5 rounded border border-gray-300 bg-white"></span> Belum Dijawab</div>
            </div>

            <!-- Grid Nomor Soal -->
            <div class="grid grid-cols-5 sm:grid-cols-6 gap-2.5 py-4 max-h-72 overflow-y-auto">
              <button
                v-for="(q, idx) in questions"
                :key="q.nomor_soal"
                @click="jumpToQuestion(idx)"
                class="h-10 rounded-lg font-bold text-sm flex items-center justify-center border transition-all"
                :class="getQuestionGridClass(q.nomor_soal, idx)"
              >
                {{ q.nomor_soal }}
              </button>
            </div>

            <div class="pt-3 border-t flex justify-end">
              <button @click="showDaftarSoal = false" class="px-5 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-bold rounded-lg">
                Tutup
              </button>
            </div>
          </div>
        </div>

        <!-- CUSTOM MODAL: INFORMASI SOAL -->
        <div v-if="showInfoModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in">
            <div class="flex items-center justify-between pb-2 border-b">
              <h3 class="text-base font-bold text-gray-800">Informasi Tes & Petunjuk</h3>
              <button @click="showInfoModal = false" class="text-gray-400 hover:text-gray-600">✕</button>
            </div>
            <div class="text-xs text-gray-600 space-y-2 leading-relaxed">
              <p>• <strong>Mata Ujian:</strong> {{ selectedMapel }} ({{ selectedJenjang }} {{ selectedPaket }})</p>
              <p>• <strong>Total Soal:</strong> {{ questions.length }} Butir Soal</p>
              <p>• <strong>Alokasi Waktu:</strong> 60 Menit</p>
              <p>• <strong>Petunjuk Jawaban:</strong> Pilihan lingkaran untuk pilihan tunggal, kotak centang untuk pilihan kompleks lebih dari satu, dan matriks baris untuk Benar/Salah.</p>
              <p>• <strong>Ukuran Huruf:</strong> Gunakan tombol <strong>A A A</strong> pada pojok kiri atas untuk mengatur ukuran huruf teks dan rumus soal.</p>
            </div>
            <div class="pt-2 flex justify-end">
              <button @click="showInfoModal = false" class="px-5 py-2 bg-[#0d6efd] text-white font-bold rounded-lg text-xs">
                Mengerti
              </button>
            </div>
          </div>
        </div>

        <!-- CUSTOM MODAL: KONFIRMASI SELESAI UJIAN (PENGGANTI BROWSER DIALOG) -->
        <div v-if="showConfirmFinishModal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4 animate-fade-in">
            <div class="w-12 h-12 bg-blue-100 text-[#0d6efd] rounded-full flex items-center justify-center mx-auto">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div>
              <h3 class="text-base font-bold text-gray-800">Konfirmasi Selesai Ujian?</h3>
              <p class="text-xs text-gray-500 mt-1">
                Anda telah menjawab <strong class="text-blue-700">{{ countAnswered }}</strong> dari <strong>{{ questions.length }}</strong> butir soal.
              </p>
              <div v-if="countRaguRagu > 0" class="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-800 font-medium">
                Peringatan: Masih terdapat {{ countRaguRagu }} soal dengan status ragu-ragu.
              </div>
            </div>
            <div class="flex gap-2 pt-2">
              <button @click="showConfirmFinishModal = false" class="w-1/2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs">
                Batal
              </button>
              <button @click="confirmFinishExam" class="w-1/2 py-2 bg-[#0d6efd] hover:bg-blue-700 text-white font-bold rounded-lg text-xs">
                Ya, Selesai
              </button>
            </div>
          </div>
        </div>

      </section>

      <!-- ========================================== -->
      <!-- STEP 6: LAPORAN HASIL & REVIEW            -->
      <!-- ========================================== -->
      <section v-else-if="currentStep === 6" class="flex-1 flex flex-col p-4 sm:p-6 max-w-5xl mx-auto w-full">
        <!-- Banner Sukses & Tombol Download PDF -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8 mb-6">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div class="text-center sm:text-left">
              <span class="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">
                Laporan Hasil Simulasi TKA 2026
              </span>
              <h2 class="text-2xl font-black text-gray-800">
                {{ studentData.nama_siswa }}
              </h2>
              <p class="text-sm text-gray-500 mt-0.5">
                <span v-if="studentData.nama_sekolah">{{ studentData.nama_sekolah }} </span>
                <span v-if="studentData.npsn">(NPSN: {{ studentData.npsn }}) • </span>
                <span>{{ selectedJenjang }} {{ selectedMapel }}</span>
              </p>
            </div>

            <!-- Box Jumlah Benar (HANYA JUMLAH BENAR - TANPA NILAI 0-100) -->
            <div class="bg-gradient-to-br from-emerald-50 to-green-100 border-2 border-emerald-300 rounded-2xl p-5 text-center min-w-[200px]">
              <span class="text-xs font-bold text-emerald-800 uppercase block">Jumlah Jawaban Benar</span>
              <div class="text-4xl font-black text-emerald-700 my-1">
                {{ scoreResult.jumlahBenar }}
              </div>
              <span class="text-xs text-emerald-800 font-medium">dari total {{ questions.length }} Soal</span>
            </div>
          </div>

          <!-- Tombol Unduh PDF Lembar Hasil (Hanya Jika Dibutuhkan & Diizinkan Marshal) -->
          <div v-if="settings.show_pdf" class="mt-6 pt-6 border-t flex flex-wrap items-center justify-end gap-3">
            <button
              @click="downloadPdfResult"
              class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs sm:text-sm shadow flex items-center gap-2 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              <span>Unduh PDF Lembar Hasil</span>
            </button>
          </div>
        </div>

        <!-- REVIEW PERBANDINGAN KUNCI JAWABAN (HANYA JIKA DIIZINKAN MARSHAL) -->
        <div v-if="settings.show_kunci" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sm:p-8">
          <div class="flex items-center justify-between pb-4 border-b mb-6">
            <div>
              <h3 class="text-lg font-bold text-gray-800">Perbandingan Jawaban dan Kunci</h3>
              <p class="text-xs text-gray-500">Daftar jawaban Anda dibandingkan dengan kunci jawaban resmi</p>
            </div>
            <span class="text-xs bg-blue-100 text-blue-800 font-bold px-3 py-1 rounded-full">Kunci Ditampilkan</span>
          </div>

          <!-- Rincian Jawaban Per Butir Soal -->
          <div class="space-y-4">
            <div 
              v-for="item in scoreResult.detailAnswers" 
              :key="item.nomor"
              class="p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              :class="item.isCorrect ? 'border-green-200 bg-green-50/40' : 'border-red-200 bg-red-50/40'"
            >
              <div class="flex items-center gap-3">
                <span 
                  class="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm text-white"
                  :class="item.isCorrect ? 'bg-green-600' : 'bg-red-500'"
                >
                  {{ item.nomor }}
                </span>
                <div>
                  <div class="text-xs font-bold text-gray-700">Tipe: {{ getQuestionTypeLabel(item.tipe) }}</div>
                  <div class="text-sm text-gray-800 mt-0.5">
                    Jawaban Anda: <strong class="text-blue-900">{{ formatUserAnswer(item.userAnswer) }}</strong>
                  </div>
                </div>
              </div>

              <div class="text-sm sm:text-right pl-11 sm:pl-0">
                <div class="text-xs font-semibold text-gray-600">Kunci Jawaban:</div>
                <div class="font-bold text-green-700">{{ formatKeyAnswer(item.keyAnswer) }}</div>
                <div class="text-[11px] font-bold mt-0.5" :class="item.isCorrect ? 'text-green-700' : 'text-red-600'">
                  Poin: {{ item.poin.toFixed(2) }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Banner Jika Kunci Dinonaktifkan Marshal -->
        <div v-else class="bg-gray-50 border border-gray-200 rounded-2xl p-6 text-center text-gray-600 text-sm">
          <svg class="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          <p class="font-semibold text-gray-700">Perbandingan Kunci Jawaban Dinonaktifkan</p>
        </div>

        <!-- Tombol Kembali ke Awal -->
        <div class="mt-8 text-center">
          <button 
            @click="resetToHome"
            class="px-8 py-3 bg-gray-800 hover:bg-gray-900 text-white font-bold rounded-xl text-sm shadow transition-all"
          >
            Selesai & Keluar Simulasi
          </button>
        </div>
      </section>

    </main>

    <!-- CUSTOM TOAST NOTIFICATION -->
    <div v-if="toastMsg" class="fixed bottom-6 right-6 z-50 bg-gray-900/95 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-fade-in">
      <span class="w-2 h-2 rounded-full bg-blue-400"></span>
      <span>{{ toastMsg }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onUnmounted } from 'vue'
import CBTHeader from '../components/CBTHeader.vue'
import CBTQuestionItem from '../components/CBTQuestionItem.vue'
import { getAppSettings, lookupNpsn, getAvailablePackages, getSoalList, submitHasilUjian } from '../services/apiService.js'
import { generateResultPDF } from '../services/pdfService.js'

// State Global & Settings
const settings = ref({
  sd_active: true,
  smp_active: true,
  show_kunci: false,
  show_pdf: true,
  require_nisn: false,
  require_npsn: false,
  current_token: '377HW8'
})

const currentStep = ref(0) // 0: Pilih, 1: Login, 2: Data, 3: Konfirmasi, 4: Ujian, 6: Hasil
const selectedJenjang = ref('SMP')
const selectedMapel = ref('Matematika')
const selectedPaket = ref('')
const availablePackages = ref([])
const isLoadingPackages = ref(false)

async function refreshAvailablePackages() {
  isLoadingPackages.value = true
  try {
    availablePackages.value = await getAvailablePackages(selectedJenjang.value, selectedMapel.value)
    if (availablePackages.value.length > 0) {
      if (!availablePackages.value.includes(selectedPaket.value)) {
        selectedPaket.value = availablePackages.value[0]
      }
    } else {
      selectedPaket.value = ''
    }
  } catch (err) {
    availablePackages.value = []
    selectedPaket.value = ''
  } finally {
    isLoadingPackages.value = false
  }
}

watch([selectedJenjang, selectedMapel], () => {
  refreshAvailablePackages()
})

// Step 1: Login
const inputStudentUsername = ref('')
const inputStudentPassword = ref('')
const showStudentPassword = ref(false)
const dummyUsername = ref('dladnc')

function handleStudentLogin() {
  const user = inputStudentUsername.value.trim() || 'dladnc'
  dummyUsername.value = user
  studentData.nama_siswa = user
  goToStep(2)
}

// Step 2: Form Data Siswa (Kosong secara default tanpa contoh isian)
const studentData = reactive({
  npsn: '',
  nama_sekolah: '',
  nama_siswa: '',
  nisn: '',
  tgl: '',
  bln: '',
  thn: ''
})
const inputToken = ref('')
const tokenError = ref(false)
const isSearchingNpsn = ref(false)
let npsnDebounceTimer = null

const bulanList = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']
const tahunList = [2005, 2006, 2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018]

// Step 4: Ujian CBT
const questions = ref([])
const currentIndex = ref(0)
const userAnswers = reactive({})
const raguRagu = reactive({})
const showDaftarSoal = ref(false)
const showInfoModal = ref(false)
const showConfirmFinishModal = ref(false)
const toastMsg = ref('')

// Font Scaling: 'sm', 'md', 'lg'
const fontSizeLevel = ref('md')

// Timer (60 Menit = 3600 Detik)
const timeRemaining = ref(3600)
let timerInterval = null
const startTime = ref(0)
const durasiPengerjaan = ref(0)

// Hasil & Skor
const scoreResult = reactive({
  jumlahBenar: 0,
  detailAnswers: []
})

// Header Identity Display (sesuai screenshot: username - adniadnla 🎓)
const studentHeaderIdentity = computed(() => {
  if (currentStep.value >= 2) {
    const nama = studentData.nama_siswa ? studentData.nama_siswa : 'PESERTA TKA'
    return `${dummyUsername.value} - ${nama}`
  }
  return 'Aplikasi Ujian CBT TKA'
})

// Lifecycle
onMounted(async () => {
  settings.value = await getAppSettings()
  
  // Penyesuaian jenjang dinamis berdasarkan kontrol Proktor Marshal
  if (settings.value.sd_active && !settings.value.smp_active) {
    selectedJenjang.value = 'SD'
  } else if (!settings.value.sd_active && settings.value.smp_active) {
    selectedJenjang.value = 'SMP'
  }

  await refreshAvailablePackages()
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

function showToast(msg) {
  toastMsg.value = msg
  setTimeout(() => {
    toastMsg.value = ''
  }, 3500)
}

// Methods Navigasi Step
function goToStep(step) {
  currentStep.value = step
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function refreshActiveToken() {
  settings.value = await getAppSettings()
  showToast('Token ujian telah diperbarui: ' + (settings.value.current_token || 'KRA26'))
}

// Auto Lookup NPSN
function handleNpsnInput() {
  if (npsnDebounceTimer) clearTimeout(npsnDebounceTimer)
  const val = studentData.npsn ? studentData.npsn.trim() : ''
  if (val.length === 8) {
    isSearchingNpsn.value = true
    npsnDebounceTimer = setTimeout(async () => {
      const res = await lookupNpsn(val)
      if (res && res.nama_sekolah) {
        studentData.nama_sekolah = res.nama_sekolah
        showToast('Sekolah ditemukan: ' + res.nama_sekolah)
      }
      isSearchingNpsn.value = false
    }, 500)
  }
}

// Submit Data Siswa & Validasi Token
function handleKonfirmasiData() {
  tokenError.value = false
  const expected = (settings.value.current_token || '').trim().toUpperCase()
  const actual = (inputToken.value || '').trim().toUpperCase()

  if (actual !== expected) {
    tokenError.value = true
    return
  }

  if (!studentData.nama_siswa || !studentData.nama_siswa.trim()) {
    showToast('Nama peserta wajib diisi.')
    return
  }

  if (settings.value.require_nisn && (!studentData.nisn || !studentData.nisn.trim())) {
    showToast('NISN (Nomor Induk Siswa Nasional) wajib diisi.')
    return
  }

  if (settings.value.require_npsn && (!studentData.npsn || !studentData.npsn.trim())) {
    showToast('NPSN wajib diisi.')
    return
  }

  if (!studentData.tgl || !studentData.bln || !studentData.thn) {
    showToast('Silakan pilih Tanggal, Bulan, dan Tahun Lahir secara lengkap.')
    return
  }

  goToStep(3)
}

// Start Exam
async function startExam() {
  questions.value = await getSoalList(selectedJenjang.value, selectedMapel.value, selectedPaket.value)
  if (questions.value.length === 0) {
    showToast('Belum ada butir soal yang diunggah untuk paket ini.')
    return
  }

  currentIndex.value = 0
  timeRemaining.value = 3600
  startTime.value = Date.now()

  // Mulai interval timer
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      clearInterval(timerInterval)
      confirmFinishExam()
    }
  }, 1000)

  goToStep(4)
}

// Navigasi CBT
const currentQuestion = computed(() => questions.value[currentIndex.value] || null)

function prevQuestion() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function nextQuestion() {
  if (currentIndex.value < questions.value.length - 1) {
    currentIndex.value++
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

function jumpToQuestion(idx) {
  currentIndex.value = idx
  showDaftarSoal.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function toggleRaguRagu() {
  if (!currentQuestion.value) return
  const no = currentQuestion.value.nomor_soal
  raguRagu[no] = !raguRagu[no]
}

// Timer Formatter hh:mm:ss (sesuai format screenshot: 01:14:40)
const timerFormatted = computed(() => {
  const h = Math.floor(timeRemaining.value / 3600)
  const m = Math.floor((timeRemaining.value % 3600) / 60)
  const s = timeRemaining.value % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

// Counter Status Jawaban
const countAnswered = computed(() => {
  let count = 0
  for (const q of questions.value) {
    const ans = userAnswers[q.nomor_soal]
    if (ans !== undefined && ans !== null && ans !== '') {
      if (Array.isArray(ans) && ans.length === 0) continue
      if (typeof ans === 'object' && Object.keys(ans).length === 0) continue
      count++
    }
  }
  return count
})

const countRaguRagu = computed(() => {
  return Object.values(raguRagu).filter(Boolean).length
})

function getQuestionGridClass(nomor, idx) {
  const isCurrent = currentIndex.value === idx
  const isRagu = raguRagu[nomor]
  const ans = userAnswers[nomor]
  const hasAnswer = ans !== undefined && ans !== null && ans !== '' && (Array.isArray(ans) ? ans.length > 0 : true) && (typeof ans === 'object' ? Object.keys(ans).length > 0 : true)

  let base = ''
  if (isRagu) {
    base = 'bg-amber-400 text-amber-950 border-amber-500'
  } else if (hasAnswer) {
    base = 'bg-green-600 text-white border-green-700'
  } else {
    base = 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
  }

  if (isCurrent) {
    base += ' ring-2 ring-blue-600 ring-offset-2 scale-105'
  }

  return base
}

// Selesai Ujian & Penilaian Poin Parsial
async function confirmFinishExam() {
  showConfirmFinishModal.value = false
  if (timerInterval) clearInterval(timerInterval)
  durasiPengerjaan.value = Math.floor((Date.now() - startTime.value) / 1000)

  let totalBenar = 0
  const details = []

  for (const q of questions.value) {
    const userAns = userAnswers[q.nomor_soal]
    const keyData = q.kunci_jawaban_json || {}
    let poin = 0
    let isCorrect = false

    if (q.tipe_soal === '1') {
      if (userAns && userAns === keyData.jawaban) {
        poin = 1.0
        isCorrect = true
      }
    } else if (q.tipe_soal === '2') {
      const correctArr = Array.isArray(keyData.jawaban) ? keyData.jawaban : [keyData.jawaban]
      const userArr = Array.isArray(userAns) ? userAns : []
      const bobot = keyData.bobot_per_opsi || (1 / correctArr.length)

      let matchCount = 0
      for (const opt of userArr) {
        if (correctArr.includes(opt)) {
          matchCount++
        } else {
          matchCount -= 0.5
        }
      }
      poin = Math.max(0, Math.min(1.0, matchCount * bobot))
      isCorrect = poin >= 0.99
    } else if (q.tipe_soal === '3') {
      const keyMap = keyData.jawaban || {}
      const rows = Object.keys(keyMap)
      const bobot = keyData.bobot_per_baris || (1 / (rows.length || 1))
      let benarCount = 0

      if (userAns && typeof userAns === 'object') {
        for (const r of rows) {
          if (userAns[r] === keyMap[r]) {
            benarCount++
          }
        }
      }
      poin = Math.min(1.0, benarCount * bobot)
      isCorrect = poin >= 0.99
    } else if (q.tipe_soal === '5') {
      const pairs = keyData.pairs || {}
      const leftKeys = Object.keys(pairs)
      const bobot = keyData.bobot_per_pasang || (1 / (leftKeys.length || 1))
      let matchCount = 0

      if (userAns && typeof userAns === 'object') {
        for (const lk of leftKeys) {
          if (userAns[lk] === pairs[lk]) {
            matchCount++
          }
        }
      }
      poin = Math.min(1.0, matchCount * bobot)
      isCorrect = poin >= 0.99
    }

    totalBenar += poin

    details.push({
      nomor: q.nomor_soal,
      tipe: q.tipe_soal,
      userAnswer: userAns,
      keyAnswer: keyData.jawaban || keyData.pairs || '',
      poin: poin,
      isCorrect: isCorrect
    })
  }

  scoreResult.jumlahBenar = Number(totalBenar.toFixed(1))
  scoreResult.detailAnswers = details

  // Simpan ke Supabase
  try {
    await submitHasilUjian({
      npsn: studentData.npsn,
      nama_sekolah: studentData.nama_sekolah,
      nama_siswa: studentData.nama_siswa,
      nisn: studentData.nisn,
      jenjang: selectedJenjang.value,
      mapel: selectedMapel.value,
      paket: selectedPaket.value,
      jumlah_benar: scoreResult.jumlahBenar,
      total_soal: questions.value.length,
      durasi_detik: durasiPengerjaan.value,
      rincian_jawaban: details
    })
  } catch (err) {
    console.error('Gagal mencatat hasil ke Supabase:', err)
  }

  // Tanpa pop-up otomatis unduh berkas PDF sesuai instruksi Mas Bos
  // Berkas PDF hanya diunduh jika siswa secara sadar mengklik tombol Unduh di halaman hasil
  goToStep(6)
}

async function downloadPdfResult() {
  showToast('Sedang memproses berkas PDF Lembar Hasil...')
  try {
    await generateResultPDF({
      nama_siswa: studentData.nama_siswa || dummyUsername.value || 'Peserta',
      nisn: studentData.nisn,
      npsn: studentData.npsn,
      nama_sekolah: studentData.nama_sekolah,
      jenjang: selectedJenjang.value,
      mapel: selectedMapel.value,
      paket: selectedPaket.value,
      jumlah_benar: scoreResult.jumlahBenar,
      total_soal: questions.value.length,
      durasi_detik: durasiPengerjaan.value
    })
    showToast('Berkas PDF Lembar Hasil berhasil diunduh.')
  } catch (err) {
    console.error('Gagal mengunduh berkas PDF:', err)
    showToast('Gagal memproses berkas PDF: ' + (err.message || 'Error'))
  }
}

function resetToHome() {
  currentStep.value = 0
  currentIndex.value = 0
  Object.keys(userAnswers).forEach(k => delete userAnswers[k])
  Object.keys(raguRagu).forEach(k => delete raguRagu[k])
}

// Helpers Formatting
function getQuestionTypeLabel(tipe) {
  switch (tipe) {
    case '1': return 'Pilihan Ganda'
    case '2': return 'PG Kompleks'
    case '3': return 'Tabel Benar/Salah'
    case '5': return 'Menjodohkan'
    default: return 'Soal'
  }
}

function formatUserAnswer(ans) {
  if (!ans) return '(Tidak Dijawab)'
  if (Array.isArray(ans)) return ans.join(', ')
  if (typeof ans === 'object') return JSON.stringify(ans).replace(/["{}]/g, ' ')
  return String(ans)
}

function formatKeyAnswer(key) {
  if (!key) return '-'
  if (Array.isArray(key)) return key.join(', ')
  if (typeof key === 'object') return JSON.stringify(key).replace(/["{}]/g, ' ')
  return String(key)
}
</script>

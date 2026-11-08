<template>
  <div class="min-h-screen bg-[#f3f6fa] flex flex-col font-sans" :style="{ fontSize: fontScaleStyle }">
    <!-- Header Pusmendik Resmi Disdikbud Karanganyar -->
    <CBTHeader />

    <!-- Notifikasi Pemeliharaan Jika SD & SMP Keduanya Dimatikan -->
    <div v-if="!settings.sd_active && !settings.smp_active" class="flex-1 flex items-center justify-center p-6">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-lg border border-amber-200 p-8 text-center">
        <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <h2 class="text-xl font-bold text-gray-800 mb-2">Simulasi Sedang Ditutup</h2>
        <p class="text-sm text-gray-600 mb-6 leading-relaxed">
          Saat ini portal simulasi TKA sedang dinonaktifkan sementara oleh Proktor Dinas Pendidikan dan Kebudayaan Kabupaten Karanganyar untuk pemeliharaan sistem.
        </p>
        <router-link to="/marshal" class="text-xs text-blue-600 hover:underline">Masuk sebagai Marshal</router-link>
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
            <!-- Jenjang -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Jenjang Pendidikan</label>
              <div class="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  :disabled="!settings.sd_active"
                  @click="selectedJenjang = 'SD'"
                  class="p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-1.5"
                  :class="[
                    selectedJenjang === 'SD' ? 'border-blue-600 bg-blue-50/70 text-blue-800 font-bold shadow-sm' : 'border-gray-200 text-gray-600 hover:border-blue-300',
                    !settings.sd_active ? 'opacity-40 cursor-not-allowed bg-gray-100' : ''
                  ]"
                >
                  <span class="text-2xl">🎒</span>
                  <span class="text-base font-bold">Jenjang SD</span>
                  <span v-if="!settings.sd_active" class="text-[10px] text-red-500 font-normal">(Nonaktif)</span>
                </button>

                <button
                  type="button"
                  :disabled="!settings.smp_active"
                  @click="selectedJenjang = 'SMP'"
                  class="p-4 rounded-xl border-2 text-center transition-all flex flex-col items-center gap-1.5"
                  :class="[
                    selectedJenjang === 'SMP' ? 'border-blue-600 bg-blue-50/70 text-blue-800 font-bold shadow-sm' : 'border-gray-200 text-gray-600 hover:border-blue-300',
                    !settings.smp_active ? 'opacity-40 cursor-not-allowed bg-gray-100' : ''
                  ]"
                >
                  <span class="text-2xl">🏫</span>
                  <span class="text-base font-bold">Jenjang SMP</span>
                  <span v-if="!settings.smp_active" class="text-[10px] text-red-500 font-normal">(Nonaktif)</span>
                </button>
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

            <!-- Paket Soal -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">Pilihan Paket Ujian</label>
              <div class="grid grid-cols-2 gap-4">
                <label 
                  class="p-3.5 rounded-lg border cursor-pointer flex items-center gap-3 transition-all"
                  :class="selectedPaket === 'Paket 1' ? 'border-blue-600 bg-blue-50 font-bold text-blue-900' : 'border-gray-200 text-gray-700'"
                >
                  <input type="radio" v-model="selectedPaket" value="Paket 1" class="text-blue-600" />
                  <span>Paket 1 (Utama)</span>
                </label>
                <label 
                  class="p-3.5 rounded-lg border cursor-pointer flex items-center gap-3 transition-all"
                  :class="selectedPaket === 'Paket 2' ? 'border-blue-600 bg-blue-50 font-bold text-blue-900' : 'border-gray-200 text-gray-700'"
                >
                  <input type="radio" v-model="selectedPaket" value="Paket 2" class="text-blue-600" />
                  <span>Paket 2 (Latihan)</span>
                </label>
              </div>
            </div>

            <button
              @click="goToStep(1)"
              class="w-full py-3.5 px-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>Lanjut ke Halaman Login</span>
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
          <div class="bg-[#326698] p-5 text-white flex items-center justify-between">
            <div>
              <h2 class="text-lg font-bold">LOGIN SIMULASI SISWA</h2>
              <p class="text-xs text-blue-100">{{ selectedJenjang }} - {{ selectedMapel }} ({{ selectedPaket }})</p>
            </div>
            <button @click="goToStep(0)" class="text-xs text-blue-200 hover:text-white underline">Ubah Paket</button>
          </div>

          <div class="p-6 sm:p-8 space-y-5">
            <!-- Info Box Token Dinamis Pusmendik Style -->
            <div class="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
              <span class="text-xs font-semibold text-amber-800 uppercase tracking-wider block">Token Ujian Aktif Saat Ini:</span>
              <div class="text-3xl font-extrabold tracking-widest text-amber-900 mt-1 select-all font-mono">
                {{ settings.current_token || 'KRA26' }}
              </div>
              <span class="text-[11px] text-amber-700 mt-1 block">Token ini diperbarui otomatis setiap 1 jam</span>
            </div>

            <!-- Dummy Username & Password -->
            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1">Username Siswa</label>
              <input 
                type="text" 
                readonly 
                :value="dummyUsername" 
                class="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm font-mono text-gray-700 cursor-not-allowed"
              />
            </div>

            <div>
              <label class="block text-xs font-semibold text-gray-600 mb-1">Password</label>
              <input 
                type="password" 
                readonly 
                value="********" 
                class="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5 text-sm font-mono text-gray-700 cursor-not-allowed"
              />
            </div>

            <button
              @click="goToStep(2)"
              class="w-full py-3 bg-[#326698] hover:bg-[#28537d] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>LOG IN</span>
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- STEP 2: KONFIRMASI DATA PESERTA (NPSN)    -->
      <!-- ========================================== -->
      <section v-else-if="currentStep === 2" class="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div class="max-w-2xl w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div class="bg-gradient-to-r from-[#326698] to-[#4a7fb8] p-5 text-white flex items-center justify-between">
            <h2 class="text-base sm:text-lg font-bold">KONFIRMASI DATA PESERTA</h2>
            <span class="text-xs bg-white/20 px-2.5 py-1 rounded-full font-medium">Langkah 2 dari 4</span>
          </div>

          <form @submit.prevent="handleKonfirmasiData" class="p-6 sm:p-8 space-y-4">
            <!-- NPSN Sekolah dengan Auto Fetch Live Internet -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">
                NPSN Sekolah (8 Digit) <span class="text-red-500">*</span>
              </label>
              <div class="relative">
                <input
                  v-model="studentData.npsn"
                  @input="handleNpsnInput"
                  type="text"
                  maxlength="8"
                  placeholder="Contoh: 20312015"
                  required
                  class="w-full border-gray-300 rounded-lg p-2.5 text-sm font-mono focus:ring-blue-500 focus:border-blue-500 pr-10"
                />
                <div v-if="isSearchingNpsn" class="absolute right-3 top-2.5 text-blue-600">
                  <svg class="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path></svg>
                </div>
              </div>
              <span v-if="isSearchingNpsn" class="text-[11px] text-blue-600 mt-1 block">
                Sedang mencari nama sekolah melalui internet...
              </span>
            </div>

            <!-- Nama Sekolah (Auto-filled atau input manual) -->
            <div>
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">
                Nama Sekolah Asal <span class="text-red-500">*</span>
              </label>
              <input
                v-model="studentData.nama_sekolah"
                type="text"
                placeholder="Nama sekolah akan otomatis terisi atau ketik manual"
                required
                class="w-full border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <!-- Nama Peserta -->
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase mb-1">
                  Nama Lengkap Siswa <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="studentData.nama_siswa"
                  type="text"
                  placeholder="Masukkan nama lengkap"
                  required
                  class="w-full border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <!-- NISN -->
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase mb-1">
                  NISN (10 Digit)
                </label>
                <input
                  v-model="studentData.nisn"
                  type="text"
                  maxlength="10"
                  placeholder="Contoh: 0098765432"
                  class="w-full border-gray-300 rounded-lg p-2.5 text-sm font-mono focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <!-- Tanggal Lahir -->
            <div class="grid grid-cols-3 gap-3">
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Tgl Lahir</label>
                <select v-model="studentData.tgl" class="w-full border-gray-300 rounded-lg p-2.5 text-sm">
                  <option v-for="d in 31" :key="d" :value="d">{{ d }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Bulan</label>
                <select v-model="studentData.bln" class="w-full border-gray-300 rounded-lg p-2.5 text-sm">
                  <option v-for="(m, i) in bulanList" :key="i" :value="m">{{ m }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Tahun</label>
                <select v-model="studentData.thn" class="w-full border-gray-300 rounded-lg p-2.5 text-sm">
                  <option v-for="y in [2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016]" :key="y" :value="y">{{ y }}</option>
                </select>
              </div>
            </div>

            <!-- Token Ujian -->
            <div class="pt-2">
              <label class="block text-xs font-bold text-gray-700 uppercase mb-1">
                Token Ujian <span class="text-red-500">*</span>
              </label>
              <input
                v-model="inputToken"
                type="text"
                placeholder="Ketik token dari layar login"
                required
                class="w-full border-gray-300 rounded-lg p-2.5 text-sm font-mono tracking-widest uppercase focus:ring-blue-500 focus:border-blue-500"
              />
              <span v-if="tokenError" class="text-xs text-red-600 font-semibold mt-1 block">
                Token yang Anda masukkan salah atau sudah berganti!
              </span>
            </div>

            <div class="pt-4 flex gap-3">
              <button
                type="button"
                @click="goToStep(1)"
                class="w-1/3 py-2.5 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 text-sm"
              >
                Kembali
              </button>
              <button
                type="submit"
                class="w-2/3 py-2.5 px-4 bg-[#326698] hover:bg-[#28537d] text-white font-bold rounded-lg shadow text-sm"
              >
                SUBMIT DATA
              </button>
            </div>
          </form>
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
              <div class="py-2.5 flex justify-between">
                <span class="text-gray-500">Asal Sekolah:</span>
                <span class="font-bold text-gray-800">{{ studentData.nama_sekolah }} ({{ studentData.npsn }})</span>
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
                class="w-1/3 py-3 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 text-sm"
              >
                Batal
              </button>
              <button
                @click="startExam"
                class="w-2/3 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-lg transition-all text-sm flex items-center justify-center gap-2"
              >
                <span>MULAI MENGERJAKAN</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- ========================================== -->
      <!-- STEP 4: RUANG UJIAN CBT (IDENTIK PUSMENDIK)-->
      <!-- ========================================== -->
      <section v-else-if="currentStep === 4" class="flex-1 flex flex-col p-4 sm:p-6 max-w-7xl mx-auto w-full">
        <!-- CBT Action Header -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 px-5 py-3.5 mb-5 flex flex-wrap items-center justify-between gap-3">
          <!-- Font Size Scaler: A- / A / A+ -->
          <div class="flex items-center space-x-1 bg-gray-100 p-1 rounded-lg border border-gray-200">
            <span class="text-xs font-bold text-gray-500 px-2">Ukuran Font:</span>
            <button 
              @click="fontScale = 0.85" 
              class="px-2.5 py-1 text-xs font-bold rounded transition-colors"
              :class="fontScale === 0.85 ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-white/60'"
            >A-</button>
            <button 
              @click="fontScale = 1.0" 
              class="px-2.5 py-1 text-sm font-bold rounded transition-colors"
              :class="fontScale === 1.0 ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-white/60'"
            >A</button>
            <button 
              @click="fontScale = 1.2" 
              class="px-2.5 py-1 text-base font-bold rounded transition-colors"
              :class="fontScale === 1.2 ? 'bg-white shadow text-blue-600' : 'text-gray-600 hover:bg-white/60'"
            >A+</button>
          </div>

          <!-- Timer Countdown Pusmendik Style -->
          <div class="flex items-center gap-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-lg text-blue-900 font-mono font-bold text-base sm:text-lg">
            <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>Sisa Waktu: {{ timerFormatted }}</span>
          </div>

          <!-- Tombol Daftar Soal Modal -->
          <button 
            @click="showDaftarSoal = true"
            class="bg-[#326698] hover:bg-[#28537d] text-white text-xs sm:text-sm font-bold px-4 py-2 rounded-lg shadow-sm flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
            <span>DAFTAR SOAL ({{ countAnswered }}/{{ questions.length }})</span>
          </button>
        </div>

        <!-- Render Current Question Item -->
        <div v-if="currentQuestion" class="flex-1">
          <CBTQuestionItem 
            :question="currentQuestion"
            v-model="userAnswers[currentQuestion.nomor_soal]"
          />
        </div>

        <!-- CBT Footer Navigation Bar -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 px-6 py-4 mt-6 flex flex-wrap items-center justify-between gap-4">
          <!-- Tombol Soal Sebelumnya -->
          <button
            :disabled="currentIndex === 0"
            @click="prevQuestion"
            class="py-2.5 px-5 rounded-lg font-bold text-xs sm:text-sm transition-all flex items-center gap-2"
            :class="currentIndex === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300 text-gray-800'"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
            <span>Soal Sebelumnya</span>
          </button>

          <!-- Checkbox Ragu-Ragu (Kuning) -->
          <label class="flex items-center gap-2 cursor-pointer bg-amber-50 border border-amber-300 px-4 py-2 rounded-lg text-amber-900 font-semibold text-xs sm:text-sm">
            <input 
              type="checkbox" 
              :checked="raguRagu[currentQuestion?.nomor_soal]" 
              @change="toggleRaguRagu"
              class="w-4 h-4 text-amber-600 rounded border-amber-400 focus:ring-amber-500" 
            />
            <span>Ragu-Ragu</span>
          </label>

          <!-- Tombol Soal Berikutnya atau Selesai -->
          <button
            v-if="currentIndex < questions.length - 1"
            @click="nextQuestion"
            class="py-2.5 px-6 rounded-lg font-bold text-xs sm:text-sm bg-[#326698] hover:bg-[#28537d] text-white shadow transition-all flex items-center gap-2"
          >
            <span>Soal Berikutnya</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
          <button
            v-else
            @click="goToStep(5)"
            class="py-2.5 px-6 rounded-lg font-bold text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white shadow transition-all flex items-center gap-2"
          >
            <span>Selesai Tes</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </button>
        </div>

        <!-- MODAL DAFTAR SOAL (PUSMENDIK POP-UP GRID) -->
        <div v-if="showDaftarSoal" class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div class="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl overflow-hidden">
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
      </section>

      <!-- ========================================== -->
      <!-- STEP 5: KONFIRMASI SELESAI UJIAN           -->
      <!-- ========================================== -->
      <section v-else-if="currentStep === 5" class="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8 text-center space-y-5">
          <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>

          <h2 class="text-xl font-bold text-gray-800">Konfirmasi Selesai Ujian</h2>
          
          <p class="text-sm text-gray-600 leading-relaxed">
            Apakah Anda yakin ingin mengakhiri tes ini? Anda telah menjawab 
            <strong class="text-blue-700">{{ countAnswered }}</strong> dari <strong>{{ questions.length }}</strong> soal.
          </p>

          <div v-if="countRaguRagu > 0" class="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 font-medium">
            Perhatian: Masih ada {{ countRaguRagu }} soal dengan status ragu-ragu.
          </div>

          <div class="flex gap-3 pt-2">
            <button
              @click="goToStep(4)"
              class="w-1/2 py-2.5 px-4 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 text-sm"
            >
              Kembali ke Soal
            </button>
            <button
              @click="finishExam"
              class="w-1/2 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg shadow text-sm"
            >
              YA, SELESAI
            </button>
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
                {{ studentData.nama_sekolah }} (NPSN: {{ studentData.npsn }}) • {{ selectedJenjang }} {{ selectedMapel }}
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

          <!-- Tombol Unduh PDF Ulang -->
          <div class="mt-6 pt-6 border-t flex flex-wrap items-center justify-between gap-3">
            <p class="text-xs text-gray-500">
              * Pop-up berkas PDF Lembar Hasil telah diunduh secara otomatis ke perangkat Anda.
            </p>
            <button
              @click="downloadPdfAgain"
              class="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs sm:text-sm shadow flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
              <span>Unduh Ulang PDF Lembar Hasil</span>
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
          <p class="text-xs text-gray-500 mt-1">
            Untuk menjaga integritas dan kerahasiaan soal simulasi, pembahasan dan kunci jawaban tidak dipublikasikan ke siswa oleh Proktor Dinas.
          </p>
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
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import CBTHeader from '../components/CBTHeader.vue'
import CBTQuestionItem from '../components/CBTQuestionItem.vue'
import { getAppSettings, lookupNpsn, getSoalList, submitHasilUjian } from '../services/apiService.js'
import { generateResultPDF } from '../services/pdfService.js'

// State Global & Settings
const settings = ref({
  sd_active: true,
  smp_active: true,
  show_kunci: false,
  show_pdf: true,
  current_token: 'KRA26'
})

const currentStep = ref(0) // 0: Pilih, 1: Login, 2: Data, 3: Konfirmasi, 4: Ujian, 5: Konfirmasi Selesai, 6: Hasil
const selectedJenjang = ref('SMP')
const selectedMapel = ref('Matematika')
const selectedPaket = ref('Paket 1')

// Step 1: Login
const dummyUsername = ref('SISWA_' + Math.floor(1000 + Math.random() * 9000))

// Step 2: Form Data Siswa
const studentData = reactive({
  npsn: '',
  nama_sekolah: '',
  nama_siswa: '',
  nisn: '',
  tgl: 15,
  bln: 'Juli',
  thn: 2011
})
const inputToken = ref('')
const tokenError = ref(false)
const isSearchingNpsn = ref(false)
let npsnDebounceTimer = null

const bulanList = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember']

// Step 4: Ujian CBT
const questions = ref([])
const currentIndex = ref(0)
const userAnswers = reactive({})
const raguRagu = reactive({})
const showDaftarSoal = ref(false)

// Timer (60 Menit = 3600 Detik)
const timeRemaining = ref(3600)
let timerInterval = null
const startTime = ref(0)
const durasiPengerjaan = ref(0)

// Font Scaling
const fontScale = ref(1.0)
const fontScaleStyle = computed(() => `${fontScale.value * 100}%`)

// Hasil & Skor
const scoreResult = reactive({
  jumlahBenar: 0,
  detailAnswers: []
})

// Lifecycle
onMounted(async () => {
  settings.value = await getAppSettings()
  
  // Jika SD tidak aktif tapi SMP aktif, default ke SMP
  if (!settings.value.smp_active && settings.value.sd_active) {
    selectedJenjang.value = 'SD'
  }
})

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})

// Methods Navigasi Step
function goToStep(step) {
  currentStep.value = step
  window.scrollTo({ top: 0, behavior: 'smooth' })
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

  goToStep(3)
}

// Start Exam
async function startExam() {
  // Load bank soal sesuai pilihan
  questions.value = await getSoalList(selectedJenjang.value, selectedMapel.value, selectedPaket.value)
  currentIndex.value = 0
  timeRemaining.value = 3600
  startTime.value = Date.now()

  // Mulai interval timer
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      // Waktu habis, otomatis selesai
      clearInterval(timerInterval)
      finishExam()
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

// Timer Formatter mm:ss
const timerFormatted = computed(() => {
  const m = Math.floor(timeRemaining.value / 60)
  const s = timeRemaining.value % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
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
async function finishExam() {
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
      // PG Tunggal
      if (userAns && userAns === keyData.jawaban) {
        poin = 1.0
        isCorrect = true
      }
    } else if (q.tipe_soal === '2') {
      // PG Kompleks (MCMA) - Poin Parsial Per Pilihan
      const correctArr = Array.isArray(keyData.jawaban) ? keyData.jawaban : [keyData.jawaban]
      const userArr = Array.isArray(userAns) ? userAns : []
      const bobot = keyData.bobot_per_opsi || (1 / correctArr.length)

      let matchCount = 0
      for (const opt of userArr) {
        if (correctArr.includes(opt)) {
          matchCount++
        } else {
          matchCount -= 0.5 // penalti salah
        }
      }
      poin = Math.max(0, Math.min(1.0, matchCount * bobot))
      isCorrect = poin >= 0.99
    } else if (q.tipe_soal === '3') {
      // Tabel Benar/Salah - Poin Parsial Per Baris
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
      // Menjodohkan (Matching) - Poin Parsial Per Pasangan
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

  // Unduh otomatis Lembar Hasil PDF
  if (settings.value.show_pdf) {
    setTimeout(() => {
      downloadPdfAgain()
    }, 600)
  }

  goToStep(6)
}

function downloadPdfAgain() {
  generateResultPDF({
    nama_siswa: studentData.nama_siswa,
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

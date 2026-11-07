<template>
  <div class="min-h-screen bg-slate-100 py-6 px-3 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">

      <!-- ========================================== -->
      <!-- 1. TAHAP REGISTRASI / PERSIAPAN UJIAN      -->
      <!-- ========================================== -->
      <div v-if="examState === 'REGISTER'" class="max-w-xl mx-auto space-y-6 pt-4">
        <div class="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-6">
          <div class="text-center space-y-2">
            <div class="w-16 h-16 rounded-2xl bg-brand-50 text-brand-700 mx-auto flex items-center justify-center mb-3">
              <GraduationCap class="w-9 h-9" />
            </div>
            <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Simulasi TKA CBT</h1>
            <p class="text-xs sm:text-sm text-slate-500">Lengkapi data diri Anda sebelum memulai pengerjaan tes.</p>
          </div>

          <form @submit.prevent="startExam" class="space-y-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Nama Lengkap Siswa</label>
              <input 
                v-model="peserta.nama" 
                type="text" 
                required 
                placeholder="Contoh: Budi Santoso"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">NISN / No Peserta</label>
                <input 
                  v-model="peserta.nisn" 
                  type="text" 
                  placeholder="0081234567"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Jenjang Ujian</label>
                <select 
                  v-model="peserta.tingkat" 
                  @change="loadAvailableSoal"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="SD">SD (Sekolah Dasar)</option>
                  <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
                </select>
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Asal Sekolah</label>
              <input 
                v-model="peserta.sekolah" 
                type="text" 
                required 
                placeholder="Contoh: SMP Negeri 1 Karanganyar"
                class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              />
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Mata Pelajaran</label>
                <select 
                  v-model="peserta.mata_pelajaran" 
                  @change="loadAvailableSoal"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="Matematika">Matematika</option>
                  <option value="IPA">IPA</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                </select>
              </div>

              <div>
                <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Paket Soal</label>
                <select 
                  v-model="peserta.paket" 
                  @change="loadAvailableSoal"
                  class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                >
                  <option value="Paket 1">Paket 1 (Utama)</option>
                  <option value="Paket 2">Paket 2</option>
                  <option value="Paket 3">Paket 3</option>
                </select>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-brand-50/70 border border-brand-100 flex items-center justify-between text-xs text-brand-900">
              <span class="font-medium">Soal Siap Dikerjakan:</span>
              <span class="font-black px-2.5 py-1 rounded bg-white text-brand-700 shadow-xs">
                {{ availableSoalCount }} Soal Tersedia
              </span>
            </div>

            <button
              type="submit"
              :disabled="isLoadingQuestions"
              class="w-full py-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-extrabold text-base shadow-lg shadow-brand-600/30 transition-all flex items-center justify-center gap-2 transform active:scale-95 disabled:opacity-50"
            >
              <Play class="w-5 h-5 fill-current" />
              <span>Mulai Ujian Sekarang</span>
            </button>
          </form>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- 2. RUANG UJIAN CBT AKTIF                  -->
      <!-- ========================================== -->
      <div v-else-if="examState === 'EXAM'" class="space-y-4">
        <!-- Top Sticky Bar -->
        <div class="bg-white rounded-2xl p-4 sm:px-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-sm">
              {{ currentQuestionIndex + 1 }}
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900 text-sm sm:text-base">{{ peserta.nama }}</span>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">{{ peserta.tingkat }}</span>
              </div>
              <p class="text-xs text-slate-500">{{ peserta.sekolah }} &bull; {{ peserta.mata_pelajaran }}</p>
            </div>
          </div>

          <!-- Timer & Nav Toggle -->
          <div class="flex items-center gap-3 sm:gap-4">
            <!-- Timer countdown -->
            <div 
              class="flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-black font-mono shadow-xs transition-colors"
              :class="timerClass"
            >
              <Clock class="w-4 h-4 shrink-0" :class="{ 'animate-bounce': timeLeft < 300 }" />
              <span>{{ formattedTime }}</span>
            </div>

            <!-- Button buka drawer nomor soal di mobile -->
            <button 
              @click="isNavDrawerOpen = !isNavDrawerOpen"
              class="lg:hidden px-3.5 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs flex items-center gap-1.5 hover:bg-slate-200"
            >
              <LayoutGrid class="w-4 h-4" />
              <span>Daftar Soal</span>
            </button>
          </div>
        </div>

        <!-- Main Exam Area (Split: Left Soal, Right Grid Nav) -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
          <!-- Area Soal & Opsi (Col 3) -->
          <div class="lg:col-span-3 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <!-- Header Soal -->
            <div class="flex items-center justify-between pb-4 border-b border-slate-100">
              <span class="text-xs font-extrabold uppercase tracking-wider text-slate-500">
                Soal Nomor {{ currentQuestionIndex + 1 }} dari {{ soalList.length }}
              </span>

              <div class="flex items-center gap-2">
                <!-- Checkbox Ragu-Ragu -->
                <label class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold cursor-pointer select-none hover:bg-amber-100 transition-colors">
                  <input 
                    type="checkbox" 
                    :checked="currentIsRagu" 
                    @change="toggleRagu" 
                    class="h-4 w-4 text-amber-500 rounded focus:ring-amber-400"
                  />
                  <span>Tandai Ragu-Ragu</span>
                </label>
              </div>
            </div>

            <!-- Isi Pertanyaan -->
            <div class="space-y-4">
              <div class="text-base sm:text-lg font-medium text-slate-900 leading-relaxed">
                <MathView :content="currentQuestion.pertanyaan_teks" />
              </div>

              <!-- Gambar Pertanyaan -->
              <div v-if="currentQuestion.pertanyaan_gambar" class="pt-2">
                <img 
                  :src="currentQuestion.pertanyaan_gambar" 
                  alt="Ilustrasi Soal" 
                  class="max-h-72 max-w-full rounded-xl border border-slate-200 object-contain shadow-xs"
                />
              </div>
            </div>

            <!-- Pilihan Jawaban Opsi A - E -->
            <div class="space-y-3 pt-4 border-t border-slate-100">
              <div 
                v-for="opsi in getAvailableOptions(currentQuestion)" 
                :key="opsi"
                @click="pilihJawaban(opsi)"
                class="group p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3.5"
                :class="currentSelectedAnswer === opsi ? 'border-brand-600 bg-brand-50/70 ring-2 ring-brand-500/20' : 'border-slate-200 bg-slate-50/40 hover:bg-slate-100/70 hover:border-slate-300'"
              >
                <!-- Opsi Indicator Circle -->
                <div 
                  class="w-7 h-7 rounded-full flex items-center justify-center font-extrabold text-xs shrink-0 transition-colors"
                  :class="currentSelectedAnswer === opsi ? 'bg-brand-600 text-white' : 'bg-slate-200 text-slate-700 group-hover:bg-slate-300'"
                >
                  {{ opsi }}
                </div>

                <!-- Teks & Gambar Opsi -->
                <div class="flex-1 text-sm sm:text-base font-medium text-slate-800">
                  <MathView :content="currentQuestion[`opsi_${opsi.toLowerCase()}_teks`]" />
                  <div v-if="currentQuestion[`opsi_${opsi.toLowerCase()}_gambar`]" class="mt-2">
                    <img :src="currentQuestion[`opsi_${opsi.toLowerCase()}_gambar`]" class="max-h-36 rounded-lg border object-contain" />
                  </div>
                </div>
              </div>
            </div>

            <!-- Bottom Navigation Actions -->
            <div class="flex items-center justify-between pt-6 border-t border-slate-200 gap-2">
              <button
                @click="prevQuestion"
                :disabled="currentQuestionIndex === 0"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ChevronLeft class="w-4 h-4" />
                <span class="hidden sm:inline">Soal Sebelumnya</span>
                <span class="sm:hidden">Sebelumnya</span>
              </button>

              <button
                v-if="currentQuestionIndex < soalList.length - 1"
                @click="nextQuestion"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-all"
              >
                <span class="hidden sm:inline">Soal Berikutnya</span>
                <span class="sm:hidden">Berikutnya</span>
                <ChevronRight class="w-4 h-4" />
              </button>

              <button
                v-else
                @click="openConfirmModal"
                class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all"
              >
                <CheckCircle2 class="w-4 h-4" />
                <span>Selesaikan Ujian</span>
              </button>
            </div>
          </div>

          <!-- Area Navigasi Nomor Soal Grid (Col 1) -->
          <div 
            class="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4"
            :class="{ 'fixed inset-0 z-50 overflow-y-auto m-4 rounded-3xl shadow-2xl': isNavDrawerOpen }"
          >
            <div class="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 class="font-bold text-slate-800 text-sm flex items-center gap-2">
                <LayoutGrid class="w-4 h-4 text-brand-600" />
                <span>Navigasi Nomor Soal</span>
              </h3>
              <button 
                v-if="isNavDrawerOpen" 
                @click="isNavDrawerOpen = false" 
                class="lg:hidden text-xs font-bold text-slate-500 hover:text-slate-800 p-1"
              >
                Tutup
              </button>
            </div>

            <!-- Legend Info -->
            <div class="grid grid-cols-3 gap-1 text-[11px] font-semibold text-slate-600 pb-2 border-b border-slate-100 text-center">
              <div class="flex items-center gap-1.5 justify-center">
                <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span>Dijawab ({{ stats.dijawab }})</span>
              </div>
              <div class="flex items-center gap-1.5 justify-center">
                <span class="w-3 h-3 rounded-full bg-amber-400"></span>
                <span>Ragu ({{ stats.ragu }})</span>
              </div>
              <div class="flex items-center gap-1.5 justify-center">
                <span class="w-3 h-3 rounded-full bg-slate-200"></span>
                <span>Kosong ({{ stats.kosong }})</span>
              </div>
            </div>

            <!-- Number Grid -->
            <div class="grid grid-cols-5 sm:grid-cols-6 lg:grid-cols-5 gap-2 max-h-[380px] overflow-y-auto pr-1">
              <button
                v-for="(soal, idx) in soalList"
                :key="soal.id || idx"
                @click="jumpToQuestion(idx)"
                class="h-10 rounded-xl font-bold text-xs transition-all flex items-center justify-center relative shadow-2xs"
                :class="getNumberBadgeClass(idx)"
              >
                <span>{{ idx + 1 }}</span>
                <span 
                  v-if="jawabanSiswa[soal.id]" 
                  class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-white text-slate-800 border border-slate-300 text-[9px] font-black flex items-center justify-center shadow-xs"
                >
                  {{ jawabanSiswa[soal.id] }}
                </span>
              </button>
            </div>

            <!-- Tombol Selesaikan Ujian -->
            <div class="pt-3 border-t border-slate-100">
              <button
                @click="openConfirmModal"
                class="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle2 class="w-4 h-4" />
                <span>Kumpulkan Jawaban</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- 3. TAMPILAN LEMBAR HASIL & NILAI           -->
      <!-- ========================================== -->
      <div v-else-if="examState === 'RESULT'" class="space-y-6">
        <!-- Result Card -->
        <div class="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl space-y-8">
          <div class="text-center space-y-3">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              <CheckCircle2 class="w-4 h-4" />
              <span>Simulasi TKA Telah Berhasil Diselesaikan</span>
            </div>

            <h2 class="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Lembar Hasil Nilai Siswa
            </h2>
            <p class="text-xs sm:text-sm text-slate-500">
              {{ peserta.nama }} &bull; {{ peserta.sekolah }} &bull; Jenjang {{ peserta.tingkat }} ({{ peserta.mata_pelajaran }})
            </p>
          </div>

          <!-- Score Showcase -->
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
            <div class="p-6 rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 text-white space-y-1 shadow-md">
              <span class="text-xs font-semibold text-brand-200 uppercase tracking-wider">Nilai Akhir</span>
              <div class="text-4xl sm:text-5xl font-black">{{ hasilAkhir.nilai }}</div>
              <span class="text-[11px] text-brand-200 font-medium">Skala 0 - 100</span>
            </div>

            <div class="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
              <span class="text-xs font-bold text-emerald-800 uppercase tracking-wider">Jawaban Benar</span>
              <div class="text-3xl sm:text-4xl font-black text-emerald-700">{{ hasilAkhir.jumlah_benar }}</div>
              <span class="text-[11px] text-emerald-600 font-semibold">dari {{ hasilAkhir.jumlah_soal }} Soal</span>
            </div>

            <div class="p-6 rounded-2xl bg-rose-50 border border-rose-200 space-y-1">
              <span class="text-xs font-bold text-rose-800 uppercase tracking-wider">Jawaban Salah</span>
              <div class="text-3xl sm:text-4xl font-black text-rose-700">{{ hasilAkhir.jumlah_salah }}</div>
              <span class="text-[11px] text-rose-600 font-semibold">Perlu Evaluasi</span>
            </div>

            <div class="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
              <span class="text-xs font-bold text-slate-600 uppercase tracking-wider">Tidak Dijawab</span>
              <div class="text-3xl sm:text-4xl font-black text-slate-700">{{ hasilAkhir.jumlah_kosong }}</div>
              <span class="text-[11px] text-slate-500 font-semibold">Kosong / Dilewati</span>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-slate-100 no-print">
            <button
              @click="printHasil"
              class="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors"
            >
              <Printer class="w-4 h-4" />
              <span>Cetak / Simpan PDF</span>
            </button>

            <button
              @click="ulangUjian"
              class="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-sm transition-colors"
            >
              <RotateCcw class="w-4 h-4" />
              <span>Mulai Simulasi Baru</span>
            </button>
          </div>
        </div>

        <!-- Detail Pembahasan Soal -->
        <div class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <h3 class="text-lg font-bold text-slate-900">Analisis & Pembahasan Tiap Soal</h3>
              <p class="text-xs text-slate-500">Bandingkan jawaban yang Anda pilih dengan kunci jawaban resmi.</p>
            </div>
            <span class="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
              Total {{ soalList.length }} Soal
            </span>
          </div>

          <div class="space-y-6">
            <div 
              v-for="(soal, index) in soalList" 
              :key="soal.id || index"
              class="p-5 rounded-2xl border transition-all space-y-3"
              :class="isCorrect(soal) ? 'border-emerald-200 bg-emerald-50/20' : 'border-rose-200 bg-rose-50/20'"
            >
              <!-- Soal header -->
              <div class="flex items-center justify-between">
                <span class="font-extrabold text-xs px-2.5 py-1 rounded-md" :class="isCorrect(soal) ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'">
                  Soal #{{ index + 1 }} &bull; {{ isCorrect(soal) ? 'BENAR' : (jawabanSiswa[soal.id] ? 'SALAH' : 'KOSONG') }}
                </span>

                <div class="text-xs font-semibold">
                  Jawaban Anda: <strong :class="isCorrect(soal) ? 'text-emerald-700' : 'text-rose-600'">{{ jawabanSiswa[soal.id] || '(Tidak Dijawab)' }}</strong>
                  &bull; Kunci: <strong class="text-emerald-700">{{ soal.jawaban_benar }}</strong>
                </div>
              </div>

              <!-- Teks Soal -->
              <div class="text-sm font-medium text-slate-900 leading-relaxed">
                <MathView :content="soal.pertanyaan_teks" />
                <div v-if="soal.pertanyaan_gambar" class="mt-2">
                  <img :src="soal.pertanyaan_gambar" class="max-h-40 rounded-lg border object-contain" />
                </div>
              </div>

              <!-- Pembahasan -->
              <div v-if="soal.pembahasan" class="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                <span class="font-bold text-brand-700">💡 Pembahasan:</span>
                <p>{{ soal.pembahasan }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========================================== -->
      <!-- MODAL KONFIRMASI SELESAI UJIAN             -->
      <!-- ========================================== -->
      <div v-if="showConfirmModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div class="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-5 animate-in fade-in zoom-in">
          <div class="text-center space-y-2">
            <div class="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 mx-auto flex items-center justify-center mb-2">
              <AlertTriangle class="w-8 h-8" />
            </div>
            <h3 class="text-xl font-extrabold text-slate-900">Konfirmasi Selesai Ujian</h3>
            <p class="text-xs text-slate-500">Pastikan Anda telah memeriksa kembali seluruh lembar jawaban sebelum mengumpulkan.</p>
          </div>

          <!-- Ringkasan jawaban -->
          <div class="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-2 text-xs">
            <div class="flex justify-between font-semibold">
              <span class="text-slate-600">Total Soal:</span>
              <span class="text-slate-900 font-bold">{{ soalList.length }} Soal</span>
            </div>
            <div class="flex justify-between font-semibold">
              <span class="text-emerald-700">Sudah Dijawab:</span>
              <span class="text-emerald-800 font-bold">{{ stats.dijawab }}</span>
            </div>
            <div class="flex justify-between font-semibold">
              <span class="text-amber-700">Masih Ragu-Ragu:</span>
              <span class="text-amber-800 font-bold">{{ stats.ragu }}</span>
            </div>
            <div class="flex justify-between font-semibold">
              <span class="text-rose-700">Belum Dijawab (Kosong):</span>
              <span class="text-rose-800 font-bold">{{ stats.kosong }}</span>
            </div>
          </div>

          <div v-if="stats.kosong > 0 || stats.ragu > 0" class="p-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs">
            ⚠️ Masih ada <strong>{{ stats.kosong }} soal kosong</strong> dan <strong>{{ stats.ragu }} soal ragu-ragu</strong>. Anda yakin ingin mengumpulkan sekarang?
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button
              @click="showConfirmModal = false"
              class="w-1/2 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-bold text-xs hover:bg-slate-50 transition-colors"
            >
              Cek Lagi
            </button>
            <button
              @click="submitExam"
              class="w-1/2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-md shadow-emerald-600/20 transition-all"
            >
              Ya, Kumpulkan
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import {
  GraduationCap,
  Play,
  Clock,
  LayoutGrid,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Printer,
  RotateCcw,
  AlertTriangle
} from 'lucide-vue-next'
import MathView from '../components/MathView.vue'
import { getSoalTKA, simpanHasilUjian } from '../services/soalService'
import confetti from 'canvas-confetti'

const examState = ref('REGISTER') // 'REGISTER' | 'EXAM' | 'RESULT'
const isLoadingQuestions = ref(false)
const isNavDrawerOpen = ref(false)
const showConfirmModal = ref(false)

// Student info
const peserta = ref({
  nama: '',
  nisn: '',
  sekolah: '',
  tingkat: 'SMP',
  mata_pelajaran: 'Matematika',
  paket: 'Paket 1'
})

// Questions
const soalList = ref([])
const availableSoalCount = ref(0)
const currentQuestionIndex = ref(0)

// Answers: { [soalId]: 'A' | 'B' | 'C' | 'D' | 'E' }
const jawabanSiswa = ref({})
// Ragu: { [soalId]: boolean }
const raguSiswa = ref({})

// Timer
const DURATION_SECONDS = 60 * 60 // 60 menit
const timeLeft = ref(DURATION_SECONDS)
let timerInterval = null

// Final Result
const hasilAkhir = ref({
  jumlah_soal: 0,
  jumlah_benar: 0,
  jumlah_salah: 0,
  jumlah_kosong: 0,
  nilai: 0
})

const currentQuestion = computed(() => {
  return soalList.value[currentQuestionIndex.value] || {}
})

const currentSelectedAnswer = computed(() => {
  if (!currentQuestion.value?.id) return null
  return jawabanSiswa.value[currentQuestion.value.id] || null
})

const currentIsRagu = computed(() => {
  if (!currentQuestion.value?.id) return false
  return !!raguSiswa.value[currentQuestion.value.id]
})

const getAvailableOptions = (soal) => {
  // If SMP, usually A, B, C, D, E. If SD, usually A, B, C, D
  if (soal.tingkat === 'SD' && !soal.opsi_e_teks && !soal.opsi_e_gambar) {
    return ['A', 'B', 'C', 'D']
  }
  return ['A', 'B', 'C', 'D', 'E']
}

const stats = computed(() => {
  let dijawab = 0
  let ragu = 0
  let kosong = 0

  for (const s of soalList.value) {
    const isAnswered = !!jawabanSiswa.value[s.id]
    const isR = !!raguSiswa.value[s.id]

    if (isR) {
      ragu++
    } else if (isAnswered) {
      dijawab++
    } else {
      kosong++
    }
  }

  return { dijawab, ragu, kosong }
})

const formattedTime = computed(() => {
  const m = Math.floor(timeLeft.value / 60)
  const s = timeLeft.value % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

const timerClass = computed(() => {
  if (timeLeft.value < 180) { // < 3 menit
    return 'bg-rose-50 text-rose-700 border-rose-300'
  }
  if (timeLeft.value < 600) { // < 10 menit
    return 'bg-amber-50 text-amber-700 border-amber-300'
  }
  return 'bg-brand-50 text-brand-700 border-brand-200'
})

const getNumberBadgeClass = (idx) => {
  const soal = soalList.value[idx]
  if (!soal) return 'bg-slate-100 text-slate-700'

  const isCurrent = idx === currentQuestionIndex.value
  const isAnswered = !!jawabanSiswa.value[soal.id]
  const isRagu = !!raguSiswa.value[soal.id]

  let classes = ''
  if (isCurrent) {
    classes += 'ring-2 ring-brand-600 ring-offset-2 '
  }

  if (isRagu) {
    classes += 'bg-amber-400 text-slate-900 font-black'
  } else if (isAnswered) {
    classes += 'bg-emerald-500 text-white font-black'
  } else {
    classes += 'bg-slate-100 text-slate-700 hover:bg-slate-200'
  }

  return classes
}

const loadAvailableSoal = async () => {
  isLoadingQuestions.value = true
  try {
    const res = await getSoalTKA({
      tingkat: peserta.value.tingkat,
      mata_pelajaran: peserta.value.mata_pelajaran,
      paket: peserta.value.paket
    })
    soalList.value = res.data || []
    availableSoalCount.value = soalList.value.length
  } catch (e) {
    console.error('Error preloading questions:', e)
  } finally {
    isLoadingQuestions.value = false
  }
}

const startExam = async () => {
  if (!peserta.value.nama || !peserta.value.sekolah) {
    alert('Harap masukkan Nama Lengkap dan Asal Sekolah.')
    return
  }

  await loadAvailableSoal()
  if (soalList.value.length === 0) {
    alert('Belum ada soal pada pilihan jenjang/mata pelajaran ini. Hubungi Guru atau muat contoh soal di Dashboard Guru.')
    return
  }

  currentQuestionIndex.value = 0
  jawabanSiswa.value = {}
  raguSiswa.value = {}
  timeLeft.value = DURATION_SECONDS
  examState.value = 'EXAM'

  // Start timer
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      clearInterval(timerInterval)
      alert('Waktu ujian telah habis! Sistem otomatis mengumpulkan lembar jawaban Anda.')
      submitExam()
    }
  }, 1000)
}

const pilihJawaban = (opsi) => {
  if (!currentQuestion.value?.id) return
  jawabanSiswa.value[currentQuestion.value.id] = opsi
}

const toggleRagu = (e) => {
  if (!currentQuestion.value?.id) return
  raguSiswa.value[currentQuestion.value.id] = e.target.checked
}

const prevQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value--
  }
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < soalList.value.length - 1) {
    currentQuestionIndex.value++
  }
}

const jumpToQuestion = (idx) => {
  currentQuestionIndex.value = idx
  isNavDrawerOpen.value = false
}

const openConfirmModal = () => {
  showConfirmModal.value = true
}

const isCorrect = (soal) => {
  const chosen = jawabanSiswa.value[soal.id]
  return chosen && chosen.toUpperCase() === soal.jawaban_benar?.toUpperCase()
}

const submitExam = async () => {
  clearInterval(timerInterval)
  showConfirmModal.value = false

  let benar = 0
  let salah = 0
  let kosong = 0

  for (const s of soalList.value) {
    const chosen = jawabanSiswa.value[s.id]
    if (!chosen) {
      kosong++
    } else if (chosen.toUpperCase() === s.jawaban_benar?.toUpperCase()) {
      benar++
    } else {
      salah++
    }
  }

  const total = soalList.value.length
  const nilai = total > 0 ? Math.round((benar / total) * 100) : 0

  hasilAkhir.value = {
    jumlah_soal: total,
    jumlah_benar: benar,
    jumlah_salah: salah,
    jumlah_kosong: kosong,
    nilai
  }

  // Save to DB
  await simpanHasilUjian({
    nama_siswa: peserta.value.nama,
    nisn: peserta.value.nisn,
    sekolah: peserta.value.sekolah,
    tingkat: peserta.value.tingkat,
    mata_pelajaran: peserta.value.mata_pelajaran,
    paket: peserta.value.paket,
    jumlah_soal: total,
    jumlah_benar: benar,
    jumlah_salah: salah,
    jumlah_kosong: kosong,
    nilai
  })

  examState.value = 'RESULT'

  // Confetti effect
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    })
  } catch (e) {
    // ignore
  }
}

const ulangUjian = () => {
  examState.value = 'REGISTER'
  loadAvailableSoal()
}

const printHasil = () => {
  window.print()
}

onMounted(() => {
  loadAvailableSoal()
})

onUnmounted(() => {
  clearInterval(timerInterval)
})
</script>

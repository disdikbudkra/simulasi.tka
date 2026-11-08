<template>
  <div class="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8">
    <div class="max-w-5xl mx-auto space-y-8">
      <!-- Header Banner -->
      <div class="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold mb-2 border border-emerald-200">
            <ShieldCheck class="w-3.5 h-3.5" />
            <span>Portal Tenaga Pendidik / Penulis Soal</span>
          </div>
          <h1 class="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Guru TKA</h1>
          <p class="text-sm text-slate-500 mt-1">Pembuatan soal berbasis rumus saintifik, pengelolaan bank soal, dan pemantauan nilai siswa.</p>
        </div>

        <div class="flex items-center gap-3">
          <button 
            @click="loadQuestions"
            class="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            title="Muat ulang data dari database"
          >
            <RefreshCw class="w-3.5 h-3.5" :class="{ 'animate-spin': isLoadingList }" />
            <span>Segarkan</span>
          </button>

          <router-link
            to="/siswa"
            class="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-brand-600 hover:bg-brand-700 text-white transition-colors shadow-xs"
          >
            <ExternalLink class="w-3.5 h-3.5" />
            <span>Uji Coba Ujian Siswa</span>
          </router-link>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="flex border-b border-slate-200 bg-white px-4 rounded-t-xl gap-2 sm:gap-6 overflow-x-auto">
        <button
          @click="activeTab = 'buat'"
          class="py-3.5 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0"
          :class="activeTab === 'buat' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <PlusCircle class="w-4 h-4" />
          <span>1. Buat Soal Baru</span>
        </button>

        <button
          @click="activeTab = 'bank'"
          class="py-3.5 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0"
          :class="activeTab === 'bank' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <Database class="w-4 h-4" />
          <span>2. Bank Soal Tersimpan ({{ daftarSoal.length }})</span>
        </button>

        <button
          @click="activeTab = 'nilai'"
          class="py-3.5 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0"
          :class="activeTab === 'nilai' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <Award class="w-4 h-4" />
          <span>3. Rekap Nilai Siswa</span>
        </button>

        <button
          @click="activeTab = 'sql'"
          class="py-3.5 px-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 shrink-0"
          :class="activeTab === 'sql' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'"
        >
          <Code2 class="w-4 h-4" />
          <span>4. Panduan & SQL Supabase</span>
        </button>
      </div>

      <!-- TAB 1: FORM BUAT SOAL -->
      <div v-if="activeTab === 'buat'" class="space-y-6">
        <!-- Notification Message -->
        <div v-if="alertMessage" class="p-4 rounded-xl flex items-center justify-between text-sm shadow-xs" :class="alertType === 'success' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'">
          <div class="flex items-center gap-2 font-medium">
            <CheckCircle2 v-if="alertType === 'success'" class="w-5 h-5 text-emerald-600 shrink-0" />
            <AlertCircle v-else class="w-5 h-5 text-rose-600 shrink-0" />
            <span>{{ alertMessage }}</span>
          </div>
          <button @click="alertMessage = ''" class="text-xs font-bold underline ml-4">Tutup</button>
        </div>

        <!-- Section 1: Kategori -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div class="flex items-center gap-2 pb-3 border-b border-slate-100">
            <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">1</span>
            <h3 class="text-base font-bold text-slate-800">Kategori & Sasaran Ujian</h3>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Jenjang / Tingkat</label>
              <select v-model="soalBaru.tingkat" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                <option value="SD">SD (Sekolah Dasar)</option>
                <option value="SMP">SMP (Sekolah Menengah Pertama)</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Mata Pelajaran</label>
              <select v-model="soalBaru.mata_pelajaran" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                <option value="Matematika">Matematika</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="IPA">IPA (Ilmu Pengetahuan Alam)</option>
                <option value="Bahasa Inggris">Bahasa Inggris</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Paket Soal</label>
              <select v-model="soalBaru.paket" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                <option value="Paket 1">Paket 1 (Utama)</option>
                <option value="Paket 2">Paket 2</option>
                <option value="Paket 3">Paket 3</option>
                <option value="Tryout Akbar">Tryout Akbar</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Section 2: Pertanyaan -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">2</span>
              <h3 class="text-base font-bold text-slate-800">Isi Soal & Rumus Matematika</h3>
            </div>
            <span class="text-xs text-slate-500">Mendukung formula MathLive & LaTeX</span>
          </div>

          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <label class="block text-xs font-bold text-slate-700 uppercase tracking-wider">Teks Pertanyaan / Rumus:</label>
              <span class="text-xs text-brand-600 font-medium">💡 Klik ikon keyboard di dalam kotak untuk membuka papan rumus</span>
            </div>

            <!-- MathLive Field for Pertanyaan -->
            <math-field 
              ref="mfPertanyaanRef"
              @input="e => soalBaru.pertanyaan_teks = e.target.value"
              class="w-full min-h-[90px] border border-slate-300 rounded-xl p-3 bg-white text-base font-mono focus:ring-2 focus:ring-emerald-500"
              placeholder="Ketik pertanyaan atau rumus di sini..."
            ></math-field>

            <!-- Upload Gambar Pertanyaan -->
            <div class="pt-2">
              <label class="block text-xs font-semibold text-slate-600 mb-1.5">Lampirkan Gambar Pertanyaan (Opsional):</label>
              <div class="flex items-center gap-4">
                <label class="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold border border-slate-200 transition-colors">
                  <ImagePlus class="w-4 h-4 text-slate-500" />
                  <span>Pilih File Gambar</span>
                  <input type="file" @change="e => handleFileSelect(e, 'pertanyaan')" accept="image/*" class="hidden" />
                </label>

                <div v-if="previewImages.pertanyaan" class="flex items-center gap-3 bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-lg border border-emerald-200 text-xs">
                  <img :src="previewImages.pertanyaan" alt="Preview Soal" class="w-10 h-10 object-cover rounded border border-emerald-300" />
                  <span>Gambar terpilih</span>
                  <button @click="removeImage('pertanyaan')" class="text-rose-600 hover:text-rose-800 font-bold ml-1">Hapus</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3: Pilihan Jawaban A s/d E -->
        <div class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-slate-100">
            <div class="flex items-center gap-2">
              <span class="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center">3</span>
              <h3 class="text-base font-bold text-slate-800">Pilihan Opsi Jawaban (A - E)</h3>
            </div>
            <span class="text-xs text-slate-500">Isi teks / rumus & gambar per opsi</span>
          </div>

          <div class="space-y-4">
            <div 
              v-for="opsi in ['a', 'b', 'c', 'd', 'e']" 
              :key="opsi" 
              class="p-4 rounded-xl border transition-all"
              :class="soalBaru.jawaban_benar.toLowerCase() === opsi ? 'border-emerald-500 bg-emerald-50/40 ring-1 ring-emerald-500' : 'border-slate-200 bg-slate-50/50'"
            >
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-extrabold uppercase px-2.5 py-1 rounded bg-slate-200 text-slate-800">
                  Opsi {{ opsi.toUpperCase() }}
                </span>
                
                <label class="inline-flex items-center gap-1.5 cursor-pointer text-xs font-bold text-slate-700">
                  <input 
                    type="radio" 
                    name="kunciJawaban" 
                    :value="opsi.toUpperCase()" 
                    v-model="soalBaru.jawaban_benar"
                    class="text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <span :class="soalBaru.jawaban_benar.toLowerCase() === opsi ? 'text-emerald-700 font-black' : ''">
                    Jadikan Kunci Jawaban Benar
                  </span>
                </label>
              </div>

              <!-- MathLive field for option -->
              <math-field 
                @input="e => soalBaru[`opsi_${opsi}_teks`] = e.target.value"
                class="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-sm"
                :placeholder="`Teks atau rumus pilihan ${opsi.toUpperCase()}...`"
              ></math-field>

              <!-- Upload Gambar Opsi -->
              <div class="mt-2.5 flex items-center gap-3">
                <label class="cursor-pointer inline-flex items-center gap-1 px-3 py-1.5 rounded bg-white hover:bg-slate-100 text-slate-600 text-xs font-semibold border border-slate-200">
                  <Image class="w-3.5 h-3.5 text-slate-400" />
                  <span>Gambar Opsi {{ opsi.toUpperCase() }} (opsional)</span>
                  <input type="file" @change="e => handleFileSelect(e, `opsi_${opsi}`)" accept="image/*" class="hidden" />
                </label>

                <div v-if="previewImages[`opsi_${opsi}`]" class="flex items-center gap-2 bg-white px-2.5 py-1 rounded border border-slate-200 text-xs">
                  <img :src="previewImages[`opsi_${opsi}`]" class="w-7 h-7 object-cover rounded" />
                  <button @click="removeImage(`opsi_${opsi}`)" class="text-rose-600 font-bold">×</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Kunci Jawaban Ringkasan -->
          <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span class="text-xs font-bold uppercase tracking-wider text-amber-800">Kunci Jawaban Terpilih:</span>
              <p class="text-lg font-black text-amber-900">Opsi {{ soalBaru.jawaban_benar }}</p>
            </div>
            <div>
              <label class="block text-xs font-bold text-slate-700 mb-1">Catatan / Pembahasan Singkat (Opsional):</label>
              <input 
                type="text" 
                v-model="soalBaru.pembahasan" 
                placeholder="Contoh: KPK dari bilangan adalah 12, lalu disederhanakan."
                class="w-full sm:w-80 bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>
        </div>

        <!-- Tombol Simpan -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            @click="resetForm"
            class="px-5 py-3 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            Bersihkan Form
          </button>

          <button
            type="button"
            @click="submitSoal"
            :disabled="isSubmitting"
            class="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save v-if="!isSubmitting" class="w-4 h-4" />
            <RefreshCw v-else class="w-4 h-4 animate-spin" />
            <span>{{ isSubmitting ? 'Menyimpan ke Cloud Supabase...' : 'Simpan Soal ke Database' }}</span>
          </button>
        </div>
      </div>

      <!-- TAB 2: BANK SOAL TERSIMPAN -->
      <div v-if="activeTab === 'bank'" class="space-y-6">
        <!-- Filter Bar -->
        <div class="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap items-center gap-3">
            <div>
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Jenjang</label>
              <select v-model="filterJenjang" class="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-semibold">
                <option value="SEMUA">Semua Jenjang</option>
                <option value="SD">SD</option>
                <option value="SMP">SMP</option>
              </select>
            </div>

            <div>
              <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Mata Pelajaran</label>
              <select v-model="filterMapel" class="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 font-semibold">
                <option value="SEMUA">Semua Mapel</option>
                <option value="Matematika">Matematika</option>
                <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                <option value="IPA">IPA</option>
              </select>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <button
              @click="loadSampleQuestions"
              class="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <Sparkles class="w-3.5 h-3.5 text-amber-600" />
              <span>Muat Contoh Soal Standar</span>
            </button>
          </div>
        </div>

        <!-- Daftar Soal List -->
        <div v-if="filteredSoal.length === 0" class="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-4">
          <div class="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Inbox class="w-6 h-6" />
          </div>
          <div class="space-y-1">
            <h4 class="font-bold text-slate-800 text-base">Belum Ada Soal di Kategori Ini</h4>
            <p class="text-xs text-slate-500">Mulai buat soal baru di Tab 1 atau klik "Muat Contoh Soal Standar".</p>
          </div>
        </div>

        <div v-else class="space-y-4">
          <div 
            v-for="(soal, index) in filteredSoal" 
            :key="soal.id || index"
            class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4"
          >
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="w-6 h-6 rounded-md bg-brand-100 text-brand-700 font-extrabold text-xs flex items-center justify-center">
                  {{ index + 1 }}
                </span>
                <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {{ soal.tingkat }} &bull; {{ soal.mata_pelajaran }} &bull; {{ soal.paket }}
                </span>
              </div>

              <button
                @click="deleteSoal(soal.id)"
                class="text-rose-600 hover:text-rose-800 p-1.5 rounded-md hover:bg-rose-50 transition-colors"
                title="Hapus Soal"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>

            <!-- Pertanyaan display -->
            <div class="text-sm font-medium text-slate-900 leading-relaxed pl-8">
              <MathView :content="soal.pertanyaan_teks" />

              <div v-if="soal.pertanyaan_gambar" class="mt-3">
                <img :src="soal.pertanyaan_gambar" alt="Gambar Soal" class="max-h-48 rounded-lg border border-slate-200 object-contain shadow-xs" />
              </div>
            </div>

            <!-- Opsi List -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pl-8 pt-2">
              <div 
                v-for="op in ['a', 'b', 'c', 'd', 'e']" 
                :key="op"
                class="p-2.5 rounded-lg border text-xs flex items-start gap-2"
                :class="soal.jawaban_benar?.toUpperCase() === op.toUpperCase() ? 'bg-emerald-50 border-emerald-300 font-bold text-emerald-900' : 'bg-slate-50 border-slate-200 text-slate-700'"
              >
                <span class="font-extrabold">{{ op.toUpperCase() }}.</span>
                <div>
                  <MathView :content="soal[`opsi_${op}_teks`] || '-'" />
                  <img v-if="soal[`opsi_${op}_gambar`]" :src="soal[`opsi_${op}_gambar`]" class="w-12 h-12 object-cover rounded mt-1 border" />
                </div>
              </div>
            </div>

            <div class="flex items-center justify-between text-xs text-slate-500 pl-8 pt-2 border-t border-slate-100">
              <span class="font-semibold text-emerald-700">Kunci Jawaban: {{ soal.jawaban_benar }}</span>
              <span v-if="soal.pembahasan" class="text-slate-500 italic">Pembahasan: {{ soal.pembahasan }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: REKAP NILAI SISWA -->
      <div v-if="activeTab === 'nilai'" class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div class="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 class="text-base font-bold text-slate-800">Hasil Pengerjaan Siswa</h3>
            <p class="text-xs text-slate-500">Daftar siswa yang telah menyelesaikan sesi simulasi TKA.</p>
          </div>
          <button @click="loadHasil" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">
            Perbarui Rekap
          </button>
        </div>

        <div v-if="daftarHasil.length === 0" class="p-8 text-center text-xs text-slate-400">
          Belum ada riwayat hasil ujian siswa. Buka menu Simulasi Siswa untuk mencoba mengerjakan.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-700 uppercase font-extrabold border-b">
              <tr>
                <th class="p-3">Nama Siswa</th>
                <th class="p-3">Sekolah</th>
                <th class="p-3">Jenjang / Mapel</th>
                <th class="p-3">Waktu Selesai</th>
                <th class="p-3">Benar / Salah</th>
                <th class="p-3 text-right">Nilai Akhir</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr v-for="h in daftarHasil" :key="h.id" class="hover:bg-slate-50/50">
                <td class="p-3 font-bold text-slate-900">{{ h.nama_siswa }} <span class="text-slate-400 font-normal">({{ h.nisn || '-' }})</span></td>
                <td class="p-3 text-slate-600">{{ h.sekolah }}</td>
                <td class="p-3 text-slate-700">{{ h.tingkat }} &bull; {{ h.mata_pelajaran }}</td>
                <td class="p-3 text-slate-500">{{ new Date(h.created_at).toLocaleString('id-ID') }}</td>
                <td class="p-3">
                  <span class="text-emerald-700 font-bold">{{ h.jumlah_benar }}B</span> / 
                  <span class="text-rose-600 font-bold">{{ h.jumlah_salah }}S</span> / 
                  <span class="text-slate-400">{{ h.jumlah_kosong || 0 }}K</span>
                </td>
                <td class="p-3 text-right">
                  <span class="inline-block px-2.5 py-1 rounded-md font-black text-sm" :class="h.nilai >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'">
                    {{ h.nilai }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 4: PANDUAN & SQL SUPABASE -->
      <div v-if="activeTab === 'sql'" class="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
        <div>
          <h3 class="text-base font-bold text-slate-900">Script SQL Supabase Database & Storage</h3>
          <p class="text-xs text-slate-500 mt-1">Salin script ini dan jalankan di SQL Editor dashboard Supabase Anda (<code class="bg-slate-100 px-1 py-0.5 rounded text-brand-700">dqrzxvjsjjibyllvinre.supabase.co</code>) untuk mengaktifkan izin tabel `soal_tka`, `hasil_ujian`, serta bucket gambar `gambar_soal`.</p>
        </div>

        <div class="relative">
          <pre class="bg-slate-900 text-slate-100 rounded-xl p-4 text-xs font-mono overflow-x-auto leading-relaxed">{{ sqlScript }}</pre>
          <button 
            @click="copySql"
            class="absolute top-3 right-3 px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <Copy class="w-3.5 h-3.5" />
            <span>{{ isCopied ? 'Tersalin!' : 'Salin SQL' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import {
  ShieldCheck,
  RefreshCw,
  ExternalLink,
  PlusCircle,
  Database,
  Award,
  Code2,
  CheckCircle2,
  AlertCircle,
  ImagePlus,
  Image,
  Save,
  Trash2,
  Inbox,
  Sparkles,
  Copy
} from 'lucide-vue-next'
import MathView from '../components/MathView.vue'
import {
  getSoalTKA,
  simpanSoalTKA,
  hapusSoalTKA,
  uploadGambarSoal,
  getHasilUjian
} from '../services/soalService'
import { DEFAULT_QUESTIONS } from '../services/defaultQuestions'
import 'mathlive'

const activeTab = ref('buat')
const isSubmitting = ref(false)
const isLoadingList = ref(false)
const alertMessage = ref('')
const alertType = ref('success')
const isCopied = ref(false)

const filterJenjang = ref('SEMUA')
const filterMapel = ref('SEMUA')

const daftarSoal = ref([])
const daftarHasil = ref([])

// Form state
const soalBaru = ref({
  tingkat: 'SMP',
  mata_pelajaran: 'Matematika',
  paket: 'Paket 1',
  pertanyaan_teks: '',
  opsi_a_teks: '',
  opsi_b_teks: '',
  opsi_c_teks: '',
  opsi_d_teks: '',
  opsi_e_teks: '',
  jawaban_benar: 'A',
  pembahasan: ''
})

// File state for uploads
const filesToUpload = ref({
  pertanyaan: null,
  opsi_a: null,
  opsi_b: null,
  opsi_c: null,
  opsi_d: null,
  opsi_e: null
})

// Image preview URLs
const previewImages = ref({
  pertanyaan: null,
  opsi_a: null,
  opsi_b: null,
  opsi_c: null,
  opsi_d: null,
  opsi_e: null
})

const handleFileSelect = (event, fieldName) => {
  const file = event.target.files[0]
  if (!file) return
  filesToUpload.value[fieldName] = file
  previewImages.value[fieldName] = URL.createObjectURL(file)
}

const removeImage = (fieldName) => {
  filesToUpload.value[fieldName] = null
  previewImages.value[fieldName] = null
}

const resetForm = () => {
  soalBaru.value = {
    tingkat: 'SMP',
    mata_pelajaran: 'Matematika',
    paket: 'Paket 1',
    pertanyaan_teks: '',
    opsi_a_teks: '',
    opsi_b_teks: '',
    opsi_c_teks: '',
    opsi_d_teks: '',
    opsi_e_teks: '',
    jawaban_benar: 'A',
    pembahasan: ''
  }
  filesToUpload.value = {
    pertanyaan: null, opsi_a: null, opsi_b: null, opsi_c: null, opsi_d: null, opsi_e: null
  }
  previewImages.value = {
    pertanyaan: null, opsi_a: null, opsi_b: null, opsi_c: null, opsi_d: null, opsi_e: null
  }
}

const submitSoal = async () => {
  if (!soalBaru.value.pertanyaan_teks && !filesToUpload.value.pertanyaan) {
    alertMessage.value = 'Pertanyaan tidak boleh kosong (isi teks/rumus atau lampirkan gambar).'
    alertType.value = 'error'
    return
  }

  isSubmitting.value = true
  alertMessage.value = ''

  try {
    // 1. Upload gambar bila ada
    const pertanyaan_gambar = await uploadGambarSoal(filesToUpload.value.pertanyaan)
    const opsi_a_gambar = await uploadGambarSoal(filesToUpload.value.opsi_a)
    const opsi_b_gambar = await uploadGambarSoal(filesToUpload.value.opsi_b)
    const opsi_c_gambar = await uploadGambarSoal(filesToUpload.value.opsi_c)
    const opsi_d_gambar = await uploadGambarSoal(filesToUpload.value.opsi_d)
    const opsi_e_gambar = await uploadGambarSoal(filesToUpload.value.opsi_e)

    // 2. Simpan record
    const payload = {
      tingkat: soalBaru.value.tingkat,
      mata_pelajaran: soalBaru.value.mata_pelajaran,
      paket: soalBaru.value.paket,
      pertanyaan_teks: soalBaru.value.pertanyaan_teks,
      pertanyaan_gambar,
      opsi_a_teks: soalBaru.value.opsi_a_teks,
      opsi_a_gambar,
      opsi_b_teks: soalBaru.value.opsi_b_teks,
      opsi_b_gambar,
      opsi_c_teks: soalBaru.value.opsi_c_teks,
      opsi_c_gambar,
      opsi_d_teks: soalBaru.value.opsi_d_teks,
      opsi_d_gambar,
      opsi_e_teks: soalBaru.value.opsi_e_teks,
      opsi_e_gambar,
      jawaban_benar: soalBaru.value.jawaban_benar,
      pembahasan: soalBaru.value.pembahasan
    }

    const res = await simpanSoalTKA(payload)

    if (res.success) {
      alertType.value = 'success'
      alertMessage.value = res.remoteSuccess 
        ? '✅ Berhasil! Soal baru telah disimpan ke database Supabase Cloud.' 
        : '✅ Soal tersimpan di database lokal & disiapkan untuk sinkronisasi ke cloud!'
      resetForm()
      await loadQuestions()
    }
  } catch (err) {
    alertType.value = 'error'
    alertMessage.value = 'Gagal menyimpan soal: ' + (err.message || err)
  } finally {
    isSubmitting.value = false
  }
}

const loadQuestions = async () => {
  isLoadingList.value = true
  try {
    const res = await getSoalTKA()
    daftarSoal.value = res.data || []
  } catch (e) {
    console.error('Error loading questions:', e)
  } finally {
    isLoadingList.value = false
  }
}

const deleteSoal = async (id) => {
  if (!false) return
  await hapusSoalTKA(id)
  await loadQuestions()
}

const loadSampleQuestions = async () => {
  if (!false) return
  for (const q of DEFAULT_QUESTIONS) {
    await simpanSoalTKA(q)
  }
  await loadQuestions()
  console.log('Contoh soal dimuat')
}

const loadHasil = async () => {
  daftarHasil.value = await getHasilUjian()
}

const filteredSoal = computed(() => {
  return daftarSoal.value.filter(s => {
    if (filterJenjang.value !== 'SEMUA' && s.tingkat !== filterJenjang.value) return false
    if (filterMapel.value !== 'SEMUA' && s.mata_pelajaran !== filterMapel.value) return false
    return true
  })
})

const sqlScript = `-- 1. Buat Tabel Soal TKA
create table if not exists soal_tka (
  id uuid default gen_random_uuid() primary key,
  tingkat text not null, 
  mata_pelajaran text not null, 
  paket text not null, 
  pertanyaan_teks text, 
  pertanyaan_gambar text, 
  opsi_a_teks text,
  opsi_a_gambar text,
  opsi_b_teks text,
  opsi_b_gambar text,
  opsi_c_teks text,
  opsi_c_gambar text,
  opsi_d_teks text,
  opsi_d_gambar text,
  opsi_e_teks text,
  opsi_e_gambar text,
  jawaban_benar text not null,
  pembahasan text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Buat Tabel Hasil Ujian Siswa
create table if not exists hasil_ujian (
  id uuid default gen_random_uuid() primary key,
  nama_siswa text not null,
  nisn text,
  sekolah text not null,
  tingkat text not null,
  mata_pelajaran text not null,
  paket text not null,
  jumlah_soal integer not null,
  jumlah_benar integer not null,
  jumlah_salah integer not null,
  jumlah_kosong integer not null,
  nilai numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Aktifkan Row Level Security (RLS) & Berikan Izin Akses Publik
alter table soal_tka enable row level security;
alter table hasil_ujian enable row level security;

create policy "Allow public read on soal_tka" on soal_tka for select using (true);
create policy "Allow public insert on soal_tka" on soal_tka for insert with check (true);
create policy "Allow public delete on soal_tka" on soal_tka for delete using (true);

create policy "Allow public read on hasil_ujian" on hasil_ujian for select using (true);
create policy "Allow public insert on hasil_ujian" on hasil_ujian for insert with check (true);

-- 4. Izin Storage Bucket gambar_soal
insert into storage.buckets (id, name, public) 
values ('gambar_soal', 'gambar_soal', true)
on conflict (id) do nothing;

create policy "Allow public read on gambar_soal" on storage.objects 
for select using (bucket_id = 'gambar_soal');

create policy "Allow public insert on gambar_soal" on storage.objects 
for insert with check (bucket_id = 'gambar_soal');
`

const copySql = () => {
  navigator.clipboard.writeText(sqlScript)
  isCopied.value = true
  setTimeout(() => { isCopied.value = false }, 2000)
}

onMounted(() => {
  loadQuestions()
  loadHasil()
})
</script>

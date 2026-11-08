<template>
  <div class="h-screen bg-[#f8fafc] flex flex-col overflow-hidden font-sans">
    <!-- Header CBT Resmi Disdikbud Karanganyar (Fixed di Atas) -->
    <CBTHeader class="flex-shrink-0 z-30 shadow-xs" />

    <!-- 1. LOGIN SCREEN PENULIS SOAL -->
    <div v-if="!currentPenulis" class="flex-1 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden my-auto">
        <div class="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white text-center">
          <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
          </div>
          <h2 class="text-xl font-bold tracking-wide">PORTAL PENULIS SOAL TKA</h2>
          <p class="text-xs text-blue-100 mt-1">Aplikasi Penulisan & Bank Soal TKA Karanganyar</p>
        </div>

        <form @submit.prevent="handleLogin" class="p-6 sm:p-8 space-y-4">
          <div v-if="loginError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 font-medium">
            {{ loginError }}
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Username Penulis</label>
            <input 
              v-model="inputUsername" 
              type="text" 
              required 
              placeholder="Masukkan username penulis"
              class="w-full border-gray-300 rounded-lg p-2.5 text-sm font-mono focus:ring-blue-500 focus:border-blue-500 bg-white" 
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Kata Sandi</label>
            <div class="relative">
              <input 
                v-model="inputPassword" 
                :type="showPassword ? 'text' : 'password'" 
                required 
                placeholder="Masukkan kata sandi"
                class="w-full border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500 pr-10 bg-white" 
              />
              <button 
                type="button" 
                @click="showPassword = !showPassword"
                class="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <!-- Ikon Mata Terbuka -->
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                <!-- Ikon Mata Tertutup -->
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>
              </button>
            </div>
          </div>

          <div class="text-[11px] text-gray-500 bg-gray-50 p-3 rounded-lg border">
            * Akun penulis soal dikelola oleh Proktor Dinas (Marshal). Hubungi Marshal jika belum memiliki akun.
          </div>

          <button
            type="submit"
            :disabled="loginCooldown > 0"
            class="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 text-sm mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loginCooldown > 0">Terkunci Sementara ({{ loginCooldown }}s)</span>
            <span v-else>MASUK KE STUDIO PENULIS</span>
          </button>
        </form>
      </div>
    </div>

    <!-- 2. STUDIO PENULIS SOAL (LOGGED IN) - SCROLLABLE CONTENT -->
    <div v-else class="flex-1 overflow-y-auto w-full p-4 sm:p-6">
      <div class="max-w-7xl mx-auto space-y-6">
      
      <!-- Top Info Profile & Paket Selector -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div class="flex items-center gap-2.5">
            <span class="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-100 text-blue-800">
              {{ currentPenulis.jenjang }}
            </span>
            <h2 class="text-base font-bold text-gray-800">
              {{ currentPenulis.nama_guru }} ({{ currentPenulis.mapel }})
            </h2>
          </div>
          <p class="text-xs text-gray-500 mt-0.5">{{ currentPenulis.asal_sekolah || 'Disdikbud Karanganyar' }} • Hak Akses: {{ currentPenulis.jenjang }} - {{ currentPenulis.mapel }}</p>
        </div>

        <div class="flex items-center gap-3">
          <!-- Pilih Paket Dinamis -->
          <div class="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg border border-gray-200">
            <span class="text-xs font-bold text-gray-500 px-2">Paket:</span>
            
            <!-- Jika Belum Ada Paket yang Terdaftar di DB -->
            <button 
              v-if="packageList.length === 0"
              @click="switchPaket(activePaket)" 
              class="px-3 py-1 text-xs font-bold rounded bg-white shadow text-blue-700"
            >
              {{ activePaket }} (Baru)
            </button>

            <!-- Daftar Paket yang Sudah Terdaftar -->
            <button 
              v-for="p in packageList"
              :key="p"
              @click="switchPaket(p)" 
              class="px-3 py-1 text-xs font-bold rounded transition-colors"
              :class="activePaket === p ? 'bg-white shadow text-blue-700' : 'text-gray-600 hover:bg-white/60'"
            >
              {{ p }}
            </button>

            <!-- Tombol Tambah Paket Baru -->
            <button
              type="button"
              @click="openAddPackageModal"
              class="px-2.5 py-1 text-xs font-bold rounded bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center ml-1"
              title="Tambah Paket Baru"
            >
              <span>+ Paket Baru</span>
            </button>
          </div>

          <button 
            @click="logoutPenulis" 
            class="text-xs bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 font-bold px-3 py-1.5 rounded-lg border transition-colors"
          >
            Keluar
          </button>
        </div>
      </div>

      <!-- TAB MENU: 1. STUDIO EDITOR SOAL | 2. BULK IMPORT DOCX -->
      <div class="flex items-center gap-2 border-b border-gray-200">
        <button
          @click="activeTab = 'editor'"
          class="pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2"
          :class="activeTab === 'editor' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          <span>Studio Penulisan Soal ({{ soalList.length }} Butir Terdaftar)</span>
        </button>

        <button
          @click="activeTab = 'upload'"
          class="pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2"
          :class="activeTab === 'upload' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          <span>Import Naskah Word (.docx)</span>
        </button>
      </div>

      <!-- ============================================== -->
      <!-- TAB 1: BULK IMPORT WORD (.DOCX) DENGAN GAMBAR -->
      <!-- ============================================== -->
      <div v-if="activeTab === 'upload'" class="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
        <div class="max-w-2xl mx-auto text-center space-y-3">
          <div class="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
          </div>
          <h3 class="text-lg font-bold text-gray-800">Import Naskah Soal dari File Word (.docx)</h3>
          <p class="text-xs text-gray-500 leading-relaxed">
            Sistem secara otomatis mengekstrak naskah soal, formula rumus, dan gambar diagram dari berkas Word (.docx) ke dalam format CBT simulasi TKA.
          </p>

          <div 
            class="border-2 border-dashed border-blue-200 hover:border-blue-400 bg-blue-50/40 rounded-2xl p-8 cursor-pointer transition-all mt-4"
            @click="$refs.fileInput.click()"
            @dragover.prevent
            @drop.prevent="handleDocxDrop"
          >
            <input 
              ref="fileInput" 
              type="file" 
              accept=".docx" 
              class="hidden" 
              @change="handleDocxSelect"
            />
            <p class="font-bold text-blue-700 text-sm">Klik atau Seret File .docx ke Sini</p>
            <span class="text-xs text-gray-400 mt-1 block">Mendukung naskah naskah soal resmi Disdikbud</span>
          </div>

          <div v-if="uploadStatus" class="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 font-semibold">
            {{ uploadStatus }}
          </div>
        </div>
      </div>

      <!-- ======================================================== -->
      <!-- TAB 2: WEB STUDIO PENULISAN SOAL (SIAP PUSMENDIK STYLE)  -->
      <!-- ======================================================== -->
      <div v-else class="space-y-6">
        
        <!-- Header Aksi & Reset Seluruh Paket -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200">
          <div class="flex items-center gap-2">
            <button 
              @click="initNewQuestion()"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow flex items-center transition-colors"
            >
              <span>+ Tambah Butir Soal Baru</span>
            </button>
            <span class="text-xs text-gray-500 font-medium">Paket Aktif: <strong>{{ activePaket }}</strong> ({{ soalList.length }} Butir Terdaftar)</span>
          </div>

          <!-- Tombol Hapus Seluruh Paket -->
          <button 
            @click="showResetPackageConfirm = true"
            class="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg text-xs border border-red-200 flex items-center gap-1.5 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            <span>Hapus / Kosongkan Seluruh Soal {{ activePaket }}</span>
          </button>
        </div>

        <!-- FORM EDITOR SOAL & LIVE CBT PREVIEW (SPLIT SCREEN) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <!-- SISI KIRI: FORM BUILDER SOAL (7 Kolom) -->
          <div class="lg:col-span-7 bg-white rounded-2xl shadow-sm border border-gray-200 p-5 sm:p-6 space-y-6">
            
            <!-- Header Kartu Editor -->
            <div class="flex items-center justify-between pb-3 border-b">
              <div class="flex items-center gap-2">
                <span class="w-7 h-7 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center">
                  {{ formSoal.nomor_soal }}
                </span>
                <h3 class="text-base font-bold text-gray-800">
                  {{ isEditing ? 'Edit Soal Nomor ' + formSoal.nomor_soal : 'Buat Soal Nomor ' + formSoal.nomor_soal }}
                </h3>
              </div>
              
              <!-- Tombol Hapus Butir Soal Ini -->
              <div class="flex items-center gap-2">
                <button
                  v-if="isEditing"
                  @click="promptDeleteCurrent"
                  type="button"
                  class="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  <span>Hapus Soal Ini</span>
                </button>
                <span class="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded">
                  {{ currentPenulis.jenjang }} - {{ currentPenulis.mapel }}
                </span>
              </div>
            </div>

            <!-- Nomor & Tipe Soal -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Nomor Butir Soal</label>
                <input 
                  v-model.number="formSoal.nomor_soal" 
                  type="number" 
                  min="1" 
                  required 
                  class="w-full border border-gray-300 rounded-lg p-2 text-sm font-bold focus:ring-blue-500 focus:border-blue-500 bg-white" 
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Bentuk / Tipe Soal</label>
                <select v-model="formSoal.tipe_soal" class="w-full border border-gray-300 rounded-lg p-2 text-xs font-semibold focus:ring-blue-500 focus:border-blue-500 bg-white">
                  <option value="1">1. Pilihan Ganda Biasa (1 Kunci)</option>
                  <option value="2">2. Pilihan Ganda Kompleks (MCMA - Centang > 1)</option>
                  <option value="3">3. Tabel Matriks (Benar / Salah)</option>
                  <option value="5">5. Menjodohkan (Pasangan Kiri & Kanan)</option>
                </select>
              </div>
            </div>

            <!-- ============================================== -->
            <!-- BAGIAN 1: STIMULUS / WACANA (OPSIONAL)         -->
            <!-- ============================================== -->
            <div class="border border-gray-200 rounded-xl p-4 bg-gray-50/50 space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-gray-700 uppercase flex items-center gap-1.5">
                  <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                  <span>Bagian 1: Stimulus / Wacana Bacaan (Opsional)</span>
                </span>
                <span class="text-[11px] text-gray-400">Kosongkan jika soal mandiri tanpa bacaan</span>
              </div>

              <!-- Toolbar Format Teks Literasi Stimulus -->
              <div class="flex items-center gap-1.5 flex-wrap bg-white p-2 rounded-lg border border-gray-200">
                <span class="text-[10px] font-bold text-gray-500 mr-1 uppercase">Format:</span>
                <button type="button" @click="applyTextFormat('stimulus_html', 'b')" class="px-2 py-0.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded font-bold text-xs" title="Tebal (Bold)"><strong>B</strong></button>
                <button type="button" @click="applyTextFormat('stimulus_html', 'i')" class="px-2 py-0.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded font-serif italic text-xs" title="Miring (Italic)"><em>I</em></button>
                <button type="button" @click="applyTextFormat('stimulus_html', 'u')" class="px-2 py-0.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded underline text-xs" title="Garis Bawah (Underline)"><u>U</u></button>
                <button type="button" @click="applyTextFormat('stimulus_html', 'quote')" class="px-2 py-0.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded text-xs font-semibold" title="Kutipan Percakapan / Dialog">“ ”</button>
                <button type="button" @click="applyTextFormat('stimulus_html', 'br')" class="px-2 py-0.5 bg-gray-50 hover:bg-gray-100 border border-gray-300 rounded text-xs font-semibold" title="Ganti Baris / Bait Puisi">⏎ Baris Baru</button>
                <button type="button" @click="applyTextFormat('stimulus_html', 'title')" class="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded text-xs font-bold" title="Format Judul Cerita / Wacana">+ Judul Cerita</button>
              </div>

              <!-- Input Teks Stimulus -->
              <div>
                <textarea 
                  ref="stimulusTextareaRef"
                  v-model="formSoal.stimulus_html" 
                  rows="4" 
                  class="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-800 focus:ring-blue-500 focus:border-blue-500 bg-white leading-relaxed" 
                  placeholder="Ketikkan judul bacaan dan paragraf cerita/stimulus di sini..."
                  @focus="activeTargetField = 'stimulus_html'"
                ></textarea>
              </div>

              <!-- Slot Unggah Gambar Stimulus Terpisah (Bebas Base64 di Textarea!) -->
              <div class="pt-1">
                <div v-if="!formSoal.stimulus_image" class="flex items-center gap-2">
                  <label class="cursor-pointer px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1.5 shadow-sm transition-colors">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>+ Unggah Gambar Stimulus / Grafik</span>
                    <input type="file" accept="image/*" class="hidden" @change="e => handleImageUpload(e, 'stimulus')" />
                  </label>
                  <span class="text-[11px] text-gray-400">Format JPG / PNG / WebP</span>
                </div>

                <!-- Pratinjau Gambar Stimulus -->
                <div v-else class="relative inline-block border rounded-lg p-1 bg-white shadow-sm mt-1">
                  <img :src="formSoal.stimulus_image" alt="Pratinjau Stimulus" class="max-h-36 max-w-full rounded" />
                  <button 
                    type="button" 
                    @click="formSoal.stimulus_image = ''" 
                    class="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs font-bold shadow"
                    title="Hapus gambar stimulus"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <!-- ============================================== -->
            <!-- BAGIAN 2: POKOK PERTANYAAN & ALAT BANTU RUMUS  -->
            <!-- ============================================== -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <label class="block text-xs font-bold text-gray-700 uppercase">
                  Bagian 2: Pokok Pertanyaan
                </label>
                <span class="text-[11px] text-blue-600 font-semibold">Tersedia Alat Bantu Rumus Lengkap</span>
              </div>

              <!-- VISUAL FORMULA & FORMAT TOOLBAR (SIAP PUSMENDIK STYLE) -->
              <div class="bg-blue-50/70 p-3 rounded-xl border border-blue-200 space-y-2.5">
                
                <!-- Baris 1: Format Teks Literasi & Pemilihan Target -->
                <div class="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-blue-200/60">
                  <div class="flex items-center gap-1 flex-wrap">
                    <span class="text-[10px] font-bold text-blue-900 mr-1 uppercase">Format Teks:</span>
                    <button type="button" @click="applyTextFormat('pertanyaan_html', 'b')" class="px-2 py-0.5 bg-white hover:bg-blue-100 text-blue-900 border border-blue-300 rounded font-bold text-xs shadow-xs" title="Tebal (Bold)"><strong>B</strong></button>
                    <button type="button" @click="applyTextFormat('pertanyaan_html', 'i')" class="px-2 py-0.5 bg-white hover:bg-blue-100 text-blue-900 border border-blue-300 rounded font-serif italic text-xs shadow-xs" title="Miring (Italic)"><em>I</em></button>
                    <button type="button" @click="applyTextFormat('pertanyaan_html', 'u')" class="px-2 py-0.5 bg-white hover:bg-blue-100 text-blue-900 border border-blue-300 rounded underline text-xs shadow-xs" title="Garis Bawah (Underline)"><u>U</u></button>
                    <button type="button" @click="applyTextFormat('pertanyaan_html', 'quote')" class="px-2 py-0.5 bg-white hover:bg-blue-100 text-blue-900 border border-blue-300 rounded text-xs font-semibold shadow-xs" title="Tanda Petik">“ ”</button>
                    <button type="button" @click="applyTextFormat('pertanyaan_html', 'br')" class="px-2 py-0.5 bg-white hover:bg-blue-100 text-blue-900 border border-blue-300 rounded text-xs font-semibold shadow-xs" title="Ganti Baris">⏎ Ganti Baris</button>
                  </div>

                  <!-- Target Selector -->
                  <div class="flex items-center gap-1.5">
                    <label class="text-[11px] font-bold text-gray-600">Target Rumus:</label>
                    <select v-model="activeTargetField" class="text-xs font-bold border border-blue-300 rounded-md py-0.5 px-2 bg-white text-blue-900">
                      <option value="pertanyaan_html">Pokok Pertanyaan</option>
                      <option value="stimulus_html">Stimulus / Wacana</option>
                      <option value="opt_A">Opsi A</option>
                      <option value="opt_B">Opsi B</option>
                      <option value="opt_C">Opsi C</option>
                      <option value="opt_D">Opsi D</option>
                    </select>
                  </div>
                </div>

                <!-- Baris 2: Pembuat Rumus Matematika Visual (Modal Interaktif) -->
                <div class="flex flex-wrap items-center gap-1.5">
                  <span class="text-[10px] font-bold text-blue-900 mr-1 uppercase">Rumus Visual:</span>
                  <button 
                    type="button" 
                    @click="openFormulaModal('fraction')" 
                    class="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-900 border border-blue-300 rounded font-bold text-xs shadow-xs flex items-center gap-1"
                  >
                    <span class="font-serif">½ / 2½</span>
                    <span>Pecahan</span>
                  </button>
                  <button 
                    type="button" 
                    @click="openFormulaModal('power')" 
                    class="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-900 border border-blue-300 rounded font-bold text-xs shadow-xs flex items-center gap-1"
                  >
                    <span class="font-serif">xⁿ</span>
                    <span>Pangkat</span>
                  </button>
                  <button 
                    type="button" 
                    @click="openFormulaModal('subscript')" 
                    class="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-900 border border-blue-300 rounded font-bold text-xs shadow-xs flex items-center gap-1"
                  >
                    <span class="font-serif">xₙ</span>
                    <span>Indeks (Uₙ)</span>
                  </button>
                  <button 
                    type="button" 
                    @click="openFormulaModal('sqrt')" 
                    class="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-900 border border-blue-300 rounded font-bold text-xs shadow-xs flex items-center gap-1"
                  >
                    <span class="font-serif">√x / ∛x</span>
                    <span>Akar</span>
                  </button>
                  <button 
                    type="button" 
                    @click="openFormulaModal('spldv')" 
                    class="px-2.5 py-1 bg-white hover:bg-blue-100 text-blue-900 border border-blue-300 rounded font-bold text-xs shadow-xs flex items-center gap-1"
                  >
                    <span class="font-mono">{</span>
                    <span>SPLDV</span>
                  </button>
                </div>

                <!-- Baris 3: Simbol Cepat Matematika & Geometri (1-Klik) -->
                <div class="flex flex-wrap items-center gap-1 pt-1.5 border-t border-blue-200/60">
                  <span class="text-[10px] text-blue-700 font-bold mr-1">Simbol 1-Klik:</span>
                  <button 
                    v-for="sym in mathSymbols" 
                    :key="sym.char"
                    type="button"
                    @click="insertSymbol(sym.char)"
                    class="min-w-[28px] h-7 px-1.5 bg-white hover:bg-blue-600 hover:text-white text-gray-800 border border-gray-300 rounded font-bold text-xs flex items-center justify-center transition-colors shadow-xs"
                    :title="sym.label"
                  >
                    {{ sym.char }}
                  </button>
                </div>
              </div>

              <!-- Textarea Pertanyaan Pokok -->
              <div class="relative">
                <textarea 
                  ref="pertanyaanInputRef"
                  v-model="formSoal.pertanyaan_html" 
                  rows="3" 
                  required 
                  class="w-full border border-gray-300 rounded-lg p-2.5 text-xs text-gray-800 focus:ring-blue-500 focus:border-blue-500 bg-white leading-relaxed" 
                  placeholder="Ketikkan kalimat pertanyaan di sini..."
                  @focus="activeTargetField = 'pertanyaan_html'"
                ></textarea>
              </div>

              <!-- Slot Gambar Soal Terpisah (Diagram Geometri / Bangun Ruang) -->
              <div class="pt-1">
                <div v-if="!formSoal.question_image" class="flex items-center gap-2">
                  <label class="cursor-pointer px-3 py-1.5 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-xs font-semibold text-gray-700 flex items-center gap-1.5 shadow-sm transition-colors">
                    <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                    <span>+ Unggah Gambar Soal (Geometri / Grafik)</span>
                    <input type="file" accept="image/*" class="hidden" @change="e => handleImageUpload(e, 'question')" />
                  </label>
                </div>

                <!-- Pratinjau Gambar Soal -->
                <div v-else class="relative inline-block border rounded-lg p-1 bg-white shadow-sm mt-1">
                  <img :src="formSoal.question_image" alt="Pratinjau Gambar Soal" class="max-h-36 max-w-full rounded" />
                  <button 
                    type="button" 
                    @click="formSoal.question_image = ''" 
                    class="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center text-xs font-bold shadow"
                    title="Hapus gambar soal"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <!-- ============================================== -->
            <!-- BAGIAN 3: OPSI JAWABAN & KUNCI SESUAI TIPE     -->
            <!-- ============================================== -->
            <div class="pt-2 border-t space-y-4">
              
              <!-- 1. TIPE 1: PILIHAN GANDA BIASA (1 KUNCI BULAT HIJAU) -->
              <div v-if="formSoal.tipe_soal === '1'" class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-bold text-gray-700 uppercase">Pilihan Jawaban (Klik bulatan hijau pada Kunci Jawaban)</label>
                  <span class="text-xs text-green-700 font-bold">Kunci Terpilih: Opsi {{ formSoal.kunci_tipe_1 }}</span>
                </div>
                
                <div v-for="opt in formSoal.options_pg" :key="opt.id" class="flex flex-col sm:flex-row sm:items-center gap-2 bg-gray-50/70 p-2.5 rounded-lg border border-gray-200">
                  <div class="flex items-center gap-2 flex-1">
                    <span class="w-6 font-bold text-gray-800 text-sm text-center">{{ opt.id }}.</span>
                    <input 
                      v-model="opt.text" 
                      type="text" 
                      class="flex-1 border border-gray-300 rounded-lg p-2 text-xs bg-white font-medium focus:ring-blue-500 focus:border-blue-500" 
                      :placeholder="'Teks jawaban opsi ' + opt.id"
                      @focus="activeTargetField = 'opt_' + opt.id"
                    />
                  </div>

                  <div class="flex items-center gap-1 justify-end pl-8 sm:pl-0">
                    <!-- Tombol Rumus ke Opsi Ini -->
                    <button 
                      type="button" 
                      @click="openFormulaModal('power', 'opt_' + opt.id)" 
                      class="px-2 py-1 bg-white hover:bg-blue-50 text-blue-700 border border-blue-200 rounded text-[11px] font-bold shadow-xs flex items-center gap-0.5"
                      title="Sisipkan Rumus ke Opsi Ini"
                    >
                      <span>f(x) Rumus</span>
                    </button>

                    <!-- Tombol Simbol Cepat ke Opsi Ini -->
                    <button 
                      v-for="s in ['²', '³', '×', '÷', '%']" 
                      :key="s"
                      type="button" 
                      @click="insertSymbolToTarget(s, 'opt_' + opt.id)"
                      class="w-6 h-6 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded font-bold text-[11px] flex items-center justify-center shadow-xs"
                      :title="'Sisipkan ' + s"
                    >
                      {{ s }}
                    </button>

                    <!-- Radio Kunci Jawaban -->
                    <label class="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-green-700 bg-white px-3 py-1 rounded-md border border-green-300 hover:bg-green-50 shadow-sm ml-1.5">
                      <input type="radio" v-model="formSoal.kunci_tipe_1" :value="opt.id" class="text-green-600 focus:ring-green-500 w-4 h-4 cursor-pointer" />
                      <span>Kunci</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- 2. TIPE 2: PILIHAN GANDA KOMPLEKS (MCMA - CENTANG LEBIH DARI SATU) -->
              <div v-else-if="formSoal.tipe_soal === '2'" class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-bold text-gray-700 uppercase">Pilihan Jawaban Kompleks (Centang semua jawaban benar)</label>
                  <span class="text-xs text-purple-700 font-bold">Kunci Terpilih: {{ formSoal.kunci_tipe_2.join(', ') || 'Belum dipilih' }}</span>
                </div>

                <div v-for="opt in formSoal.options_pg" :key="opt.id" class="flex flex-col sm:flex-row sm:items-center gap-2 bg-gray-50/70 p-2.5 rounded-lg border border-gray-200">
                  <div class="flex items-center gap-2 flex-1">
                    <span class="w-6 font-bold text-gray-800 text-sm text-center">{{ opt.id }}.</span>
                    <input 
                      v-model="opt.text" 
                      type="text" 
                      class="flex-1 border border-gray-300 rounded-lg p-2 text-xs bg-white font-medium focus:ring-blue-500 focus:border-blue-500" 
                      :placeholder="'Teks pernyataan opsi ' + opt.id"
                      @focus="activeTargetField = 'opt_' + opt.id"
                    />
                  </div>

                  <div class="flex items-center gap-1 justify-end pl-8 sm:pl-0">
                    <!-- Tombol Rumus ke Opsi Ini -->
                    <button 
                      type="button" 
                      @click="openFormulaModal('power', 'opt_' + opt.id)" 
                      class="px-2 py-1 bg-white hover:bg-purple-50 text-purple-700 border border-purple-200 rounded text-[11px] font-bold shadow-xs flex items-center gap-0.5"
                      title="Sisipkan Rumus ke Opsi Ini"
                    >
                      <span>f(x) Rumus</span>
                    </button>

                    <!-- Tombol Simbol Cepat ke Opsi Ini -->
                    <button 
                      v-for="s in ['²', '³', '×', '÷', '%']" 
                      :key="s"
                      type="button" 
                      @click="insertSymbolToTarget(s, 'opt_' + opt.id)"
                      class="w-6 h-6 bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 rounded font-bold text-[11px] flex items-center justify-center shadow-xs"
                      :title="'Sisipkan ' + s"
                    >
                      {{ s }}
                    </button>

                    <!-- Checkbox Kunci Jawaban -->
                    <label class="flex items-center gap-1.5 cursor-pointer text-xs font-bold text-purple-700 bg-white px-3 py-1 rounded-md border border-purple-300 hover:bg-purple-50 shadow-sm ml-1.5">
                      <input type="checkbox" v-model="formSoal.kunci_tipe_2" :value="opt.id" class="text-purple-600 rounded focus:ring-purple-500 w-4 h-4 cursor-pointer" />
                      <span>Kunci</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- 3. TIPE 3: MATRIKS BENAR / SALAH (TABEL VISUAL) -->
              <div v-else-if="formSoal.tipe_soal === '3'" class="space-y-3">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-bold text-gray-700 uppercase">Baris Pernyataan Matriks</label>
                  <button 
                    type="button" 
                    @click="addTableRow" 
                    class="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold px-2.5 py-1 rounded border border-blue-200"
                  >
                    + Tambah Baris
                  </button>
                </div>

                <div class="overflow-x-auto border border-gray-200 rounded-lg">
                  <table class="min-w-full text-xs">
                    <thead class="bg-gray-100 font-bold text-gray-700">
                      <tr>
                        <th class="p-2 text-left w-10">No</th>
                        <th class="p-2 text-left">Pernyataan</th>
                        <th class="p-2 text-center w-28">Kunci Jawaban</th>
                        <th class="p-2 text-center w-12">Aksi</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 bg-white">
                      <tr v-for="(row, idx) in formSoal.options_table" :key="row.id">
                        <td class="p-2 font-bold text-gray-500 text-center">{{ idx + 1 }}</td>
                        <td class="p-2">
                          <input 
                            v-model="row.pernyataan" 
                            type="text" 
                            class="w-full border border-gray-300 rounded p-1.5 text-xs bg-white" 
                            :placeholder="'Teks pernyataan baris ' + (idx + 1)" 
                          />
                        </td>
                        <td class="p-2 text-center">
                          <select v-model="formSoal.kunci_table[row.id]" class="border border-gray-300 rounded p-1 text-xs font-bold bg-white">
                            <option value="B">Benar</option>
                            <option value="S">Salah</option>
                          </select>
                        </td>
                        <td class="p-2 text-center">
                          <button 
                            v-if="formSoal.options_table.length > 2"
                            type="button" 
                            @click="removeTableRow(idx)" 
                            class="text-red-500 hover:text-red-700 font-bold"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- 4. TIPE 5: MENJODOHKAN (PASANGAN VISUAL DUA KOLOM) -->
              <div v-else-if="formSoal.tipe_soal === '5'" class="space-y-4">
                <div class="flex items-center justify-between">
                  <label class="block text-xs font-bold text-gray-700 uppercase">Pasangan Menjodohkan (Premis Kiri ➜ Pilihan Kanan)</label>
                  <button 
                    type="button" 
                    @click="addMatchingPair" 
                    class="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold px-2.5 py-1 rounded border border-blue-200"
                  >
                    + Tambah Pasangan
                  </button>
                </div>

                <!-- Kartu Dua Kolom -->
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Kolom Kiri -->
                  <div class="bg-blue-50/40 p-3 rounded-xl border border-blue-100 space-y-2">
                    <span class="text-xs font-bold text-blue-900 block">Kolom Kiri (Premis / Pernyataan):</span>
                    <div v-for="l in formSoal.matching_left" :key="l.id" class="flex items-center gap-1.5">
                      <span class="font-bold text-xs text-blue-700 w-6">{{ l.id }}</span>
                      <input v-model="l.text" type="text" class="flex-1 border border-gray-300 rounded p-1.5 text-xs bg-white" :placeholder="'Teks premis ' + l.id" />
                    </div>
                  </div>

                  <!-- Kolom Kanan -->
                  <div class="bg-green-50/40 p-3 rounded-xl border border-green-100 space-y-2">
                    <span class="text-xs font-bold text-green-900 block">Kolom Kanan (Pilihan Pasangan):</span>
                    <div v-for="r in formSoal.matching_right" :key="r.id" class="flex items-center gap-1.5">
                      <span class="font-bold text-xs text-green-700 w-6">{{ r.id }}</span>
                      <input v-model="r.text" type="text" class="flex-1 border border-gray-300 rounded p-1.5 text-xs bg-white" :placeholder="'Teks pilihan ' + r.id" />
                    </div>
                  </div>
                </div>

                <!-- Kunci Hubungan Pasangan -->
                <div class="bg-gray-50 p-3.5 rounded-xl border border-gray-200 space-y-2">
                  <span class="text-xs font-bold text-gray-800 block">Kunci Pasangan yang Benar:</span>
                  <div v-for="l in formSoal.matching_left" :key="l.id" class="flex items-center justify-between text-xs py-1 border-b border-gray-200 last:border-0">
                    <span class="font-medium text-gray-700">{{ l.id }}: {{ l.text || '(Belum diisi)' }}</span>
                    <div class="flex items-center gap-2">
                      <span class="text-gray-400">berpasangan dengan</span>
                      <select v-model="formSoal.kunci_matching[l.id]" class="border border-gray-300 rounded p-1 text-xs font-bold bg-white">
                        <option v-for="r in formSoal.matching_right" :key="r.id" :value="r.id">
                          {{ r.id }}: {{ r.text || '(Pilihan ' + r.id + ')' }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <!-- Tombol Simpan Butir Soal -->
            <div class="pt-4 flex gap-3 border-t">
              <button 
                type="button" 
                @click="saveQuestion"
                class="flex-1 py-3 bg-[#0d6efd] hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow flex items-center justify-center gap-2 transition-colors"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <span>Simpan Butir Soal Ini</span>
              </button>
            </div>

          </div>

          <!-- SISI KANAN: LIVE CBT PREVIEW (5 Kolom) -->
          <div class="lg:col-span-5 space-y-5">
            <div class="flex items-center justify-between px-1">
              <span class="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Live CBT Preview (Tampilan Siswa)</span>
              </span>
            </div>

            <!-- Pratinjau Komponen CBT Siswa Detik Itu Juga -->
            <div class="border-2 border-blue-200 rounded-2xl overflow-hidden shadow-sm">
              <CBTQuestionItem 
                :question="previewQuestionObj"
                v-model="previewDummyAnswer"
              />
            </div>

            <!-- Daftar Butir Soal Terdaftar dalam Paket -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
              <div class="flex items-center justify-between mb-3">
                <h4 class="text-sm font-bold text-gray-800">Daftar Soal {{ activePaket }} ({{ soalList.length }} Butir)</h4>
              </div>

              <div v-if="soalList.length === 0" class="text-center py-8 text-gray-400 text-xs bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                Belum ada butir soal pada {{ activePaket }}. <br/>
                Ketikkan butir soal di formulir sebelah kiri dan klik <strong>Simpan Butir Soal Ini</strong>.
              </div>

              <div v-else class="grid grid-cols-5 gap-2 max-h-72 overflow-y-auto p-1">
                <div 
                  v-for="q in soalList" 
                  :key="q.nomor_soal"
                  class="relative group p-2 border rounded-lg text-center cursor-pointer transition-all hover:border-blue-500"
                  :class="formSoal.nomor_soal === q.nomor_soal && isEditing ? 'border-blue-600 bg-blue-50 font-bold ring-2 ring-blue-400' : 'border-gray-200 bg-white'"
                  @click="loadQuestionIntoForm(q)"
                >
                  <button
                    type="button"
                    @click.stop="confirmDeleteSpecificQuestion(q)"
                    title="Hapus butir soal ini"
                    class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-[10px] shadow opacity-0 group-hover:opacity-100 transition-opacity z-10"
                  >
                    ✕
                  </button>
                  <div class="text-xs font-bold text-gray-800">No. {{ q.nomor_soal }}</div>
                  <div class="text-[10px] text-gray-500">Tipe {{ q.tipe_soal }}</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- MODAL POPUP ALAT BANTU RUMUS MATEMATIKA (INTERAKTIF)     -->
    <!-- ======================================================== -->
    <div v-if="activeFormulaModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
        <!-- Header Modal -->
        <div class="flex items-center justify-between pb-3 border-b">
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-blue-600"></span>
            <h3 class="text-sm font-bold text-gray-800">{{ formulaModalTitle }}</h3>
          </div>
          <button @click="activeFormulaModal = null" class="text-gray-400 hover:text-gray-600 p-1">✕</button>
        </div>

        <!-- Target Selector -->
        <div class="flex items-center justify-between bg-blue-50/50 p-2.5 rounded-lg border border-blue-200 text-xs">
          <span class="font-bold text-gray-700">Target Penyisipan:</span>
          <select v-model="activeTargetField" class="font-bold text-blue-900 border border-blue-300 rounded px-2 py-1 bg-white">
            <option value="pertanyaan_html">Pokok Pertanyaan</option>
            <option value="stimulus_html">Stimulus / Wacana</option>
            <option value="opt_A">Pilihan Opsi A</option>
            <option value="opt_B">Pilihan Opsi B</option>
            <option value="opt_C">Pilihan Opsi C</option>
            <option value="opt_D">Pilihan Opsi D</option>
          </select>
        </div>

        <!-- Formula Type Switcher Tab -->
        <div class="grid grid-cols-5 gap-1 bg-gray-100 p-1 rounded-lg text-xs font-bold text-center">
          <button 
            type="button" 
            @click="openFormulaModal('fraction')" 
            class="py-1.5 rounded transition-all"
            :class="activeFormulaModal === 'fraction' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          >
            ½ Pecahan
          </button>
          <button 
            type="button" 
            @click="openFormulaModal('power')" 
            class="py-1.5 rounded transition-all"
            :class="activeFormulaModal === 'power' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          >
            xⁿ Pangkat
          </button>
          <button 
            type="button" 
            @click="openFormulaModal('subscript')" 
            class="py-1.5 rounded transition-all"
            :class="activeFormulaModal === 'subscript' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          >
            xₙ Indeks
          </button>
          <button 
            type="button" 
            @click="openFormulaModal('sqrt')" 
            class="py-1.5 rounded transition-all"
            :class="activeFormulaModal === 'sqrt' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          >
            √x Akar
          </button>
          <button 
            type="button" 
            @click="openFormulaModal('spldv')" 
            class="py-1.5 rounded transition-all"
            :class="activeFormulaModal === 'spldv' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-600 hover:text-gray-900'"
          >
            { SPLDV
          </button>
        </div>

        <!-- FORM INPUTS BERDASARKAN TIPE -->
        <!-- 1. Pecahan -->
        <div v-if="activeFormulaModal === 'fraction'" class="space-y-3">
          <div class="flex items-center gap-4 text-xs font-bold text-gray-700 pb-1">
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" v-model="formulaInputs.fractionType" value="biasa" class="text-blue-600" />
              <span>Pecahan Biasa (a/b)</span>
            </label>
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="radio" v-model="formulaInputs.fractionType" value="campuran" class="text-blue-600" />
              <span>Pecahan Campuran (a b/c)</span>
            </label>
          </div>

          <div class="grid gap-2.5" :class="formulaInputs.fractionType === 'campuran' ? 'grid-cols-3' : 'grid-cols-2'">
            <div v-if="formulaInputs.fractionType === 'campuran'">
              <label class="block text-[11px] font-bold text-gray-600 mb-1">Bil. Bulat (Depan):</label>
              <input v-model="formulaInputs.whole" type="text" placeholder="Contoh: 2" class="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold bg-white text-center focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-gray-600 mb-1">Pembilang (Atas):</label>
              <input v-model="formulaInputs.numerator" type="text" placeholder="Contoh: 3" class="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold bg-white text-center focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-gray-600 mb-1">Penyebut (Bawah):</label>
              <input v-model="formulaInputs.denominator" type="text" placeholder="Contoh: 4" class="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold bg-white text-center focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <!-- 2. Pangkat -->
        <div v-else-if="activeFormulaModal === 'power'" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-gray-600 mb-1">Bilangan Pokok (Basis):</label>
              <input v-model="formulaInputs.base" type="text" placeholder="Contoh: 7 atau x" class="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold bg-white focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-gray-600 mb-1">Angka Pangkat (Eksponen):</label>
              <input v-model="formulaInputs.exponent" type="text" placeholder="Contoh: -3, 2, 4" class="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold bg-white focus:ring-blue-500" />
            </div>
          </div>
          <div class="flex items-center gap-1.5 text-xs">
            <span class="text-[10px] text-gray-400 font-bold">Pintasan Cepat:</span>
            <button v-for="p in ['2', '3', '-1', '-2', '-3', '-4', '-9']" :key="p" type="button" @click="formulaInputs.exponent = p" class="px-2 py-0.5 bg-gray-100 hover:bg-blue-100 rounded text-[11px] font-bold text-gray-700">{{ p }}</button>
          </div>
        </div>

        <!-- 3. Indeks / Subskrip -->
        <div v-else-if="activeFormulaModal === 'subscript'" class="space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-gray-600 mb-1">Simbol Pokok:</label>
              <input v-model="formulaInputs.base" type="text" placeholder="Contoh: U, S, x" class="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold bg-white focus:ring-blue-500" />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-gray-600 mb-1">Indeks Bawah (Subskrip):</label>
              <input v-model="formulaInputs.subscript" type="text" placeholder="Contoh: n, 1, 20" class="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold bg-white focus:ring-blue-500" />
            </div>
          </div>
          <div class="flex items-center gap-1.5 text-xs">
            <span class="text-[10px] text-gray-400 font-bold">Pintasan Cepat:</span>
            <button v-for="s in ['n', '1', '2', '20', '10']" :key="s" type="button" @click="formulaInputs.subscript = s" class="px-2 py-0.5 bg-gray-100 hover:bg-blue-100 rounded text-[11px] font-bold text-gray-700">{{ s }}</button>
          </div>
        </div>

        <!-- 4. Bentuk Akar -->
        <div v-else-if="activeFormulaModal === 'sqrt'" class="space-y-3">
          <div class="grid grid-cols-3 gap-3">
            <div>
              <label class="block text-[11px] font-bold text-gray-600 mb-1">Derajat Akar:</label>
              <input v-model="formulaInputs.sqrtDegree" type="text" placeholder="Kosong = √" class="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold bg-white text-center focus:ring-blue-500" />
              <span class="text-[9px] text-gray-400 block mt-0.5">Isi 3 untuk ∛</span>
            </div>
            <div class="col-span-2">
              <label class="block text-[11px] font-bold text-gray-600 mb-1">Nilai di Dalam Akar:</label>
              <input v-model="formulaInputs.sqrtValue" type="text" placeholder="Contoh: 75 atau 125" class="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold bg-white focus:ring-blue-500" />
            </div>
          </div>
        </div>

        <!-- 5. SPLDV -->
        <div v-else-if="activeFormulaModal === 'spldv'" class="space-y-3">
          <div>
            <label class="block text-[11px] font-bold text-gray-600 mb-1">Persamaan Baris 1:</label>
            <input v-model="formulaInputs.spldvLine1" type="text" placeholder="Contoh: 2x + y = 13" class="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold bg-white focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-gray-600 mb-1">Persamaan Baris 2:</label>
            <input v-model="formulaInputs.spldvLine2" type="text" placeholder="Contoh: x - 2y = 4" class="w-full border border-gray-300 rounded-lg p-2 text-xs font-bold bg-white focus:ring-blue-500" />
          </div>
        </div>

        <!-- INSTANT LIVE PREVIEW DALAM MODAL -->
        <div class="bg-blue-50/60 p-3 rounded-xl border border-blue-200 text-center space-y-1">
          <span class="text-[10px] font-bold text-blue-700 uppercase tracking-wider block">Pratinjau Rumus yang Akan Disisipkan:</span>
          <div class="min-h-[44px] flex items-center justify-center text-lg text-blue-900" v-html="modalFormulaPreview"></div>
        </div>

        <!-- Tombol Aksi -->
        <div class="flex gap-2 pt-2 border-t">
          <button @click="activeFormulaModal = null" class="w-1/2 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs transition-colors">
            Batal
          </button>
          <button @click="insertBuiltFormula" class="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-colors shadow">
            Sisipkan Rumus Ini
          </button>
        </div>
      </div>
    </div>

    <!-- CUSTOM MODAL: KONFIRMASI HAPUS 1 BUTIR SOAL -->
    <div v-if="showDeleteSingleConfirm" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
        <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
        </div>
        <div>
          <h3 class="text-base font-bold text-gray-800">Hapus Soal Nomor {{ targetQuestionToDelete?.nomor_soal || formSoal.nomor_soal }}?</h3>
          <p class="text-xs text-gray-500 mt-1">
            Butir soal ini akan dihapus secara permanen dari {{ activePaket }} ({{ currentPenulis?.jenjang }} {{ currentPenulis?.mapel }}).
          </p>
        </div>
        <div class="flex gap-2 pt-2">
          <button @click="showDeleteSingleConfirm = false" class="w-1/2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs">
            Batal
          </button>
          <button @click="executeDeleteSingle" class="w-1/2 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs">
            Ya, Hapus
          </button>
        </div>
      </div>
    </div>

    <!-- CUSTOM MODAL: KONFIRMASI HAPUS SELURUH PAKET SOAL -->
    <div v-if="showResetPackageConfirm" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl text-center space-y-4">
        <div class="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
        </div>
        <div>
          <h3 class="text-base font-bold text-gray-800">Hapus Seluruh Soal {{ activePaket }}?</h3>
          <p class="text-xs text-red-600 font-semibold mt-1">
            PERINGATAN: Semua {{ soalList.length }} butir soal pada {{ activePaket }} akan dibersihkan dari database untuk diisi ulang.
          </p>
        </div>
        <div class="flex gap-2 pt-2">
          <button @click="showResetPackageConfirm = false" class="w-1/2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs">
            Batal
          </button>
          <button @click="executeResetPackage" class="w-1/2 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs">
            Ya, Hapus Semua
          </button>
        </div>
      </div>
    </div>

    <!-- CUSTOM MODAL: TAMBAH PAKET SOAL BARU -->
    <div v-if="showAddPackageModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
        <div class="flex items-center justify-between pb-2 border-b">
          <h3 class="text-sm font-bold text-gray-800 flex items-center gap-1.5">
            <span class="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
            <span>Tambah Paket Soal Baru</span>
          </h3>
          <button @click="showAddPackageModal = false" class="text-gray-400 hover:text-gray-600">✕</button>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Nama Paket</label>
          <input 
            v-model="newPackageName" 
            type="text" 
            placeholder="Contoh: Paket 2, Paket Susulan, Paket 3" 
            class="w-full border border-gray-300 rounded-lg p-2.5 text-xs font-bold bg-white focus:ring-blue-500" 
            @keyup.enter="confirmAddPackage"
          />
          <div class="flex items-center gap-1.5 mt-2 flex-wrap">
            <span class="text-[10px] text-gray-400 font-bold">Pilihan Cepat:</span>
            <button 
              v-for="sug in suggestedPackageNames" 
              :key="sug"
              type="button" 
              @click="newPackageName = sug" 
              class="px-2 py-0.5 bg-gray-100 hover:bg-blue-100 rounded text-[11px] font-bold text-gray-700"
            >
              {{ sug }}
            </button>
          </div>
        </div>

        <div class="flex gap-2 pt-2 border-t">
          <button @click="showAddPackageModal = false" class="w-1/2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-xs">
            Batal
          </button>
          <button @click="confirmAddPackage" class="w-1/2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow">
            Buat Paket
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL PERINGATAN IDLE TIMEOUT (COUNTDOWN 60 DETIK) -->
    <div v-if="showIdleWarningModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4">
        <div class="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
          <svg class="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div>
          <h3 class="text-base font-bold text-gray-800">Sesi Penulis Segera Berakhir</h3>
          <p class="text-xs text-gray-500 mt-1">
            Tidak ada aktivitas selama 29 menit. Demi keamanan butir soal simulasi, sesi Anda akan otomatis keluar dalam:
          </p>
          <div class="text-4xl font-black text-amber-600 font-mono my-3">
            {{ idleSecondsLeft }}s
          </div>
        </div>
        <button 
          @click="resumeIdleSession" 
          class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
        >
          Lanjut Menulis (Tetap Login)
        </button>
      </div>
    </div>

    <!-- FOOTER JEMPROT [BID SMP 2026] -->
    <AppFooter />

    <!-- CUSTOM TOAST NOTIFICATION -->
    <div v-if="toastMsg" class="fixed bottom-6 right-6 z-50 bg-gray-900/95 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs font-semibold animate-fade-in">
      <span class="w-2 h-2 rounded-full bg-blue-400"></span>
      <span>{{ toastMsg }}</span>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import CBTHeader from '../components/CBTHeader.vue'
import CBTQuestionItem from '../components/CBTQuestionItem.vue'
import AppFooter from '../components/AppFooter.vue'
import { loginPenulis, getAvailablePackages, getSoalListPenulis, saveSoalPenulis, deleteSoalByNomor, deleteEntirePackage } from '../services/apiService.js'
import {
  createIdleTimer,
  broadcastSessionLogout,
  listenCrossTabLogout,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts
} from '../services/sessionSecurity.js'
import { supabase } from '../supabase.js'
import mammoth from 'mammoth'
import { convertLatexToMarkup } from 'mathlive'

// State Penulis & Login
const currentPenulis = ref(null)
const inputUsername = ref('')
const inputPassword = ref('')
const showPassword = ref(false)
const loginError = ref('')
const toastMsg = ref('')

// Inactivity Auto Logout (30 Menit)
const showIdleWarningModal = ref(false)
const idleSecondsLeft = ref(60)
let idleTracker = null
let stopCrossTabListen = null

// Brute Force Rate Limiting
const loginCooldown = ref(0)
let cooldownTimer = null

// State Tabs & Paket Dinamis
const activeTab = ref('editor')
const activePaket = ref('Paket 1')
const packageList = ref([])
const showAddPackageModal = ref(false)
const newPackageName = ref('')
const soalList = ref([])

const suggestedPackageNames = computed(() => {
  const nextNum = packageList.value.length + 1
  return [`Paket ${nextNum}`, 'Paket Susulan', 'Paket Pengayaan']
})

function openAddPackageModal() {
  const nextNum = packageList.value.length + 1
  newPackageName.value = `Paket ${nextNum}`
  showAddPackageModal.value = true
}

function confirmAddPackage() {
  const name = newPackageName.value.trim()
  if (!name) {
    showToast('Silakan ketikkan nama paket.')
    return
  }
  if (!packageList.value.includes(name)) {
    packageList.value.push(name)
  }
  activePaket.value = name
  showAddPackageModal.value = false
  newPackageName.value = ''
  soalList.value = []
  initNewQuestion()
  showToast(`Paket "${name}" siap ditulis!`)
}

async function refreshPackageList() {
  if (!currentPenulis.value) return
  const pkgs = await getAvailablePackages(currentPenulis.value.jenjang, currentPenulis.value.mapel)
  if (pkgs && pkgs.length > 0) {
    packageList.value = pkgs
    if (!packageList.value.includes(activePaket.value)) {
      activePaket.value = packageList.value[0]
    }
  } else {
    packageList.value = []
    if (!activePaket.value) {
      activePaket.value = 'Paket 1'
    }
  }
}

// Target Field Fokus untuk Penyisipan Rumus / Simbol
const stimulusTextareaRef = ref(null)
const pertanyaanInputRef = ref(null)
const activeTargetField = ref('pertanyaan_html')

// Modals Konfirmasi
const showDeleteSingleConfirm = ref(false)
const showResetPackageConfirm = ref(false)
const targetQuestionToDelete = ref(null)

// Formula Builder Modal
const activeFormulaModal = ref(null) // 'fraction', 'power', 'subscript', 'sqrt', 'spldv'
const formulaInputs = reactive({
  fractionType: 'biasa',
  whole: '',
  numerator: '1',
  denominator: '2',
  base: 'x',
  exponent: '2',
  subscript: 'n',
  sqrtDegree: '',
  sqrtValue: 'x',
  spldvLine1: '2x + y = 13',
  spldvLine2: 'x - 2y = 4'
})

const formulaModalTitle = computed(() => {
  switch (activeFormulaModal.value) {
    case 'fraction': return 'Sisipkan Pecahan (Biasa / Campuran)'
    case 'power': return 'Sisipkan Bilangan Berpangkat / Eksponen'
    case 'subscript': return 'Sisipkan Indeks Bawah / Subskrip'
    case 'sqrt': return 'Sisipkan Bentuk Akar'
    case 'spldv': return 'Sisipkan Sistem Persamaan (SPLDV)'
    default: return 'Alat Bantu Rumus Matematika'
  }
})

// Pratinjau LaTeX Rumus Otomatis
const modalFormulaLatex = computed(() => {
  if (activeFormulaModal.value === 'fraction') {
    const num = formulaInputs.numerator.trim() || '1'
    const den = formulaInputs.denominator.trim() || '2'
    if (formulaInputs.fractionType === 'campuran' && formulaInputs.whole.trim()) {
      return `${formulaInputs.whole.trim()}\\frac{${num}}{${den}}`
    }
    return `\\frac{${num}}{${den}}`
  } else if (activeFormulaModal.value === 'power') {
    const b = formulaInputs.base.trim() || 'x'
    const exp = formulaInputs.exponent.trim() || '2'
    return `${b}^{${exp}}`
  } else if (activeFormulaModal.value === 'subscript') {
    const b = formulaInputs.base.trim() || 'U'
    const s = formulaInputs.subscript.trim() || 'n'
    return `${b}_{${s}}`
  } else if (activeFormulaModal.value === 'sqrt') {
    const v = formulaInputs.sqrtValue.trim() || 'x'
    if (formulaInputs.sqrtDegree.trim()) {
      return `\\sqrt[${formulaInputs.sqrtDegree.trim()}]{${v}}`
    }
    return `\\sqrt{${v}}`
  } else if (activeFormulaModal.value === 'spldv') {
    const l1 = formulaInputs.spldvLine1.trim() || '2x + y = 13'
    const l2 = formulaInputs.spldvLine2.trim() || 'x - 2y = 4'
    return `\\begin{cases} ${l1} \\\\ ${l2} \\end{cases}`
  }
  return ''
})

const modalFormulaPreview = computed(() => {
  if (!modalFormulaLatex.value) return '<span class="text-gray-400 text-xs">Belum ada rumus</span>'
  try {
    return convertLatexToMarkup(modalFormulaLatex.value)
  } catch (e) {
    return `<span class="font-mono text-xs text-gray-500">${modalFormulaLatex.value}</span>`
  }
})

// Simbol-Simbol Cepat Matematika & Geometri (SD & SMP)
const mathSymbols = [
  { char: '²', label: 'Pangkat Dua / Persegi (m²)' },
  { char: '³', label: 'Pangkat Tiga / Kubik (cm³)' },
  { char: '×', label: 'Kali' },
  { char: '÷', label: 'Bagi' },
  { char: '±', label: 'Plus Minus' },
  { char: '≤', label: 'Kurang Dari Sama Dengan' },
  { char: '≥', label: 'Lebih Dari Sama Dengan' },
  { char: '≠', label: 'Tidak Sama Dengan' },
  { char: '≈', label: 'Hampir Sama Dengan / Taksiran' },
  { char: '°', label: 'Derajat' },
  { char: 'π', label: 'Pi' },
  { char: '∠', label: 'Sudut' },
  { char: '△', label: 'Segitiga' },
  { char: '⊥', label: 'Tegak Lurus' },
  { char: '//', label: 'Garis Sejajar' },
  { char: '%', label: 'Persen' }
]

// Editor Form
const isEditing = ref(false)
const formSoal = reactive({
  nomor_soal: 1,
  tipe_soal: '1',
  stimulus_html: '',
  stimulus_image: '',
  pertanyaan_html: '',
  question_image: '',
  options_pg: [
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
    { id: 'D', text: '' }
  ],
  kunci_tipe_1: 'A',
  kunci_tipe_2: ['A'],
  options_table: [
    { id: 'row_1', pernyataan: '' },
    { id: 'row_2', pernyataan: '' },
    { id: 'row_3', pernyataan: '' }
  ],
  kunci_table: {
    row_1: 'B',
    row_2: 'S',
    row_3: 'B'
  },
  matching_left: [
    { id: 'L1', text: '' },
    { id: 'L2', text: '' }
  ],
  matching_right: [
    { id: 'R1', text: '' },
    { id: 'R2', text: '' }
  ],
  kunci_matching: {
    L1: 'R1',
    L2: 'R2'
  }
})

// Live Preview
const previewDummyAnswer = ref(null)
const uploadStatus = ref('')

onMounted(async () => {
  const saved = localStorage.getItem('penulis_session') || sessionStorage.getItem('penulis_session')
  if (saved) {
    try {
      currentPenulis.value = JSON.parse(saved)
      await loadSoalList()
      startIdleTracker()
    } catch (e) {
      localStorage.removeItem('penulis_session')
      sessionStorage.removeItem('penulis_session')
    }
  }

  // Cross-tab logout listener
  stopCrossTabListen = listenCrossTabLogout((msg) => {
    if (msg.type === 'LOGOUT') {
      logoutPenulis()
      showToast('Sesi penulis telah keluar dari tab lain.')
    }
  })

  updateLoginCooldown()
})

onUnmounted(() => {
  stopIdleTracker()
  if (stopCrossTabListen) stopCrossTabListen()
  if (cooldownTimer) clearInterval(cooldownTimer)
})

function startIdleTracker() {
  stopIdleTracker()
  idleTracker = createIdleTimer({
    timeoutMs: 30 * 60 * 1000, // 30 Menit Sesuai Instruksi Mas Bos
    warningMs: 60 * 1000,      // 60 Detik Sebelum Habis
    onWarning: (sec) => {
      idleSecondsLeft.value = sec
      showIdleWarningModal.value = true
    },
    onTimeout: () => {
      showIdleWarningModal.value = false
      logoutPenulis()
      showToast('Sesi penulis telah berakhir otomatis karena tidak ada aktivitas selama 30 menit.')
    },
    onResume: () => {
      showIdleWarningModal.value = false
    }
  })
  idleTracker.start()
}

function resumeIdleSession() {
  if (idleTracker) idleTracker.reset()
  showIdleWarningModal.value = false
}

function stopIdleTracker() {
  if (idleTracker) {
    idleTracker.stop()
    idleTracker = null
  }
  showIdleWarningModal.value = false
}

function updateLoginCooldown() {
  const rl = checkLoginRateLimit('penulis')
  loginCooldown.value = rl.remainingCooldown
  if (loginCooldown.value > 0 && !cooldownTimer) {
    cooldownTimer = setInterval(() => {
      loginCooldown.value--
      if (loginCooldown.value <= 0) {
        clearInterval(cooldownTimer)
        cooldownTimer = null
      }
    }, 1000)
  }
}

function showToast(msg) {
  toastMsg.value = msg
  setTimeout(() => {
    toastMsg.value = ''
  }, 3500)
}

async function handleLogin() {
  loginError.value = ''
  updateLoginCooldown()
  if (loginCooldown.value > 0) {
    loginError.value = `Terlalu banyak percobaan gagal. Silakan tunggu ${loginCooldown.value} detik.`
    return
  }

  if (!inputUsername.value || !inputPassword.value) {
    loginError.value = 'Silakan masukkan username dan kata sandi.'
    return
  }
  const acc = await loginPenulis(inputUsername.value, inputPassword.value)
  if (acc) {
    resetLoginAttempts('penulis')
    acc.password = inputPassword.value
    currentPenulis.value = acc
    sessionStorage.setItem('penulis_session', JSON.stringify(acc))
    await loadSoalList()
    startIdleTracker()
    showToast(`Selamat datang, ${acc.nama_guru}!`)
  } else {
    recordFailedLogin('penulis')
    updateLoginCooldown()
    loginError.value = 'Username atau kata sandi penulis tidak ditemukan.'
  }
}

function logoutPenulis() {
  stopIdleTracker()
  broadcastSessionLogout('penulis')
  currentPenulis.value = null
  sessionStorage.removeItem('penulis_session')
  localStorage.removeItem('penulis_session')
  inputUsername.value = ''
  inputPassword.value = ''
}

async function switchPaket(p) {
  activePaket.value = p
  await loadSoalList()
  initNewQuestion()
}

async function loadSoalList(autoLoadFirst = true) {
  if (!currentPenulis.value) return
  await refreshPackageList()
  soalList.value = await getSoalListPenulis(
    currentPenulis.value.username,
    currentPenulis.value.password || '',
    currentPenulis.value.jenjang,
    currentPenulis.value.mapel,
    activePaket.value
  )
  if (autoLoadFirst) {
    if (soalList.value.length > 0 && !isEditing.value) {
      loadQuestionIntoForm(soalList.value[0])
    } else if (soalList.value.length === 0) {
      initNewQuestion()
    }
  }
}

function initNewQuestion(customNomor = null) {
  isEditing.value = false
  const parsedNomor = Number(customNomor)
  if (
    customNomor !== null && 
    customNomor !== undefined && 
    typeof customNomor !== 'object' && 
    !isNaN(parsedNomor) && 
    parsedNomor > 0
  ) {
    formSoal.nomor_soal = parsedNomor
  } else {
    const highestNomor = (soalList.value || []).reduce((max, q) => Math.max(max, Number(q.nomor_soal) || 0), 0)
    formSoal.nomor_soal = highestNomor + 1
  }
  formSoal.tipe_soal = '1'
  formSoal.stimulus_html = ''
  formSoal.stimulus_image = ''
  formSoal.pertanyaan_html = ''
  formSoal.question_image = ''
  formSoal.options_pg = [
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
    { id: 'D', text: '' }
  ]
  formSoal.kunci_tipe_1 = 'A'
  formSoal.kunci_tipe_2 = ['A']
  formSoal.options_table = [
    { id: 'row_1', pernyataan: '' },
    { id: 'row_2', pernyataan: '' }
  ]
  formSoal.kunci_table = { row_1: 'B', row_2: 'S' }
  formSoal.matching_left = [
    { id: 'L1', text: '' },
    { id: 'L2', text: '' }
  ]
  formSoal.matching_right = [
    { id: 'R1', text: '' },
    { id: 'R2', text: '' }
  ]
  formSoal.kunci_matching = { L1: 'R1', L2: 'R2' }
}

function loadQuestionIntoForm(q) {
  isEditing.value = true
  formSoal.nomor_soal = q.nomor_soal
  formSoal.tipe_soal = q.tipe_soal
  formSoal.stimulus_html = q.stimulus_html || ''
  formSoal.stimulus_image = q.stimulus_image || ''
  formSoal.pertanyaan_html = q.pertanyaan_html || ''
  formSoal.question_image = q.question_image || ''

  if (q.tipe_soal === '1') {
    formSoal.options_pg = q.options_json || []
    formSoal.kunci_tipe_1 = q.kunci_jawaban_json?.jawaban || 'A'
  } else if (q.tipe_soal === '2') {
    formSoal.options_pg = q.options_json || []
    formSoal.kunci_tipe_2 = q.kunci_jawaban_json?.jawaban || ['A']
  } else if (q.tipe_soal === '3') {
    formSoal.options_table = q.options_json || []
    formSoal.kunci_table = q.kunci_jawaban_json?.jawaban || {}
  } else if (q.tipe_soal === '5') {
    formSoal.matching_left = q.options_json?.left || []
    formSoal.matching_right = q.options_json?.right || []
    formSoal.kunci_matching = q.kunci_jawaban_json?.pairs || {}
  }
}

// Upload Gambar Terpisah (FileReader to Base64/DataURL)
function handleImageUpload(e, targetField) {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (event) => {
    if (targetField === 'stimulus') {
      formSoal.stimulus_image = event.target.result
      showToast('Gambar stimulus berhasil diunggah.')
    } else {
      formSoal.question_image = event.target.result
      showToast('Gambar soal berhasil diunggah.')
    }
  }
  reader.readAsDataURL(file)
}

// Format Teks Literasi (Tebal, Miring, Garis Bawah, Kutipan Dialog, Ganti Baris, Judul)
function applyTextFormat(targetFieldName, tag) {
  const el = targetFieldName === 'stimulus_html' ? stimulusTextareaRef.value : pertanyaanInputRef.value
  let currentVal = formSoal[targetFieldName] || ''

  let start = el ? el.selectionStart : currentVal.length
  let end = el ? el.selectionEnd : currentVal.length
  let selectedText = currentVal.substring(start, end)

  let replacement = ''
  if (tag === 'b') {
    replacement = `<strong>${selectedText || 'teks tebal'}</strong>`
  } else if (tag === 'i') {
    replacement = `<em>${selectedText || 'teks miring'}</em>`
  } else if (tag === 'u') {
    replacement = `<u>${selectedText || 'teks garis bawah'}</u>`
  } else if (tag === 'quote') {
    replacement = `“${selectedText || 'teks kutipan dialog'}”`
  } else if (tag === 'br') {
    replacement = `<br/>\n`
  } else if (tag === 'title') {
    replacement = `<p class="font-bold text-center">${selectedText || 'Judul Wacana / Cerita'}</p>\n`
  }

  formSoal[targetFieldName] = currentVal.substring(0, start) + replacement + currentVal.substring(end)

  if (el) {
    setTimeout(() => {
      el.focus()
      el.setSelectionRange(start + replacement.length, start + replacement.length)
    }, 50)
  }
}

// Alat Bantu Rumus Matematika Popover
function openFormulaModal(type, targetField = null) {
  if (targetField) {
    activeTargetField.value = targetField
  }
  activeFormulaModal.value = type
  if (type === 'fraction') {
    formulaInputs.fractionType = 'biasa'
    formulaInputs.whole = ''
    formulaInputs.numerator = '1'
    formulaInputs.denominator = '2'
  } else if (type === 'power') {
    formulaInputs.base = 'x'
    formulaInputs.exponent = '2'
  } else if (type === 'subscript') {
    formulaInputs.base = 'U'
    formulaInputs.subscript = 'n'
  } else if (type === 'sqrt') {
    formulaInputs.sqrtDegree = ''
    formulaInputs.sqrtValue = 'x'
  } else if (type === 'spldv') {
    formulaInputs.spldvLine1 = '2x + y = 13'
    formulaInputs.spldvLine2 = 'x - 2y = 4'
  }
}

function insertToTarget(content) {
  if (activeTargetField.value === 'stimulus_html') {
    formSoal.stimulus_html += ` ${content} `
  } else if (activeTargetField.value && activeTargetField.value.startsWith('opt_')) {
    const optId = activeTargetField.value.replace('opt_', '')
    const opt = formSoal.options_pg.find(o => o.id === optId)
    if (opt) {
      opt.text += opt.text ? ` ${content}` : content
    }
  } else {
    formSoal.pertanyaan_html += ` ${content} `
  }
}

function insertBuiltFormula() {
  const latex = modalFormulaLatex.value
  if (!latex) {
    activeFormulaModal.value = null
    return
  }

  const token = `<span class="math-inline">${latex}</span>`
  insertToTarget(token)
  showToast('Rumus matematika berhasil disisipkan.')
  activeFormulaModal.value = null
}

function insertSymbolToTarget(sym, target) {
  if (target === 'stimulus_html') {
    formSoal.stimulus_html += `${sym}`
  } else if (target && target.startsWith('opt_')) {
    const optId = target.replace('opt_', '')
    const opt = formSoal.options_pg.find(o => o.id === optId)
    if (opt) {
      opt.text += opt.text ? ` ${sym}` : sym
    }
  } else {
    formSoal.pertanyaan_html += `${sym}`
  }
  showToast(`Simbol ${sym} disisipkan.`)
}

function insertSymbol(sym) {
  insertSymbolToTarget(sym, activeTargetField.value)
}

// Helpers Tabel Matriks
function addTableRow() {
  const nextId = 'row_' + (formSoal.options_table.length + 1)
  formSoal.options_table.push({ id: nextId, pernyataan: '' })
  formSoal.kunci_table[nextId] = 'B'
}

function removeTableRow(idx) {
  const row = formSoal.options_table[idx]
  if (row) {
    delete formSoal.kunci_table[row.id]
  }
  formSoal.options_table.splice(idx, 1)
}

// Helpers Menjodohkan
function addMatchingPair() {
  const count = formSoal.matching_left.length + 1
  const lid = 'L' + count
  const rid = 'R' + count
  formSoal.matching_left.push({ id: lid, text: '' })
  formSoal.matching_right.push({ id: rid, text: '' })
  formSoal.kunci_matching[lid] = rid
}

// Simpan Butir Soal ke Supabase
async function saveQuestion() {
  let optionsJson = []
  let kunciJson = {}

  if (formSoal.tipe_soal === '1') {
    optionsJson = formSoal.options_pg
    kunciJson = { jawaban: formSoal.kunci_tipe_1 }
  } else if (formSoal.tipe_soal === '2') {
    optionsJson = formSoal.options_pg
    kunciJson = { jawaban: formSoal.kunci_tipe_2, bobot_per_opsi: 1 / (formSoal.kunci_tipe_2.length || 1) }
  } else if (formSoal.tipe_soal === '3') {
    optionsJson = formSoal.options_table
    kunciJson = { jawaban: formSoal.kunci_table, bobot_per_baris: 1 / (formSoal.options_table.length || 1) }
  } else if (formSoal.tipe_soal === '5') {
    optionsJson = {
      left: formSoal.matching_left,
      right: formSoal.matching_right
    }
    kunciJson = { pairs: formSoal.kunci_matching, bobot_per_pasang: 1 / (formSoal.matching_left.length || 1) }
  }

  const payload = {
    jenjang: currentPenulis.value.jenjang,
    mapel: currentPenulis.value.mapel,
    paket: activePaket.value,
    nomor_soal: formSoal.nomor_soal,
    tipe_soal: formSoal.tipe_soal,
    stimulus_html: formSoal.stimulus_html,
    stimulus_image: formSoal.stimulus_image,
    pertanyaan_html: formSoal.pertanyaan_html,
    question_image: formSoal.question_image,
    options_json: optionsJson,
    kunci_jawaban_json: kunciJson
  }

  try {
    await saveSoalPenulis(
      currentPenulis.value.username,
      currentPenulis.value.password || '',
      payload
    )
    const savedNomor = Number(formSoal.nomor_soal)
    
    // Muat ulang daftar soal tanpa memaksa kembali ke soal pertama
    await loadSoalList(false)

    // Beralih otomatis ke nomor berikutnya sesuai arahan Mas Bos:
    // Soal no 1 tersimpan -> form di-reset bersih ke No 2.
    // Jika No 2 belum disimpan oleh penulis, maka tidak masuk ke database.
    const nextNomor = savedNomor + 1
    const existingNext = soalList.value.find(q => Number(q.nomor_soal) === nextNomor)
    
    if (existingNext) {
      loadQuestionIntoForm(existingNext)
      showToast(`Soal Nomor ${savedNomor} berhasil disimpan! Beralih ke Soal Nomor ${nextNomor}.`)
    } else {
      initNewQuestion(nextNomor)
      showToast(`Soal Nomor ${savedNomor} berhasil disimpan! Form di-reset untuk Soal Nomor ${nextNomor}.`)
    }

    // Scroll konten kembali ke atas agar penulis nyaman mengetik soal berikutnya
    const scrollContainer = document.querySelector('.overflow-y-auto')
    if (scrollContainer) {
      scrollContainer.scrollTo({ top: 0, behavior: 'smooth' })
    }
  } catch (err) {
    showToast('Gagal menyimpan butir soal: ' + (err.message || 'Error'))
  }
}

// 1. HAPUS 1 BUTIR SOAL TERTENTU
function promptDeleteCurrent() {
  targetQuestionToDelete.value = { nomor_soal: formSoal.nomor_soal }
  showDeleteSingleConfirm.value = true
}

function confirmDeleteSpecificQuestion(q) {
  targetQuestionToDelete.value = q
  showDeleteSingleConfirm.value = true
}

async function executeDeleteSingle() {
  const nomor = targetQuestionToDelete.value ? targetQuestionToDelete.value.nomor_soal : formSoal.nomor_soal
  try {
    await deleteSoalByNomor(
      currentPenulis.value.username,
      currentPenulis.value.password || '',
      currentPenulis.value.jenjang,
      currentPenulis.value.mapel,
      activePaket.value,
      nomor
    )
    showDeleteSingleConfirm.value = false
    targetQuestionToDelete.value = null
    showToast(`Soal Nomor ${nomor} berhasil dihapus dari database.`)
    await loadSoalList()
    initNewQuestion()
  } catch (err) {
    showToast('Gagal menghapus soal: ' + (err.message || 'Error'))
  }
}

// 2. HAPUS SELURUH PAKET SOAL
async function executeResetPackage() {
  try {
    await deleteEntirePackage(
      currentPenulis.value.username,
      currentPenulis.value.password || '',
      currentPenulis.value.jenjang,
      currentPenulis.value.mapel,
      activePaket.value
    )
    showResetPackageConfirm.value = false
    showToast(`Seluruh butir soal dalam ${activePaket.value} telah dibersihkan.`)
    await loadSoalList()
    initNewQuestion()
  } catch (err) {
    showToast('Gagal mengosongkan paket: ' + (err.message || 'Error'))
  }
}

// Mammoth Docx Importer
async function handleDocxSelect(e) {
  const file = e.target.files[0]
  if (file) await processDocxFile(file)
}

async function handleDocxDrop(e) {
  const file = e.dataTransfer.files[0]
  if (file) await processDocxFile(file)
}

async function processDocxFile(file) {
  uploadStatus.value = 'Mengekstrak teks, rumus, dan gambar dari dokumen Word...'
  try {
    const arrayBuffer = await file.arrayBuffer()
    const result = await mammoth.convertToHtml({ arrayBuffer })
    uploadStatus.value = `Berhasil mengekstrak naskah soal! Mengonversi ${result.value.length} karakter dokumen.`
    showToast('Naskah Word berhasil diekstrak! Tinjau soal pada menu Studio Penulisan.')
    activeTab.value = 'editor'
  } catch (err) {
    uploadStatus.value = 'Gagal memproses file Word: ' + err.message
  }
}

// Live Preview Computed Object
const previewQuestionObj = computed(() => {
  let opt = []
  if (formSoal.tipe_soal === '1' || formSoal.tipe_soal === '2') {
    opt = formSoal.options_pg
  } else if (formSoal.tipe_soal === '3') {
    opt = formSoal.options_table
  } else if (formSoal.tipe_soal === '5') {
    opt = { left: formSoal.matching_left, right: formSoal.matching_right }
  }

  return {
    nomor_soal: formSoal.nomor_soal,
    tipe_soal: formSoal.tipe_soal,
    stimulus_html: formSoal.stimulus_html,
    stimulus_image: formSoal.stimulus_image,
    pertanyaan_html: formSoal.pertanyaan_html,
    question_image: formSoal.question_image,
    options_json: opt
  }
})
</script>

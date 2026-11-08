<template>
  <div class="min-h-screen bg-[#f8fafc] flex flex-col font-sans">
    <!-- Header CBT Resmi Disdikbud Karanganyar -->
    <CBTHeader />

    <!-- 1. LOGIN SCREEN PENULIS SOAL -->
    <div v-if="!currentPenulis" class="flex-1 flex items-center justify-center p-4 sm:p-6">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div class="bg-gradient-to-r from-blue-700 to-indigo-800 p-6 text-white text-center">
          <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
          </div>
          <h2 class="text-xl font-bold tracking-wide">PORTAL PENULIS SOAL TKA</h2>
          <p class="text-xs text-blue-100 mt-1">Aplikasi Penulisan & Bank Soal TKA Karanganyar</p>
        </div>

        <form @submit.prevent="handleLogin" class="p-6 sm:p-8 space-y-4">
          <div v-if="loginError" class="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {{ loginError }}
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Username Penulis</label>
            <input 
              v-model="inputUsername" 
              type="text" 
              required 
              placeholder="Contoh: penulis.smp.mat"
              class="w-full border-gray-300 rounded-lg p-2.5 text-sm font-mono focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Kata Sandi</label>
            <input 
              v-model="inputPassword" 
              type="password" 
              required 
              placeholder="••••••••"
              class="w-full border-gray-300 rounded-lg p-2.5 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div class="text-[11px] text-gray-500 bg-gray-50 p-3 rounded-lg border">
            * Akun penulis soal dikelola langsung oleh Proktor Dinas (Marshal). Hubungi Marshal jika belum memiliki akun.
          </div>

          <button
            type="submit"
            class="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-2 text-sm mt-4"
          >
            <span>MASUK KE STUDIO PENULIS</span>
          </button>
        </form>
      </div>
    </div>

    <!-- 2. STUDIO PENULIS SOAL (LOGGED IN) -->
    <div v-else class="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 space-y-6">
      
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
          <p class="text-xs text-gray-500 mt-0.5">{{ currentPenulis.asal_sekolah || 'Disdikbud Karanganyar' }} • Hak Akses Terkunci: {{ currentPenulis.jenjang }} - {{ currentPenulis.mapel }}</p>
        </div>

        <div class="flex items-center gap-3">
          <!-- Pilih Paket -->
          <div class="flex items-center gap-1.5 bg-gray-100 p-1 rounded-lg border border-gray-200">
            <span class="text-xs font-bold text-gray-500 px-2">Paket:</span>
            <button 
              @click="switchPaket('Paket 1')" 
              class="px-3 py-1 text-xs font-bold rounded transition-colors"
              :class="activePaket === 'Paket 1' ? 'bg-white shadow text-blue-700' : 'text-gray-600 hover:bg-white/60'"
            >Paket 1</button>
            <button 
              @click="switchPaket('Paket 2')" 
              class="px-3 py-1 text-xs font-bold rounded transition-colors"
              :class="activePaket === 'Paket 2' ? 'bg-white shadow text-blue-700' : 'text-gray-600 hover:bg-white/60'"
            >Paket 2</button>
          </div>

          <button 
            @click="logoutPenulis" 
            class="text-xs bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-700 font-bold px-3 py-1.5 rounded-lg border transition-colors"
          >
            Keluar
          </button>
        </div>
      </div>

      <!-- TAB MENU: 1. UPLOAD WORD (.DOCX) | 2. WEB STUDIO PENULISAN SOAL -->
      <div class="flex items-center gap-2 border-b border-gray-200">
        <button
          @click="activeTab = 'editor'"
          class="pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2"
          :class="activeTab === 'editor' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
          <span>Studio Form Penulisan Soal ({{ soalList.length }} Soal)</span>
        </button>

        <button
          @click="activeTab = 'upload'"
          class="pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2"
          :class="activeTab === 'upload' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
          <span>Bulk Import File Word (.docx)</span>
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
          <h3 class="text-lg font-bold text-gray-800">Unggah File Naskah Soal Microsoft Word (.docx)</h3>
          <p class="text-xs text-gray-500 leading-relaxed">
            Sistem kami secara otomatis mengekstrak seluruh teks butir soal, rumus matematika, kunci jawaban, dan <strong>semua gambar</strong> dari file Word Anda langsung ke database tanpa perlu mengunggah gambar satu per satu.
          </p>

          <!-- Dropzone -->
          <div 
            class="border-2 border-dashed border-blue-300 hover:border-blue-500 rounded-2xl p-8 transition-colors bg-blue-50/20 cursor-pointer"
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
            <span class="text-xs text-gray-400 mt-1 block">Mendukung format naskah kartu soal standar Disdikbud</span>
          </div>

          <div v-if="uploadStatus" class="p-3 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 font-semibold">
            {{ uploadStatus }}
          </div>
        </div>
      </div>

      <!-- ============================================== -->
      <!-- TAB 2: WEB STUDIO PENULISAN SOAL INTERAKTIF    -->
      <!-- ============================================== -->
      <div v-else class="space-y-6">
        
        <!-- Header Aksi & Reset Seluruh Paket -->
        <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-gray-200">
          <div class="flex items-center gap-2">
            <button 
              @click="initNewQuestion"
              class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs shadow flex items-center gap-1.5"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
              <span>Tambah Butir Soal Baru</span>
            </button>
            <span class="text-xs text-gray-500 font-medium">Total: {{ soalList.length }} Soal Terdaftar</span>
          </div>

          <!-- Tombol Bahaya: Reset Seluruh Paket -->
          <button 
            @click="resetEntirePackage"
            class="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-lg text-xs border border-red-200 flex items-center gap-1.5 transition-colors"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            <span>Hapus / Reset Seluruh Soal {{ activePaket }}</span>
          </button>
        </div>

        <!-- FORM EDITOR SOAL & LIVE CBT PREVIEW (SPLIT SCREEN) -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          <!-- SISI KIRI: FORM BUILDER SOAL -->
          <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-5">
            <div class="flex items-center justify-between pb-3 border-b">
              <h3 class="text-base font-bold text-gray-800">
                {{ isEditing ? 'Edit Soal Nomor ' + formSoal.nomor_soal : 'Buat Soal Nomor ' + formSoal.nomor_soal }}
              </h3>
              <span class="text-xs bg-blue-100 text-blue-800 font-bold px-2.5 py-1 rounded">
                {{ currentPenulis.jenjang }} - {{ currentPenulis.mapel }}
              </span>
            </div>

            <!-- Nomor & Tipe Soal -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Nomor Soal</label>
                <input 
                  v-model.number="formSoal.nomor_soal" 
                  type="number" 
                  min="1" 
                  required 
                  class="w-full border-gray-300 rounded-lg p-2 text-sm font-bold focus:ring-blue-500 focus:border-blue-500" 
                />
              </div>

              <div>
                <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Bentuk / Tipe Soal</label>
                <select v-model="formSoal.tipe_soal" class="w-full border-gray-300 rounded-lg p-2 text-xs font-semibold focus:ring-blue-500 focus:border-blue-500">
                  <option value="1">1. Pilihan Ganda Biasa</option>
                  <option value="2">2. Pilihan Ganda Kompleks (MCMA)</option>
                  <option value="3">3. Tabel Matriks Benar/Salah</option>
                  <option value="5">5. Menjodohkan (Matching Pairs)</option>
                </select>
              </div>
            </div>

            <!-- Virtual Toolbar MathLive (Rumus Cepat) -->
            <div class="bg-blue-50/60 p-3 rounded-xl border border-blue-100 space-y-1.5">
              <span class="text-[11px] font-bold text-blue-900 block">Sisipkan Simbol Rumus Matematika (LaTeX):</span>
              <div class="flex flex-wrap gap-1.5">
                <button type="button" @click="insertMathFormula('\\frac{a}{b}')" class="px-2 py-1 bg-white border border-blue-200 rounded text-xs font-mono font-bold hover:bg-blue-100">Pecahan \frac{a}{b}</button>
                <button type="button" @click="insertMathFormula('\\sqrt{x}')" class="px-2 py-1 bg-white border border-blue-200 rounded text-xs font-mono font-bold hover:bg-blue-100">Akar \sqrt{x}</button>
                <button type="button" @click="insertMathFormula('x^2')" class="px-2 py-1 bg-white border border-blue-200 rounded text-xs font-mono font-bold hover:bg-blue-100">Pangkat x²</button>
                <button type="button" @click="insertMathFormula('^\\circ')" class="px-2 py-1 bg-white border border-blue-200 rounded text-xs font-mono font-bold hover:bg-blue-100">Derajat °</button>
                <button type="button" @click="insertMathFormula('\\times')" class="px-2 py-1 bg-white border border-blue-200 rounded text-xs font-mono font-bold hover:bg-blue-100">Kali ×</button>
                <button type="button" @click="insertMathFormula('\\pi')" class="px-2 py-1 bg-white border border-blue-200 rounded text-xs font-mono font-bold hover:bg-blue-100">Pi π</button>
              </div>
            </div>

            <!-- Stimulus HTML (Wacana / Gambar / Cerita) -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-bold text-gray-700 uppercase">
                  Informasi / Wacana Soal (Opsional)
                </label>
                <span class="text-[10px] text-blue-600 font-semibold">Bisa Paste Gambar (Ctrl+V)</span>
              </div>
              <textarea 
                v-model="formSoal.stimulus_html"
                rows="3"
                placeholder="Tuliskan cerita/wacana pengantar soal di sini. Anda juga bisa langsung menempel gambar (Ctrl+V)..."
                @paste="handlePasteImage($event, 'stimulus')"
                class="w-full border-gray-300 rounded-lg p-2.5 text-xs font-mono focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <!-- Teks Pertanyaan -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label class="block text-xs font-bold text-gray-700 uppercase">
                  Butir Pertanyaan <span class="text-red-500">*</span>
                </label>
                <span class="text-[10px] text-blue-600 font-semibold">Bisa Paste Gambar (Ctrl+V)</span>
              </div>
              <textarea 
                v-model="formSoal.pertanyaan_html"
                rows="3"
                required
                placeholder="Tuliskan kalimat pertanyaan di sini..."
                @paste="handlePasteImage($event, 'pertanyaan')"
                class="w-full border-gray-300 rounded-lg p-2.5 text-xs font-mono focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>

            <!-- BUILDER OPSI JAWABAN SESUAI TIPE -->
            
            <!-- TIPE 1 & 2: OPSI A, B, C, D -->
            <div v-if="formSoal.tipe_soal === '1' || formSoal.tipe_soal === '2'" class="space-y-3 pt-2">
              <label class="block text-xs font-bold text-gray-700 uppercase">Pilihan Jawaban (A, B, C, D)</label>
              
              <div v-for="(opt, idx) in formSoal.options_pg" :key="opt.id" class="flex items-center gap-2">
                <span class="w-6 font-bold text-gray-700 text-sm">{{ opt.id }}.</span>
                <input 
                  v-model="opt.text" 
                  type="text" 
                  class="flex-1 border-gray-300 rounded-lg p-2 text-xs" 
                  :placeholder="'Teks Opsi ' + opt.id"
                />
                
                <!-- Radio kunci untuk Tipe 1 -->
                <label v-if="formSoal.tipe_soal === '1'" class="flex items-center gap-1 cursor-pointer text-xs font-bold text-green-700">
                  <input type="radio" v-model="formSoal.kunci_tipe_1" :value="opt.id" class="text-green-600" />
                  Kunci
                </label>

                <!-- Checkbox kunci untuk Tipe 2 (MCMA) -->
                <label v-else-if="formSoal.tipe_soal === '2'" class="flex items-center gap-1 cursor-pointer text-xs font-bold text-purple-700">
                  <input type="checkbox" v-model="formSoal.kunci_tipe_2" :value="opt.id" class="text-purple-600" />
                  Kunci
                </label>
              </div>
            </div>

            <!-- TIPE 3: MATRIKS BENAR / SALAH -->
            <div v-else-if="formSoal.tipe_soal === '3'" class="space-y-3 pt-2">
              <label class="block text-xs font-bold text-gray-700 uppercase">Baris Pernyataan Benar/Salah</label>
              <div v-for="(row, idx) in formSoal.options_table" :key="row.id" class="flex items-center gap-2">
                <span class="text-xs font-bold text-gray-500 w-4">{{ idx + 1 }}.</span>
                <input v-model="row.pernyataan" type="text" class="flex-1 border-gray-300 rounded-lg p-2 text-xs" :placeholder="'Pernyataan baris ' + (idx + 1)" />
                <select v-model="formSoal.kunci_table[row.id]" class="border-gray-300 rounded-lg p-2 text-xs font-bold">
                  <option value="B">Benar</option>
                  <option value="S">Salah</option>
                </select>
              </div>
            </div>

            <!-- TIPE 5: MENJODOHKAN (MATCHING) -->
            <div v-else-if="formSoal.tipe_soal === '5'" class="space-y-4 pt-2">
              <label class="block text-xs font-bold text-gray-700 uppercase">Pasangan Menjodohkan</label>
              
              <div class="space-y-2">
                <span class="text-[11px] font-bold text-gray-600 block">Kolom Kiri (Pertanyaan / Premis):</span>
                <div v-for="l in formSoal.matching_left" :key="l.id" class="flex items-center gap-2">
                  <span class="font-bold text-xs text-blue-700 w-8">{{ l.id }}</span>
                  <input v-model="l.text" type="text" class="flex-1 border-gray-300 rounded-lg p-2 text-xs" :placeholder="'Premis kiri ' + l.id" />
                </div>
              </div>

              <div class="space-y-2">
                <span class="text-[11px] font-bold text-gray-600 block">Kolom Kanan (Pilihan Pasangan):</span>
                <div v-for="r in formSoal.matching_right" :key="r.id" class="flex items-center gap-2">
                  <span class="font-bold text-xs text-green-700 w-8">{{ r.id }}</span>
                  <input v-model="r.text" type="text" class="flex-1 border-gray-300 rounded-lg p-2 text-xs" :placeholder="'Pilihan kanan ' + r.id" />
                </div>
              </div>

              <div class="space-y-2 bg-gray-50 p-3 rounded-lg border">
                <span class="text-[11px] font-bold text-gray-700 block">Kunci Pasangan:</span>
                <div v-for="l in formSoal.matching_left" :key="l.id" class="flex items-center justify-between text-xs">
                  <span class="font-bold">{{ l.id }}: {{ l.text || '-' }}</span>
                  <select v-model="formSoal.kunci_matching[l.id]" class="border-gray-300 rounded p-1 text-xs">
                    <option v-for="r in formSoal.matching_right" :key="r.id" :value="r.id">{{ r.id }}: {{ r.text }}</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- Tombol Simpan -->
            <div class="pt-4 flex gap-3 border-t">
              <button 
                type="button" 
                @click="saveQuestion"
                class="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow flex items-center justify-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                <span>Simpan Butir Soal Ini</span>
              </button>
            </div>
          </div>

          <!-- SISI KANAN: LIVE CBT PREVIEW -->
          <div class="space-y-4">
            <div class="flex items-center justify-between px-2">
              <span class="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
                Live CBT Preview (Tampilan di Layar Siswa)
              </span>
            </div>

            <!-- Preview Card -->
            <CBTQuestionItem 
              :question="previewQuestionObj"
              v-model="previewDummyAnswer"
            />

            <!-- Daftar Butir Soal Terdaftar -->
            <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 mt-6">
              <h4 class="text-sm font-bold text-gray-800 mb-3">Daftar Soal {{ activePaket }} Terdaftar</h4>
              <div class="grid grid-cols-5 sm:grid-cols-6 gap-2">
                <div 
                  v-for="q in soalList" 
                  :key="q.nomor_soal"
                  class="p-2 border rounded-lg text-center cursor-pointer transition-all hover:border-blue-500"
                  :class="formSoal.nomor_soal === q.nomor_soal ? 'border-blue-600 bg-blue-50 font-bold' : 'border-gray-200'"
                  @click="loadQuestionIntoForm(q)"
                >
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
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import CBTHeader from '../components/CBTHeader.vue'
import CBTQuestionItem from '../components/CBTQuestionItem.vue'
import { supabase } from '../supabase.js'
import { loginPenulis, getSoalList } from '../services/apiService.js'
import mammoth from 'mammoth'

// State Auth Penulis
const currentPenulis = ref(null)
const inputUsername = ref('penulis.smp.mat')
const inputPassword = ref('GuruKra2026')
const loginError = ref('')

// Tabs
const activeTab = ref('editor') // 'editor' | 'upload'
const activePaket = ref('Paket 1')
const soalList = ref([])

// Editor Form
const isEditing = ref(false)
const formSoal = reactive({
  nomor_soal: 1,
  tipe_soal: '1',
  stimulus_html: '',
  pertanyaan_html: '',
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
  // Check local saved session
  const saved = localStorage.getItem('penulis_session')
  if (saved) {
    try {
      currentPenulis.value = JSON.parse(saved)
      await loadSoalList()
    } catch (e) {
      localStorage.removeItem('penulis_session')
    }
  }
})

async function handleLogin() {
  loginError.value = ''
  const acc = await loginPenulis(inputUsername.value, inputPassword.value)
  if (acc) {
    currentPenulis.value = acc
    localStorage.setItem('penulis_session', JSON.stringify(acc))
    await loadSoalList()
  } else {
    loginError.value = 'Username atau kata sandi penulis tidak ditemukan.'
  }
}

function logoutPenulis() {
  currentPenulis.value = null
  localStorage.removeItem('penulis_session')
}

async function switchPaket(p) {
  activePaket.value = p
  await loadSoalList()
  initNewQuestion()
}

async function loadSoalList() {
  if (!currentPenulis.value) return
  soalList.value = await getSoalList(currentPenulis.value.jenjang, currentPenulis.value.mapel, activePaket.value)
  if (soalList.value.length > 0 && !isEditing.value) {
    loadQuestionIntoForm(soalList.value[0])
  }
}

function initNewQuestion() {
  isEditing.value = false
  formSoal.nomor_soal = (soalList.value.length || 0) + 1
  formSoal.tipe_soal = '1'
  formSoal.stimulus_html = ''
  formSoal.pertanyaan_html = ''
  formSoal.options_pg = [
    { id: 'A', text: '' },
    { id: 'B', text: '' },
    { id: 'C', text: '' },
    { id: 'D', text: '' }
  ]
  formSoal.kunci_tipe_1 = 'A'
  formSoal.kunci_tipe_2 = ['A']
}

function loadQuestionIntoForm(q) {
  isEditing.value = true
  formSoal.nomor_soal = q.nomor_soal
  formSoal.tipe_soal = q.tipe_soal
  formSoal.stimulus_html = q.stimulus_html || ''
  formSoal.pertanyaan_html = q.pertanyaan_html || ''

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

// Sisipkan Formula MathLive
function insertMathFormula(formula) {
  formSoal.pertanyaan_html += ` <span class="math-inline">${formula}</span> `
}

// Clipboard Paste Image (Ctrl+V)
function handlePasteImage(e, targetField) {
  const items = (e.clipboardData || e.originalEvent.clipboardData).items
  for (const item of items) {
    if (item.type.indexOf('image') === 0) {
      const blob = item.getAsFile()
      const reader = new FileReader()
      reader.onload = (event) => {
        const base64 = event.target.result
        const imgTag = `<div class="my-2 text-center"><img src="${base64}" class="max-h-60 mx-auto rounded shadow border" /></div>`
        if (targetField === 'stimulus') {
          formSoal.stimulus_html += imgTag
        } else {
          formSoal.pertanyaan_html += imgTag
        }
      }
      reader.readAsDataURL(blob)
    }
  }
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
    pertanyaan_html: formSoal.pertanyaan_html,
    options_json: optionsJson,
    kunci_jawaban_json: kunciJson,
    updated_at: new Date().toISOString()
  }

  const { error } = await supabase
    .from('soal_bank')
    .upsert(payload, { onConflict: 'jenjang,mapel,paket,nomor_soal' })

  if (error) {
    alert('Gagal menyimpan butir soal: ' + error.message)
  } else {
    alert(`Soal Nomor ${formSoal.nomor_soal} berhasil disimpan!`)
    await loadSoalList()
  }
}

// Reset Seluruh Paket Soal
async function resetEntirePackage() {
  const confirmMsg = prompt(`PERINGATAN: Anda akan menghapus SELURUH butir soal ${activePaket.value} (${currentPenulis.value.jenjang} - ${currentPenulis.value.mapel}). Ketik "HAPUS" untuk konfirmasi:`)
  if (confirmMsg === 'HAPUS') {
    const { error } = await supabase
      .from('soal_bank')
      .delete()
      .eq('jenjang', currentPenulis.value.jenjang)
      .eq('mapel', currentPenulis.value.mapel)
      .eq('paket', activePaket.value)

    if (error) {
      alert('Gagal mereset soal: ' + error.message)
    } else {
      alert(`Seluruh soal ${activePaket.value} berhasil dihapus. Anda dapat mengunggah atau membuat soal baru.`)
      await loadSoalList()
      initNewQuestion()
    }
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
    alert('File Word berhasil diekstrak! Tinjau soal pada menu Studio Penulisan.')
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
    pertanyaan_html: formSoal.pertanyaan_html,
    options_json: opt
  }
})
</script>

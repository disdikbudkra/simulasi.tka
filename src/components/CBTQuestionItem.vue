<template>
  <div 
    class="cbt-question-container bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-gray-800"
    :style="cbtFontStyles"
  >
    <!-- Body Soal -->
    <div class="p-5 sm:p-7">
      
      <!-- Layout 2 Kolom dengan Dotted Divider jika ada Stimulus/Wacana -->
      <div v-if="question.stimulus_html || question.stimulus_image" class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        <!-- KOLOM KIRI: STIMULUS / WACANA POLOS DENGAN GAMBAR BESAR & SCROLL MANDIRI -->
        <div class="stimulus-column overflow-y-auto max-h-[680px] pr-4 lg:border-r lg:border-dotted lg:border-gray-300 text-justify leading-relaxed">
          <div v-if="question.stimulus_image" class="my-3 text-center">
            <img :src="question.stimulus_image" alt="Gambar Stimulus" class="max-w-full mx-auto rounded shadow-sm border" />
          </div>
          <div v-if="question.stimulus_html" class="content-body" v-html="formattedStimulus"></div>
        </div>

        <!-- KOLOM KANAN: PERTANYAAN & OPSI JAWABAN POLOS PUSMENDIK -->
        <div class="question-column space-y-4 pl-0 lg:pl-2">
          <!-- Butir Pertanyaan -->
          <div class="pertanyaan-text font-normal text-gray-900 leading-relaxed" v-html="formattedPertanyaan"></div>

          <!-- Gambar Soal Terpisah (jika ada) -->
          <div v-if="question.question_image" class="my-3 text-center">
            <img :src="question.question_image" alt="Gambar Soal" class="max-w-full max-h-72 mx-auto rounded shadow-sm border" />
          </div>

          <!-- Teks Panduan Biru Tebal Sesuai Standar Pusmendik -->
          <div v-if="instructionText" class="instruction-text text-blue-700 font-bold tracking-tight leading-snug">
            {{ instructionText }}
          </div>

          <!-- 1. TIPE 1: PILIHAN GANDA BIASA (LINGKARAN POLOS PUSMENDIK) -->
          <div v-if="question.tipe_soal === '1'" class="space-y-3 pt-1 options-container">
            <label 
              v-for="opt in question.options_json" 
              :key="opt.id"
              class="flex items-start gap-3.5 cursor-pointer py-1 transition-colors hover:text-blue-700 group"
            >
              <div class="mt-0.5">
                <input 
                  type="radio" 
                  :name="'soal_' + question.nomor_soal" 
                  :value="opt.id"
                  :checked="modelValue === opt.id"
                  @change="$emit('update:modelValue', opt.id)"
                  class="w-5 h-5 text-blue-600 border-gray-400 focus:ring-blue-500 cursor-pointer"
                />
              </div>
              <div class="flex-1 flex items-start gap-1.5 leading-relaxed text-gray-800 group-hover:text-blue-900">
                <div class="flex-1 option-text" v-html="formatHtml(opt.text)"></div>
              </div>
            </label>
          </div>

          <!-- 2. TIPE 2: PILIHAN GANDA KOMPLEKS (MCMA - KOTAK CENTANG POLOS PUSMENDIK) -->
          <div v-else-if="question.tipe_soal === '2'" class="space-y-3 pt-1 options-container">
            <label 
              v-for="opt in question.options_json" 
              :key="opt.id"
              class="flex items-start gap-3.5 cursor-pointer py-1 transition-colors hover:text-blue-700 group"
            >
              <div class="mt-0.5">
                <input 
                  type="checkbox" 
                  :value="opt.id" 
                  :checked="isMcmaChecked(opt.id)"
                  @change="toggleMcma(opt.id)"
                  class="w-5 h-5 text-blue-600 rounded border-gray-400 focus:ring-blue-500 cursor-pointer"
                />
              </div>
              <div class="flex-1 flex items-start gap-1.5 leading-relaxed text-gray-800 group-hover:text-blue-900">
                <div class="flex-1 option-text" v-html="formatHtml(opt.text)"></div>
              </div>
            </label>
          </div>

          <!-- 3. TIPE 3: MATRIKS TABEL BENAR / SALAH (TABEL TIPIS BERSIH PUSMENDIK) -->
          <div v-else-if="question.tipe_soal === '3'" class="overflow-x-auto pt-2">
            <table class="min-w-full border-collapse border border-gray-300 cbt-table">
              <thead class="bg-gray-50/80 text-gray-800 font-medium">
                <tr>
                  <th class="py-2 px-3 text-left border border-gray-300 font-bold">Pernyataan</th>
                  <th class="py-2 px-3 text-center border border-gray-300 w-24 font-bold">Benar</th>
                  <th class="py-2 px-3 text-center border border-gray-300 w-24 font-bold">Salah</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-300 bg-white">
                <tr v-for="row in question.options_json" :key="row.id" class="hover:bg-gray-50/70">
                  <td class="py-2.5 px-3 text-gray-800 border border-gray-300">
                    <div class="table-cell-text" v-html="formatHtml(row.pernyataan)"></div>
                  </td>
                  <td class="py-2.5 px-3 text-center border border-gray-300">
                    <input 
                      type="radio" 
                      :name="'row_' + question.nomor_soal + '_' + row.id" 
                      value="B"
                      :checked="getTableVal(row.id) === 'B'"
                      @change="setTableVal(row.id, 'B')"
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-400 cursor-pointer"
                    />
                  </td>
                  <td class="py-2.5 px-3 text-center border border-gray-300">
                    <input 
                      type="radio" 
                      :name="'row_' + question.nomor_soal + '_' + row.id" 
                      value="S"
                      :checked="getTableVal(row.id) === 'S'"
                      @change="setTableVal(row.id, 'S')"
                      class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-400 cursor-pointer"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 4. TIPE 5: MENJODOHKAN (MATCHING PAIRS) -->
          <div v-else-if="question.tipe_soal === '5'" class="space-y-4 pt-1">
            <div class="space-y-3">
              <div 
                v-for="item in question.options_json?.left || []" 
                :key="item.id"
                class="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 gap-3"
              >
                <div class="font-medium text-gray-800 flex-1 option-text" v-html="formatHtml(item.text)"></div>
                
                <div class="flex items-center gap-2 sm:w-1/2">
                  <span class="text-xs font-bold text-gray-400 sm:inline hidden">➜</span>
                  <select 
                    :value="getMatchingVal(item.id)"
                    @change="setMatchingVal(item.id, $event.target.value)"
                    class="w-full font-medium border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white py-1.5 px-2.5 shadow-sm"
                  >
                    <option value="">-- Pilih Pasangan --</option>
                    <option 
                      v-for="right in question.options_json?.right || []" 
                      :key="right.id" 
                      :value="right.id"
                    >
                      {{ right.text }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Layout 1 Kolom jika TIDAK ADA Stimulus/Wacana (Sesuai Gambar Soal Matematika Mas Bos) -->
      <div v-else class="max-w-4xl mx-auto space-y-5">
        <!-- Butir Pertanyaan -->
        <div class="pertanyaan-text font-normal text-gray-900 leading-relaxed" v-html="formattedPertanyaan"></div>

        <!-- Gambar Soal Terpisah (jika ada) -->
        <div v-if="question.question_image" class="my-3 text-center">
          <img :src="question.question_image" alt="Gambar Soal" class="max-w-full max-h-72 mx-auto rounded shadow-sm border" />
        </div>

        <!-- Teks Panduan Biru Tebal -->
        <div v-if="instructionText" class="instruction-text text-blue-700 font-bold tracking-tight leading-snug">
          {{ instructionText }}
        </div>

        <!-- 1. Tipe 1: Pilihan Ganda Biasa Polos -->
        <div v-if="question.tipe_soal === '1'" class="space-y-3 pt-1 options-container">
          <label 
            v-for="opt in question.options_json" 
            :key="opt.id"
            class="flex items-start gap-3.5 cursor-pointer py-1 transition-colors hover:text-blue-700 group"
          >
            <div class="mt-0.5">
              <input 
                type="radio" 
                :name="'soal_' + question.nomor_soal" 
                :value="opt.id"
                :checked="modelValue === opt.id"
                @change="$emit('update:modelValue', opt.id)"
                class="w-5 h-5 text-blue-600 border-gray-400 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div class="flex-1 flex items-start gap-1.5 leading-relaxed text-gray-800 group-hover:text-blue-900">
              <div class="flex-1 option-text" v-html="formatHtml(opt.text)"></div>
            </div>
          </label>
        </div>

        <!-- 2. Tipe 2: Pilihan Ganda Kompleks Polos -->
        <div v-else-if="question.tipe_soal === '2'" class="space-y-3 pt-1 options-container">
          <label 
            v-for="opt in question.options_json" 
            :key="opt.id"
            class="flex items-start gap-3.5 cursor-pointer py-1 transition-colors hover:text-blue-700 group"
          >
            <div class="mt-0.5">
              <input 
                type="checkbox" 
                :value="opt.id" 
                :checked="isMcmaChecked(opt.id)"
                @change="toggleMcma(opt.id)"
                class="w-5 h-5 text-blue-600 rounded border-gray-400 focus:ring-blue-500 cursor-pointer"
              />
            </div>
            <div class="flex-1 flex items-start gap-1.5 leading-relaxed text-gray-800 group-hover:text-blue-900">
              <div class="flex-1 option-text" v-html="formatHtml(opt.text)"></div>
            </div>
          </label>
        </div>

        <!-- 3. Tipe 3: Matriks Tabel Benar / Salah -->
        <div v-else-if="question.tipe_soal === '3'" class="overflow-x-auto pt-2">
          <table class="min-w-full border-collapse border border-gray-300 cbt-table">
            <thead class="bg-gray-50/80 text-gray-800 font-medium">
              <tr>
                <th class="py-2 px-3 text-left border border-gray-300 font-bold">Pernyataan</th>
                <th class="py-2 px-3 text-center border border-gray-300 w-24 font-bold">Benar</th>
                <th class="py-2 px-3 text-center border border-gray-300 w-24 font-bold">Salah</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-300 bg-white">
              <tr v-for="row in question.options_json" :key="row.id" class="hover:bg-gray-50/70">
                <td class="py-2.5 px-3 text-gray-800 border border-gray-300">
                  <div class="table-cell-text" v-html="formatHtml(row.pernyataan)"></div>
                </td>
                <td class="py-2.5 px-3 text-center border border-gray-300">
                  <input 
                    type="radio" 
                    :name="'row_' + question.nomor_soal + '_' + row.id" 
                    value="B"
                    :checked="getTableVal(row.id) === 'B'"
                    @change="setTableVal(row.id, 'B')"
                    class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-400 cursor-pointer"
                  />
                </td>
                <td class="py-2.5 px-3 text-center border border-gray-300">
                  <input 
                    type="radio" 
                    :name="'row_' + question.nomor_soal + '_' + row.id" 
                    value="S"
                    :checked="getTableVal(row.id) === 'S'"
                    @change="setTableVal(row.id, 'S')"
                    class="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-400 cursor-pointer"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  question: {
    type: Object,
    required: true
  },
  modelValue: {
    type: [String, Array, Object],
    default: null
  },
  fontSizeLevel: {
    type: String,
    default: 'md' // 'sm', 'md', 'lg'
  }
})

const emit = defineEmits(['update:modelValue'])

// Dynamic styles scaling every single text element inside
const cbtFontStyles = computed(() => {
  let size = '16px'
  let lh = '1.65'
  let instructionSize = '14px'

  if (props.fontSizeLevel === 'sm') {
    size = '13.5px'
    lh = '1.5'
    instructionSize = '12px'
  } else if (props.fontSizeLevel === 'lg') {
    size = '20.5px'
    lh = '1.8'
    instructionSize = '17px'
  }

  return {
    '--cbt-content-size': size,
    '--cbt-line-height': lh,
    '--cbt-instruction-size': instructionSize
  }
})

function formatHtml(html) {
  if (!html) return ''
  const base = import.meta.env.BASE_URL || '/'
  return String(html).replaceAll('src="/images/', `src="${base}images/`)
}

const formattedStimulus = computed(() => formatHtml(props.question.stimulus_html))
const formattedPertanyaan = computed(() => formatHtml(props.question.pertanyaan_html))

// Teks Instruksi Biru Sesuai Pusmendik
const instructionText = computed(() => {
  switch (props.question.tipe_soal) {
    case '2':
      return 'Klik pada setiap pilihan jawaban benar! Jawaban benar lebih dari satu.'
    case '3':
      return 'Klik pada pilihan Benar atau Salah untuk setiap pertanyaan berdasarkan isi teks!'
    case '5':
      return 'Pasangkan setiap butir di kolom kiri dengan pasangan yang tepat di kolom kanan!'
    default:
      return ''
  }
})

// Helper MCMA (Tipe 2)
function isMcmaChecked(optId) {
  if (Array.isArray(props.modelValue)) {
    return props.modelValue.includes(optId)
  }
  return false
}

function toggleMcma(optId) {
  let list = Array.isArray(props.modelValue) ? [...props.modelValue] : []
  if (list.includes(optId)) {
    list = list.filter(x => x !== optId)
  } else {
    list.push(optId)
  }
  emit('update:modelValue', list)
}

// Helper Matriks Tabel (Tipe 3)
function getTableVal(rowId) {
  if (props.modelValue && typeof props.modelValue === 'object') {
    return props.modelValue[rowId] || ''
  }
  return ''
}

function setTableVal(rowId, val) {
  const current = (props.modelValue && typeof props.modelValue === 'object') ? { ...props.modelValue } : {}
  current[rowId] = val
  emit('update:modelValue', current)
}

// Helper Menjodohkan (Tipe 5)
function getMatchingVal(leftId) {
  if (props.modelValue && typeof props.modelValue === 'object') {
    return props.modelValue[leftId] || ''
  }
  return ''
}

function setMatchingVal(leftId, rightId) {
  const current = (props.modelValue && typeof props.modelValue === 'object') ? { ...props.modelValue } : {}
  current[leftId] = rightId
  emit('update:modelValue', current)
}
</script>

<style scoped>
.stimulus-column,
.pertanyaan-text,
.option-text,
.table-cell-text,
.cbt-table {
  font-size: var(--cbt-content-size, 16px) !important;
  line-height: var(--cbt-line-height, 1.65) !important;
}

.instruction-text {
  font-size: var(--cbt-instruction-size, 14px) !important;
}

.stimulus-column :deep(img) {
  max-width: 100%;
  width: auto;
  height: auto;
  margin: 1rem auto;
  display: block;
  border-radius: 0.375rem;
}

.stimulus-column :deep(p) {
  margin-bottom: 0.75rem;
  font-size: var(--cbt-content-size, 16px) !important;
  line-height: var(--cbt-line-height, 1.65) !important;
}

.stimulus-column :deep(h1), 
.stimulus-column :deep(h2), 
.stimulus-column :deep(h3),
.stimulus-column :deep(h4) {
  font-weight: 700;
  text-align: center;
  margin-bottom: 0.75rem;
}

.pertanyaan-text :deep(p) {
  margin-bottom: 0.5rem;
  font-size: var(--cbt-content-size, 16px) !important;
  line-height: var(--cbt-line-height, 1.65) !important;
}

.pertanyaan-text :deep(span.math-inline),
.option-text :deep(span.math-inline),
.stimulus-column :deep(span.math-inline) {
  font-size: 1.05em !important;
}
</style>

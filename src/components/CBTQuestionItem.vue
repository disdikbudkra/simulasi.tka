<template>
  <div class="cbt-question-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <!-- Header Soal -->
    <div class="bg-gray-50 border-b border-gray-200 px-6 py-3.5 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <span class="bg-blue-600 text-white font-bold px-3 py-1 rounded-md text-sm shadow-sm">
          Soal No. {{ question.nomor_soal }}
        </span>
        <span class="text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider" :class="typeBadgeClass">
          {{ typeLabel }}
        </span>
      </div>

      <!-- Panduan Pengerjaan Singkat Sesuai Tipe -->
      <div class="text-xs text-gray-500 italic hidden sm:block">
        <span v-if="question.tipe_soal === '1'">Pilihlah salah satu jawaban yang paling tepat</span>
        <span v-else-if="question.tipe_soal === '2'">Pilihan Ganda Kompleks: Anda dapat memilih lebih dari satu jawaban</span>
        <span v-else-if="question.tipe_soal === '3'">Tentukan nilai Benar atau Salah pada setiap baris pernyataan</span>
        <span v-else-if="question.tipe_soal === '5'">Pasangkan setiap butir di kolom kiri dengan pasangan yang tepat di kolom kanan</span>
      </div>
    </div>

    <!-- Body Soal: Split Tampilan jika ada Stimulus -->
    <div class="p-6">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start" :class="{ '!grid-cols-1': !question.stimulus_html }">
        
        <!-- Kolom Kiri: Stimulus / Wacana / Gambar (Jika ada) -->
        <div v-if="question.stimulus_html" class="stimulus-pane bg-blue-50/40 p-5 rounded-lg border border-blue-100 text-gray-800 leading-relaxed text-justify overflow-x-auto">
          <div class="font-bold text-xs uppercase tracking-wider text-blue-800 mb-2.5 flex items-center gap-1.5">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Informasi / Wacana Soal
          </div>
          <div class="content-body text-sm sm:text-base" v-html="question.stimulus_html"></div>
        </div>

        <!-- Kolom Kanan: Pertanyaan & Opsi Jawaban -->
        <div class="pertanyaan-pane space-y-6">
          <!-- Teks Pertanyaan -->
          <div class="pertanyaan-text font-medium text-gray-900 text-base leading-relaxed" v-html="question.pertanyaan_html"></div>

          <!-- 1. TIPE 1: PILIHAN GANDA TUNGGAL -->
          <div v-if="question.tipe_soal === '1'" class="space-y-3">
            <label 
              v-for="opt in question.options_json" 
              :key="opt.id"
              class="flex items-start p-3.5 rounded-lg border cursor-pointer transition-all hover:bg-blue-50/50"
              :class="modelValue === opt.id ? 'border-blue-600 bg-blue-50 shadow-sm ring-1 ring-blue-500' : 'border-gray-200 bg-white'"
            >
              <div class="flex items-center h-5 mr-3 mt-0.5">
                <input 
                  type="radio" 
                  :name="'soal_' + question.nomor_soal" 
                  :value="opt.id"
                  :checked="modelValue === opt.id"
                  @change="$emit('update:modelValue', opt.id)"
                  class="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
              </div>
              <div class="flex-1 flex items-start gap-2 text-sm sm:text-base text-gray-800">
                <span class="font-bold text-gray-700 min-w-[20px]">{{ opt.id }}.</span>
                <div class="flex-1" v-html="opt.text"></div>
              </div>
            </label>
          </div>

          <!-- 2. TIPE 2: PILIHAN GANDA KOMPLEKS (MCMA - Centang Banyak) -->
          <div v-else-if="question.tipe_soal === '2'" class="space-y-3">
            <label 
              v-for="opt in question.options_json" 
              :key="opt.id"
              class="flex items-start p-3.5 rounded-lg border cursor-pointer transition-all hover:bg-blue-50/50"
              :class="isMcmaChecked(opt.id) ? 'border-blue-600 bg-blue-50 shadow-sm ring-1 ring-blue-500' : 'border-gray-200 bg-white'"
            >
              <div class="flex items-center h-5 mr-3 mt-0.5">
                <input 
                  type="checkbox" 
                  :value="opt.id"
                  :checked="isMcmaChecked(opt.id)"
                  @change="toggleMcma(opt.id)"
                  class="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                />
              </div>
              <div class="flex-1 flex items-start gap-2 text-sm sm:text-base text-gray-800">
                <span class="font-bold text-gray-700 min-w-[20px]">{{ opt.id }}.</span>
                <div class="flex-1" v-html="opt.text"></div>
              </div>
            </label>
          </div>

          <!-- 3. TIPE 3: MATRIKS TABEL BENAR / SALAH -->
          <div v-else-if="question.tipe_soal === '3'" class="overflow-x-auto">
            <table class="min-w-full border border-gray-300 rounded-lg overflow-hidden text-sm">
              <thead class="bg-gray-100 text-gray-700 uppercase font-semibold text-xs">
                <tr>
                  <th class="py-3 px-4 text-left border-b border-gray-300">Pernyataan</th>
                  <th class="py-3 px-4 text-center border-b border-gray-300 w-24 bg-green-50 text-green-800">Benar</th>
                  <th class="py-3 px-4 text-center border-b border-gray-300 w-24 bg-red-50 text-red-800">Salah</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 bg-white">
                <tr v-for="row in question.options_json" :key="row.id" class="hover:bg-gray-50/60">
                  <td class="py-3.5 px-4 text-gray-800 font-medium">
                    <div v-html="row.pernyataan"></div>
                  </td>
                  <td class="py-3 px-4 text-center bg-green-50/30">
                    <input 
                      type="radio" 
                      :name="'row_' + question.nomor_soal + '_' + row.id" 
                      value="B"
                      :checked="getTableVal(row.id) === 'B'"
                      @change="setTableVal(row.id, 'B')"
                      class="w-4 h-4 text-green-600 focus:ring-green-500 border-gray-300"
                    />
                  </td>
                  <td class="py-3 px-4 text-center bg-red-50/30">
                    <input 
                      type="radio" 
                      :name="'row_' + question.nomor_soal + '_' + row.id" 
                      value="S"
                      :checked="getTableVal(row.id) === 'S'"
                      @change="setTableVal(row.id, 'S')"
                      class="w-4 h-4 text-red-600 focus:ring-red-500 border-gray-300"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 4. TIPE 5: MENJODOHKAN (MATCHING PAIRS) -->
          <div v-else-if="question.tipe_soal === '5'" class="space-y-4">
            <div class="text-xs text-blue-700 font-semibold bg-blue-50 p-2.5 rounded border border-blue-200">
              Pilihlah pasangan yang sesuai pada dropdown untuk setiap butir kolom kiri:
            </div>
            <div class="space-y-3">
              <div 
                v-for="item in question.options_json?.left || []" 
                :key="item.id"
                class="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-gray-50 rounded-lg border border-gray-200 gap-3"
              >
                <div class="font-medium text-gray-800 flex-1" v-html="item.text"></div>
                
                <div class="flex items-center gap-2 sm:w-1/2">
                  <span class="text-xs font-bold text-gray-400 sm:inline hidden">➜</span>
                  <select 
                    :value="getMatchingVal(item.id)"
                    @change="setMatchingVal(item.id, $event.target.value)"
                    class="w-full text-sm font-medium border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500 bg-white py-2 px-3 shadow-sm"
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
  }
})

const emit = defineEmits(['update:modelValue'])

const typeLabel = computed(() => {
  switch (props.question.tipe_soal) {
    case '1': return 'Pilihan Ganda'
    case '2': return 'Pilihan Ganda Kompleks'
    case '3': return 'Tabel Benar/Salah'
    case '5': return 'Menjodohkan'
    default: return 'Soal'
  }
})

const typeBadgeClass = computed(() => {
  switch (props.question.tipe_soal) {
    case '1': return 'bg-blue-100 text-blue-700 border border-blue-200'
    case '2': return 'bg-purple-100 text-purple-700 border border-purple-200'
    case '3': return 'bg-emerald-100 text-emerald-700 border border-emerald-200'
    case '5': return 'bg-amber-100 text-amber-700 border border-amber-200'
    default: return 'bg-gray-100 text-gray-700'
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
.content-body :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 0.5rem auto;
  border-radius: 0.375rem;
}
.content-body :deep(p) {
  margin-bottom: 0.5rem;
}
</style>

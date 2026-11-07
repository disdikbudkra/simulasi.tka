<template>
  <div class="math-view-wrapper inline-block max-w-full">
    <!-- If content has LaTeX / math formula -->
    <template v-if="hasMath(content)">
      <math-field 
        ref="mathFieldRef"
        read-only 
        class="math-display-field border-none bg-transparent p-0 inline-block align-middle cursor-default select-text"
        :value="formatMathContent(content)"
      ></math-field>
    </template>
    <!-- If normal text -->
    <template v-else>
      <span class="whitespace-pre-line leading-relaxed">{{ content }}</span>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import 'mathlive'

const props = defineProps({
  content: {
    type: String,
    default: ''
  }
})

const mathFieldRef = ref(null)

const hasMath = (text) => {
  if (!text) return false
  return text.includes('\\') || text.includes('^') || text.includes('_') || text.includes('{') || text.includes('}')
}

const formatMathContent = (text) => {
  if (!text) return ''
  return text
}
</script>

<style scoped>
.math-display-field {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 !important;
  font-size: 1.1em;
  color: inherit;
}
.math-display-field::part(virtual-keyboard-toggle) {
  display: none !important;
}
</style>

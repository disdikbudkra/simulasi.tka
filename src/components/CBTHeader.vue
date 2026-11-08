<template>
  <header class="pusmendik-header shadow-md relative z-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between">
      <!-- Logo & Dinas Identity (Pusmendik / Disdikbud Style) -->
      <div class="flex items-center space-x-3.5">
        <img 
          :src="baseUrl + 'images/logo_karanganyar.png'" 
          alt="Logo Kabupaten Karanganyar" 
          class="h-10 sm:h-11 w-auto drop-shadow object-contain"
        />
        <div class="text-white border-l border-white/25 pl-3">
          <h1 class="text-[10px] sm:text-xs font-semibold tracking-wider text-blue-100 uppercase leading-none">
            Dinas Pendidikan dan Kebudayaan
          </h1>
          <div class="text-sm sm:text-lg font-bold tracking-tight leading-tight mt-0.5">
            KABUPATEN KARANGANYAR
          </div>
          <div class="text-[10px] text-blue-200/90 font-medium leading-none">
            Simulasi Tes Kemampuan Akademik (TKA)
          </div>
        </div>
      </div>

      <!-- Right Side: Clean Student Badge (Sesuai Screenshot Pusmendik: username - Nama Siswa 🎓) -->
      <div class="flex items-center space-x-2 text-white/90 text-xs sm:text-sm font-medium">
        <span class="text-blue-100 font-mono text-xs">{{ studentIdentity || 'Aplikasi CBT TKA' }}</span>
        <div class="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center text-white">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/></svg>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
const props = defineProps({
  studentIdentity: {
    type: String,
    default: ''
  }
})

const baseUrl = import.meta.env.BASE_URL
</script>

<style scoped>
.pusmendik-header {
  background: linear-gradient(135deg, #326698 0%, #4a7fb8 100%);
  border-bottom: 2px solid rgba(255, 255, 255, 0.15);
}
</style>

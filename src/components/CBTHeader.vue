<template>
  <header class="pusmendik-header shadow-md relative z-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
      <!-- Logo & Dinas Identity -->
      <div class="flex items-center space-x-3.5">
        <img 
          src="/images/logo_karanganyar.png" 
          alt="Logo Kabupaten Karanganyar" 
          class="h-12 w-auto drop-shadow object-contain"
        />
        <div class="text-white border-l border-white/25 pl-3.5">
          <h1 class="text-xs sm:text-sm font-semibold tracking-wider text-blue-100 uppercase">
            Dinas Pendidikan dan Kebudayaan
          </h1>
          <div class="text-base sm:text-xl font-bold tracking-tight leading-tight">
            KABUPATEN KARANGANYAR
          </div>
          <div class="text-[11px] text-blue-200/90 font-medium">
            Simulasi Tes Kemampuan Akademik (TKA)
          </div>
        </div>
      </div>

      <!-- Quick Nav / Portal Switcher -->
      <div class="flex items-center space-x-2 sm:space-x-3">
        <router-link 
          to="/simulasi_tka"
          class="text-xs sm:text-sm text-white/90 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1.5"
          active-class="bg-white/20 font-semibold"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
          </svg>
          <span class="hidden sm:inline">Simulasi Siswa</span>
        </router-link>

        <router-link 
          to="/penulis"
          class="text-xs sm:text-sm text-white/90 hover:text-white px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors flex items-center gap-1.5"
          active-class="bg-white/20 font-semibold"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          <span class="hidden sm:inline">Penulis Soal</span>
        </router-link>

        <router-link 
          to="/marshal"
          class="text-xs sm:text-sm text-white bg-amber-500/80 hover:bg-amber-500 px-3 py-1.5 rounded-md transition-all shadow-sm flex items-center gap-1.5 font-medium"
          active-class="bg-amber-600 font-bold"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span>Marshal</span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<style scoped>
.pusmendik-header {
  background: linear-gradient(135deg, #326698 0%, #4a7fb8 100%);
  border-bottom: 2px solid rgba(255, 255, 255, 0.15);
}
</style>

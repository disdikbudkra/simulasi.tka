<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs no-print">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo & Title -->
        <router-link to="/" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-700 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap class="w-6 h-6" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-bold text-lg sm:text-xl text-slate-900 tracking-tight">Simulasi TKA</span>
              <span class="px-2 py-0.5 text-[11px] font-semibold bg-brand-50 text-brand-700 rounded-full border border-brand-200">Karanganyar</span>
            </div>
            <p class="text-xs text-slate-500 hidden sm:block">Tes Kemampuan Akademik Jenjang SD & SMP</p>
          </div>
        </router-link>

        <!-- Navigation Links -->
        <nav class="hidden md:flex items-center gap-1 sm:gap-2">
          <router-link 
            to="/" 
            class="px-3 py-2 text-sm font-medium rounded-lg transition-colors"
            :class="$route.path === '/' ? 'text-brand-700 bg-brand-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'"
          >
            Beranda
          </router-link>

          <router-link 
            to="/siswa" 
            class="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-all"
            :class="$route.path === '/siswa' ? 'text-white bg-brand-600 font-semibold shadow-xs' : 'text-slate-700 hover:bg-brand-50 hover:text-brand-700'"
          >
            <UserCheck class="w-4 h-4" />
            <span>Simulasi Siswa</span>
          </router-link>

          <router-link 
            to="/guru" 
            class="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium rounded-lg transition-all"
            :class="$route.path === '/guru' ? 'text-emerald-800 bg-emerald-50 border border-emerald-300 font-semibold' : 'text-slate-700 hover:bg-slate-100'"
          >
            <PenSquare class="w-4 h-4 text-emerald-600" />
            <span>Dashboard Guru</span>
          </router-link>
        </nav>

        <!-- Right Side: DB Cloud Indicator & Mobile Toggle -->
        <div class="flex items-center gap-3">
          <div class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-600 border border-slate-200" title="Terhubung ke Supabase Cloud DB">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Supabase Cloud</span>
          </div>

          <!-- Mobile Hamburger -->
          <button 
            @click="isMobileMenuOpen = !isMobileMenuOpen" 
            class="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle navigation"
          >
            <Menu v-if="!isMobileMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu dropdown -->
    <div v-if="isMobileMenuOpen" class="md:hidden border-t border-slate-200 bg-white px-4 pt-2 pb-4 space-y-1">
      <router-link 
        @click="isMobileMenuOpen = false" 
        to="/" 
        class="block px-3 py-2 rounded-lg text-base font-medium"
        :class="$route.path === '/' ? 'text-brand-700 bg-brand-50 font-bold' : 'text-slate-700 hover:bg-slate-50'"
      >
        Beranda
      </router-link>

      <router-link 
        @click="isMobileMenuOpen = false" 
        to="/siswa" 
        class="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium"
        :class="$route.path === '/siswa' ? 'text-white bg-brand-600 font-bold' : 'text-slate-700 hover:bg-slate-50'"
      >
        <UserCheck class="w-5 h-5" />
        <span>Simulasi Siswa</span>
      </router-link>

      <router-link 
        @click="isMobileMenuOpen = false" 
        to="/guru" 
        class="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium"
        :class="$route.path === '/guru' ? 'text-emerald-800 bg-emerald-50 font-bold' : 'text-slate-700 hover:bg-slate-50'"
      >
        <PenSquare class="w-5 h-5 text-emerald-600" />
        <span>Dashboard Guru (Penulis Soal)</span>
      </router-link>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { GraduationCap, UserCheck, PenSquare, Menu, X } from 'lucide-vue-next'

const isMobileMenuOpen = ref(false)
</script>

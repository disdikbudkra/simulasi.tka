<template>
  <div class="h-screen bg-gray-100 flex flex-col overflow-hidden font-sans">
    
    <!-- ======================================================== -->
    <!-- 1. HEADER REKAP SISWA DENGAN TAB NAVIGASI MARSHAL        -->
    <!-- ======================================================== -->
    <header class="bg-gradient-to-r from-[#1e3a5f] to-[#326698] text-white shadow-md flex-shrink-0 z-30">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4">
        
        <!-- Identitas Dinas Karanganyar -->
        <div class="flex items-center space-x-3">
          <img 
            :src="baseUrl + 'images/logo_karanganyar.png'" 
            alt="Logo Karanganyar" 
            class="h-9 sm:h-10 w-auto object-contain drop-shadow"
          />
          <div class="border-l border-white/25 pl-3">
            <h1 class="text-[10px] sm:text-xs font-semibold tracking-wider text-blue-200 uppercase leading-none">
              Dinas Pendidikan dan Kebudayaan
            </h1>
            <div class="text-sm sm:text-base font-bold tracking-tight leading-tight mt-0.5">
              REKAPITULASI HASIL SIMULASI TKA
            </div>
            <div class="text-[10px] text-blue-200/90 font-medium leading-none">
              Kabupaten Karanganyar
            </div>
          </div>
        </div>

        <!-- Tab Navigasi & Profile / Logout (Jika Login) -->
        <div v-if="isLoggedIn" class="flex items-center gap-2 sm:gap-3">
          
          <router-link 
            to="/marshal" 
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 text-blue-100 hover:bg-white/10"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            <span class="hidden md:inline">Pusat Kendali Marshal</span>
          </router-link>

          <span class="px-3 py-1.5 rounded-lg text-xs font-bold bg-white text-[#1e3a5f] shadow flex items-center gap-1.5">
            <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            <span>Rekap Siswa</span>
          </span>

          <router-link 
            to="/penulis" 
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-blue-100 hover:bg-white/10 hidden sm:flex items-center gap-1.5"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
            <span>Penulis</span>
          </router-link>

          <router-link 
            to="/" 
            class="px-3 py-1.5 rounded-lg text-xs font-bold transition-all text-blue-100 hover:bg-white/10 hidden lg:flex items-center gap-1.5"
          >
            <span>Simulasi Siswa ↗</span>
          </router-link>

          <!-- Tombol Log Out -->
          <button 
            @click="handleLogout"
            class="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-500/80 hover:bg-red-600 text-white shadow transition-colors flex items-center gap-1"
            title="Keluar dari sesi Rekap"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            <span>Keluar</span>
          </button>
        </div>

      </div>
    </header>

    <!-- ======================================================== -->
    <!-- 2. FORM LOGIN (JIKA BELUM LOGGED IN SEBAGAI ADMIN)       -->
    <!-- ======================================================== -->
    <main v-if="!isLoggedIn" class="flex-1 overflow-y-auto flex items-center justify-center p-4">
      <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 p-8 space-y-6 my-auto">
        <div class="text-center space-y-2">
          <div class="w-14 h-14 mx-auto rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-2xl shadow-inner">
            <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <h2 class="text-xl font-bold text-gray-800">Rekapitulasi Simulasi Siswa</h2>
          <p class="text-xs text-gray-500">Masuk menggunakan akun Administrator / Marshal Karanganyar</p>
        </div>

        <!-- Alert Error & Rate Limit -->
        <div v-if="authError" class="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
          <svg class="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
          <div>{{ authError }}</div>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Email Administrator</label>
            <input 
              v-model="loginEmail" 
              type="email" 
              required
              placeholder="admin@disdikbud.karanganyarkab.go.id" 
              class="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-700 mb-1">Kata Sandi</label>
            <input 
              v-model="loginPassword" 
              type="password" 
              required
              placeholder="••••••••" 
              class="w-full text-xs border border-gray-300 rounded-xl px-3.5 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          <button 
            type="submit" 
            :disabled="isLoading || loginCooldown > 0"
            class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span v-if="isLoading">Memverifikasi...</span>
            <span v-else-if="loginCooldown > 0">Terkunci ({{ loginCooldown }}s)</span>
            <span v-else>Masuk ke Rekap Siswa</span>
          </button>
        </form>

        <div class="text-center pt-2">
          <router-link to="/marshal" class="text-xs text-blue-600 hover:underline">
            ← Buka Pusat Kendali Marshal
          </router-link>
        </div>
      </div>
    </main>

    <!-- ======================================================== -->
    <!-- 3. DASHBOARD REKAP SISWA (LOGGED IN) - SCROLLABLE        -->
    <!-- ======================================================== -->
    <main v-else class="flex-1 overflow-y-auto w-full p-4 sm:p-6">
      <div class="max-w-7xl mx-auto space-y-6">

      <!-- A. KARTU STATISTIK RINGKAS SIMULASI (DIAGNOSTIK EDUKATIF) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <!-- Total Selesai -->
        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
          </div>
          <div>
            <span class="text-xs text-gray-500 font-medium block">Total Sesi Simulasi</span>
            <span class="text-xl sm:text-2xl font-black text-gray-800">{{ totalDataCount }}</span>
            <span class="text-[10px] text-gray-400 block">Siswa selesai</span>
          </div>
        </div>

        <!-- Rata-rata Benar -->
        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <span class="text-xs text-gray-500 font-medium block">Rata-rata Capaian</span>
            <span class="text-xl sm:text-2xl font-black text-emerald-700">{{ avgBenarText }}</span>
            <span class="text-[10px] text-emerald-600 font-semibold block">{{ avgPersentaseText }} ketepatan</span>
          </div>
        </div>

        <!-- Rata-rata Durasi -->
        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          </div>
          <div>
            <span class="text-xs text-gray-500 font-medium block">Rata-rata Durasi</span>
            <span class="text-xl sm:text-2xl font-black text-purple-800">{{ avgDurasiText }}</span>
            <span class="text-[10px] text-gray-400 block">Waktu pengerjaan</span>
          </div>
        </div>

        <!-- Distribusi Jenjang -->
        <div class="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center flex-shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
          </div>
          <div>
            <span class="text-xs text-gray-500 font-medium block">Sebaran Jenjang</span>
            <div class="flex items-center gap-2 mt-1">
              <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-orange-100 text-orange-800">SD: {{ sdCount }}</span>
              <span class="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">SMP: {{ smpCount }}</span>
            </div>
            <span class="text-[10px] text-gray-400 mt-0.5 block">Partisipasi siswa</span>
          </div>
        </div>

      </div>

      <!-- B. KONTROL UTAMA: FILTER, PENCARIAN, PAGINASI PER HALAMAN & EKSPOR -->
      <div class="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 space-y-4">
        
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-gray-100">
          <div>
            <h2 class="text-base font-bold text-gray-800 flex items-center gap-2">
              <span>Daftar Lembar Hasil Simulasi Siswa</span>
              <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                {{ filteredList.length }} data terfilter
              </span>
            </h2>
            <p class="text-xs text-gray-500">Pantau kesiapan akademik siswa, rincian jawaban, dan bersihkan data simulasi</p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <!-- Pilihan Data Per Halaman Sesuai Permintaan Mas Bos: 25, 50, 100 -->
            <div class="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 px-2.5 py-1.5 rounded-lg border">
              <span class="font-medium">Tampil:</span>
              <select v-model="pageSize" @change="currentPage = 1" class="bg-transparent font-bold text-gray-800 focus:outline-none cursor-pointer">
                <option :value="25">25</option>
                <option :value="50">50</option>
                <option :value="100">100</option>
              </select>
              <span>baris</span>
            </div>

            <!-- Tombol Refresh -->
            <button 
              @click="loadData" 
              class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg border flex items-center gap-1.5 transition-colors"
              title="Muat ulang data terbaru dari Supabase"
            >
              <svg class="w-3.5 h-3.5" :class="{ 'animate-spin': isRefreshing }" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
              <span>Refresh</span>
            </button>

            <!-- Tombol Export Excel -->
            <button 
              @click="exportExcel" 
              class="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow flex items-center gap-1.5 transition-colors"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              <span>Unduh Excel (.xlsx)</span>
            </button>
          </div>
        </div>

        <!-- Filter Bar Interaktif -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
          
          <!-- Cari Nama / NPSN / Sekolah -->
          <div class="lg:col-span-2 relative">
            <input 
              v-model="searchQuery" 
              @input="currentPage = 1"
              type="text" 
              placeholder="Cari Nama Siswa, NPSN, atau Asal Sekolah..." 
              class="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2 text-xs focus:ring-blue-500 focus:border-blue-500 bg-white"
            />
            <svg class="w-4 h-4 text-gray-400 absolute left-2.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
          </div>

          <!-- Filter Jenjang -->
          <select v-model="filterJenjang" @change="currentPage = 1" class="border border-gray-300 rounded-lg p-2 text-xs bg-white">
            <option value="">Semua Jenjang</option>
            <option value="SD">Jenjang SD</option>
            <option value="SMP">Jenjang SMP</option>
          </select>

          <!-- Filter Mapel -->
          <select v-model="filterMapel" @change="currentPage = 1" class="border border-gray-300 rounded-lg p-2 text-xs bg-white">
            <option value="">Semua Mapel</option>
            <option v-for="m in uniqueMapelList" :key="m" :value="m">{{ m }}</option>
          </select>

          <!-- Filter Paket / Khusus Data Coba -->
          <select v-model="filterSpecial" @change="currentPage = 1" class="border border-gray-300 rounded-lg p-2 text-xs bg-white font-medium">
            <option value="all">Semua Sesi Simulasi</option>
            <option value="trial">⚠️ Data Uji Coba (< 1m / coba)</option>
            <option value="optimal">🌟 Capaian Optimal (≥ 80%)</option>
            <option value="pengayaan">💡 Perlu Pendalaman (< 50%)</option>
          </select>

        </div>

        <!-- Banner Cerdas Checkbox Seleksi Semua Data (Muncul saat semua baris di halaman terpilih) -->
        <div 
          v-if="isCurrentPageAllSelected && filteredList.length > paginatedList.length" 
          class="p-2.5 bg-blue-50 border border-blue-200 rounded-xl text-xs flex items-center justify-between text-blue-900"
        >
          <div>
            <span v-if="!isAllFilteredSelected">
              Semua <strong>{{ paginatedList.length }}</strong> siswa pada halaman ini telah terpilih.
            </span>
            <span v-else class="font-bold text-blue-700">
              ✓ Seluruh {{ filteredList.length }} siswa yang cocok dengan filter telah terpilih.
            </span>
          </div>
          <div>
            <button 
              v-if="!isAllFilteredSelected"
              @click="selectAllFilteredData" 
              class="font-bold text-blue-700 hover:underline"
            >
              Pilih seluruh {{ filteredList.length }} data hasil simulasi ini
            </button>
            <button 
              v-else
              @click="clearSelection" 
              class="font-bold text-gray-600 hover:underline"
            >
              Batalkan pilihan seluruh data
            </button>
          </div>
        </div>

        <!-- C. TABEL REKAPITULASI DENGAN CHECKBOX MULTI-LEVEL -->
        <div class="overflow-x-auto border border-gray-200 rounded-xl">
          <table class="min-w-full divide-y divide-gray-200 text-xs">
            <thead class="bg-gray-50 text-gray-600 font-bold uppercase tracking-wider select-none">
              <tr>
                <!-- Checkbox Master Header -->
                <th class="py-3 px-3 text-center w-10">
                  <input 
                    type="checkbox" 
                    :checked="isCurrentPageAllSelected"
                    @change="toggleSelectCurrentPage"
                    class="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                    title="Pilih seluruh siswa di halaman ini"
                  />
                </th>
                <th class="py-3 px-3 text-left">Waktu Selesai</th>
                <th class="py-3 px-3 text-left">NPSN & Sekolah</th>
                <th class="py-3 px-3 text-left">Nama Siswa</th>
                <th class="py-3 px-3 text-center">Jenjang</th>
                <th class="py-3 px-3 text-left">Mapel / Paket</th>
                <th class="py-3 px-3 text-center">Capaian Latihan</th>
                <th class="py-3 px-3 text-center">Durasi</th>
                <th class="py-3 px-3 text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 bg-white">
              <tr v-if="paginatedList.length === 0">
                <td colspan="9" class="text-center py-10 text-gray-400">
                  <div class="flex flex-col items-center justify-center space-y-1">
                    <svg class="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    <p class="font-medium text-xs">Tidak ada data hasil simulasi yang cocok dengan filter.</p>
                  </div>
                </td>
              </tr>

              <tr 
                v-for="row in paginatedList" 
                :key="row.id" 
                class="hover:bg-blue-50/40 transition-colors"
                :class="{ 'bg-blue-50/70': selectedIdMap[row.id] || isAllFilteredSelected }"
              >
                <!-- Checkbox Masing-Masing Siswa -->
                <td class="py-2.5 px-3 text-center">
                  <input 
                    type="checkbox" 
                    :checked="selectedIdMap[row.id] || isAllFilteredSelected"
                    @change="toggleSelectRow(row.id)"
                    class="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 cursor-pointer"
                  />
                </td>

                <!-- Waktu Selesai -->
                <td class="py-2.5 px-3 text-gray-500 whitespace-nowrap">
                  {{ formatDateTime(row.created_at) }}
                </td>

                <!-- NPSN & Asal Sekolah -->
                <td class="py-2.5 px-3">
                  <div class="font-bold text-gray-800">{{ row.nama_sekolah || '-' }}</div>
                  <div class="font-mono text-[11px] text-blue-700">{{ row.npsn || 'Tanpa NPSN' }}</div>
                </td>

                <!-- Nama Siswa & NISN -->
                <td class="py-2.5 px-3">
                  <div class="font-bold text-gray-900">{{ row.nama_siswa }}</div>
                  <div v-if="row.nisn" class="text-[10px] text-gray-400 font-mono">NISN: {{ row.nisn }}</div>
                </td>

                <!-- Jenjang -->
                <td class="py-2.5 px-3 text-center">
                  <span 
                    class="px-2 py-0.5 rounded text-[10px] font-bold"
                    :class="row.jenjang === 'SD' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'"
                  >
                    {{ row.jenjang }}
                  </span>
                </td>

                <!-- Mapel / Paket -->
                <td class="py-2.5 px-3 text-gray-700 whitespace-nowrap">
                  <div class="font-medium">{{ row.mapel }}</div>
                  <div class="text-[10px] text-gray-400">{{ row.paket || 'Paket 1' }}</div>
                </td>

                <!-- Capaian Simulasi (Benar X dari Y + Badge Predikat Edukatif) -->
                <td class="py-2.5 px-3 text-center whitespace-nowrap">
                  <div class="font-bold text-gray-900">
                    Benar <span class="text-emerald-700 font-black">{{ row.jumlah_benar }}</span> dari {{ row.total_soal }}
                  </div>
                  <div class="mt-0.5">
                    <span 
                      class="px-2 py-0.5 rounded-full text-[9px] font-bold inline-block"
                      :class="getCapaianBadgeClass(row.jumlah_benar, row.total_soal)"
                    >
                      {{ getCapaianBadgeLabel(row.jumlah_benar, row.total_soal) }}
                    </span>
                  </div>
                </td>

                <!-- Durasi -->
                <td class="py-2.5 px-3 text-center text-gray-600 whitespace-nowrap">
                  {{ formatDuration(row.durasi_detik) }}
                </td>

                <!-- Icon Aksi: Detail Jawaban & Hapus -->
                <td class="py-2.5 px-3 text-center whitespace-nowrap">
                  <div class="flex items-center justify-center gap-1.5">
                    
                    <!-- Tombol Detail Lembar Pengerjaan -->
                    <button 
                      @click="openDetailModal(row)" 
                      class="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Lihat rincian lembar pengerjaan siswa"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    </button>

                    <!-- Icon Hapus Individual Sesuai Permintaan Mas Bos -->
                    <button 
                      @click="openSingleDeleteModal(row)" 
                      class="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus rekaman siswa ini"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- D. KONTROL PAGINASI INTERAKTIF (SEBELUMNYA, NOMOR, BERIKUTNYA) -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-gray-600">
          <div>
            Menampilkan baris <strong>{{ paginationInfo.from }}</strong> s.d <strong>{{ paginationInfo.to }}</strong> dari <strong>{{ filteredList.length }}</strong> data
          </div>

          <div class="flex items-center gap-1">
            <!-- Tombol Pertama -->
            <button 
              @click="currentPage = 1" 
              :disabled="currentPage === 1"
              class="px-2.5 py-1.5 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              «
            </button>
            <!-- Tombol Sebelumnya -->
            <button 
              @click="currentPage--" 
              :disabled="currentPage === 1"
              class="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              Sebelumnya
            </button>

            <!-- Nomor-Nomor Halaman -->
            <button 
              v-for="p in visiblePages" 
              :key="p"
              @click="p !== '...' && (currentPage = p)"
              :disabled="p === '...'"
              class="px-3 py-1.5 rounded-lg border font-bold transition-colors"
              :class="currentPage === p ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-50 text-gray-700'"
            >
              {{ p }}
            </button>

            <!-- Tombol Berikutnya -->
            <button 
              @click="currentPage++" 
              :disabled="currentPage >= totalPages"
              class="px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              Berikutnya
            </button>
            <!-- Tombol Terakhir -->
            <button 
              @click="currentPage = totalPages" 
              :disabled="currentPage >= totalPages"
              class="px-2.5 py-1.5 rounded-lg border bg-white hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
            >
              »
            </button>
          </div>
        </div>

      </div>

      </div>
    </main>

    <!-- ======================================================== -->
    <!-- 4. FLOATING BULK ACTION BAR (MUNCUL JIKA CHECKBOX AKTIF)  -->
    <!-- ======================================================== -->
    <transition enter-active-class="transform transition ease-out duration-300" enter-from-class="translate-y-full opacity-0" enter-to-class="translate-y-0 opacity-100" leave-active-class="transform transition ease-in duration-200" leave-from-class="translate-y-0 opacity-100" leave-to-class="translate-y-full opacity-0">
      <div 
        v-if="effectiveSelectedCount > 0" 
        class="fixed bottom-14 inset-x-0 mx-auto max-w-xl bg-gray-900 text-white rounded-2xl shadow-2xl p-4 flex items-center justify-between z-40 border border-gray-700"
      >
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            {{ effectiveSelectedCount }}
          </div>
          <div>
            <div class="text-xs font-bold">{{ effectiveSelectedCount }} data siswa dipilih</div>
            <div class="text-[10px] text-gray-400">Siap dihapus atau dibersihkan dari rekap</div>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button 
            @click="clearSelection" 
            class="px-3 py-1.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs text-gray-300 font-semibold transition-colors"
          >
            Batal Pilih
          </button>
          <button 
            @click="openBulkDeleteModal" 
            class="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-xs text-white font-bold shadow flex items-center gap-1.5 transition-colors"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
            <span>Hapus {{ effectiveSelectedCount }} Terpilih</span>
          </button>
        </div>
      </div>
    </transition>

    <!-- ======================================================== -->
    <!-- 5. MODAL KONFIRMASI HAPUS INDIVIDUAL                     -->
    <!-- ======================================================== -->
    <div v-if="deleteTargetRow" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-800">Hapus Data Simulasi Siswa?</h3>
            <p class="text-xs text-gray-500 mt-1">
              Data pengerjaan atas nama <strong class="text-gray-900">{{ deleteTargetRow.nama_siswa }}</strong> ({{ deleteTargetRow.nama_sekolah || 'Tanpa Sekolah' }}) akan dihapus secara permanen dari Supabase.
            </p>
          </div>
        </div>

        <div class="bg-gray-50 rounded-xl p-3 text-xs space-y-1 text-gray-700">
          <div>• Mapel / Paket : <strong>{{ deleteTargetRow.mapel }} ({{ deleteTargetRow.paket }})</strong></div>
          <div>• Capaian : <strong>Benar {{ deleteTargetRow.jumlah_benar }} dari {{ deleteTargetRow.total_soal }}</strong></div>
          <div>• Waktu : <strong>{{ formatDateTime(deleteTargetRow.created_at) }}</strong></div>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button 
            @click="deleteTargetRow = null" 
            :disabled="isDeleting"
            class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
          >
            Batal
          </button>
          <button 
            @click="confirmSingleDelete" 
            :disabled="isDeleting"
            class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <span v-if="isDeleting">Menghapus...</span>
            <span v-else>Hapus Permanen</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 6. MODAL KONFIRMASI HAPUS MASSAL (BULK DELETE)           -->
    <!-- ======================================================== -->
    <div v-if="showBulkDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div class="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4">
        <div class="flex items-start gap-3">
          <div class="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
          </div>
          <div>
            <h3 class="text-base font-bold text-gray-800">Hapus {{ effectiveSelectedCount }} Data Sekaligus?</h3>
            <p class="text-xs text-gray-500 mt-1">
              Seluruh <strong>{{ effectiveSelectedCount }}</strong> data hasil simulasi yang Anda pilih akan dihapus permanen dari basis data dan tidak dapat dikembalikan.
            </p>
          </div>
        </div>

        <div class="p-3 bg-red-50 border border-red-200 text-red-800 rounded-xl text-xs flex items-center gap-2">
          <svg class="w-4 h-4 text-red-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
          <span>Tindakan ini ditujukan untuk pembersihan data uji coba / simulasi massal.</span>
        </div>

        <div class="flex items-center justify-end gap-2 pt-2">
          <button 
            @click="showBulkDeleteModal = false" 
            :disabled="isDeleting"
            class="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold transition-colors"
          >
            Batal
          </button>
          <button 
            @click="confirmBulkDelete" 
            :disabled="isDeleting"
            class="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <span v-if="isDeleting">Menghapus {{ effectiveSelectedCount }} data...</span>
            <span v-else>Ya, Hapus Semua Terpilih</span>
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 7. MODAL RINCIAN LEMBAR PENGERJAAN SISWA                 -->
    <!-- ======================================================== -->
    <div v-if="detailTargetRow" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div class="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] flex flex-col">
        <div class="flex items-center justify-between pb-3 border-b">
          <div>
            <h3 class="text-base font-bold text-gray-800">Lembar Pengerjaan Siswa</h3>
            <p class="text-xs text-gray-500">{{ detailTargetRow.nama_siswa }} • {{ detailTargetRow.nama_sekolah || '-' }}</p>
          </div>
          <button @click="detailTargetRow = null" class="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <!-- Ringkasan Nilai Siswa -->
        <div class="grid grid-cols-3 gap-3 text-xs bg-gray-50 p-3 rounded-xl border border-gray-200 text-center">
          <div>
            <span class="text-gray-500 block">Benar</span>
            <span class="text-lg font-black text-emerald-700">{{ detailTargetRow.jumlah_benar }} Soal</span>
          </div>
          <div>
            <span class="text-gray-500 block">Total Soal</span>
            <span class="text-lg font-black text-gray-800">{{ detailTargetRow.total_soal }} Soal</span>
          </div>
          <div>
            <span class="text-gray-500 block">Durasi</span>
            <span class="text-lg font-black text-purple-700">{{ formatDuration(detailTargetRow.durasi_detik) }}</span>
          </div>
        </div>

        <!-- Rincian Jawaban Siswa -->
        <div class="flex-1 overflow-y-auto space-y-2 pr-1">
          <div class="text-xs font-bold text-gray-700 mb-2">Jawaban yang Dipilih Siswa:</div>
          <div v-if="!detailTargetRow.rincian_jawaban || Object.keys(detailTargetRow.rincian_jawaban).length === 0" class="text-center py-6 text-gray-400 text-xs">
            Tidak ada rekaman rincian butir soal untuk sesi ini.
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div 
              v-for="(val, key) in detailTargetRow.rincian_jawaban" 
              :key="key" 
              class="p-2.5 rounded-lg border text-xs flex items-center justify-between bg-white border-gray-200 shadow-2xs"
            >
              <span class="font-bold text-gray-700">No. {{ key }}</span>
              <span class="font-mono font-bold text-blue-700 truncate max-w-[120px]">{{ formatAnswerValue(val) }}</span>
            </div>
          </div>
        </div>

        <div class="pt-3 border-t flex justify-end">
          <button @click="detailTargetRow = null" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs">
            Tutup
          </button>
        </div>
      </div>
    </div>

    <!-- ======================================================== -->
    <!-- 8. MODAL PERINGATAN IDLE TIMEOUT (COUNTDOWN 60 DETIK)    -->
    <!-- ======================================================== -->
    <div v-if="showIdleWarningModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div class="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center space-y-4 animate-bounce-short">
        <div class="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
          <svg class="w-8 h-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <div>
          <h3 class="text-base font-bold text-gray-800">Sesi Segera Berakhir</h3>
          <p class="text-xs text-gray-500 mt-1">
            Tidak ada aktivitas selama 29 menit. Demi keamanan data simulasi Karanganyar, Anda akan otomatis keluar dalam:
          </p>
          <div class="text-4xl font-black text-amber-600 font-mono my-3">
            {{ idleSecondsLeft }}s
          </div>
        </div>
        <button 
          @click="resumeIdleSession" 
          class="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-all"
        >
          Lanjut Bekerja (Tetap Login)
        </button>
      </div>
    </div>

    <!-- FOOTER JEMPROT [BID SMP 2026] -->
    <AppFooter />

    <!-- Toast Notifikasi Ringan -->
    <div 
      v-if="toastMsg" 
      class="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-lg flex items-center gap-2"
    >
      <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
      <span>{{ toastMsg }}</span>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import AppFooter from '../components/AppFooter.vue'
import { supabase } from '../supabase.js'
import { 
  getRekapHasilUjian, 
  deleteHasilUjian, 
  deleteBatchHasilUjian, 
  deleteAllHasilUjian 
} from '../services/apiService.js'
import { 
  createIdleTimer, 
  broadcastSessionLogout, 
  listenCrossTabLogout,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginAttempts
} from '../services/sessionSecurity.js'
import * as XLSX from 'xlsx'

const router = useRouter()
const baseUrl = import.meta.env.BASE_URL

// State Autentikasi
const isLoggedIn = ref(false)
const userEmail = ref('')
const loginEmail = ref('')
const loginPassword = ref('')
const isLoading = ref(false)
const authError = ref('')
const loginCooldown = ref(0)
let cooldownTimer = null

// Data Rekapitulasi
const hasilList = ref([])
const isRefreshing = ref(false)
const toastMsg = ref('')

// Filter & Pencarian
const searchQuery = ref('')
const filterJenjang = ref('')
const filterMapel = ref('')
const filterSpecial = ref('all')

// Paginasi Sesuai Permintaan Mas Bos (25, 50, 100)
const pageSize = ref(25)
const currentPage = ref(1)

// Checkbox Multi-Level
const selectedIdMap = ref({})
const isAllFilteredSelected = ref(false)

// Modals
const deleteTargetRow = ref(null)
const showBulkDeleteModal = ref(false)
const detailTargetRow = ref(null)
const isDeleting = ref(false)

// Auto Logout Idle Timer (30 Menit) Sesuai Instruksi Mas Bos
const showIdleWarningModal = ref(false)
const idleSecondsLeft = ref(60)
let idleTracker = null
let stopCrossTabListen = null

// ========================================================
// LIFECYCLE
// ========================================================
onMounted(async () => {
  // 1. Cek sesi Supabase Auth yang tersimpan
  const { data: { session } } = await supabase.auth.getSession()
  if (session && session.user) {
    isLoggedIn.value = true
    userEmail.value = session.user.email
    await loadData()
    startIdleTracker()
  } else {
    isLoggedIn.value = false
  }

  // 2. Pantau perubahan auth
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session && session.user) {
      isLoggedIn.value = true
      userEmail.value = session.user.email
      if (hasilList.value.length === 0) {
        await loadData()
      }
      startIdleTracker()
    } else {
      isLoggedIn.value = false
      stopIdleTracker()
    }
  })

  // 3. Listener Multi-tab logout
  stopCrossTabListen = listenCrossTabLogout((msg) => {
    if (msg.type === 'LOGOUT') {
      isLoggedIn.value = false
      stopIdleTracker()
      showToast('Sesi telah keluar dari tab lain.')
    }
  })

  // 4. Cek rate limit login
  updateLoginCooldown()
})

onUnmounted(() => {
  stopIdleTracker()
  if (stopCrossTabListen) stopCrossTabListen()
  if (cooldownTimer) clearInterval(cooldownTimer)
})

// ========================================================
// IDLE TIMER AUTO LOGOUT (30 MENIT)
// ========================================================
function startIdleTracker() {
  stopIdleTracker()
  idleTracker = createIdleTimer({
    timeoutMs: 30 * 60 * 1000, // 30 Menit
    warningMs: 60 * 1000,      // 60 Detik sebelum habis
    onWarning: (sec) => {
      idleSecondsLeft.value = sec
      showIdleWarningModal.value = true
    },
    onTimeout: async () => {
      showIdleWarningModal.value = false
      await handleLogout()
      showToast('Sesi telah berakhir otomatis karena tidak ada aktivitas selama 30 menit.')
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

// ========================================================
// LOGIN & LOGOUT
// ========================================================
function updateLoginCooldown() {
  const rl = checkLoginRateLimit('marshal_rekap')
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

async function handleLogin() {
  authError.value = ''
  updateLoginCooldown()
  if (loginCooldown.value > 0) {
    authError.value = `Terlalu banyak percobaan gagal. Silakan tunggu ${loginCooldown.value} detik.`
    return
  }

  isLoading.value = true
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail.value.trim(),
      password: loginPassword.value.trim()
    })

    if (error) {
      const rl = recordFailedLogin('marshal_rekap')
      updateLoginCooldown()
      throw error
    }

    resetLoginAttempts('marshal_rekap')
    isLoggedIn.value = true
    userEmail.value = data.user.email
    await loadData()
    startIdleTracker()
  } catch (err) {
    authError.value = 'Login gagal: ' + (err.message || 'Periksa email dan password.')
  } finally {
    isLoading.value = false
  }
}

async function handleLogout() {
  stopIdleTracker()
  broadcastSessionLogout('marshal')
  await supabase.auth.signOut()
  isLoggedIn.value = false
  hasilList.value = []
  clearSelection()
}

// ========================================================
// DATA LOADING
// ========================================================
async function loadData() {
  isRefreshing.value = true
  try {
    hasilList.value = await getRekapHasilUjian()
  } catch (e) {
    console.error('Error load rekap:', e)
  } finally {
    isRefreshing.value = false
  }
}

function showToast(msg) {
  toastMsg.value = msg
  setTimeout(() => {
    toastMsg.value = ''
  }, 3500)
}

// ========================================================
// FILTER & COMPUTED
// ========================================================
const uniqueMapelList = computed(() => {
  const set = new Set()
  hasilList.value.forEach(r => {
    if (r.mapel) set.add(r.mapel)
  })
  return Array.from(set).sort()
})

const filteredList = computed(() => {
  return hasilList.value.filter(item => {
    // 1. Search Query
    if (searchQuery.value) {
      const q = searchQuery.value.toLowerCase().trim()
      const matchNama = item.nama_siswa && item.nama_siswa.toLowerCase().includes(q)
      const matchSekolah = item.nama_sekolah && item.nama_sekolah.toLowerCase().includes(q)
      const matchNpsn = item.npsn && item.npsn.toLowerCase().includes(q)
      const matchNisn = item.nisn && item.nisn.toLowerCase().includes(q)
      if (!matchNama && !matchSekolah && !matchNpsn && !matchNisn) return false
    }

    // 2. Filter Jenjang
    if (filterJenjang.value && item.jenjang !== filterJenjang.value) return false

    // 3. Filter Mapel
    if (filterMapel.value && item.mapel !== filterMapel.value) return false

    // 4. Filter Khusus
    if (filterSpecial.value === 'trial') {
      // Data coba: durasi < 60 detik atau nama mengandung kata test / coba
      const isShort = (item.durasi_detik || 0) < 60
      const isTestName = /test|coba|dummy|asdasd/i.test(item.nama_siswa || '')
      if (!isShort && !isTestName) return false
    } else if (filterSpecial.value === 'optimal') {
      const pct = (item.jumlah_benar / (item.total_soal || 1)) * 100
      if (pct < 80) return false
    } else if (filterSpecial.value === 'pengayaan') {
      const pct = (item.jumlah_benar / (item.total_soal || 1)) * 100
      if (pct >= 50) return false
    }

    return true
  })
})

// Metrik KPI
const totalDataCount = computed(() => hasilList.value.length)
const sdCount = computed(() => hasilList.value.filter(r => r.jenjang === 'SD').length)
const smpCount = computed(() => hasilList.value.filter(r => r.jenjang === 'SMP').length)

const avgBenarText = computed(() => {
  if (hasilList.value.length === 0) return '0 Soal'
  const sum = hasilList.value.reduce((acc, r) => acc + (Number(r.jumlah_benar) || 0), 0)
  const avg = (sum / hasilList.value.length).toFixed(1)
  return `${avg} Soal`
})

const avgPersentaseText = computed(() => {
  if (hasilList.value.length === 0) return '0%'
  const sumBenar = hasilList.value.reduce((acc, r) => acc + (Number(r.jumlah_benar) || 0), 0)
  const sumTotal = hasilList.value.reduce((acc, r) => acc + (Number(r.total_soal) || 20), 0)
  if (sumTotal === 0) return '0%'
  return `${Math.round((sumBenar / sumTotal) * 100)}%`
})

const avgDurasiText = computed(() => {
  if (hasilList.value.length === 0) return '0m'
  const sum = hasilList.value.reduce((acc, r) => acc + (Number(r.durasi_detik) || 0), 0)
  const avgSec = Math.round(sum / hasilList.value.length)
  return formatDuration(avgSec)
})

// ========================================================
// PAGINASI
// ========================================================
const totalPages = computed(() => {
  const count = Math.ceil(filteredList.value.length / pageSize.value)
  return count > 0 ? count : 1
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredList.value.slice(start, start + pageSize.value)
})

const paginationInfo = computed(() => {
  const total = filteredList.value.length
  if (total === 0) return { from: 0, to: 0 }
  const from = (currentPage.value - 1) * pageSize.value + 1
  const to = Math.min(currentPage.value * pageSize.value, total)
  return { from, to }
})

const visiblePages = computed(() => {
  const current = currentPage.value
  const total = totalPages.value
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1)
  }
  const pages = []
  pages.push(1)
  if (current > 3) pages.push('...')
  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  if (current < total - 2) pages.push('...')
  pages.push(total)
  return pages
})

// ========================================================
// MULTI-LEVEL CHECKBOX & BULK ACTIONS
// ========================================================
const isCurrentPageAllSelected = computed(() => {
  if (paginatedList.value.length === 0) return false
  if (isAllFilteredSelected.value) return true
  return paginatedList.value.every(row => selectedIdMap.value[row.id])
})

const effectiveSelectedCount = computed(() => {
  if (isAllFilteredSelected.value) {
    return filteredList.value.length
  }
  return Object.values(selectedIdMap.value).filter(Boolean).length
})

function toggleSelectRow(id) {
  isAllFilteredSelected.value = false
  if (selectedIdMap.value[id]) {
    delete selectedIdMap.value[id]
  } else {
    selectedIdMap.value[id] = true
  }
}

function toggleSelectCurrentPage() {
  const currentlyAll = isCurrentPageAllSelected.value
  isAllFilteredSelected.value = false
  paginatedList.value.forEach(row => {
    if (currentlyAll) {
      delete selectedIdMap.value[row.id]
    } else {
      selectedIdMap.value[row.id] = true
    }
  })
}

function selectAllFilteredData() {
  isAllFilteredSelected.value = true
  filteredList.value.forEach(row => {
    selectedIdMap.value[row.id] = true
  })
}

function clearSelection() {
  selectedIdMap.value = {}
  isAllFilteredSelected.value = false
}

// ========================================================
// PENGHAPUSAN DATA (INDIVIDUAL & BULK)
// ========================================================
function openSingleDeleteModal(row) {
  deleteTargetRow.value = row
}

async function confirmSingleDelete() {
  if (!deleteTargetRow.value) return
  isDeleting.value = true
  try {
    await deleteHasilUjian(deleteTargetRow.value.id)
    showToast(`Data simulasi ${deleteTargetRow.value.nama_siswa} berhasil dihapus.`)
    delete selectedIdMap.value[deleteTargetRow.value.id]
    deleteTargetRow.value = null
    await loadData()
  } catch (e) {
    showToast('Gagal menghapus data: ' + e.message)
  } finally {
    isDeleting.value = false
  }
}

function openBulkDeleteModal() {
  showBulkDeleteModal.value = true
}

async function confirmBulkDelete() {
  isDeleting.value = true
  try {
    if (isAllFilteredSelected.value) {
      // Hapus seluruh data yang cocok dengan filter aktif
      const idsToDelete = filteredList.value.map(r => r.id)
      await deleteBatchHasilUjian(idsToDelete)
      showToast(`Berhasil menghapus ${idsToDelete.length} data simulasi siswa.`)
    } else {
      const ids = Object.keys(selectedIdMap.value).filter(id => selectedIdMap.value[id])
      await deleteBatchHasilUjian(ids)
      showToast(`Berhasil menghapus ${ids.length} data simulasi siswa terpilih.`)
    }
    clearSelection()
    showBulkDeleteModal.value = false
    await loadData()
  } catch (e) {
    showToast('Gagal menghapus massal: ' + e.message)
  } finally {
    isDeleting.value = false
  }
}

// ========================================================
// DETAIL LEMBAR JAWABAN SISWA
// ========================================================
function openDetailModal(row) {
  detailTargetRow.value = row
}

function formatAnswerValue(val) {
  if (val === null || val === undefined || val === '') return '-'
  if (typeof val === 'object') return JSON.stringify(val)
  return String(val)
}

// ========================================================
// FORMATTERS & HELPER
// ========================================================
function formatDateTime(dtStr) {
  if (!dtStr) return '-'
  const d = new Date(dtStr)
  return d.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatDuration(sec) {
  if (!sec) return '0m'
  const m = Math.floor(sec / 60)
  const s = sec % 60
  if (m === 0) return `${s}s`
  return `${m}m ${s}s`
}

function getCapaianBadgeLabel(benar, total) {
  const t = total || 1
  const pct = (benar / t) * 100
  if (pct >= 80) return '🌟 Optimal'
  if (pct >= 50) return '📈 Berkembang'
  return '💡 Perlu Pendalaman'
}

function getCapaianBadgeClass(benar, total) {
  const t = total || 1
  const pct = (benar / t) * 100
  if (pct >= 80) return 'bg-emerald-100 text-emerald-800'
  if (pct >= 50) return 'bg-blue-100 text-blue-800'
  return 'bg-amber-100 text-amber-800'
}

// ========================================================
// EKSPOR EXCEL (.xlsx)
// ========================================================
function exportExcel() {
  if (filteredList.value.length === 0) {
    showToast('Tidak ada data yang dapat diekspor.')
    return
  }

  const exportData = filteredList.value.map((r, idx) => ({
    'No': idx + 1,
    'Waktu Selesai': formatDateTime(r.created_at),
    'NPSN': r.npsn || '-',
    'Nama Sekolah': r.nama_sekolah || '-',
    'Nama Siswa': r.nama_siswa || '-',
    'NISN': r.nisn || '-',
    'Jenjang': r.jenjang,
    'Mata Pelajaran': r.mapel,
    'Paket': r.paket,
    'Jumlah Benar': r.jumlah_benar,
    'Total Soal': r.total_soal,
    'Persentase Ketepatan': `${Math.round((r.jumlah_benar / (r.total_soal || 1)) * 100)}%`,
    'Predikat Simulasi': getCapaianBadgeLabel(r.jumlah_benar, r.total_soal),
    'Durasi Pengerjaan': formatDuration(r.durasi_detik)
  }))

  const ws = XLSX.utils.json_to_sheet(exportData)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Rekap Simulasi Siswa')

  const dateStr = new Date().toISOString().slice(0, 10)
  XLSX.writeFile(wb, `Rekap_Simulasi_TKA_Karanganyar_${dateStr}.xlsx`)
  showToast(`File Excel berhasil diunduh (${exportData.length} baris data).`)
}
</script>

<style scoped>
@keyframes bounceShort {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}
.animate-bounce-short {
  animation: bounceShort 0.5s ease-in-out;
}
</style>

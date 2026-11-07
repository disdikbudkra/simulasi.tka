<template>
  <div class="min-h-screen bg-slate-50 py-8 sm:py-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      <!-- Hero Banner -->
      <div class="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 text-white p-8 sm:p-14 shadow-2xl">
        <div class="relative z-10 max-w-3xl space-y-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs sm:text-sm font-semibold tracking-wide text-brand-200">
            <Sparkles class="w-4 h-4 text-amber-300" />
            <span>Platform Resmi Simulasi Tes Kemampuan Akademik</span>
          </div>

          <h1 class="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Simulasi Ujian TKA <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-300">
              Jenjang SD & SMP
            </span>
          </h1>

          <p class="text-base sm:text-lg text-brand-100 leading-relaxed font-normal">
            Sistem simulasi berbasis Computer-Based Test (CBT) modern dengan dukungan penuh rumus matematika interaktif (MathLive), navigasi lembar jawab dinamis, dan integrasi penyimpanan cloud real-time.
          </p>

          <div class="flex flex-wrap items-center gap-4 pt-2">
            <router-link
              to="/siswa"
              class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-base shadow-lg shadow-amber-400/30 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <UserCheck class="w-5 h-5 text-slate-900" />
              <span>Mulai Simulasi Siswa</span>
            </router-link>

            <router-link
              to="/guru"
              class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold text-base transition-all"
            >
              <PenSquare class="w-5 h-5 text-emerald-400" />
              <span>Dashboard Guru</span>
            </router-link>
          </div>
        </div>

        <!-- Decorative background glow -->
        <div class="absolute -right-24 -bottom-24 w-96 h-96 rounded-full bg-brand-500/20 blur-3xl pointer-events-none"></div>
        <div class="absolute right-1/3 -top-24 w-72 h-72 rounded-full bg-amber-400/10 blur-2xl pointer-events-none"></div>
      </div>

      <!-- Dua Pintu Masuk Utama (Siswa & Guru) -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Kartu Siswa -->
        <div class="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div class="space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpenCheck class="w-8 h-8" />
            </div>

            <div class="space-y-2">
              <span class="text-xs font-bold uppercase tracking-wider text-brand-600">Untuk Pelajar / Siswa</span>
              <h2 class="text-2xl font-bold text-slate-900">Ruang Ujian & Simulasi Mandiri</h2>
              <p class="text-sm text-slate-600 leading-relaxed">
                Latih kesiapan menghadapi TKA dengan pengalaman ujian CBT nyata. Dilengkapi timer hitung mundur, navigasi soal lengkap, status ragu-ragu, serta rekap skor dan pembahasan instan.
              </p>
            </div>

            <ul class="space-y-2 text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-100">
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Pilihan jenjang SD & SMP (Matematika, IPA, B. Indonesia)</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Format CBT standar dengan penanda ragu-ragu & nomor lompat</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Hasil skor nilai seketika & lembar pembahasan kunci jawaban</span>
              </li>
            </ul>
          </div>

          <div class="pt-6">
            <router-link
              to="/siswa"
              class="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-sm transition-colors"
            >
              <span>Masuk Halaman Siswa</span>
              <ArrowRight class="w-4 h-4" />
            </router-link>
          </div>
        </div>

        <!-- Kartu Guru -->
        <div class="bg-white rounded-2xl p-7 sm:p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div class="space-y-4">
            <div class="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileEdit class="w-8 h-8" />
            </div>

            <div class="space-y-2">
              <span class="text-xs font-bold uppercase tracking-wider text-emerald-600">Untuk Guru / Penulis Soal</span>
              <h2 class="text-2xl font-bold text-slate-900">Dashboard Penulis & Bank Soal</h2>
              <p class="text-sm text-slate-600 leading-relaxed">
                Kelola bank soal TKA dengan mudah. Masukkan rumus pecahan, akar, persamaan dengan virtual keyboard MathLive, sisipkan gambar soal, dan simpan langsung ke database Supabase.
              </p>
            </div>

            <ul class="space-y-2 text-xs sm:text-sm text-slate-600 pt-2 border-t border-slate-100">
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Editor MathLive interaktif dengan keyboard matematika visual</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dukungan opsi jawaban A hingga E + gambar ilustrasi tiap opsi</span>
              </li>
              <li class="flex items-center gap-2">
                <CheckCircle2 class="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Sinkronisasi otomatis ke Supabase Database & Supabase Storage</span>
              </li>
            </ul>
          </div>

          <div class="pt-6">
            <router-link
              to="/guru"
              class="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-sm transition-colors"
            >
              <span>Buka Dashboard Guru</span>
              <ArrowRight class="w-4 h-4" />
            </router-link>
          </div>
        </div>
      </div>

      <!-- Fitur Utama Grid -->
      <div class="space-y-6">
        <div class="text-center space-y-2">
          <h3 class="text-2xl font-bold text-slate-900">Fitur Keunggulan Sistem</h3>
          <p class="text-sm text-slate-500 max-w-2xl mx-auto">Dirancang untuk kelancaran asesmen digital di tingkat sekolah dasar dan menengah.</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <div class="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Calculator class="w-5 h-5" />
            </div>
            <h4 class="font-bold text-slate-900 text-base">Formula MathLive</h4>
            <p class="text-xs text-slate-500 leading-relaxed">
              Pengetikan rumus saintifik dan matematika standar internasional tanpa repot menghafal kode LaTeX rumit.
            </p>
          </div>

          <div class="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <div class="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock class="w-5 h-5" />
            </div>
            <h4 class="font-bold text-slate-900 text-base">Timer CBT Realtime</h4>
            <p class="text-xs text-slate-500 leading-relaxed">
              Pengatur durasi ujian otomatis yang memperingatkan siswa saat waktu tersisa sedikit dan auto-submit bila habis.
            </p>
          </div>

          <div class="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <div class="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Database class="w-5 h-5" />
            </div>
            <h4 class="font-bold text-slate-900 text-base">Database Cloud Supabase</h4>
            <p class="text-xs text-slate-500 leading-relaxed">
              Penyimpanan cloud PostgreSQL yang aman, cepat, dan tangguh untuk bank soal serta riwayat nilai siswa.
            </p>
          </div>

          <div class="bg-white p-6 rounded-xl border border-slate-200 space-y-3">
            <div class="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Award class="w-5 h-5" />
            </div>
            <h4 class="font-bold text-slate-900 text-base">Analisis Hasil Instan</h4>
            <p class="text-xs text-slate-500 leading-relaxed">
              Kalkulasi skor otomatis lengkap dengan rincian benar, salah, tidak terjawab, serta pembahasan kunci jawaban.
            </p>
          </div>
        </div>
      </div>

      <!-- Footer Info -->
      <footer class="pt-8 border-t border-slate-200 text-center text-xs text-slate-500 space-y-2">
        <p class="font-semibold text-slate-700">Simulasi TKA Karanganyar &bull; Aplikasi Asesmen Kemampuan Akademik</p>
        <p>Bidang Pembinaan SMP / SD Dinas Pendidikan & Kebudayaan Kabupaten Karanganyar</p>
      </footer>
    </div>
  </div>
</template>

<script setup>
import {
  Sparkles,
  UserCheck,
  PenSquare,
  BookOpenCheck,
  FileEdit,
  CheckCircle2,
  ArrowRight,
  Calculator,
  Clock,
  Database,
  Award
} from 'lucide-vue-next'
</script>

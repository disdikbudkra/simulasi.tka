# 🎓 Simulasi TKA (Tes Kemampuan Akademik) - Karanganyar

Aplikasi Simulasi Ujian CBT (Computer-Based Test) Tes Kemampuan Akademik (TKA) Jenjang SD & SMP berbasis web modern, dilengkapi editor rumus matematika saintifik **MathLive**, manajemen bank soal, serta integrasi database cloud **Supabase**.

---

## 🌟 Fitur Unggulan

### 1. 👨‍🎓 Portal Ujian CBT Siswa (`/siswa`)
* **Registrasi & Verifikasi Peserta**: Input Nama, NISN, Asal Sekolah, Jenjang (SD/SMP), Mata Pelajaran, dan Paket Soal.
* **Tampilan Ujian Standar ANBK / CBT**:
  - Timer countdown hitung mundur otomatis dengan indikator warna (peringatan saat < 10 menit & < 3 menit).
  - Navigasi nomor soal lompat cepat dengan visual status:
    - 🟩 **Hijau**: Sudah Dijawab
    - 🟨 **Kuning**: Ragu-Ragu
    - ⬜ **Abu-abu**: Belum Dijawab / Dilewati
  - Dukungan rumus matematika pecahan, akar, eksponen, serta gambar ilustrasi soal dan opsi.
  - Opsi jawaban pilihan ganda responsif (A, B, C, D untuk SD; A, B, C, D, E untuk SMP).
* **Lembar Hasil Nilai & Analisis Instan**:
  - Kalkulasi skor akhir otomatis (skala 0 - 100).
  - Rincian jumlah benar, jumlah salah, dan jumlah tidak dijawab.
  - Review detail jawaban siswa vs kunci jawaban resmi dilengkapi pembahasan.
  - Tombol **Cetak / Simpan PDF** langsung untuk arsip hasil ujian.

### 2. 👨‍🏫 Dashboard Guru & Penulis Soal (`/guru`)
* **Editor Rumus Matematika (MathLive)**: Mengetik rumus pecahan, akar, matriks, dan eksponen dengan mudah menggunakan virtual keyboard matematika interaktif.
* **Multi-Format Input**: Pertanyaan dan tiap opsi jawaban (A s/d E) mendukung kombinasi teks matematika + upload gambar ke Supabase Storage.
* **Kunci Jawaban & Pembahasan**: Penentuan kunci jawaban benar dengan radio button visual dan kolom pembahasan soal.
* **Bank Soal & Filter**: Kelola, cari, filter per jenjang/mapel, serta hapus soal dengan mudah.
* **Tombol Muat Contoh Soal Standar**: Menyediakan soal siap pakai untuk SD & SMP.
* **Rekap Nilai Siswa**: Melihat daftar siswa yang telah menyelesaikan simulasi beserta perolehan nilai mereka.
* **Dokumentasi & SQL Supabase**: Panduan konfigurasi tabel database dan izin storage.

---

## 🚀 Panduan Menjalankan Aplikasi

### 1. Prasyarat
- Node.js versi 18 ke atas
- npm

### 2. Jalankan Mode Pengembangan (Development)
```bash
npm run dev
```
Akses di browser: `http://localhost:5173`

### 3. Build untuk Produksi
```bash
npm run build
```
Hasil build siap pakai berada di folder `dist/`.

---

## 🗄️ Konfigurasi Supabase Cloud

File konfigurasi kredensial ada di [.env](file:///home/jemprot/ProductJP/Simulasi%20TKA/.env):
```env
VITE_SUPABASE_URL=https://dqrzxvjsjjibyllvinre.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Script Database & Storage (SQL Setup)
Buka menu **SQL Editor** pada project Supabase Anda, lalu jalankan isi file [supabase_setup.sql](file:///home/jemprot/ProductJP/Simulasi%20TKA/supabase_setup.sql). Script tersebut otomatis membuat:
1. Tabel `soal_tka`
2. Tabel `hasil_ujian`
3. Storage bucket `gambar_soal`
4. Row Level Security (RLS) policies agar aplikasi dapat membaca dan menulis data
5. Data awal (seed) soal standar SD & SMP.

---

## 📂 Struktur Direktori

```
Simulasi TKA/
├── index.html                   # Entry point HTML & Google Fonts
├── package.json                 # Dependencies & build scripts
├── postcss.config.js            # PostCSS plugin config
├── tailwind.config.js           # Tailwind CSS design system
├── vite.config.js               # Vite + Vue compiler configuration
├── supabase_setup.sql           # Schema SQL Supabase lengkap
├── .env                         # Konfigurasi Supabase
├── src/
│   ├── main.js                  # Inisialisasi Vue & Router
│   ├── App.vue                  # Root Layout & Navbar
│   ├── router.js                # Rute (/ , /siswa, /guru)
│   ├── index.css                # Styling global, MathLive & Print
│   ├── supabase.js              # Inisialisasi client Supabase
│   ├── components/
│   │   ├── Navbar.vue           # Header navigasi & logo
│   │   └── MathView.vue         # Komponen render rumus matematika
│   ├── services/
│   │   ├── defaultQuestions.js  # Bank soal bawaan (SD & SMP)
│   │   └── soalService.js       # Logika CRUD Supabase & Local fallback
│   └── views/
│       ├── Home.vue             # Beranda & Portal Pilihan Peran
│       ├── Guru.vue             # Dashboard Guru & Pembuat Soal
│       └── Siswa.vue            # Ruang Ujian CBT & Hasil Nilai Siswa
```

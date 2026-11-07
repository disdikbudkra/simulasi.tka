-- =========================================================================
-- SQL SETUP SCRIPT: SIMULASI TKA KARANGANYAR (SUPABASE DATABASE & STORAGE)
-- Salin dan jalankan seluruh script ini di Supabase SQL Editor:
-- https://supabase.com/dashboard/project/dqrzxvjsjjibyllvinre/sql
-- =========================================================================

-- 1. TABEL SOAL TKA
create table if not exists public.soal_tka (
  id uuid default gen_random_uuid() primary key,
  tingkat text not null, -- SD atau SMP
  mata_pelajaran text not null, -- Matematika, Bahasa Indonesia, IPA
  paket text not null, -- Paket 1, Paket 2, Paket 3, Tryout Akbar
  pertanyaan_teks text, 
  pertanyaan_gambar text, 
  opsi_a_teks text,
  opsi_a_gambar text,
  opsi_b_teks text,
  opsi_b_gambar text,
  opsi_c_teks text,
  opsi_c_gambar text,
  opsi_d_teks text,
  opsi_d_gambar text,
  opsi_e_teks text,
  opsi_e_gambar text,
  jawaban_benar text not null, -- A, B, C, D, E
  pembahasan text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. TABEL HASIL UJIAN SISWA
create table if not exists public.hasil_ujian (
  id uuid default gen_random_uuid() primary key,
  nama_siswa text not null,
  nisn text,
  sekolah text not null,
  tingkat text not null,
  mata_pelajaran text not null,
  paket text not null,
  jumlah_soal integer not null,
  jumlah_benar integer not null,
  jumlah_salah integer not null,
  jumlah_kosong integer not null,
  nilai numeric not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. AKTIFKAN ROW LEVEL SECURITY (RLS) & POLICY AKSES
alter table public.soal_tka enable row level security;
alter table public.hasil_ujian enable row level security;

-- Hapus policy lama jika ada untuk mencegah duplikasi
drop policy if exists "Allow public read on soal_tka" on public.soal_tka;
drop policy if exists "Allow public insert on soal_tka" on public.soal_tka;
drop policy if exists "Allow public update on soal_tka" on public.soal_tka;
drop policy if exists "Allow public delete on soal_tka" on public.soal_tka;

drop policy if exists "Allow public read on hasil_ujian" on public.hasil_ujian;
drop policy if exists "Allow public insert on hasil_ujian" on public.hasil_ujian;

-- Policy Publik untuk Tabel Soal TKA
create policy "Allow public read on soal_tka" on public.soal_tka for select using (true);
create policy "Allow public insert on soal_tka" on public.soal_tka for insert with check (true);
create policy "Allow public update on soal_tka" on public.soal_tka for update using (true);
create policy "Allow public delete on soal_tka" on public.soal_tka for delete using (true);

-- Policy Publik untuk Tabel Hasil Ujian
create policy "Allow public read on hasil_ujian" on public.hasil_ujian for select using (true);
create policy "Allow public insert on hasil_ujian" on public.hasil_ujian for insert with check (true);

-- 4. BUCKET STORAGE UNTUK FOTO/GAMBAR SOAL
insert into storage.buckets (id, name, public) 
values ('gambar_soal', 'gambar_soal', true)
on conflict (id) do update set public = true;

drop policy if exists "Allow public read on gambar_soal" on storage.objects;
drop policy if exists "Allow public insert on gambar_soal" on storage.objects;

create policy "Allow public read on gambar_soal" on storage.objects 
for select using (bucket_id = 'gambar_soal');

create policy "Allow public insert on gambar_soal" on storage.objects 
for insert with check (bucket_id = 'gambar_soal');

-- =========================================================================
-- SEED DATA CONTOH AWAL SOAL TKA
-- =========================================================================
insert into public.soal_tka (
  tingkat, mata_pelajaran, paket, 
  pertanyaan_teks, 
  opsi_a_teks, opsi_b_teks, opsi_c_teks, opsi_d_teks, opsi_e_teks, 
  jawaban_benar, pembahasan
) values 
(
  'SMP', 'Matematika', 'Paket 1',
  'Hasil dari operasi pecahan \\frac{3}{4} + \\frac{5}{6} - \\frac{2}{3} adalah...',
  '\\frac{11}{12}', '\\frac{7}{12}', '\\frac{13}{12}', '\\frac{5}{12}', '\\frac{9}{12}',
  'A', 'KPK dari 4, 6, dan 3 adalah 12. Jadi (9 + 10 - 8) / 12 = 11/12.'
),
(
  'SMP', 'Matematika', 'Paket 1',
  'Bentuk sederhana dari \\sqrt{75} + 2\\sqrt{12} - \\sqrt{27} adalah...',
  '4\\sqrt{3}', '6\\sqrt{3}', '5\\sqrt{3}', '7\\sqrt{3}', '3\\sqrt{3}',
  'B', '√75 = 5√3; 2√12 = 4√3; √27 = 3√3. Maka 5√3 + 4√3 - 3√3 = 6√3.'
),
(
  'SMP', 'IPA', 'Paket 1',
  'Sebuah benda bermassa 2 kg bergerak dengan percepatan 4 m/s^2. Berdasarkan Hukum II Newton F = m \\cdot a, besar gaya yang bekerja pada benda tersebut adalah...',
  '2 Newton', '6 Newton', '8 Newton', '10 Newton', '12 Newton',
  'C', 'F = m x a = 2 kg x 4 m/s² = 8 Newton.'
),
(
  'SD', 'Matematika', 'Paket 1',
  'Hasil dari 1.250 + 750 \\times 2 - 500 adalah...',
  '2.250', '2.500', '3.500', '2.750', '3.000',
  'A', 'Kerjakan perkalian dulu: 750 x 2 = 1.500. Lalu 1.250 + 1.500 - 500 = 2.750 - 500 = 2.250.'
)
on conflict do nothing;

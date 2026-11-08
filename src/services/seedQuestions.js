// Data 30 Butir Soal Try Out TKA 2026 - Jenjang SMP Matematika Paket 1
// Disusun langsung dari dokumen resmi Penulis Soal Disdikbud Karanganyar

export const SMP_MATEMATIKA_PAKET_1 = [
  {
    nomor_soal: 1,
    tipe_soal: '1', // PG Tunggal
    stimulus_html: '',
    pertanyaan_html: '<p>Diketahui beberapa bilangan berikut : <span class="math-inline">79\\%; \\frac{7}{9}; 2\\frac{3}{4}; -3; 0.82</span>. Jika bilangan–bilangan tersebut diurutkan dari bilangan terkecil ke bilangan terbesar, maka bilangan yang berada pada urutan ke-3 dan ke-4 adalah . . .</p>',
    options_json: [
      { id: 'A', text: '<span class="math-inline">\\frac{7}{9}</span> dan 79%' },
      { id: 'B', text: '<span class="math-inline">\\frac{7}{9}</span> dan 0,82' },
      { id: 'C', text: '79% dan 0,82' },
      { id: 'D', text: '<span class="math-inline">2\\frac{3}{4}</span> dan 79%' }
    ],
    kunci_jawaban_json: { jawaban: 'C', pembahasan: 'Urutan bilangan dari terkecil ke terbesar: -3; 7/9 (0.777...); 79% (0.79); 0.82; 2 3/4 (2.75). Bilangan urutan ke-3 = 79% dan ke-4 = 0,82.' }
  },
  {
    nomor_soal: 2,
    tipe_soal: '1',
    stimulus_html: '<p>Perhatikan gambar berikut:</p><div class="my-3 text-center"><img src="/images/soal/image1.jpeg" alt="Diskon Sepatu dan Tas" class="max-h-64 mx-auto rounded shadow border" /></div>',
    pertanyaan_html: '<p>Ibu membelikan Ani sebuah sepatu dan 1 tas di toko tersebut. Jika harga sepatu Rp150.000,00 dan harga sebuah tas adalah Rp225.000,00 dan ibu membayar dengan empat lembar uang seratus ribuan, maka uang kembalian yang diterima ibu adalah . . .</p>',
    options_json: [
      { id: 'A', text: 'Rp25.000,00' },
      { id: 'B', text: 'Rp35.000,00' },
      { id: 'C', text: 'Rp60.000,00' },
      { id: 'D', text: 'Rp70.000,00' }
    ],
    kunci_jawaban_json: { jawaban: 'D', pembahasan: 'Kunci jawaban: D.' }
  },
  {
    nomor_soal: 3,
    tipe_soal: '1',
    stimulus_html: '<p>Perhatikan pernyataan berikut:</p><div class="bg-gray-50 p-3 rounded border my-2 font-mono text-sm"><p>(i). <span class="math-inline">\\frac{7}{8} \\times 20\\% + 1\\frac{1}{2} : 3 = \\frac{135}{100}</span></p><p>(ii). <span class="math-inline">20\\% \\times 1\\frac{1}{2} + 3 : \\frac{7}{8} = 3\\frac{51}{70}</span></p><p>(iii). <span class="math-inline">1\\frac{1}{2} : \\frac{7}{8} - 3 \\times 20\\% = 1\\frac{8}{70}</span></p></div>',
    pertanyaan_html: '<p>Pernyataan yang benar adalah . . .</p>',
    options_json: [
      { id: 'A', text: '(i) dan (ii)' },
      { id: 'B', text: '(i) dan (iii)' },
      { id: 'C', text: '(ii) dan (iii)' },
      { id: 'D', text: '(i), (ii) dan (iii)' }
    ],
    kunci_jawaban_json: { jawaban: 'C', pembahasan: 'Kunci jawaban: C.' }
  },
  {
    nomor_soal: 4,
    tipe_soal: '1',
    stimulus_html: '',
    pertanyaan_html: '<p>Sinta diminta ibunya membeli perlengkapan dapur berupa gula 2kg, kecap 1 botol, telur 1 kg dan garam 1 bungkus di toko depan rumah. Dengan harga gula adalah Rp17.625,00/kg, kecap Rp5.200,00 per botol, Telur Rp24.650,00/kg dan garam Rp1.550,00/bungkus, sedangkan ibu memberinya uang 1 lembar uang seratus ribuan. Jika dihitung dengan pembulatan ke ribuan, estimasi uang kembalian Sinta adalah . . .</p>',
    options_json: [
      { id: 'A', text: 'Rp33.000,00' },
      { id: 'B', text: 'Rp30.000,00' },
      { id: 'C', text: 'Rp27.000,00' },
      { id: 'D', text: 'Rp25.000,00' }
    ],
    kunci_jawaban_json: { jawaban: 'A', pembahasan: 'Kunci jawaban: A.' }
  },
  {
    nomor_soal: 5,
    tipe_soal: '1',
    stimulus_html: '',
    pertanyaan_html: '<p>Faktorisasi prima dari <span class="math-inline">27 + 9</span> adalah . . .</p>',
    options_json: [
      { id: 'A', text: '<span class="math-inline">3^5</span>' },
      { id: 'B', text: '<span class="math-inline">2^2 \\times 3^2</span>' },
      { id: 'C', text: '<span class="math-inline">2^3 \\times 3^2</span>' },
      { id: 'D', text: '<span class="math-inline">3^3 + 3^2</span>' }
    ],
    kunci_jawaban_json: { jawaban: 'B', pembahasan: '27 + 9 = 36. Faktorisasi prima dari 36 = 2^2 x 3^2. Kunci: B.' }
  },
  {
    nomor_soal: 6,
    tipe_soal: '2', // PGK (Pilihan Ganda Kompleks / Multi-select)
    stimulus_html: '<p>Renovasi sebuah gedung sekolah direncanakan selesai dalam waktu 3 bulan (1 bulan = 30 hari) dengan 24 pekerja.</p>',
    pertanyaan_html: '<p>Berdasarkan pernyataan di atas, tentukan semua pernyataan berikut yang benar: <em>(Pilihan Ganda Kompleks - centang semua yang benar)</em></p>',
    options_json: [
      { id: 'A', text: 'Jika dipercepat menjadi 2 bulan, maka dibutuhkan tambahan pekerja sebanyak 12 orang' },
      { id: 'B', text: 'Jika dipercepat menjadi 2,5 bulan, maka dibutuhkan tambahan pekerja sebanyak 6 orang' },
      { id: 'C', text: 'Jika diberikan tambahan pekerja 16 orang maka waktu pengerjaan menjadi 2 bulan 12 hari' },
      { id: 'D', text: 'Jika pekerja dikurangi 4 orang, maka pekerjaan akan lebih lambat 1 bulan' }
    ],
    kunci_jawaban_json: { jawaban: ['A', 'C'], bobot_per_opsi: 0.5, pembahasan: 'Kunci jawaban: A dan C.' }
  },
  {
    nomor_soal: 7,
    tipe_soal: '1',
    stimulus_html: '<p>Perhatikan denah rumah bapak Ahmad berikut:</p><div class="my-3 text-center"><img src="/images/soal/image2.jpeg" alt="Denah Rumah Pak Ahmad" class="max-h-64 mx-auto rounded shadow border" /></div>',
    pertanyaan_html: '<p>Jika panjang rumah bagian depan adalah tiga kali panjang kamar dan lebar samping rumah 4,5 kali lebar kamar, dengan skala 1 : 150, maka luas tanah pak Ahmad adalah . . .</p>',
    options_json: [
      { id: 'A', text: '162 m²' },
      { id: 'B', text: '364,5 m²' },
      { id: 'C', text: '384,5 m²' },
      { id: 'D', text: '400 m²' }
    ],
    kunci_jawaban_json: { jawaban: 'B', pembahasan: 'Kunci: B (364,5 m²).' }
  },
  {
    nomor_soal: 8,
    tipe_soal: '1',
    stimulus_html: '',
    pertanyaan_html: '<p>Penyelesaian dari persamaan <span class="math-inline">4(2p - 3) = 3p + 8</span> adalah . . .</p>',
    options_json: [
      { id: 'A', text: '10' },
      { id: 'B', text: '5' },
      { id: 'C', text: '4' },
      { id: 'D', text: '2' }
    ],
    kunci_jawaban_json: { jawaban: 'C', pembahasan: '8p - 12 = 3p + 8 => 5p = 20 => p = 4. Kunci: C.' }
  },
  {
    nomor_soal: 9,
    tipe_soal: '1',
    stimulus_html: '',
    pertanyaan_html: '<p>Himpunan penyelesaian dari pertidaksamaan <span class="math-inline">2x + 12 > 3x + 5</span>, dengan x anggota bilangan asli adalah . . .</p>',
    options_json: [
      { id: 'A', text: '{1, 2, 3, 4, 5, 6, 7}' },
      { id: 'B', text: '{1, 2, 3, 4, 5, 6}' },
      { id: 'C', text: '{7, 8, 9, 10, . . .}' },
      { id: 'D', text: '{8, 9, 10, . . .}' }
    ],
    kunci_jawaban_json: { jawaban: 'B', pembahasan: '2x - 3x > 5 - 12 => -x > -7 => x < 7. Karena x anggota bilangan asli, maka HP = {1, 2, 3, 4, 5, 6}. Kunci: B.' }
  },
  {
    nomor_soal: 10,
    tipe_soal: '1',
    stimulus_html: '',
    pertanyaan_html: '<p>Jika x dan y penyelesaian dari sistem persamaan <span class="math-inline">2x + 3y = 19</span> dan <span class="math-inline">3x - y = 12</span>, maka nilai dari <span class="math-inline">x + y</span> adalah . . .</p>',
    options_json: [
      { id: 'A', text: '31' },
      { id: 'B', text: '19' },
      { id: 'C', text: '12' },
      { id: 'D', text: '7' }
    ],
    kunci_jawaban_json: { jawaban: 'A', pembahasan: 'Kunci jawaban: A.' }
  },
  {
    nomor_soal: 11,
    tipe_soal: '2', // PGK
    stimulus_html: '<p>Perhatikan bentuk aljabar berikut:</p><div class="bg-gray-50 p-3 rounded border my-2 font-mono text-sm"><p>(i). <span class="math-inline">2x(3x + 1) + x(2x - 1)</span></p><p>(ii). <span class="math-inline">3x(2x + 1) + 2x(x - 1)</span></p><p>(iii). <span class="math-inline">2x(x - 1) + x(x + 3)</span></p></div>',
    pertanyaan_html: '<p>Yang merupakan pernyataan yang senilai adalah . . . <em>(Pilihan Ganda Kompleks)</em></p>',
    options_json: [
      { id: 'A', text: '(i) dan (ii)' },
      { id: 'B', text: '(i) dan (iii)' },
      { id: 'C', text: '(ii) dan (iii)' },
      { id: 'D', text: '(i), (ii) dan (iii)' }
    ],
    kunci_jawaban_json: { jawaban: ['A', 'C'], bobot_per_opsi: 0.5, pembahasan: 'Kunci jawaban: A dan C.' }
  },
  {
    nomor_soal: 12,
    tipe_soal: '1',
    stimulus_html: '',
    pertanyaan_html: '<p>Hari membeli 4 buku tulis dan 15 pulpen seharga Rp230.000,00. Harga buku tulis dua kali harga pulpen. Toni membeli 10 buku tulis dan 8 pulpen dari toko yang sama dan jenis yang sama. Toni akan membayar . . .</p>',
    options_json: [
      { id: 'A', text: 'Rp180.000,00' },
      { id: 'B', text: 'Rp200.000,00' },
      { id: 'C', text: 'Rp260.000,00' },
      { id: 'D', text: 'Rp280.000,00' }
    ],
    kunci_jawaban_json: { jawaban: 'D', pembahasan: 'Kunci jawaban: D (Rp280.000,00).' }
  },
  {
    nomor_soal: 13,
    tipe_soal: '3', // Matriks Tabel Benar / Salah
    stimulus_html: '<p>Perhatikan diagram panah berikut:</p><div class="my-3 text-center"><img src="/images/soal/image3.jpeg" alt="Diagram Panah Relasi dan Fungsi" class="max-h-64 mx-auto rounded shadow border" /></div>',
    pertanyaan_html: '<p>Berdasarkan gambar tersebut, tentukan nilai kebenaran dari setiap pernyataan berikut:</p>',
    options_json: [
      { id: 'row_1', pernyataan: 'Domain = {5, 6, 7, 9}' },
      { id: 'row_2', pernyataan: 'Kodomain = {5, 6, 7, 8, 9}' },
      { id: 'row_3', pernyataan: 'Domain = {1, 2, 3, 4}' },
      { id: 'row_4', pernyataan: 'Range = {5, 6, 7, 8, 9}' }
    ],
    kunci_jawaban_json: {
      jawaban: {
        row_1: 'S', // Salah
        row_2: 'B', // Benar
        row_3: 'B', // Benar
        row_4: 'S'  // Salah
      },
      bobot_per_baris: 0.25,
      pembahasan: 'Kunci: S, B, B, S.'
    }
  },
  {
    nomor_soal: 14,
    tipe_soal: '1',
    stimulus_html: '',
    pertanyaan_html: '<p>Suku ke-20 dari barisan aritmetika 5, 11, 17, 23, … adalah . . .</p>',
    options_json: [
      { id: 'A', text: '117' },
      { id: 'B', text: '118' },
      { id: 'C', text: '119' },
      { id: 'D', text: '120' }
    ],
    kunci_jawaban_json: { jawaban: 'C', pembahasan: 'a = 5, b = 6. U20 = 5 + 19(6) = 5 + 114 = 119. Kunci: C.' }
  },
  {
    nomor_soal: 15,
    tipe_soal: '1',
    stimulus_html: '',
    pertanyaan_html: '<p>Dalam suatu gedung pertemuan banyak kursi di baris pertama 8, baris kedua 12, dan seterusnya bertambah 4, maka banyak kursi pada baris ke-10 adalah . . .</p>',
    options_json: [
      { id: 'A', text: '40' },
      { id: 'B', text: '42' },
      { id: 'C', text: '44' },
      { id: 'D', text: '46' }
    ],
    kunci_jawaban_json: { jawaban: 'C', pembahasan: 'a = 8, b = 4. U10 = 8 + 9(4) = 8 + 36 = 44. Kunci: C.' }
  },
  {
    nomor_soal: 16,
    tipe_soal: '1',
    stimulus_html: '<p>Perhatikan gambar berikut:</p><div class="my-3 text-center"><img src="/images/soal/image4.jpeg" alt="Sudut Segitiga" class="max-h-64 mx-auto rounded shadow border" /></div>',
    pertanyaan_html: '<p>Jika besar sudut BCD = 10°, maka besar sudut ABC = . . .</p>',
    options_json: [
      { id: 'A', text: '85°' },
      { id: 'B', text: '75°' },
      { id: 'C', text: '60°' },
      { id: 'D', text: '45°' }
    ],
    kunci_jawaban_json: { jawaban: 'A', pembahasan: 'Kunci jawaban: A (85°).' }
  },
  {
    nomor_soal: 17,
    tipe_soal: '1',
    stimulus_html: '',
    pertanyaan_html: '<p>Sebuah tiang berdiri tegak di atas permukaan tanah. Seutas tali diikatkan pada ujung tiang, yang kemudian dihubungkan pada sebuah patok di tanah. Jika panjang tali yang menghubungkan ujung tiang dengan patok 17 m dan jarak patok ke tiang 8 m, maka tinggi tiang adalah . . .</p>',
    options_json: [
      { id: 'A', text: '25 m' },
      { id: 'B', text: '20 m' },
      { id: 'C', text: '18 m' },
      { id: 'D', text: '15 m' }
    ],
    kunci_jawaban_json: { jawaban: 'D', pembahasan: 't = akar(17^2 - 8^2) = akar(289 - 64) = akar(225) = 15 m. Kunci: D.' }
  },
  {
    nomor_soal: 18,
    tipe_soal: '2', // PGK
    stimulus_html: '<p>Perhatikan bangun–bangun berikut:</p><div class="my-3 text-center"><img src="/images/soal/image5.jpeg" alt="Bangun Sebangun" class="max-h-64 mx-auto rounded shadow border" /></div>',
    pertanyaan_html: '<p>Pasangan bangun yang sebangun adalah . . . <em>(Pilihan Ganda Kompleks)</em></p>',
    options_json: [
      { id: 'A', text: '(i) dan (ii)' },
      { id: 'B', text: '(i) dan (iii)' },
      { id: 'C', text: '(ii) dan (iii)' },
      { id: 'D', text: '(iii) dan (iv)' }
    ],
    kunci_jawaban_json: { jawaban: ['A', 'D'], bobot_per_opsi: 0.5, pembahasan: 'Kunci jawaban: A dan D.' }
  },
  {
    nomor_soal: 19,
    tipe_soal: '1',
    stimulus_html: '<p>Perhatikan dua bangun berikut:</p><div class="my-3 text-center"><img src="/images/soal/image6.jpeg" alt="Dua Trapesium Sebangun" class="max-h-64 mx-auto rounded shadow border" /></div>',
    pertanyaan_html: '<p>Jika dua buah trapesium tersebut sebangun, maka nilai x adalah . . .</p>',
    options_json: [
      { id: 'A', text: '22,4 cm' },
      { id: 'B', text: '8,75 cm' },
      { id: 'C', text: '2,86 cm' },
      { id: 'D', text: '5,75 cm' }
    ],
    kunci_jawaban_json: { jawaban: 'B', pembahasan: 'Kunci jawaban: B (8,75 cm).' }
  },
  {
    nomor_soal: 20,
    tipe_soal: '1',
    stimulus_html: '<p>Perhatikan prisma berikut:</p><div class="my-3 text-center"><img src="/images/soal/image7.png" alt="Gambar Prisma" class="max-h-48 mx-auto rounded shadow border" /></div>',
    pertanyaan_html: '<p>Yang merupakan jaring–jaring prisma di atas adalah . . .</p>',
    options_json: [
      { id: 'A', text: '<div class="text-center font-bold mb-1">A</div><img src="/images/soal/image8.jpeg" class="max-h-36 mx-auto rounded border" />' },
      { id: 'B', text: '<div class="text-center font-bold mb-1">B</div><img src="/images/soal/image10.jpeg" class="max-h-36 mx-auto rounded border" />' },
      { id: 'C', text: '<div class="text-center font-bold mb-1">C</div><img src="/images/soal/image9.jpeg" class="max-h-36 mx-auto rounded border" />' },
      { id: 'D', text: '<div class="text-center font-bold mb-1">D</div><img src="/images/soal/image11.jpeg" class="max-h-36 mx-auto rounded border" />' }
    ],
    kunci_jawaban_json: { jawaban: 'C', pembahasan: 'Kunci jawaban: C.' }
  },
  {
    nomor_soal: 21,
    tipe_soal: '1',
    stimulus_html: '<p>Perhatikan gambar berikut:</p><div class="my-3 text-center"><img src="/images/soal/image12.jpeg" alt="Garis AC Bayangan dari AB" class="max-h-64 mx-auto rounded shadow border" /></div><p>Garis AC adalah bayangan dari garis AB.</p>',
    pertanyaan_html: '<p>Maka pernyataan yang benar berdasarkan gambar tersebut adalah . . .</p>',
    options_json: [
      { id: 'A', text: 'Garis AC merupakan hasil rotasi garis AB dengan pusat rotasi O(0,0) sejauh 90°' },
      { id: 'B', text: 'Garis AC merupakan hasil rotasi garis AB dengan pusat rotasi O(0,0) sejauh 270°' },
      { id: 'C', text: 'Garis AC merupakan hasil pencerminan garis AB terhadap sumbu x' },
      { id: 'D', text: 'Garis AC merupakan hasil translasi dari garis AB' }
    ],
    kunci_jawaban_json: { jawaban: 'C', pembahasan: 'Kunci: C (pencerminan terhadap sumbu x).' }
  },
  {
    nomor_soal: 22,
    tipe_soal: '1',
    stimulus_html: '<p>Perhatikan gambar berikut:</p><div class="my-3 text-center"><img src="/images/soal/image13.jpeg" alt="Bangun Datar Gabungan" class="max-h-64 mx-auto rounded shadow border" /></div>',
    pertanyaan_html: '<p>Keliling bangun di atas adalah . . .</p>',
    options_json: [
      { id: 'A', text: '134,8 cm' },
      { id: 'B', text: '103,4 cm' },
      { id: 'C', text: '76 cm' },
      { id: 'D', text: '72 cm' }
    ],
    kunci_jawaban_json: { jawaban: 'B', pembahasan: 'Kunci jawaban: B (103,4 cm).' }
  },
  {
    nomor_soal: 23,
    tipe_soal: '1',
    stimulus_html: '<p>Gambar berikut adalah gambar taman di suatu komplek perumahan:</p><div class="my-3 text-center"><img src="/images/soal/image14.jpeg" alt="Denah Taman Komplek" class="max-h-64 mx-auto rounded shadow border" /></div>',
    pertanyaan_html: '<p>Jika taman berbentuk persegi dengan panjang sisi 30 m dan jari–jari kolam di setiap sudutnya adalah 5 m, maka luas taman di luar kolam adalah . . .</p>',
    options_json: [
      { id: 'A', text: '900 m²' },
      { id: 'B', text: '821,5 m²' },
      { id: 'C', text: '314 m²' },
      { id: 'D', text: '235,5 m²' }
    ],
    kunci_jawaban_json: { jawaban: 'B', pembahasan: 'Luas persegi = 30x30 = 900 m2. Empat seperempat lingkaran = 1 lingkaran penuh jari2 5 m => Luas = 3.14 x 25 = 78.5 m2. Luas sisa = 900 - 78.5 = 821,5 m2. Kunci: B.' }
  },
  {
    nomor_soal: 24,
    tipe_soal: '1',
    stimulus_html: '<p>Perhatikan gambar ember berikut:</p><div class="my-3 text-center"><img src="/images/soal/image15.png" alt="Gambar Ember" class="max-h-48 mx-auto rounded shadow border mb-2" /><p class="text-xs text-gray-500">Jika ember tersebut didapatkan dari kerucut yang terpotong seperti gambar di bawah ini:</p><img src="/images/soal/image16.jpeg" alt="Kerucut Terpotong" class="max-h-48 mx-auto rounded shadow border" /></div>',
    pertanyaan_html: '<p>Maka volume ember tersebut adalah . . .</p>',
    options_json: [
      { id: 'A', text: '9420 cm³' },
      { id: 'B', text: '8841,25 cm³' },
      { id: 'C', text: '7087,50 cm³' },
      { id: 'D', text: '588,75 cm³' }
    ],
    kunci_jawaban_json: { jawaban: 'B', pembahasan: 'Kunci jawaban: B (8841,25 cm³).' }
  },
  {
    nomor_soal: 25,
    tipe_soal: '1',
    stimulus_html: '<p>Sekelompok siswa sedang mendapatkan tugas membuat diagram batang tentang profesi/pekerjaan orang tua teman sekelasnya.</p>',
    pertanyaan_html: '<p>Jika siswa tersebut akan membuat diagram batang dengan objek penelitian adalah teman sekelasnya, maka pertanyaan kuesioner yang paling tepat diajukan adalah . . .</p>',
    options_json: [
      { id: 'A', text: 'Ayahmu bekerja di mana?' },
      { id: 'B', text: 'Berapa gaji ayahmu?' },
      { id: 'C', text: 'Ayahmu polisikah?' },
      { id: 'D', text: 'Apa pekerjaan ayahmu?' }
    ],
    kunci_jawaban_json: { jawaban: 'D', pembahasan: 'Kunci jawaban: D (Apa pekerjaan ayahmu?).' }
  },
  {
    nomor_soal: 26,
    tipe_soal: '1',
    stimulus_html: '',
    pertanyaan_html: '<p>Perhatikan data nilai berikut: <br/><strong>75, 80, 65, 75, 75, 85, 85, 70, 60, 85, 95, 55, 70</strong>.<br/> Rerata (mean) nilai dari kelompok data tersebut adalah . . .</p>',
    options_json: [
      { id: 'A', text: '60' },
      { id: 'B', text: '65' },
      { id: 'C', text: '75' },
      { id: 'D', text: '77' }
    ],
    kunci_jawaban_json: { jawaban: 'C', pembahasan: 'Total = 975 / 13 = 75. Kunci: C.' }
  },
  {
    nomor_soal: 27,
    tipe_soal: '1',
    stimulus_html: '',
    pertanyaan_html: '<p>Data berat badan dari sekelompok calon peserta ekstrakurikuler pencak silat adalah sebagai berikut: <strong>55, 65, 50, 50, 60, 57, 45, 50, 65, 60, 57</strong>. Ternyata ada beberapa anak yang mempunyai berat badan 63 belum dihitung. Jika beberapa anak tersebut dimasukkan, nilai rata-ratanya menjadi 57,5. Maka banyaknya calon anggota yang ditambahkan sebanyak . . .</p>',
    options_json: [
      { id: 'A', text: '9' },
      { id: 'B', text: '6' },
      { id: 'C', text: '4' },
      { id: 'D', text: '3' }
    ],
    kunci_jawaban_json: { jawaban: 'D', pembahasan: 'Kunci jawaban: D (3 orang).' }
  },
  {
    nomor_soal: 28,
    tipe_soal: '2', // PGK
    stimulus_html: '<p>Diberikan suatu data: <strong>15, 20, 24, 30, 35, 35, 25, 25, 25, 45</strong>. Setelah ditambahkan 3 data baru yaitu <strong>24, 27, dan 34</strong>.</p>',
    pertanyaan_html: '<p>Maka pernyataan yang benar adalah . . . <em>(Pilihan Ganda Kompleks)</em></p>',
    options_json: [
      { id: 'A', text: 'Rata–ratanya akan naik' },
      { id: 'B', text: 'Mediannya akan berubah' },
      { id: 'C', text: 'Modusnya akan sama' },
      { id: 'D', text: 'Rata–ratanya akan turun' }
    ],
    kunci_jawaban_json: { jawaban: ['A', 'C'], bobot_per_opsi: 0.5, pembahasan: 'Kunci jawaban: A dan C.' }
  },
  {
    nomor_soal: 29,
    tipe_soal: '1',
    stimulus_html: '',
    pertanyaan_html: '<p>Dalam sebuah kotak terdapat 5 kelereng kuning, 12 kelereng merah dan 3 kelereng hijau. Sebuah kelereng kuning dan sebuah kelereng hijau diambil dan tidak dikembalikan lagi. Jika diambil satu kelereng lagi secara acak, peluang terambil kelereng kuning adalah . . .</p>',
    options_json: [
      { id: 'A', text: '<span class="math-inline">\\frac{2}{9}</span>' },
      { id: 'B', text: '<span class="math-inline">\\frac{4}{20}</span>' },
      { id: 'C', text: '<span class="math-inline">\\frac{4}{19}</span>' },
      { id: 'D', text: '<span class="math-inline">\\frac{5}{20}</span>' }
    ],
    kunci_jawaban_json: { jawaban: 'A', pembahasan: 'Kuning sisa = 4, Total sisa kelereng = 18. Peluang = 4/18 = 2/9. Kunci: A.' }
  },
  {
    nomor_soal: 30,
    tipe_soal: '1',
    stimulus_html: '<p>Sebuah dadu yang mempunyai 6 sisi, masing–masing sisinya bertuliskan angka mulai angka 11 sampai 16 seperti gambar berikut:</p><div class="my-3 text-center"><img src="/images/soal/image17.jpeg" alt="Dadu Angka 11 sampai 16" class="max-h-48 mx-auto rounded shadow border" /></div><p>Jika dadu tersebut dilemparkan berkali–kali sehingga hasilnya seperti pada tabel berikut:</p><div class="overflow-x-auto my-3"><table class="min-w-full border border-gray-300 text-center text-sm"><tr class="bg-blue-50 font-bold"><td class="border p-2">Mata Dadu</td><td class="border p-2">11</td><td class="border p-2">12</td><td class="border p-2">13</td><td class="border p-2">14</td><td class="border p-2">15</td><td class="border p-2">16</td></tr><tr><td class="border p-2 font-bold bg-gray-50">Banyak Muncul</td><td class="border p-2">15</td><td class="border p-2">12</td><td class="border p-2">17</td><td class="border p-2">15</td><td class="border p-2">11</td><td class="border p-2">15</td></tr></table></div>',
    pertanyaan_html: '<p>Maka frekuensi relatif muncul angka 15 adalah . . .</p>',
    options_json: [
      { id: 'A', text: '<span class="math-inline">\\frac{11}{85}</span>' },
      { id: 'B', text: '<span class="math-inline">\\frac{14}{15}</span>' },
      { id: 'C', text: '<span class="math-inline">\\frac{15}{85}</span>' },
      { id: 'D', text: '<span class="math-inline">\\frac{16}{85}</span>' }
    ],
    kunci_jawaban_json: { jawaban: 'C', pembahasan: 'Kunci jawaban: C.' }
  }
];

// Contoh Soal Tambahan untuk Paket 2 (Termasuk Soal Menjodohkan Tipe 5)
export const SMP_MATEMATIKA_PAKET_2 = [
  {
    nomor_soal: 1,
    tipe_soal: '5', // Menjodohkan / Matching Pairs
    stimulus_html: '<p>Jodohkan bangun datar berikut dengan rumus kelilingnya yang tepat:</p>',
    pertanyaan_html: '<p>Tarik garis atau pasangkan pernyataan di Kolom Kiri dengan rumus yang tepat di Kolom Kanan:</p>',
    options_json: {
      left: [
        { id: 'L1', text: 'Persegi (sisi s)' },
        { id: 'L2', text: 'Persegi Panjang (panjang p, lebar l)' },
        { id: 'L3', text: 'Lingkaran (jari-jari r)' }
      ],
      right: [
        { id: 'R1', text: 'K = 4 × s' },
        { id: 'R2', text: 'K = 2 × (p + l)' },
        { id: 'R3', text: 'K = 2 × π × r' },
        { id: 'R4', text: 'K = s × s' }
      ]
    },
    kunci_jawaban_json: {
      pairs: {
        L1: 'R1',
        L2: 'R2',
        L3: 'R3'
      },
      bobot_per_pasang: 0.333,
      pembahasan: 'Persegi: 4s; Persegi Panjang: 2(p+l); Lingkaran: 2πr.'
    }
  },
  {
    nomor_soal: 2,
    tipe_soal: '1',
    stimulus_html: '',
    pertanyaan_html: '<p>Hasil dari <span class="math-inline">(-12) + 7 \\times (-3)</span> adalah . . .</p>',
    options_json: [
      { id: 'A', text: '-33' },
      { id: 'B', text: '-15' },
      { id: 'C', text: '9' },
      { id: 'D', text: '15' }
    ],
    kunci_jawaban_json: { jawaban: 'A', pembahasan: '(-12) + (-21) = -33. Kunci: A.' }
  }
];

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export async function generateResultPDF({
  nama_siswa,
  jenjang,
  mapel,
  paket,
  jumlah_benar,
  total_soal,
  durasi_detik,
  tanggal
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  })

  // Format durasi
  const menit = Math.floor((durasi_detik || 0) / 60)
  const detik = (durasi_detik || 0) % 60
  const durasiFormatted = `${menit} menit ${detik} detik`

  // Format tanggal jika belum ada
  const tglFormatted = tanggal || new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })

  // 1. Header Latihan Modern & Bersih (Tanpa Kop Dinas & Tanpa Logo Pemkab)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(16)
  doc.setTextColor(30, 58, 138) // Navy Blue
  doc.text('LEMBAR HASIL LATIHAN SIMULASI TKA', 105, 20, { align: 'center' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139) // Slate Gray
  doc.text(`Tes Kemampuan Akademik (TKA) • ${jenjang || 'SD/SMP'} ${mapel || ''}`, 105, 27, { align: 'center' })

  // Garis aksen pemisah bersih
  doc.setDrawColor(203, 213, 225)
  doc.setLineWidth(0.5)
  doc.line(16, 32, 194, 32)

  // 2. Tabel Identitas Peserta Latihan (Tanpa NPSN, Tanpa NISN, Tanpa Asal Sekolah)
  const dataIdentitas = [
    ['Nama Peserta', ':', (nama_siswa || 'Peserta').toUpperCase()],
    ['Jenjang & Mata Pelajaran', ':', `${jenjang || '-'} - ${mapel || '-'}`],
    ['Paket Latihan', ':', paket || 'Paket 1'],
    ['Waktu Latihan', ':', tglFormatted],
    ['Durasi Pengerjaan', ':', durasiFormatted]
  ]

  autoTable(doc, {
    startY: 38,
    body: dataIdentitas,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 2,
      textColor: [51, 65, 85]
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 55 },
      1: { cellWidth: 5 },
      2: { cellWidth: 118 }
    },
    margin: { left: 16, right: 16 }
  })

  // 3. Kotak Ringkasan Capaian Latihan
  const cardY = doc.lastAutoTable.finalY + 8
  const salahCount = Math.max(0, (total_soal || 0) - (jumlah_benar || 0))

  // Background Box
  doc.setFillColor(248, 250, 252) // Light Slate
  doc.setDrawColor(203, 213, 225)
  doc.setLineWidth(0.6)
  doc.roundedRect(16, cardY, 178, 62, 3, 3, 'FD')

  // Label Header Box
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.setTextColor(30, 41, 59)
  doc.text('RINGKASAN CAPAIAN LATIHAN', 105, cardY + 9, { align: 'center' })

  // Badge Keterangan Utama: "Benar X dari Y Soal"
  doc.setFontSize(22)
  doc.setTextColor(16, 120, 60) // Hijau Edukatif
  doc.text(`Benar ${jumlah_benar} dari ${total_soal} Soal`, 105, cardY + 23, { align: 'center' })

  // Garis pemisah dalam box
  doc.setDrawColor(226, 232, 240)
  doc.setLineWidth(0.3)
  doc.line(30, cardY + 29, 180, cardY + 29)

  // Rincian Butir Soal
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(71, 85, 105)
  doc.text(`• Total Butir Soal Dikerjakan : ${total_soal} Soal`, 35, cardY + 36)
  doc.text(`• Jumlah Jawaban Benar : ${jumlah_benar} Soal`, 35, cardY + 42)
  doc.text(`• Jawaban Belum Tepat / Kosong : ${salahCount} Soal`, 35, cardY + 48)

  // Kalimat Penjelas Bersahabat
  doc.setFont('helvetica', 'italic')
  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  doc.text(
    `* Dari total ${total_soal} butir soal latihan pada paket ini, kamu telah berhasil menjawab ${jumlah_benar} butir soal dengan benar.`,
    105,
    cardY + 56,
    { align: 'center' }
  )

  // 4. Catatan Evaluasi Mandiri (Bukan Catatan Resmi Dinas & Tanpa Tanda Tangan)
  const noteY = cardY + 70
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(10)
  doc.setTextColor(51, 65, 85)
  doc.text('Catatan Belajar:', 16, noteY)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  doc.text('1. Lembar ini merupakan rekaman latihan mandiri untuk mengukur kesiapan dan pemahaman materi.', 16, noteY + 6)
  doc.text('2. Gunakan hasil simulasi ini sebagai bahan evaluasi untuk memperdalam materi yang belum dikuasai.', 16, noteY + 12)
  doc.text('3. Teruslah berlatih secara konsisten untuk mengasah kemampuan akademikmu!', 16, noteY + 18)

  // 5. Footer Watermark Kecil di Bawah
  doc.setFontSize(8)
  doc.setTextColor(148, 163, 184)
  doc.text(`Dicetak otomatis melalui Simulasi TKA • ${tglFormatted}`, 105, 280, { align: 'center' })

  // 6. Simpan File PDF
  const safeName = (nama_siswa || 'Peserta').replace(/[^a-zA-Z0-9]/g, '_')
  doc.save(`Hasil_Latihan_TKA_${safeName}.pdf`)
}

import { jsPDF } from 'jspdf'
import autoTable from 'jspdf-autotable'

export async function generateResultPDF({
  nama_siswa,
  nisn,
  npsn,
  nama_sekolah,
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

  // 1. Header & Kop Surat Disdikbud Karanganyar
  // Coba muat logo Karanganyar jika tersedia
  try {
    const base = import.meta.env.BASE_URL || '/'
    const logoImg = await loadImgBase64(`${base}images/logo_karanganyar.png`, 800)
    if (logoImg) {
      doc.addImage(logoImg, 'PNG', 16, 12, 22, 26)
    }
  } catch (e) {
    // Lewatkan jika logo belum siap
  }

  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('PEMERINTAH KABUPATEN KARANGANYAR', 110, 16, { align: 'center' })
  doc.setFontSize(15)
  doc.text('DINAS PENDIDIKAN DAN KEBUDAYAAN', 110, 23, { align: 'center' })
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.text('Kompleks Perkantoran Cangakan, Karanganyar, Jawa Tengah', 110, 29, { align: 'center' })
  doc.text('Laman Resmi: https://disdikbud.karanganyarkab.go.id  |  Email: disdik.karanganyar@gmail.com', 110, 34, { align: 'center' })

  // Garis batas kop surat (Double line)
  doc.setLineWidth(0.8)
  doc.line(15, 39, 195, 39)
  doc.setLineWidth(0.3)
  doc.line(15, 40.5, 195, 40.5)

  // 2. Judul Dokumen
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(13)
  doc.text('LEMBAR HASIL SIMULASI TES KEMAMPUAN AKADEMIK (TKA)', 105, 50, { align: 'center' })
  doc.setFontSize(11)
  doc.setTextColor(40, 70, 120)
  doc.text(`TAHUN AJARAN 2026/2027`, 105, 56, { align: 'center' })
  doc.setTextColor(0, 0, 0)

  // 3. Tabel Identitas Peserta
  const dataIdentitas = [
    ['Nama Peserta', ':', (nama_siswa || '-').toUpperCase()]
  ]

  if (nisn) {
    dataIdentitas.push(['Nomor Induk Siswa Nasional (NISN)', ':', nisn])
  }
  if (npsn) {
    dataIdentitas.push(['Nomor Pokok Sekolah Nasional (NPSN)', ':', npsn])
  }
  if (nama_sekolah) {
    dataIdentitas.push(['Asal Sekolah', ':', nama_sekolah])
  }

  dataIdentitas.push(
    ['Jenjang / Mata Pelajaran', ':', `${jenjang || '-'} / ${mapel || '-'}`],
    ['Paket Soal', ':', paket || 'Paket 1'],
    ['Waktu Pelaksanaan', ':', tglFormatted],
    ['Durasi Pengerjaan', ':', durasiFormatted]
  )

  autoTable(doc, {
    startY: 63,
    body: dataIdentitas,
    theme: 'plain',
    styles: {
      fontSize: 10,
      cellPadding: 1.5,
      textColor: [30, 30, 30]
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 70 },
      1: { cellWidth: 5 },
      2: { cellWidth: 105 }
    },
    margin: { left: 16, right: 16 }
  })

  // 4. Kotak Hasil Capaian (HANYA JUMLAH BENAR - TANPA NILAI 0-100 & TANPA KUNCI)
  const currentY = doc.lastAutoTable.finalY + 10

  // Background Box
  doc.setFillColor(242, 247, 255)
  doc.setDrawColor(50, 102, 152)
  doc.setLineWidth(0.6)
  doc.roundedRect(16, currentY, 178, 48, 3, 3, 'FD')

  // Label Header Box
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(30, 60, 100)
  doc.text('RINGKASAN CAPAIAN SIMULASI', 105, currentY + 10, { align: 'center' })

  // Badge Jumlah Benar
  doc.setFontSize(28)
  doc.setTextColor(16, 120, 60) // Hijau
  doc.text(`${jumlah_benar}`, 105, currentY + 26, { align: 'center' })

  doc.setFontSize(12)
  doc.setTextColor(60, 60, 60)
  doc.text(`dari total ${total_soal} butir soal yang dikerjakan`, 105, currentY + 34, { align: 'center' })

  doc.setFont('helvetica', 'italic')
  doc.setFontSize(9)
  doc.setTextColor(110, 110, 110)
  doc.text('* Lembar hasil ini hanya memuat jumlah jawaban benar sebagai tolok ukur kesiapan simulasi akademik.', 105, currentY + 42, { align: 'center' })

  // 5. Catatan Dinas & Tanda Pengesahan
  const noteY = currentY + 58
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(80, 80, 80)
  doc.text('Catatan Resmi:', 16, noteY)
  doc.text('1. Dokumen ini merupakan bukti keikutsertaan simulasi TKA Disdikbud Kabupaten Karanganyar.', 16, noteY + 5)
  doc.text('2. Kerahasiaan butir soal dan kunci jawaban dilindungi oleh peraturan penyelenggaraan asesmen.', 16, noteY + 10)
  doc.text('3. Gunakan hasil simulasi ini sebagai bahan evaluasi dan pengayaan materi di sekolah masing-masing.', 16, noteY + 15)

  // Tanggal & Tanda Tangan Proktor
  const ttdY = noteY + 28
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(0, 0, 0)
  doc.text('Karanganyar, ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }), 140, ttdY)
  doc.text('Proktor / Panitia Pelaksana,', 140, ttdY + 6)

  // Garis TTD
  doc.setFont('helvetica', 'bold')
  doc.text('DISDIKBUD KAB. KARANGANYAR', 140, ttdY + 30)

  // 6. Unduh berkas PDF
  const safeName = (nama_siswa || 'Peserta').replace(/[^a-zA-Z0-9]/g, '_')
  doc.save(`Lembar_Hasil_TKA_${safeName}.pdf`)
}

// Helper untuk load gambar logo ke Base64 dengan timeout pengaman
function loadImgBase64(url, timeoutMs = 800) {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(null), timeoutMs)
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = () => {
      clearTimeout(timer)
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        resolve(canvas.toDataURL('image/png'))
      } catch (err) {
        resolve(null)
      }
    }
    img.onerror = () => {
      clearTimeout(timer)
      resolve(null)
    }
    img.src = url
  })
}

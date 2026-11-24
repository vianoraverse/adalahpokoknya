# Catatan Implementasi

Website dibangun dari `LAPORAN_BAB_1-3.md` (isi Google Docs per 24 November 2026). Catatan ini mencatat
bagian yang masih perlu diisi tim dan keputusan yang diambil ketika isi laporan tidak seragam.

## Model Perhitungan yang Dipakai

Mengikuti Subbab 2.7 dan 3.5 laporan (`behavioral-model/engine.js`):

1. Nilai indikator = rata-rata jawaban butirnya (1–5), dinormalisasi `x' = (x − 1) / 4 × 100`.
2. Nilai Y, X1, dan X2 = rata-rata nilai indikator anggotanya, tanpa bobot.
3. Nilai soft skill gabungan `X = (X1 + X2) / 2`.
4. Kategori: Perlu Dikembangkan (< 56), Cukup Cocok (56 sampai < 76), Sangat Cocok (≥ 76), untuk Y, X1, X2,
   dan X. Ambang dapat diubah admin.
5. Indikator prioritas: tiga soft skill dengan nilai terendah; bila seri, urutan mengikuti nomor indikator
   pada Tabel 2.3.
6. Tabel keputusan R1–R4 dari kombinasi Y dan X terhadap batas 76, ditambah aturan tambahan bila X1 < 56 atau
   X2 < 56.
7. Penjelasan hasil disusun dari templat per aturan (tabel `templat_penjelasan`), diisi label kategori, nama
   karier pilihan, dan tiga indikator prioritas. Tanpa AI dan tanpa angka.

Nilai angka hanya disimpan di backend (tabel `hasil_asesmen`) untuk pemetaan kategori dan analisis. Mahasiswa
hanya melihat label kategori. Ringkasan admin menampilkan rata-rata nilai gabungan tanpa nama.

Model lama (bobot, profil kebutuhan soft skill per karier, gap, SFS, karier paling cocok, dan karier alternatif)
sudah dihapus dari website. Basis data lama diperbarui otomatis saat server menyala: tabel model lama dihapus,
ambang bawaan 50/75 diganti 56/76, dan hasil tes lama dihitung ulang dari jawaban yang tersimpan.

## Perlu Dilengkapi Tim

1. **Teks rekomendasi R1–R4, aturan tambahan, templat penjelasan, dan saran per soft skill** ditulis sebagai
   isi awal dan dapat diubah lewat Admin > Ambang dan aturan.
2. **Analisis hubungan variabel (Subbab 3.5.4)**, yaitu korelasi dan regresi X1, X2 terhadap Y, dilakukan
   di luar aplikasi. Admin > Ringkasan hasil hanya menampilkan sebaran dan rata-rata gabungan.

## Keputusan Saat Isi Laporan Berbeda Antarbagian

| Bagian laporan | Temuan | Implementasi |
| --- | --- | --- |
| 3.8.2 Prototype dan 3.9.1 | Menyebut CTA dan data *roadmap* karier per peran, tetapi isi *roadmap* tidak dijelaskan di bagian lain | Atas keputusan tim, *roadmap* belum dibuat |
| 3.8.2 Prototype | *Hero section* hanya menyebut badge Y, X1, dan X2 | Mengikuti FR-06 dan 3.8.1: kategori Y, X1, X2, dan X ditampilkan |
| 3.9.2 Lingkungan pengembangan | Menyebut JavaScript/TypeScript dan React.js | Atas permintaan tim, frontend ditulis dengan HTML, CSS, dan JavaScript biasa (tanpa React, tanpa TypeScript) dan backend dengan JavaScript (Node.js + Express). PostgreSQL tetap. **Subbab 3.9.2 pada laporan perlu disesuaikan.** |
| 2.7.3 dan 3.5.3 | Batas aturan R1–R4 (76) sama dengan batas Sangat Cocok | Satu pengaturan "ambang tinggi" dipakai untuk keduanya, jadi keduanya selalu sejalan |
| 3.7.4 ERD | Entitas `HASIL_ASESMEN` | Tabel `hasil_asesmen` menyimpan nilai internal, label kategori, aturan, dan detail hasil (termasuk tiga indikator prioritas) |

## Tampilan Hasil untuk Mahasiswa

Halaman hasil (`frontend/js/halaman/hasil.js`) menampilkan:

- Karier yang dipilih mahasiswa ("Hasil untuk karier pilihanmu").
- Kategori niat karier (Y), soft skill secara keseluruhan (X), intrapersonal (X1), dan interpersonal (X2),
  tanpa angka.
- Ringkasan dari templat penjelasan.
- Rekomendasi dari aturan yang terpicu, ditambah aturan tambahan bila ada.
- Tiga soft skill prioritas, masing-masing dengan saran.
- Spider chart 14 soft skill, tanpa angka. Zona kuning menandai kategori Sangat Cocok, garis putus-putus
  menandai batas Perlu Dikembangkan, dan titik kuning menandai soft skill prioritas. Spider chart tidak disebut di
  laporan; dipertahankan atas keputusan tim.

Teks rekomendasi dan templat diambil dari pengaturan admin terbaru setiap kali hasil dibuka, sedangkan kategori
dan prioritas disimpan sebagai potret saat tes dikerjakan (perubahan ambang tidak mengubah hasil lama).

## Fitur Tambahan di Luar Laporan

- **Mode gelap** dengan tombol ganti tema; awalnya mengikuti setting perangkat.
- **Bahasa Inggris** untuk seluruh sisi mahasiswa (termasuk 36 pertanyaan, deskripsi karier, saran latihan,
  rekomendasi, dan templat penjelasan). Menu admin tetap bahasa Indonesia. Terjemahan bawaan ditulis tim
  pengembang dan belum diperiksa ahli bahasa; pertanyaan kuesioner versi Inggris juga belum diuji validitasnya.
- **Data demo** (`npm run demo`): akun demo dan 15 mahasiswa contoh dengan jawaban acak. Data ini bukan data
  responden sungguhan dan tidak boleh dipakai untuk analisis.

## Hal Kecil pada Naskah Laporan

- Sumber butir pada Subbab 3.3 (misalnya Harred dkk., 2023; Sosu, 2013; Heppner & Petersen, 1982; Tierney &
  Farmer, 2002) belum tercantum di Daftar Pustaka.
- Judul Subbab 2.4.3 dan 2.4.4 sama persis ("Pemetaan MSIS 2016 dan ASEC ke Variabel Penelitian"); yang kedua
  berisi kompetensi yang tidak dijadikan indikator.

# Catatan Implementasi

Website dibangun dari `LAPORAN_BAB_1-3.md` (isi Google Docs per 16 November 2026). Catatan ini mencatat
bagian yang masih perlu diisi tim dan keputusan yang diambil ketika isi laporan tidak seragam.

## Perlu Dilengkapi Tim

1. **Profil kebutuhan soft skill per karier masih data ilustratif.** Laporan (Subbab 3.4) menetapkan
   `Req(r, i)` dan `w(r, i)` dihitung dari lowongan kerja jenjang awal 2026, tetapi angkanya belum ada di
   laporan. Agar sistem bisa dijalankan, `database/data.js` berisi perkiraan frekuensi per karier
   yang diolah dengan pita frekuensi laporan (80/65/50/35) dan `w = f / Σf`. **Angka ini bukan hasil survei
   lowongan.** Ganti lewat menu Admin > Profil karier, atau ubah `FREKUENSI` sebelum basis data dibuat.
   Selama angkanya masih sementara, setiap bagian yang bergantung padanya menampilkan catatan "angka sementara".
   Setelah diganti, ubah `DATA_SEMENTARA` di `frontend/js/umum.js` menjadi `false`.
2. **Saran pengembangan per indikator dan teks rekomendasi R1–R4** ditulis sebagai isi awal dan dapat diubah
   lewat Admin > Bobot dan aturan.
3. **Bobot indikator** bawaan sama rata (rata-rata biasa), sesuai Subbab 2.7.2. Bobot hasil *expert
   judgment* dapat diisi lewat menu admin.
4. **FR-08 (penjelasan AI) tidak memakai AI.** Atas keputusan tim, paragraf "Ringkasnya" di halaman hasil
   disusun dari kalimat templat (`backend/ringkasan.js`), tanpa layanan AI dan tanpa kunci API. Bagian laporan
   yang menyebut penjelasan AI (FR-08, UC-12, dan NFR terkait) perlu disesuaikan.
5. **Analisis hubungan variabel (Subbab 3.5.4)**, yaitu korelasi dan regresi X1, X2 terhadap Y, dilakukan
   di luar aplikasi. Admin > Ringkasan hasil hanya menampilkan rata-rata dan sebaran gabungan.

## Keputusan saat isi laporan berbeda antarbagian

| Bagian laporan | Temuan | Implementasi |
| --- | --- | --- |
| 3.8.2 Prototype dan 3.9.1 | Masih memuat rancangan lama: *Intention Fit Score*, radar lima variabel (Learning Behavior, Self-Efficacy, Technical Competency, Soft Skill, Project Experience), soal pilihan ganda teknis, *roadmap*, proyeksi skor | Mengikuti model pada Bab 2 dan Subbab 3.2–3.6: hanya Y, X1, X2, dan SFS; radar 14 indikator soft skill terhadap kebutuhan karier; tanpa soal teknis, tanpa skor *self-efficacy*, tanpa *roadmap* |
| Tabel 3.4 | ID `FR-07` dipakai tiga kali | Dua yang terakhir diperlakukan sebagai kebutuhan admin tersendiri (kelola instrumen/model; kelola akun dan pantau agregat) |
| Tabel 3.6 | Keterangan UC-07 berisi akun dan agregat; UC-11 dan UC-12 merujuk *include* ke UC-02 dan UC-03 | Hitung skor dijalankan saat kuesioner dikirim (UC-03); ringkasan (templat) disusun saat hasil ditampilkan (UC-04) |
| 3.9.2 Lingkungan pengembangan | Menyebut JavaScript/TypeScript dan React.js | Atas permintaan tim, frontend ditulis dengan HTML, CSS, dan JavaScript biasa (tanpa React, tanpa TypeScript) dan backend dengan JavaScript (Node.js + Express). PostgreSQL tetap. **Subbab 3.9.2 pada laporan perlu disesuaikan.** |
| 3.4 | Merujuk "14 indikator pada Tabel 2.2" | Dipakai 14 indikator pada Tabel 2.3 |
| 2.7.3 | Ambang kategori "dapat diubah Operator Admin" | Ambang kategori, ambang aturan (75), selisih alternatif (10), dan jumlah prioritas (3) dapat diubah admin |
| 3.5.2 | Status Selaras/Berbeda tidak menyebut kasus seri | Bila SFS karier pilihan sama dengan SFS tertinggi, status "Selaras" |

## Tampilan Hasil untuk Mahasiswa

Halaman hasil, dasbor, dan riwayat mahasiswa tidak lagi menampilkan angka maupun istilah
teknis. Yang ditampilkan:

- Satu karier hasil akhir, yaitu karier dengan SFS tertinggi dari 16 karier (bisa berbeda dari karier yang
  dipilih mahasiswa), dengan label "Sangat cocok" (SFS ≥ ambang tinggi), "Cukup cocok" (≥ ambang rendah), atau
  "Masih perlu dikembangkan".
- Tiga soft skill dengan skor tertinggi (kekuatan).
- Soft skill yang perlu dilatih untuk karier hasil (prioritas `w × Gap` terbesar), masing-masing dengan saran.
- Spider chart 14 soft skill terhadap kebutuhan karier hasil, tanpa angka; soft skill yang masih di bawah
  kebutuhan ditandai titik kuning.
- Tiga karier alternatif (SFS tertinggi berikutnya), tanpa angka.
- Ringkasan singkat dari kalimat templat, juga tanpa angka.

Perhitungan di backend tidak berubah: skor Y, X1, X2, SFS, aturan R1–R4, dan prioritas untuk karier pilihan tetap
dihitung, disimpan, dan dipakai pada ringkasan admin.

**Yang perlu disesuaikan di laporan:** FR-07 (Tabel 3.4) dan Subbab 3.8.1 menyebut halaman hasil menampilkan skor
Y, X1, X2, SFS karier pilihan, status kesesuaian, dan prioritas. Tampilan sekarang tidak lagi memperlihatkannya
kepada mahasiswa, dan hasil utamanya adalah karier paling cocok, bukan karier pilihan.

## Fitur Tambahan di Luar Laporan

- **Mode gelap** dengan tombol ganti tema; awalnya mengikuti setting perangkat.
- **Bahasa Inggris** untuk seluruh sisi mahasiswa (termasuk 36 pertanyaan, deskripsi karier, saran latihan, dan
  ringkasan). Menu admin tetap bahasa Indonesia. Terjemahan bawaan ditulis tim pengembang dan belum diperiksa
  ahli bahasa; pertanyaan kuesioner versi Inggris juga belum diuji validitasnya.
- **Data demo** (`npm run demo`): akun demo dan 15 mahasiswa contoh dengan jawaban acak. Data ini bukan data
  responden sungguhan dan tidak boleh dipakai untuk analisis.

Hasil asesmen disimpan sebagai potret (skor, selisih, aturan, dan teks rekomendasi saat itu), sehingga
perubahan bobot atau aturan oleh admin tidak mengubah hasil lama.

## Hal Kecil pada Naskah Laporan

- Rujukan silang *self-efficacy* menyebut Subbab 2.2.4, sedangkan pembahasannya ada di 2.2.3.
- Judul Subbab 2.4.3 muncul dua kali; yang kedua berisi kompetensi yang tidak dijadikan indikator.
- Tabel 3.8 tertulis "Kuesioner SUz 10 butir".
- Daftar Pustaka masih memuat entri "[LENGKAPI]" (Ula & Faisal, 2025; Wibowo, 2020), dan sumber butir pada
  Subbab 3.3 (misalnya Harred dkk., 2023; Sosu, 2013; Heppner & Petersen, 1982; Tierney & Farmer, 2002)
  belum tercantum.

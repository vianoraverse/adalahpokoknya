# Catatan implementasi

Website dibangun dari `LAPORAN_BAB_1-3.md` (isi Google Docs per 16 November 2026). Catatan ini mencatat
bagian yang masih perlu diisi tim dan keputusan yang diambil ketika isi laporan tidak seragam.

## Perlu dilengkapi tim

1. **Profil kebutuhan soft skill per karier masih data ilustratif.** Laporan (Subbab 3.4) menetapkan
   `Req(r, i)` dan `w(r, i)` dihitung dari lowongan kerja jenjang awal 2026, tetapi angkanya belum ada di
   laporan. Agar sistem bisa dijalankan, `server/src/seed/data.ts` berisi perkiraan frekuensi per karier
   yang diolah dengan pita frekuensi laporan (80/65/50/35) dan `w = f / Σf`. **Angka ini bukan hasil survei
   lowongan.** Ganti lewat menu Admin > Profil karier, atau ubah `FREKUENSI` sebelum basis data dibuat.
2. **Saran pengembangan per indikator dan teks rekomendasi R1–R4** ditulis sebagai isi awal dan dapat diubah
   lewat Admin > Bobot dan aturan.
3. **Bobot indikator** bawaan sama rata (rata-rata biasa), sesuai Subbab 2.7.2. Bobot hasil *expert
   judgment* dapat diisi lewat menu admin.
4. **Kunci API AI** belum diisi; tanpa kunci, penjelasan memakai templat.
5. **Analisis hubungan variabel (Subbab 3.5.4)**, yaitu korelasi dan regresi X1, X2 terhadap Y, dilakukan
   di luar aplikasi. Admin > Ringkasan hasil hanya menampilkan rata-rata dan sebaran gabungan.

## Keputusan saat isi laporan berbeda antarbagian

| Bagian laporan | Temuan | Yang diimplementasikan |
| --- | --- | --- |
| 3.8.2 Prototype dan 3.9.1 | Masih memuat rancangan lama: *Intention Fit Score*, radar lima variabel (Learning Behavior, Self-Efficacy, Technical Competency, Soft Skill, Project Experience), soal pilihan ganda teknis, *roadmap*, proyeksi skor | Mengikuti model pada Bab 2 dan Subbab 3.2–3.6: hanya Y, X1, X2, dan SFS; radar 14 indikator soft skill terhadap kebutuhan karier; tanpa soal teknis, tanpa skor *self-efficacy*, tanpa *roadmap* |
| Tabel 3.4 | ID `FR-07` dipakai tiga kali | Dua yang terakhir diperlakukan sebagai kebutuhan admin tersendiri (kelola instrumen/model; kelola akun dan pantau agregat) |
| Tabel 3.6 | Keterangan UC-07 berisi akun dan agregat; UC-11 dan UC-12 merujuk *include* ke UC-02 dan UC-03 | Hitung skor dijalankan saat kuesioner dikirim (UC-03); penjelasan AI saat hasil ditampilkan (UC-04) |
| 3.4 | Merujuk "14 indikator pada Tabel 2.2" | Dipakai 14 indikator pada Tabel 2.3 |
| 2.7.3 | Ambang kategori "dapat diubah Operator Admin" | Ambang kategori, ambang aturan (75), selisih alternatif (10), dan jumlah prioritas (3) dapat diubah admin |
| 3.5.2 | Status Selaras/Berbeda tidak menyebut kasus seri | Bila SFS karier pilihan sama dengan SFS tertinggi, status "Selaras" |

Hasil asesmen disimpan sebagai potret (skor, selisih, aturan, dan teks rekomendasi saat itu), sehingga
perubahan bobot atau aturan oleh admin tidak mengubah hasil lama.

## Hal kecil pada naskah laporan

- Rujukan silang *self-efficacy* menyebut Subbab 2.2.4, sedangkan pembahasannya ada di 2.2.3.
- Judul Subbab 2.4.3 muncul dua kali; yang kedua berisi kompetensi yang tidak dijadikan indikator.
- Tabel 3.8 tertulis "Kuesioner SUz 10 butir".
- Daftar Pustaka masih memuat entri "[LENGKAPI]" (Ula & Faisal, 2025; Wibowo, 2020), dan sumber butir pada
  Subbab 3.3 (misalnya Harred dkk., 2023; Sosu, 2013; Heppner & Petersen, 1982; Tierney & Farmer, 2002)
  belum tercantum.

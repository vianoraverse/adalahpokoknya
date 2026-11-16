# YourWay

Sistem pemodelan niat karier (*career intention*) mahasiswa Teknik Informatika berbasis *soft skill*.
Mahasiswa memilih satu dari 16 karier TIK, mengisi 36 butir kuesioner Likert, lalu melihat skor niat (Y),
soft skill intrapersonal (X1) dan interpersonal (X2), *Soft Skill Fit Score* (SFS), serta rekomendasi
pengembangan yang ditentukan aturan (*rule-based*).

Proyek Rekayasa Perangkat Lunak, Kelompok 4, Program Studi Teknik Informatika, FST UIN Syarif Hidayatullah
Jakarta (2026). Dasar proyek ini adalah laporan pada [`docs/LAPORAN_BAB_1-3.md`](docs/LAPORAN_BAB_1-3.md)
([PDF](docs/LAPORAN_BAB_1-3.pdf)).

## Menjalankan

Butuh Node.js 20.12 atau lebih baru. Tidak perlu memasang basis data untuk mencoba.

```bash
npm install
npm run dev
```

- Aplikasi: http://localhost:5173
- API: http://localhost:4000
- Operator Admin bawaan: `admin@yourway.local` / `admin12345` (ganti lewat `.env` sebelum dipakai sungguhan)

Tanpa `DATABASE_URL`, server memakai PGlite (PostgreSQL tertanam) dan menyimpan data di `server/data/pglite`.
Untuk memakai PostgreSQL, salin `.env.example` menjadi `.env` lalu isi `DATABASE_URL`. Tabel dan data awal
dibuat otomatis saat server pertama kali dijalankan.

Mode production (satu server menyajikan API dan frontend):

```bash
npm run build
JWT_SECRET=<nilai-acak-panjang> NODE_ENV=production npm start   # http://localhost:4000
```

Atau dengan Docker dan PostgreSQL: `docker compose up --build`.

### Penjelasan AI (opsional)

Isi `AI_PROVIDER` (`groq`, `gemini`, atau `qwen`) dan `AI_API_KEY` pada `.env`. Tanpa kunci, atau bila layanan
AI gagal, sistem menampilkan penjelasan templat dari hasil yang sama. AI hanya menarasikan hasil; skor,
klasifikasi, dan rekomendasi selalu dihitung mesin BMS. Data yang dikirim ke AI tidak memuat nama atau email.

## Pengujian

```bash
npm test   # validasi mesin skor terhadap perhitungan manual (normalisasi, gap, SFS, aturan R1–R4, nilai batas)
```

## Struktur

```
client/                 React + TypeScript + Vite (lapisan tampilan)
  src/pages/            Landing, Auth, Asesmen, Hasil, Dasbor, Riwayat, Pengaturan, Admin
  src/components/       diagram (cincin skor, radar, batang SFS) dan komponen UI
server/                 Node.js + Express + TypeScript (lapisan logika aplikasi)
  src/bms/engine.ts     mesin BMS: skor berbobot, gap, SFS, aturan (fungsi murni + uji)
  src/ai.ts             penjelasan AI (Groq/Gemini/Qwen) dengan cadangan templat
  src/routes/           auth, asesmen, admin (REST API, RBAC)
  src/schema.sql        skema PostgreSQL (lapisan data, sesuai Tabel 3.7)
  src/seed/data.ts      16 karier, 18 indikator, 36 butir, profil karier, aturan, ambang
docs/                   laporan dan catatan implementasi
```

## Cakupan terhadap laporan

| Kebutuhan | Implementasi |
| --- | --- |
| FR-01 Login dan RBAC | Daftar, masuk, keluar; peran Mahasiswa dan Operator Admin; JWT pada cookie `httpOnly` |
| FR-02 Pilih karier | 16 karier dari Tabel 2.4 |
| FR-03 Kuesioner Likert | 36 butir Subbab 3.3; `[okupasi]` diganti karier pilihan; draf tersimpan di peramban |
| FR-04 Skor Y, X1, X2 | Rata-rata butir, normalisasi min-max 0–100, skor berbobot |
| FR-05 Gap, SFS, prioritas | `Gap = max(Req − S, 0)`, `SFS = 100 − Σ(w × Gap)`, prioritas dari `w × Gap` terbesar |
| FR-06 SFS 16 karier | Karier paling selaras dan status Selaras/Berbeda |
| FR-07 Tampilan hasil | Cincin SFS, diagram radar skor terhadap kebutuhan, tabel rincian |
| FR-08 Penjelasan AI | Dipanggil terpisah setelah skor tampil; cadangan templat |
| Kelola instrumen dan model | Butir, bobot indikator, ambang, aturan R1–R4, profil karier (tambah, ubah, hapus) |
| Kelola akun dan pantau agregat | Akun pengguna; ringkasan gabungan tanpa nama |
| NFR | Responsif; Bcrypt; hasil hanya untuk pemilik akun; persetujuan saat daftar; hapus akun |

Keputusan implementasi dan hal yang perlu dilengkapi tim ada di
[`docs/CATATAN_IMPLEMENTASI.md`](docs/CATATAN_IMPLEMENTASI.md).

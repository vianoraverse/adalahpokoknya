# YourWay

Sistem pemodelan niat karier (*career intention*) mahasiswa Teknik Informatika berbasis *soft skill*.
Mahasiswa memilih satu dari 16 karier TIK, mengisi 36 butir kuesioner Likert, lalu melihat skor niat (Y),
soft skill intrapersonal (X1) dan interpersonal (X2), *Soft Skill Fit Score* (SFS), serta rekomendasi
pengembangan yang ditentukan aturan (*rule-based*).

Proyek Rekayasa Perangkat Lunak, Kelompok 4, Program Studi Teknik Informatika, FST UIN Syarif Hidayatullah
Jakarta (2026). Dasar proyek ini adalah laporan pada [`docs/LAPORAN_BAB_1-3.md`](docs/LAPORAN_BAB_1-3.md)
([PDF](docs/LAPORAN_BAB_1-3.pdf)).

Seluruh kode ditulis dengan **HTML, CSS, dan JavaScript biasa**. Tidak ada TypeScript, tidak ada framework
frontend, dan tidak ada proses *build*: berkas di `public/` adalah berkas yang dibuka peramban.

## Menjalankan

Butuh Node.js 20.12 atau lebih baru. Tidak perlu memasang basis data untuk mencoba.

```bash
npm install
npm run dev
```

Buka http://localhost:4000. Operator Admin bawaan: `admin@yourway.local` / `admin12345` (ganti lewat `.env`
sebelum dipakai sungguhan).

- Perubahan pada `public/` (HTML, CSS, JS halaman) langsung terlihat setelah halaman dimuat ulang.
- Perubahan pada `server/` membuat server menyala ulang otomatis.
- Tanpa `DATABASE_URL`, server memakai PGlite (PostgreSQL tertanam) dan menyimpan data di folder `data/`.
  Untuk memakai PostgreSQL, salin `.env.example` menjadi `.env` lalu isi `DATABASE_URL`. Tabel dan data awal
  dibuat otomatis saat server pertama kali dijalankan.

Untuk menayangkan website secara publik (Render + Neon, gratis), lihat [`docs/DEPLOY.md`](docs/DEPLOY.md).
Dengan Docker: `docker compose up --build`.

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
public/                     FRONTEND: yang dibuka peramban
  index.html                halaman depan
  masuk.html, daftar.html   masuk dan daftar
  app/*.html                halaman mahasiswa (dasbor, asesmen, hasil, riwayat, pengaturan)
  admin/*.html              halaman Operator Admin
  css/styles.css            seluruh gaya tampilan (warna dan huruf ada di bagian :root)
  js/umum.js                fungsi bersama: panggilan API, templat HTML, menu samping, toast, modal
  js/grafik.js              diagram radar
  js/hasil-bagian.js        potongan tampilan hasil (dipakai dasbor dan halaman hasil)
  js/halaman/*.js           satu berkas JS untuk setiap halaman
server/                     BACKEND: Node.js + Express
  index.js                  titik masuk server
  routes/                   auth.js, asesmen.js, admin.js (REST API, hak akses per peran)
  bms/engine.js             mesin BMS: skor berbobot, gap, SFS, aturan (+ engine.test.js)
  ai.js                     penjelasan AI (Groq/Gemini/Qwen) dengan cadangan templat
  schema.sql                skema PostgreSQL (sesuai Tabel 3.7)
  seed/data.js              data awal: 16 karier, 18 indikator, 36 butir, profil karier, aturan, ambang
docs/                       laporan, panduan deploy, catatan implementasi
```

### Mau mengubah apa, buka berkas mana

| Mau mengubah | Berkas |
| --- | --- |
| Teks halaman depan | `public/index.html` |
| Warna, huruf, tata letak | `public/css/styles.css` |
| Halaman hasil | `public/js/halaman/hasil.js`, `public/js/hasil-bagian.js`, `public/js/grafik.js` |
| Kuesioner dan pilih karier | `public/js/halaman/asesmen.js` |
| Menu samping | `public/js/umum.js` (bagian `MENU`) |
| Rumus skor dan aturan | `server/bms/engine.js` (jalankan `npm test` setelah mengubah) |
| Data awal (karier, butir, profil) | `server/seed/data.js` (hanya dipakai saat basis data masih kosong) |

Butir kuesioner, bobot, ambang, teks rekomendasi, profil karier, dan akun dapat diubah langsung dari menu
admin di website, tanpa menyentuh kode.

Halaman aplikasi digambar oleh JavaScript memakai fungsi `html` di `js/umum.js`. Nilai yang disisipkan lewat
`${...}` otomatis di-*escape*, jadi teks dari pengguna tidak bisa menyisipkan tag HTML. Pakai fungsi itu
setiap kali menampilkan data, jangan menyusun `innerHTML` dengan menyambung string.

## Cakupan terhadap laporan

| Kebutuhan | Implementasi |
| --- | --- |
| FR-01 Login dan RBAC | Daftar, masuk, keluar; peran Mahasiswa dan Operator Admin; JWT pada cookie `httpOnly` |
| FR-02 Pilih karier | 16 karier dari Tabel 2.4 |
| FR-03 Kuesioner Likert | 36 butir Subbab 3.3; `[okupasi]` diganti karier pilihan; draf tersimpan di peramban |
| FR-04 Skor Y, X1, X2 | Rata-rata butir, normalisasi min-max 0–100, skor berbobot |
| FR-05 Gap, SFS, prioritas | `Gap = max(Req − S, 0)`, `SFS = 100 − Σ(w × Gap)`, prioritas dari `w × Gap` terbesar |
| FR-06 SFS 16 karier | Peringkat 16 karier, karier paling selaras, status Selaras/Berbeda |
| FR-07 Tampilan hasil | Papan hasil, diagram radar skor terhadap kebutuhan, tabel rincian per indikator |
| FR-08 Penjelasan AI | Dipanggil terpisah setelah skor tampil; cadangan templat |
| Kelola instrumen dan model | Butir, bobot indikator, ambang, aturan R1–R4, profil karier (tambah, ubah, hapus) |
| Kelola akun dan pantau agregat | Akun pengguna; ringkasan gabungan tanpa nama |
| NFR | Responsif; Bcrypt; hasil hanya untuk pemilik akun; persetujuan saat daftar; hapus akun |

Keputusan implementasi dan hal yang perlu dilengkapi tim ada di
[`docs/CATATAN_IMPLEMENTASI.md`](docs/CATATAN_IMPLEMENTASI.md).

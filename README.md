# YourWay

Sistem pemodelan niat karier (*career intention*) mahasiswa Teknik Informatika berbasis *soft skill*.
Mahasiswa memilih satu dari 16 karier TIK, mengisi 36 butir kuesioner Likert, lalu melihat skor niat (Y),
soft skill intrapersonal (X1) dan interpersonal (X2), *Soft Skill Fit Score* (SFS), serta rekomendasi
pengembangan yang ditentukan aturan (*rule-based*).

## Menjalankan

Butuh Node.js 20.12 atau lebih baru. Tidak perlu memasang basis data untuk mencoba.

```bash
npm install
npm run dev
```

Buka http://localhost:4000. Operator Admin bawaan: `admin@yourway.local` / `admin12345` (ganti lewat `.env`
sebelum dipakai sungguhan).

- Mau demo ke dosen? Jalankan `npm run demo` (bukan `npm run dev`). Ini menambahkan akun demo
  `demo@yourway.local` / `demo12345` yang sudah punya hasil tes, plus 15 mahasiswa contoh supaya ringkasan admin
  ada isinya. Datanya hanya dibuat sekali; setelah itu `npm run demo` sama saja dengan `npm run dev`.
- Website punya tombol mode gelap/terang (awalnya ikut setting laptop/HP) dan tombol bahasa ID/EN. Bahasa Inggris
  hanya untuk sisi mahasiswa; menu admin tetap bahasa Indonesia.
- Perubahan pada `frontend/` (HTML, CSS, JS halaman) langsung terlihat setelah halaman dimuat ulang.
- Perubahan pada `backend/`, `behavioral-model/`, atau `database/` membuat server menyala ulang otomatis.
- Tanpa `DATABASE_URL`, server memakai PGlite (PostgreSQL tertanam) dan menyimpan data di folder `data/`.
  Untuk memakai PostgreSQL, salin `.env.example` menjadi `.env` lalu isi `DATABASE_URL`. Tabel dan data awal
  dibuat otomatis saat server pertama kali dijalankan.

Website ini dijalankan lokal di laptop masing-masing anggota (tidak di-hosting).

## Pengujian

```bash
npm test   # validasi mesin skor terhadap perhitungan manual (normalisasi, gap, SFS, aturan R1–R4, nilai batas)
```

## Struktur

```
frontend/                   FRONTEND: yang dibuka peramban
  index.html                halaman depan
  masuk.html, daftar.html   masuk dan daftar
  app/*.html                halaman mahasiswa (dasbor, asesmen, hasil, riwayat, pengaturan)
  admin/*.html              halaman Operator Admin
  css/styles.css            seluruh gaya tampilan (warna dan huruf ada di bagian :root)
  js/awal.js                memasang tema (gelap/terang) dan bahasa sebelum halaman tampil
  js/bahasa.js              semua teks tampilan mahasiswa dalam bahasa Indonesia dan Inggris
  js/umum.js                fungsi bersama: panggilan API, templat HTML, menu samping, toast, modal, tombol tema/bahasa
  js/hasil-bagian.js        potongan tampilan hasil (dipakai dasbor dan halaman hasil)
  js/grafik.js              spider chart di halaman hasil
  js/ikon.js                ikon vector dari Lucide (lisensi ISC, tercantum di berkas)
  js/halaman/*.js           satu berkas JS untuk setiap halaman
backend/                    BACKEND: Node.js + Express
  index.js                  titik masuk server
  routes/                   auth.js, asesmen.js, admin.js (REST API, hak akses per peran)
  ringkasan.js              teks "Ringkasnya" di halaman hasil (kalimat templat)
  demo.js                   akun demo dan mahasiswa contoh untuk `npm run demo`
  simpan-asesmen.js         menghitung dan menyimpan satu asesmen (dipakai API dan demo)
database/
  schema.sql                skema PostgreSQL (sesuai Tabel 3.7)
  data.js                   data awal: 16 karier, 18 indikator, 36 butir, profil karier, aturan, ambang, terjemahan
  seed.js                   memasukkan data awal saat basis data masih kosong
behavioral-model/
  engine.js                 mesin BMS: skor berbobot, gap, SFS, aturan
testing/
  engine.test.js            tes otomatis mesin BMS (`npm test`)
documentation/              laporan, panduan kode, catatan implementasi
```

### Mau mengubah apa, buka berkas mana

| Mau mengubah | Berkas |
| --- | --- |
| Teks yang dilihat mahasiswa (ID dan EN) | `frontend/js/bahasa.js` |
| Warna mode gelap | `frontend/css/styles.css` (bagian `:root[data-tema='gelap']`) |
| Warna, huruf, tata letak | `frontend/css/styles.css` |
| Halaman hasil | `frontend/js/halaman/hasil.js`, `frontend/js/hasil-bagian.js`, `frontend/js/grafik.js` |
| Kuesioner dan pilih karier | `frontend/js/halaman/asesmen.js` |
| Menu samping | `frontend/js/umum.js` (bagian `MENU`) |
| Rumus skor dan aturan | `behavioral-model/engine.js` (jalankan `npm test` setelah mengubah) |
| Data awal (karier, butir, profil) | `database/data.js` (hanya dipakai saat basis data masih kosong) |
| Teks "Ringkasnya" di halaman hasil | `backend/ringkasan.js` |

Butir kuesioner, bobot, ambang, teks rekomendasi, profil karier, dan akun dapat diubah langsung dari menu
admin di website, tanpa menyentuh kode.

Halaman aplikasi digambar oleh JavaScript memakai fungsi `html` di `js/umum.js`. Nilai yang disisipkan lewat
`${...}` otomatis di-*escape*, jadi teks dari pengguna tidak bisa menyisipkan tag HTML. Pakai fungsi itu
setiap kali menampilkan data, jangan menyusun `innerHTML` dengan menyambung string.

### Kerja bareng tim

- Tambahkan anggota tim di GitHub: repo > **Settings > Collaborators > Add people**.
- Alur kerja: `git pull`, ubah, coba dengan `npm run dev`, lalu `git commit` dan `git push`.
- Data (akun, hasil tes) tersimpan di folder `data/` di laptop masing-masing dan tidak ikut ter-push.

## Cakupan terhadap laporan

| Kebutuhan | Implementasi |
| --- | --- |
| FR-01 Login dan RBAC | Daftar, masuk, keluar; peran Mahasiswa dan Operator Admin; JWT pada cookie `httpOnly` |
| FR-02 Pilih karier | 16 karier dari Tabel 2.4 |
| FR-03 Kuesioner Likert | 36 butir Subbab 3.3; `[okupasi]` diganti karier pilihan; draf tersimpan di peramban |
| FR-04 Skor Y, X1, X2 | Rata-rata butir, normalisasi min-max 0–100, skor berbobot |
| FR-05 Gap, SFS, prioritas | `Gap = max(Req − S, 0)`, `SFS = 100 − Σ(w × Gap)`, prioritas dari `w × Gap` terbesar |
| FR-06 SFS 16 karier | Dihitung untuk 16 karier; yang tertinggi jadi hasil akhir, tiga berikutnya jadi alternatif |
| FR-07 Tampilan hasil | Disederhanakan: karier paling cocok, kekuatan, yang bisa dilatih, spider chart, 3 alternatif, tanpa angka (lihat catatan implementasi) |
| FR-08 Penjelasan hasil | Ringkasan dari kalimat templat, tanpa layanan AI (lihat catatan implementasi) |
| Kelola instrumen dan model | Butir, bobot indikator, ambang, aturan R1–R4, profil karier (tambah, ubah, hapus) |
| Kelola akun dan pantau agregat | Akun pengguna; ringkasan gabungan tanpa nama |
| NFR | Responsif; Bcrypt; hasil hanya untuk pemilik akun; persetujuan saat daftar; hapus akun |

Penjelasan kode dengan bahasa santai ada di [`documentation/PANDUAN_KODE.md`](documentation/PANDUAN_KODE.md).

Keputusan implementasi dan hal yang perlu dilengkapi tim ada di
[`documentation/CATATAN_IMPLEMENTASI.md`](documentation/CATATAN_IMPLEMENTASI.md).

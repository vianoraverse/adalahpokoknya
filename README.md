# YourWay

Sistem pemodelan niat karier (*career intention*) mahasiswa Teknik Informatika berbasis *soft skill*.
Mahasiswa memilih satu dari 16 karier TIK, mengisi 36 butir kuesioner Likert, lalu melihat kategori kecocokan
(Sangat Cocok, Cukup Cocok, Perlu Dikembangkan) untuk niat karier (Y), soft skill intrapersonal (X1),
interpersonal (X2), dan gabungannya (X), tiga soft skill prioritas, serta rekomendasi dari tabel keputusan.

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
npm test   # validasi perhitungan terhadap hitungan manual (normalisasi, rata-rata, kategori, prioritas, R1–R4, nilai batas)
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
  data.js                   data awal: 16 karier, 18 indikator, 36 butir, aturan, templat, ambang, terjemahan
  seed.js                   memasukkan data awal saat basis data masih kosong
behavioral-model/
  engine.js                 mesin BMS: rata-rata, kategori, prioritas, tabel keputusan
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
| Data awal (karier, butir, aturan, templat) | `database/data.js` (hanya dipakai saat basis data masih kosong) |
| Teks "Ringkasnya" di halaman hasil | `backend/ringkasan.js` |

Butir kuesioner, ambang kategori, teks rekomendasi, templat penjelasan, saran per soft skill, dan akun dapat diubah langsung dari menu
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
| FR-04 Nilai Y, X1, X2 | Rata-rata butir, normalisasi min-max 0–100, rata-rata indikator tanpa bobot |
| FR-05 Nilai X, kategori, prioritas | `X = (X1 + X2) / 2`; kategori < 56 / 56–< 76 / ≥ 76; tiga soft skill dengan nilai terendah |
| FR-06 Tampilan hasil | Kategori Y, X1, X2, dan X tanpa angka, tiga prioritas, rekomendasi R1–R4 dan aturan tambahan, spider chart 14 soft skill |
| FR-07 Penjelasan templat | Templat per aturan diisi label kategori, karier pilihan, dan tiga prioritas; tanpa AI |
| FR-08 Kelola instrumen dan model | Butir, saran per indikator, ambang kategori, aturan tabel keputusan, templat penjelasan |
| FR-09 Kelola akun dan pantau agregat | Akun pengguna; ringkasan gabungan tanpa nama |
| NFR | Responsif; Bcrypt; hasil hanya untuk pemilik akun; persetujuan saat daftar; hapus akun |

Penjelasan kode dengan bahasa santai ada di [`documentation/PANDUAN_KODE.md`](documentation/PANDUAN_KODE.md).

Keputusan implementasi dan hal yang perlu dilengkapi tim ada di
[`documentation/CATATAN_IMPLEMENTASI.md`](documentation/CATATAN_IMPLEMENTASI.md).

# Panduan baca kode YourWay

Panduan ini buat anggota tim yang mau ngerti kodenya tanpa harus baca semua file. Bacanya urut dari atas.

## 1. Gambaran besar

Website ini dibagi dua:

- **Frontend** (folder `public/`): yang tampil di browser. Isinya HTML, CSS, dan JavaScript biasa.
- **Backend** (folder `server/`): program Node.js yang jalan di laptop (atau server). Tugasnya nyimpen data ke
  database, ngecek login, dan ngitung hasil tes.

Frontend dan backend ngobrol lewat **API**: frontend minta data ke alamat yang diawali `/api/...`, backend
bales dalam bentuk JSON.

Contoh: waktu halaman hasil dibuka, file `public/js/halaman/hasil.js` manggil `/api/assessments/5`, lalu backend
(`server/routes/asesmen.js`) ngambil hasil tes nomor 5 dari database dan ngirim balik datanya.

## 2. Alur dari klik sampai hasil

(Tips: jalankan `npm run demo` lalu masuk dengan `demo@yourway.local` / `demo12345` kalau mau langsung lihat
halaman hasil tanpa ngisi tes dulu.)

1. **Halaman depan** (`public/index.html` + `public/js/halaman/depan.js`). JS-nya ngambil daftar 16 karier dari
   `/api/careers`, lalu nampilin di papan.
2. **Daftar / masuk** (`daftar.html`, `masuk.html` + JS-nya). Formulir dikirim ke `/api/auth/register` atau
   `/api/auth/login`. Kalau berhasil, backend nyimpen "tiket login" di cookie browser.
3. **Tes** (`public/app/asesmen.html` + `js/halaman/asesmen.js`). Mahasiswa milih karier, lalu jawab 36 pertanyaan,
   6 per halaman. Jawaban sementara disimpan di browser (`localStorage`) supaya nggak hilang kalau halaman ketutup.
   Waktu tombol "Kirim jawaban" ditekan, semua jawaban dikirim ke `/api/assessments`.
4. **Backend ngitung hasil** (`server/routes/asesmen.js` manggil `hitung()` di `server/bms/engine.js`), lalu
   nyimpen hasilnya ke database.
5. **Halaman hasil** (`app/hasil.html` + `js/halaman/hasil.js`) nampilin karier paling cocok, kekuatan, yang bisa
   dilatih, spider chart, 3 karier alternatif, dan ringkasan singkat.

## 3. Cara ngitung hasil (versi singkat)

Semua ada di `server/bms/engine.js`, fungsi `hitung()`.

1. Tiap soft skill punya 2 pertanyaan. Jawaban 1 sampai 5 dirata-rata, lalu diubah ke skala 0 sampai 100.
2. Tiap karier punya "kebutuhan" untuk tiap soft skill (angka 0 sampai 100) dan "bobot" (seberapa penting).
   Angka ini ada di database, bisa diubah di menu Admin > Profil karier.
3. Untuk tiap karier, dihitung seberapa jauh skor mahasiswa di bawah kebutuhan karier itu. Makin kecil
   kekurangannya, makin cocok kariernya. Angka kecocokan ini namanya **SFS** di kode.
4. Karier dengan SFS paling tinggi jadi **hasil akhir**. Tiga karier berikutnya jadi **alternatif**.
5. Soft skill dengan kekurangan paling berpengaruh untuk karier hasil jadi **yang bisa dilatih**. Tiga soft skill
   dengan skor tertinggi jadi **kekuatan**.

Angka-angka ini nggak ditampilin ke mahasiswa. Yang tampil cuma nama karier, label ("Sangat cocok", "Cukup
cocok", "Masih perlu dikembangkan"), dan daftar soft skill.

Rumus lengkap dan asalnya ada di `CATATAN_IMPLEMENTASI.md` dan di laporan (Subbab 2.7 dan 3.4 sampai 3.5).

## 4. File mana ngapain

### Frontend (`public/`)

| File | Isinya |
| --- | --- |
| `index.html` | Halaman depan. Teksnya langsung ditulis di sini. |
| `masuk.html`, `daftar.html` | Halaman masuk dan daftar. |
| `app/*.html`, `admin/*.html` | "Cangkang" halaman. Isinya kosong, diisi oleh file JS dengan nama yang mirip. |
| `css/styles.css` | Semua tampilan. Warna dan huruf ada di bagian paling atas (`:root`). |
| `js/awal.js` | Dijalankan paling awal: memasang mode gelap/terang dan bahasa supaya halaman nggak "berkedip". |
| `js/bahasa.js` | Semua teks yang dilihat mahasiswa, dalam bahasa Indonesia dan Inggris. |
| `js/umum.js` | Fungsi yang dipakai banyak halaman: `api()` buat manggil backend, `html` buat nyusun HTML, menu samping, toast, modal. |
| `js/hasil-bagian.js` | Potongan tampilan hasil yang dipakai di Dasbor dan halaman Hasil. |
| `js/grafik.js` | Spider chart di halaman hasil. |
| `js/ikon.js` | Ikon karier, soft skill, dan menu (dari lucide.dev). Ganti ikon: cari di lucide.dev, salin isi `<svg>`-nya ke sini. |
| `js/halaman/*.js` | Satu file per halaman. Misalnya `hasil.js` buat `app/hasil.html`. |

### Backend (`server/`)

| File | Isinya |
| --- | --- |
| `index.js` | Titik mulai server. Nyambungin semua bagian. |
| `routes/auth.js` | API daftar, masuk, keluar, ubah profil, hapus akun. |
| `routes/asesmen.js` | API daftar karier, pertanyaan, kirim jawaban, ambil hasil, penjelasan. |
| `routes/admin.js` | API khusus admin: kelola pertanyaan, bobot, aturan, profil karier, akun, ringkasan. |
| `bms/engine.js` | Semua rumus perhitungan. |
| `bms/engine.test.js` | Tes otomatis buat rumus. Jalanin dengan `npm test`. |
| `ai.js` | Nyusun teks "Ringkasnya" di halaman hasil (pakai AI kalau ada kunci API, kalau nggak pakai templat). |
| `auth.js` | Ngecek siapa yang login dan perannya (mahasiswa atau admin). |
| `db.js` | Koneksi database. |
| `schema.sql` | Daftar tabel database. |
| `seed/data.js` | Data awal: 16 karier, 36 pertanyaan, profil karier, aturan. Cuma dipakai waktu database masih kosong. |

## 5. Cara ngubah hal yang sering diubah

| Mau ngubah | Caranya |
| --- | --- |
| Teks yang dilihat mahasiswa | Edit `public/js/bahasa.js`. Tiap teks punya versi `id` dan `en`; ubah dua-duanya. |
| Warna mode gelap | Edit bagian `:root[data-tema='gelap']` di `public/css/styles.css`. |
| Warna atau huruf | Edit bagian `:root` di `public/css/styles.css`. |
| Teks halaman hasil | Edit `public/js/halaman/hasil.js` atau `public/js/hasil-bagian.js`. |
| Teks "Ringkasnya" | Edit fungsi `penjelasanTemplat` di `server/ai.js` (server nyala ulang sendiri). |
| Pertanyaan, bobot, profil karier, teks saran | Lewat menu admin di website, nggak perlu ngoding. |
| Rumus | Edit `server/bms/engine.js`, lalu jalanin `npm test` buat ngecek nggak ada yang rusak. |

## 6. Mode gelap dan bahasa

- **Mode gelap.** `js/awal.js` nempelin `data-tema="gelap"` atau `"terang"` ke tag `<html>`. Pertama kali dibuka,
  ikut setting laptop/HP; kalau tombolnya ditekan, pilihannya disimpan di browser. Warnanya diatur di CSS lewat
  variabel (`--ink`, `--paper`, dan seterusnya) yang nilainya diganti di bagian `:root[data-tema='gelap']`.
- **Bahasa.** Pilihan bahasa juga disimpan di browser. Teks tampilan diambil lewat `t('kunci')` dari
  `js/bahasa.js`. Di halaman HTML biasa (depan, masuk, daftar), elemennya diberi `data-teks="kunci"`.
  Pertanyaan kuesioner, deskripsi karier, dan saran latihan disimpan di database (kolom `teks_en`, `deskripsi_en`,
  `saran_en`); frontend minta versi Inggris lewat header `X-Bahasa: en`. Admin bisa mengisi teks Inggris di
  form butir dan form indikator. Menu admin sendiri selalu bahasa Indonesia.

## 7. Catatan "angka sementara"

Profil kebutuhan soft skill tiap karier masih angka sementara, jadi semua bagian yang hasilnya bergantung pada
angka itu (karier hasil, yang bisa dilatih, spider chart, karier alternatif, ringkasan, dan beberapa bagian di
ringkasan admin) diberi catatan kecil di pojok kanan bawah.

Kalau profil karier sudah diisi data asli dari lowongan kerja, buka `public/js/umum.js`, cari
`DATA_SEMENTARA = true`, lalu ubah jadi `false`. Semua catatan hilang sekaligus.

## 8. Satu aturan penting

Waktu nampilin data di halaman, pakai fungsi `html` dari `js/umum.js`, contohnya:

```js
pasang(wadah, html`<p>Halo, ${pengguna.nama}</p>`);
```

Jangan nyusun HTML dengan nyambung string (`'<p>' + nama + '</p>'`). Fungsi `html` otomatis "menjinakkan" teks
dari pengguna, jadi kalau ada yang daftar dengan nama berisi kode HTML, kodenya nggak ikut jalan.

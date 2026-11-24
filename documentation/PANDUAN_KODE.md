# Panduan baca kode YourWay

Panduan ini buat anggota tim yang mau ngerti kodenya tanpa harus baca semua file. Bacanya urut dari atas.

## 1. Gambaran besar

Isi repo dibagi per folder:

- **`frontend/`**: yang tampil di browser. Isinya HTML, CSS, dan JavaScript biasa.
- **`backend/`**: program Node.js yang jalan di laptop (atau server). Tugasnya ngecek login, nyediain API, dan
  nyimpen hasil tes.
- **`database/`**: daftar tabel (`schema.sql`) dan data awal (`data.js`, `seed.js`).
- **`behavioral-model/`**: rumus perhitungan hasil tes (`engine.js`).
- **`testing/`**: tes otomatis buat rumus.
- **`documentation/`**: laporan dan panduan, termasuk file ini.

Frontend dan backend ngobrol lewat **API**: frontend minta data ke alamat yang diawali `/api/...`, backend
bales dalam bentuk JSON.

Contoh: waktu halaman hasil dibuka, file `frontend/js/halaman/hasil.js` manggil `/api/assessments/5`, lalu backend
(`backend/routes/asesmen.js`) ngambil hasil tes nomor 5 dari database dan ngirim balik datanya.

## 2. Alur dari klik sampai hasil

(Tips: jalankan `npm run demo` lalu masuk dengan `demo@yourway.local` / `demo12345` kalau mau langsung lihat
halaman hasil tanpa ngisi tes dulu.)

1. **Halaman depan** (`frontend/index.html` + `frontend/js/halaman/depan.js`). Isinya judul, tombol "Mulai tes",
   dan tiga langkah singkat cara pakai. Kalau belum masuk, tombolnya ngarah ke halaman daftar (yang ada tautan ke Masuk); kalau udah masuk,
   langsung ke halaman tes.
2. **Daftar / masuk** (`daftar.html`, `masuk.html` + JS-nya). Formulir dikirim ke `/api/auth/register` atau
   `/api/auth/login`. Kalau berhasil, backend nyimpen "tiket login" di cookie browser.
3. **Tes** (`frontend/app/asesmen.html` + `js/halaman/asesmen.js`). Mahasiswa milih karier, lalu jawab 36 pertanyaan,
   6 per halaman. Jawaban sementara disimpan di browser (`localStorage`) supaya nggak hilang kalau halaman ketutup.
   Waktu tombol "Kirim jawaban" ditekan, semua jawaban dikirim ke `/api/assessments`.
4. **Backend ngitung hasil** (`backend/routes/asesmen.js` manggil `hitung()` di `behavioral-model/engine.js`), lalu
   nyimpen hasilnya ke database.
5. **Halaman hasil** (`app/hasil.html` + `js/halaman/hasil.js`) nampilin karier yang dipilih, kategori
   kecocokan, ringkasan, rekomendasi, tiga soft skill yang perlu dilatih, dan spider chart.

## 3. Cara ngitung hasil (versi singkat)

Semua ada di `behavioral-model/engine.js`, fungsi `hitung()`.

1. Tiap indikator punya 2 pertanyaan. Jawaban 1 sampai 5 dirata-rata, lalu diubah ke skala 0 sampai 100.
2. Niat karier (Y), soft skill intrapersonal (X1), dan interpersonal (X2) = rata-rata indikatornya masing-masing.
   Semua indikator sama penting, nggak ada bobot.
3. Soft skill gabungan X = (X1 + X2) / 2.
4. Tiap nilai dimasukkan ke kategori: di bawah 56 **Perlu Dikembangkan**, 56 sampai di bawah 76 **Cukup Cocok**,
   76 ke atas **Sangat Cocok**.
5. Tiga soft skill dengan nilai paling rendah jadi **prioritas latihan**.
6. Rekomendasi dipilih dari tabel keputusan R1 sampai R4 (kombinasi Y dan X), plus saran tambahan kalau X1 atau X2
   di bawah 56.
7. Kalimat "Ringkasnya" diambil dari templat per aturan, terus diisi nama karier, kategori, dan tiga prioritas
   (`backend/ringkasan.js`).

Angka-angka ini nggak ditampilin ke mahasiswa. Yang tampil cuma label kategori dan daftar soft skill.

Rumus lengkap dan asalnya ada di laporan (Subbab 2.7 dan 3.5) dan di `CATATAN_IMPLEMENTASI.md`.

## 4. File mana ngapain

### Frontend (`frontend/`)

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

### Backend dan folder lainnya

| File | Isinya |
| --- | --- |
| `backend/index.js` | Titik mulai server. Nyambungin semua bagian. |
| `backend/routes/auth.js` | API daftar, masuk, keluar, ubah profil, hapus akun. |
| `backend/routes/asesmen.js` | API daftar karier, pertanyaan, kirim jawaban, ambil hasil (termasuk ringkasan). |
| `backend/routes/admin.js` | API khusus admin: kelola pertanyaan, ambang, aturan, templat penjelasan, akun, ringkasan. |
| `backend/ringkasan.js` | Ngisi templat penjelasan (dari database) jadi teks "Ringkasnya" di halaman hasil. |
| `backend/auth.js` | Ngecek siapa yang login dan perannya (mahasiswa atau admin). |
| `backend/db.js` | Koneksi database. |
| `behavioral-model/engine.js` | Semua rumus perhitungan. |
| `testing/engine.test.js` | Tes otomatis buat rumus. Jalanin dengan `npm test`. |
| `database/schema.sql` | Daftar tabel database. |
| `database/data.js` | Data awal: 16 karier, 36 pertanyaan, aturan, templat penjelasan, ambang. Cuma dipakai waktu database masih kosong. |
| `database/seed.js` | Masukin data awal itu ke database, dan memperbarui database lama ke model terbaru. |

## 5. Cara ngubah hal yang sering diubah

| Mau ngubah | Caranya |
| --- | --- |
| Teks yang dilihat mahasiswa | Edit `frontend/js/bahasa.js`. Tiap teks punya versi `id` dan `en`; ubah dua-duanya. |
| Warna mode gelap | Edit bagian `:root[data-tema='gelap']` di `frontend/css/styles.css`. |
| Warna atau huruf | Edit bagian `:root` di `frontend/css/styles.css`. |
| Teks halaman hasil | Edit `frontend/js/halaman/hasil.js` atau `frontend/js/hasil-bagian.js`. |
| Teks "Ringkasnya" | Lewat menu Admin > Ambang dan aturan, bagian Templat penjelasan. |
| Pertanyaan, ambang, teks rekomendasi, saran | Lewat menu admin di website, nggak perlu ngoding. |
| Rumus | Edit `behavioral-model/engine.js`, lalu jalanin `npm test` buat ngecek nggak ada yang rusak. |

## 6. Mode gelap dan bahasa

- **Mode gelap.** `js/awal.js` nempelin `data-tema="gelap"` atau `"terang"` ke tag `<html>`. Pertama kali dibuka,
  ikut setting laptop/HP; kalau tombolnya ditekan, pilihannya disimpan di browser. Warnanya diatur di CSS lewat
  variabel (`--ink`, `--paper`, dan seterusnya) yang nilainya diganti di bagian `:root[data-tema='gelap']`.
- **Bahasa.** Pilihan bahasa juga disimpan di browser. Teks tampilan diambil lewat `t('kunci')` dari
  `js/bahasa.js`. Di halaman HTML biasa (depan, masuk, daftar), elemennya diberi `data-teks="kunci"`.
  Pertanyaan kuesioner, deskripsi karier, dan saran latihan disimpan di database (kolom `teks_en`, `deskripsi_en`,
  `saran_en`); frontend minta versi Inggris lewat header `X-Bahasa: en`. Admin bisa mengisi teks Inggris di
  form butir dan form indikator. Menu admin sendiri selalu bahasa Indonesia.

## 7. Satu aturan penting

Waktu nampilin data di halaman, pakai fungsi `html` dari `js/umum.js`, contohnya:

```js
pasang(wadah, html`<p>Halo, ${pengguna.nama}</p>`);
```

Jangan nyusun HTML dengan nyambung string (`'<p>' + nama + '</p>'`). Fungsi `html` otomatis "menjinakkan" teks
dari pengguna, jadi kalau ada yang daftar dengan nama berisi kode HTML, kodenya nggak ikut jalan.

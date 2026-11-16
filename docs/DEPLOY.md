# Deploy YourWay (Render + Neon)

Hasil akhirnya: satu alamat `https://<nama>.onrender.com` yang bisa dibuka siapa saja, dan setiap `git push`
ke `main` otomatis memperbarui website.

## 1. Buat basis data di Neon

1. Daftar di https://neon.com (bisa pakai akun GitHub), lalu buat project baru. Pilih region Singapore.
2. Di dasbor project, klik **Connect** dan salin *connection string* (diawali `postgresql://`).

Neon dipakai karena paket gratisnya tidak punya batas waktu. PostgreSQL gratis milik Render dihapus
30 hari setelah dibuat.

## 2. Deploy di Render

1. Daftar di https://render.com pakai akun GitHub yang punya repo ini.
2. Klik **New > Blueprint**, pilih repo `adalahpokoknya`. Render membaca `render.yaml`.
3. Isi dua nilai yang diminta:
   - `DATABASE_URL`: connection string dari Neon.
   - `ADMIN_PASSWORD`: kata sandi Operator Admin (minimal 8 karakter, jangan `admin12345`).
4. Klik **Deploy Blueprint** dan tunggu sampai statusnya *Live*.

Tabel dan data awal (16 karier, 36 butir, aturan) dibuat otomatis saat server pertama kali menyala. Masuk
sebagai admin dengan `admin@yourway.local` dan kata sandi yang tadi diisi.

## Yang perlu diketahui

- **Server gratis tidur setelah 15 menit tanpa pengunjung.** Kunjungan pertama setelah itu butuh sekitar
  satu menit. Buka websitenya beberapa menit sebelum demo atau sesi UAT.
- **Jangan kosongkan `DATABASE_URL`.** Tanpa itu server memakai basis data tertanam di disk Render yang
  terhapus setiap deploy atau restart.
- **Penjelasan AI**: tambahkan `AI_PROVIDER` (`groq`/`gemini`/`qwen`) dan `AI_API_KEY` di Render >
  Environment bila ingin menyalakannya.

## Mengubah isi web bersama tim

- Tambahkan anggota tim di GitHub: repo > **Settings > Collaborators > Add people**.
- **Isi yang bisa diubah tanpa menyentuh kode** (masuk sebagai admin di website): butir kuesioner, bobot
  indikator, ambang, teks rekomendasi R1–R4, profil kebutuhan soft skill per karier, dan akun.
- **Isi yang ada di kode**:
  | Mau mengubah | Berkas |
  | --- | --- |
  | Teks halaman depan | `client/src/pages/Landing.tsx` |
  | Warna, huruf, tata letak | `client/src/styles.css` (token warna ada di bagian `:root`) |
  | Halaman hasil dan diagram | `client/src/pages/Hasil.tsx`, `client/src/components/charts.tsx` |
  | Kuesioner | `client/src/pages/Asesmen.tsx` |
  | Rumus skor dan aturan | `server/src/bms/engine.ts` (jalankan `npm test` setelah mengubah) |
  | Data awal (karier, butir, profil) | `server/src/seed/data.ts` (hanya dipakai saat basis data masih kosong) |
- Alur kerja: `git pull`, ubah, coba dengan `npm run dev`, lalu `git commit` dan `git push`. Render
  membangun ulang dalam beberapa menit. Bila build gagal, versi lama tetap tayang; lihat log di Render.

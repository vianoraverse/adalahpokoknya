-- Skema basis data YourWay (mengikuti entitas pada Tabel 3.7 laporan)

CREATE TABLE IF NOT EXISTS pengguna (
  id SERIAL PRIMARY KEY,
  nama TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  kata_sandi_hash TEXT NOT NULL,
  peran TEXT NOT NULL CHECK (peran IN ('mahasiswa', 'admin')),
  aktif BOOLEAN NOT NULL DEFAULT TRUE,
  persetujuan_pada TIMESTAMPTZ,
  dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS karier (
  id SERIAL PRIMARY KEY,
  kode TEXT NOT NULL UNIQUE,
  nama TEXT NOT NULL,
  area_fungsi TEXT NOT NULL,
  padanan TEXT NOT NULL,
  status_padanan TEXT NOT NULL,
  deskripsi TEXT NOT NULL DEFAULT '',
  urutan INT NOT NULL
);

CREATE TABLE IF NOT EXISTS indikator (
  id SERIAL PRIMARY KEY,
  kode TEXT NOT NULL UNIQUE,
  nama TEXT NOT NULL,
  variabel TEXT NOT NULL CHECK (variabel IN ('Y', 'X1', 'X2')),
  dasar TEXT NOT NULL DEFAULT '',
  saran TEXT NOT NULL DEFAULT '',
  urutan INT NOT NULL
);

CREATE TABLE IF NOT EXISTS butir (
  id SERIAL PRIMARY KEY,
  indikator_id INT NOT NULL REFERENCES indikator(id) ON DELETE CASCADE,
  teks TEXT NOT NULL,
  dasar TEXT NOT NULL DEFAULT '',
  urutan INT NOT NULL,
  aktif BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS asesmen (
  id SERIAL PRIMARY KEY,
  pengguna_id INT NOT NULL REFERENCES pengguna(id) ON DELETE CASCADE,
  karier_id INT NOT NULL REFERENCES karier(id),
  jenis TEXT NOT NULL CHECK (jenis IN ('awal', 'ulang')),
  dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS jawaban (
  asesmen_id INT NOT NULL REFERENCES asesmen(id) ON DELETE CASCADE,
  butir_id INT NOT NULL REFERENCES butir(id) ON DELETE CASCADE,
  nilai SMALLINT NOT NULL CHECK (nilai BETWEEN 1 AND 5),
  PRIMARY KEY (asesmen_id, butir_id)
);

-- Nilai internal (0–100) hanya disimpan di backend untuk pemetaan ambang dan analisis penelitian.
-- Yang ditampilkan ke mahasiswa hanya label kategori: perlu / cukup / sangat.
CREATE TABLE IF NOT EXISTS hasil_asesmen (
  asesmen_id INT PRIMARY KEY REFERENCES asesmen(id) ON DELETE CASCADE,
  nilai_y DOUBLE PRECISION NOT NULL,
  nilai_x1 DOUBLE PRECISION NOT NULL,
  nilai_x2 DOUBLE PRECISION NOT NULL,
  nilai_x DOUBLE PRECISION NOT NULL,
  kategori_y TEXT NOT NULL,
  kategori_x1 TEXT NOT NULL,
  kategori_x2 TEXT NOT NULL,
  kategori_x TEXT NOT NULL,
  aturan_kode TEXT NOT NULL,
  detail JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS aturan_rekomendasi (
  kode TEXT PRIMARY KEY,
  kondisi TEXT NOT NULL,
  interpretasi TEXT NOT NULL,
  jenis TEXT NOT NULL,
  teks TEXT NOT NULL
);

-- Templat kalimat penjelasan per aturan tabel keputusan (diisi otomatis dengan label kategori,
-- nama karier, dan tiga indikator prioritas).
CREATE TABLE IF NOT EXISTS templat_penjelasan (
  kode TEXT PRIMARY KEY,
  teks TEXT NOT NULL,
  teks_en TEXT
);

CREATE TABLE IF NOT EXISTS pengaturan (
  kunci TEXT PRIMARY KEY,
  nilai DOUBLE PRECISION NOT NULL,
  keterangan TEXT NOT NULL DEFAULT ''
);

-- Terjemahan bahasa Inggris untuk teks yang dilihat mahasiswa (kosong = pakai bahasa Indonesia).
ALTER TABLE karier ADD COLUMN IF NOT EXISTS deskripsi_en TEXT;
ALTER TABLE butir ADD COLUMN IF NOT EXISTS teks_en TEXT;
ALTER TABLE indikator ADD COLUMN IF NOT EXISTS saran_en TEXT;
ALTER TABLE aturan_rekomendasi ADD COLUMN IF NOT EXISTS teks_en TEXT;

-- Bagian model lama yang sudah tidak dipakai laporan (bobot, profil karier, SFS).
-- Hasil lama dihitung ulang dari tabel jawaban saat server menyala (lihat database/seed.js).
ALTER TABLE indikator DROP COLUMN IF EXISTS bobot;
DROP TABLE IF EXISTS profil_karier;
DROP TABLE IF EXISTS hasil_skor;

-- Dulu dipakai untuk menyimpan penjelasan AI; fitur itu sudah dihapus.
DROP TABLE IF EXISTS penjelasan_ai;

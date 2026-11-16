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
  bobot DOUBLE PRECISION NOT NULL DEFAULT 1,
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

CREATE TABLE IF NOT EXISTS profil_karier (
  karier_id INT NOT NULL REFERENCES karier(id) ON DELETE CASCADE,
  indikator_id INT NOT NULL REFERENCES indikator(id) ON DELETE CASCADE,
  req DOUBLE PRECISION NOT NULL,
  bobot DOUBLE PRECISION NOT NULL,
  PRIMARY KEY (karier_id, indikator_id)
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

CREATE TABLE IF NOT EXISTS hasil_skor (
  asesmen_id INT PRIMARY KEY REFERENCES asesmen(id) ON DELETE CASCADE,
  skor_y DOUBLE PRECISION NOT NULL,
  skor_x1 DOUBLE PRECISION NOT NULL,
  skor_x2 DOUBLE PRECISION NOT NULL,
  sfs_pilihan DOUBLE PRECISION NOT NULL,
  aturan_kode TEXT NOT NULL,
  status_kesesuaian TEXT NOT NULL,
  karier_teratas_id INT NOT NULL REFERENCES karier(id),
  detail JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS aturan_rekomendasi (
  kode TEXT PRIMARY KEY,
  kondisi TEXT NOT NULL,
  interpretasi TEXT NOT NULL,
  jenis TEXT NOT NULL,
  teks TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS penjelasan_ai (
  asesmen_id INT PRIMARY KEY REFERENCES asesmen(id) ON DELETE CASCADE,
  narasi TEXT NOT NULL,
  sumber TEXT NOT NULL,
  model TEXT,
  dibuat_pada TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS pengaturan (
  kunci TEXT PRIMARY KEY,
  nilai DOUBLE PRECISION NOT NULL,
  keterangan TEXT NOT NULL DEFAULT ''
);

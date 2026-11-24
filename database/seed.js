import bcrypt from 'bcryptjs';
import { config } from '../backend/config.js';
import { hitungUlangHasil } from '../backend/simpan-asesmen.js';
import { ATURAN, BUTIR, BUTIR_EN, DESKRIPSI_KARIER_EN, INDIKATOR, KARIER, PENGATURAN, SARAN_EN, TEMPLAT } from './data.js';

/** Teks bawaan aturan versi lama (model SFS). Kalau masih sama persis, teksnya diganti versi baru. */
const TEKS_ATURAN_LAMA = [
  "Niat dan soft skill kamu sudah sejalan dengan karier ini. Cari tantangan yang lebih tinggi: proyek nyata, magang, sertifikasi, atau kompetisi di bidang tersebut.",
  "Niat kamu sudah kuat. Fokuskan waktu pada tiga soft skill dengan selisih terbesar terhadap kebutuhan karier ini.",
  "Soft skill kamu sudah mendukung karier ini, tetapi niatnya belum mantap. Gali lebih jauh: baca deskripsi kerja, ngobrol dengan praktisi, atau coba proyek kecil di bidang ini.",
  "Niat dan kesesuaian soft skill masih perlu diperkuat. Jelajahi karier lain yang lebih selaras sambil membangun soft skill dasar."
];
/** Mengisi data awal bila tabel masih kosong. Aman dijalankan berulang. */
export async function seed(db) {
  const { rows } = await db.query('SELECT COUNT(*)::int AS n FROM karier');
  if (rows[0].n === 0) {
    await db.tx(async (q) => {
      for (const [i, k] of KARIER.entries()) {
        await q.query(
          'INSERT INTO karier (kode, nama, area_fungsi, padanan, status_padanan, deskripsi, urutan) VALUES ($1,$2,$3,$4,$5,$6,$7)',
          [...k, i + 1],
        );
      }
      for (const [i, ind] of INDIKATOR.entries()) {
        await q.query('INSERT INTO indikator (kode, nama, variabel, dasar, saran, urutan) VALUES ($1,$2,$3,$4,$5,$6)', [
          ...ind,
          i + 1,
        ]);
      }
      for (const [i, b] of BUTIR.entries()) {
        await q.query(
          'INSERT INTO butir (indikator_id, teks, dasar, urutan) SELECT id, $2, $3, $4 FROM indikator WHERE kode = $1',
          [b[0], b[1], b[2], i + 1],
        );
      }
    });
    console.log('[seed] Data awal dimuat: 16 karier, 18 indikator, 36 butir.');
  }
  await perbaruiModel(db);
  await isiTerjemahan(db);
  await hitungUlangHasil(db);
  const admin = await db.query('SELECT 1 FROM pengguna WHERE peran = $1 LIMIT 1', ['admin']);
  if (admin.rows.length === 0) {
    const hash = await bcrypt.hash(config.adminPassword, 10);
    await db.query('INSERT INTO pengguna (nama, email, kata_sandi_hash, peran) VALUES ($1,$2,$3,$4)', [
      'Operator Admin',
      config.adminEmail,
      hash,
      'admin',
    ]);
    console.log(`[seed] Akun Operator Admin dibuat: ${config.adminEmail}`);
  }
}

/**
 * Mengisi teks bahasa Inggris yang masih kosong. Dijalankan setiap server menyala, jadi basis data lama
 * (dibuat sebelum ada fitur bahasa) ikut terisi. Butir dicocokkan lewat teks Indonesianya, jadi butir yang
 * sudah diubah admin tidak ditimpa dan tetap tampil dalam bahasa Indonesia sampai admin mengisi terjemahannya.
 */
async function isiTerjemahan(db) {
  for (const [kode, teks] of Object.entries(DESKRIPSI_KARIER_EN)) {
    await db.query('UPDATE karier SET deskripsi_en = $2 WHERE kode = $1 AND deskripsi_en IS NULL', [kode, teks]);
  }
  for (const [kode, teks] of Object.entries(SARAN_EN)) {
    await db.query('UPDATE indikator SET saran_en = $2 WHERE kode = $1 AND saran_en IS NULL', [kode, teks]);
  }
  for (const [i, b] of BUTIR.entries()) {
    await db.query('UPDATE butir SET teks_en = $2 WHERE teks = $1 AND teks_en IS NULL', [b[1], BUTIR_EN[i]]);
  }
}

/**
 * Menyamakan aturan, templat, dan pengaturan dengan model terbaru (laporan per 24 November 2026).
 * Dijalankan setiap server menyala. Basis data lama (model SFS) ikut diperbarui; teks yang sudah
 * diubah admin tidak ditimpa.
 */
async function perbaruiModel(db) {
  await db.tx(async (q) => {
    // Aturan ALTERNATIF ikut hilang bersama profil karier.
    await q.query("DELETE FROM aturan_rekomendasi WHERE kode = 'ALTERNATIF'");
    for (const [kode, kondisi, interpretasi, jenis, teks, teksEn] of ATURAN) {
      await q.query(
        `INSERT INTO aturan_rekomendasi (kode, kondisi, interpretasi, jenis, teks, teks_en) VALUES ($1,$2,$3,$4,$5,$6)
         ON CONFLICT (kode) DO UPDATE SET kondisi = EXCLUDED.kondisi, interpretasi = EXCLUDED.interpretasi,
           jenis = EXCLUDED.jenis, teks_en = COALESCE(aturan_rekomendasi.teks_en, EXCLUDED.teks_en)`,
        [kode, kondisi, interpretasi, jenis, teks, teksEn],
      );
      await q.query('UPDATE aturan_rekomendasi SET teks = $2 WHERE kode = $1 AND teks = ANY($3::text[])', [
        kode,
        teks,
        TEKS_ATURAN_LAMA,
      ]);
    }
    for (const [kode, teks, teksEn] of TEMPLAT) {
      await q.query(
        'INSERT INTO templat_penjelasan (kode, teks, teks_en) VALUES ($1,$2,$3) ON CONFLICT (kode) DO NOTHING',
        [kode, teks, teksEn],
      );
    }
    // Pengaturan: buang kunci model lama, tambah yang belum ada, ganti ambang bawaan lama (50/75) ke 56/76.
    const kunci = PENGATURAN.map((p) => p[0]);
    await q.query('DELETE FROM pengaturan WHERE NOT (kunci = ANY($1::text[]))', [kunci]);
    const lama = await q.query('SELECT kunci, nilai FROM pengaturan');
    const nilaiLama = Object.fromEntries(lama.rows.map((r) => [r.kunci, Number(r.nilai)]));
    const ambangLama = nilaiLama.ambang_rendah === 50 && nilaiLama.ambang_tinggi === 75;
    for (const [k, nilai, keterangan] of PENGATURAN) {
      await q.query(
        `INSERT INTO pengaturan (kunci, nilai, keterangan) VALUES ($1,$2,$3)
         ON CONFLICT (kunci) DO UPDATE SET keterangan = EXCLUDED.keterangan`,
        [k, nilai, keterangan],
      );
      if (ambangLama && k.startsWith('ambang_')) await q.query('UPDATE pengaturan SET nilai = $2 WHERE kunci = $1', [k, nilai]);
    }
  });
}

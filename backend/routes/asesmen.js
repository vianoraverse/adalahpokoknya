import { Router } from 'express';
import { z } from 'zod';
import { wajibLogin } from '../auth.js';
import { getDb } from '../db.js';
import { HttpError, bahasa, h } from '../http.js';
import { susunRingkasan } from '../ringkasan.js';
import { simpanAsesmen } from '../simpan-asesmen.js';
export const asesmenRouter = Router();
// Daftar 16 karier (publik, dipakai juga di halaman depan).
asesmenRouter.get(
  '/careers',
  h(async (req, res) => {
    const db = await getDb();
    // Untuk tampilan bahasa Inggris, deskripsi diambil dari kolom deskripsi_en (kalau sudah diisi).
    const deskripsi = bahasa(req) === 'en' ? 'COALESCE(deskripsi_en, deskripsi)' : 'deskripsi';
    const { rows } = await db.query(
      `SELECT id, kode, nama, area_fungsi, padanan, status_padanan, ${deskripsi} AS deskripsi FROM karier ORDER BY urutan`,
    );
    res.json({ karier: rows });
  }),
);
// Instrumen kuesioner aktif (FR-03).
asesmenRouter.get(
  '/instrument',
  wajibLogin(),
  h(async (req, res) => {
    const db = await getDb();
    const teks = bahasa(req) === 'en' ? 'COALESCE(b.teks_en, b.teks)' : 'b.teks';
    const { rows } = await db.query(`SELECT b.id, ${teks} AS teks, i.kode AS indikator_kode, i.nama AS indikator, i.variabel
     FROM butir b JOIN indikator i ON i.id = b.indikator_id
     WHERE b.aktif = TRUE ORDER BY i.urutan, b.urutan, b.id`);
    res.json({ butir: rows });
  }),
);
/** Teks aturan rekomendasi dan templat penjelasan terbaru (yang diatur admin), sesuai bahasa. */
async function muatTeks(q) {
  const [aturan, templat] = await Promise.all([
    q.query('SELECT kode, jenis, teks, teks_en FROM aturan_rekomendasi'),
    q.query('SELECT kode, teks, teks_en FROM templat_penjelasan'),
  ]);
  return {
    aturan: Object.fromEntries(aturan.rows.map((r) => [r.kode, r])),
    templat: Object.fromEntries(templat.rows.map((r) => [r.kode, r])),
  };
}

async function ambilAsesmen(q, id, penggunaId, bhs = 'id') {
  const { rows } = await q.query(
    `SELECT a.id, a.jenis, a.dibuat_pada, k.id AS karier_id, k.kode AS karier_kode, k.nama AS karier_nama, k.area_fungsi,
            h.detail
     FROM asesmen a
     JOIN karier k ON k.id = a.karier_id
     JOIN hasil_asesmen h ON h.asesmen_id = a.id
     WHERE a.id = $1 AND a.pengguna_id = $2`,
    [id, penggunaId],
  );
  const r = rows[0];
  // Hasil hanya dapat diakses pemilik akun (NFR-Privacy): asesmen milik orang lain dianggap tidak ada.
  if (!r) throw new HttpError(404, 'Hasil asesmen tidak ditemukan.');
  const hasil = r.detail;
  const { aturan, templat } = await muatTeks(q);
  const teksAturan = (kode) => {
    const x = aturan[kode];
    return x ? { kode, teks: (bhs === 'en' && x.teks_en) || x.teks } : null;
  };
  // Nilai angka tidak dikirim ke mahasiswa: yang dikirim hanya kategori, prioritas, dan teks.
  // Nilai per indikator tetap dikirim untuk spider chart (digambar tanpa angka).
  return {
    id: r.id,
    jenis: r.jenis,
    dibuatPada: r.dibuat_pada,
    karier: { id: r.karier_id, kode: r.karier_kode, nama: r.karier_nama, areaFungsi: r.area_fungsi },
    kategori: hasil.kategori,
    prioritas: hasil.prioritas.map((p) => ({
      kode: p.kode,
      nama: p.nama,
      saran: (bhs === 'en' && p.saranEn) || p.saran,
    })),
    softSkill: hasil.nilaiIndikator
      .filter((i) => i.variabel !== 'Y')
      .map((i) => ({ kode: i.kode, nama: i.nama, variabel: i.variabel, nilai: i.nilai })),
    ambang: { rendah: hasil.ambang.ambang_rendah, tinggi: hasil.ambang.ambang_tinggi },
    rekomendasi: {
      utama: teksAturan(hasil.aturan),
      tambahan: hasil.aturanTambahan.map(teksAturan).filter(Boolean),
    },
    ringkasan: susunRingkasan({ templat, hasil, karier: r.karier_nama, bahasa: bhs }),
  };
}
// Kirim jawaban → hitung nilai dan kategori (UC-10) → simpan hasil (FR-04 dan FR-05).
asesmenRouter.post(
  '/assessments',
  wajibLogin('mahasiswa'),
  h(async (req, res) => {
    const d = z
      .object({
        karierId: z.number().int(),
        jawaban: z.record(z.string(), z.number().int().min(1).max(5)),
      })
      .parse(req.body);
    const db = await getDb();
    const penggunaId = req.pengguna.id;
    const id = await simpanAsesmen(db, penggunaId, d.karierId, d.jawaban);
    res.status(201).json({ asesmen: await ambilAsesmen(db, id, penggunaId, bahasa(req)) });
  }),
);
asesmenRouter.get(
  '/assessments',
  wajibLogin('mahasiswa'),
  h(async (req, res) => {
    const db = await getDb();
    const { rows } = await db.query(
      `SELECT a.id, a.jenis, a.dibuat_pada AS "dibuatPada", k.nama AS karier, k.kode AS "kodeKarier",
            h.kategori_y AS "kategoriY", h.kategori_x AS "kategoriX"
     FROM asesmen a JOIN karier k ON k.id = a.karier_id JOIN hasil_asesmen h ON h.asesmen_id = a.id
     WHERE a.pengguna_id = $1 ORDER BY a.dibuat_pada DESC, a.id DESC`,
      [req.pengguna.id],
    );
    res.json({ asesmen: rows });
  }),
);
asesmenRouter.get(
  '/assessments/:id',
  wajibLogin('mahasiswa'),
  h(async (req, res) => {
    const db = await getDb();
    res.json({ asesmen: await ambilAsesmen(db, Number(req.params.id), req.pengguna.id, bahasa(req)) });
  }),
);

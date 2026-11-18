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
asesmenRouter.get(
  '/careers/:id/profile',
  wajibLogin(),
  h(async (req, res) => {
    const db = await getDb();
    const { rows } = await db.query(
      `SELECT i.id AS indikator_id, i.kode, i.nama, i.variabel, p.req, p.bobot
     FROM profil_karier p JOIN indikator i ON i.id = p.indikator_id
     WHERE p.karier_id = $1 ORDER BY i.urutan`,
      [Number(req.params.id)],
    );
    res.json({ profil: rows });
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
/** Data untuk kalimat "Ringkasnya" (tanpa identitas mahasiswa, hanya nama karier dan soft skill). */
function ringkasan(a, bhs) {
  const hs = a.hasil;
  // Hasil lama (sebelum ada prioritasHasil) hanya punya prioritas untuk karier pilihan. Kalau karier hasilnya
  // berbeda, datanya tidak ada (null) dan ringkasan meminta mahasiswa mengulang tes.
  const sama = hs.karierTeratas.karierId === a.karier.id;
  const kembangkan = hs.prioritasHasil ?? (sama ? hs.prioritas : null);
  return susunRingkasan({
    karierHasil: hs.karierTeratas.nama,
    karierPilihan: a.karier.nama,
    samaDenganPilihan: sama,
    kembangkan: kembangkan?.map((p) => ({ nama: p.nama })) ?? null,
    bahasa: bhs,
  });
}
async function ambilAsesmen(q, id, penggunaId, bhs = 'id') {
  const { rows } = await q.query(
    `SELECT a.id, a.jenis, a.dibuat_pada, k.id AS karier_id, k.nama AS karier_nama, k.area_fungsi,
            h.detail
     FROM asesmen a
     JOIN karier k ON k.id = a.karier_id
     JOIN hasil_skor h ON h.asesmen_id = a.id
     WHERE a.id = $1 AND a.pengguna_id = $2`,
    [id, penggunaId],
  );
  const r = rows[0];
  // Hasil hanya dapat diakses pemilik akun (NFR-Privacy): asesmen milik orang lain dianggap tidak ada.
  if (!r) throw new HttpError(404, 'Hasil asesmen tidak ditemukan.');
  const a = {
    id: r.id,
    jenis: r.jenis,
    dibuatPada: r.dibuat_pada,
    karier: { id: r.karier_id, nama: r.karier_nama, areaFungsi: r.area_fungsi },
    hasil: r.detail,
  };
  a.ringkasan = ringkasan(a, bhs);
  return a;
}
// Kirim jawaban → hitung skor (UC-11) → simpan hasil (FR-04 s.d. FR-06).
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
      `SELECT a.id, a.jenis, a.dibuat_pada AS "dibuatPada", k.nama AS karier, kh.nama AS "karierHasil", kh.kode AS "kodeHasil",
            h.skor_y AS y, h.skor_x1 AS x1, h.skor_x2 AS x2, h.sfs_pilihan AS sfs,
            h.aturan_kode AS aturan, h.status_kesesuaian AS status
     FROM asesmen a JOIN karier k ON k.id = a.karier_id JOIN hasil_skor h ON h.asesmen_id = a.id
     JOIN karier kh ON kh.id = h.karier_teratas_id
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

import { Router } from 'express';
import { z } from 'zod';
import { susunPenjelasan, type DataPenjelasan } from '../ai.js';
import { wajibLogin } from '../auth.js';
import { hitung, type Hasil } from '../bms/engine.js';
import { getDb, type Queryable } from '../db.js';
import { HttpError, h } from '../http.js';
import { muatModel } from '../model.js';

export const asesmenRouter = Router();

// Daftar 16 karier (publik, dipakai juga di halaman depan).
asesmenRouter.get('/careers', h(async (_req, res) => {
  const db = await getDb();
  const { rows } = await db.query('SELECT id, kode, nama, area_fungsi, padanan, status_padanan, deskripsi FROM karier ORDER BY urutan');
  res.json({ karier: rows });
}));

asesmenRouter.get('/careers/:id/profile', wajibLogin(), h(async (req, res) => {
  const db = await getDb();
  const { rows } = await db.query(
    `SELECT i.id AS indikator_id, i.kode, i.nama, i.variabel, p.req, p.bobot
     FROM profil_karier p JOIN indikator i ON i.id = p.indikator_id
     WHERE p.karier_id = $1 ORDER BY i.urutan`,
    [Number(req.params.id)],
  );
  res.json({ profil: rows });
}));

// Instrumen kuesioner aktif (FR-03).
asesmenRouter.get('/instrument', wajibLogin(), h(async (_req, res) => {
  const db = await getDb();
  const { rows } = await db.query(
    `SELECT b.id, b.teks, i.kode AS indikator_kode, i.nama AS indikator, i.variabel
     FROM butir b JOIN indikator i ON i.id = b.indikator_id
     WHERE b.aktif = TRUE ORDER BY i.urutan, b.urutan, b.id`,
  );
  res.json({ butir: rows });
}));

async function ambilAsesmen(q: Queryable, id: number, penggunaId: number) {
  const { rows } = await q.query(
    `SELECT a.id, a.jenis, a.dibuat_pada, k.id AS karier_id, k.nama AS karier_nama, k.area_fungsi,
            h.detail, pj.narasi, pj.sumber, pj.model
     FROM asesmen a
     JOIN karier k ON k.id = a.karier_id
     JOIN hasil_skor h ON h.asesmen_id = a.id
     LEFT JOIN penjelasan_ai pj ON pj.asesmen_id = a.id
     WHERE a.id = $1 AND a.pengguna_id = $2`,
    [id, penggunaId],
  );
  const r = rows[0];
  // Hasil hanya dapat diakses pemilik akun (NFR-Privacy): asesmen milik orang lain dianggap tidak ada.
  if (!r) throw new HttpError(404, 'Hasil asesmen tidak ditemukan.');
  return {
    id: r.id,
    jenis: r.jenis,
    dibuatPada: r.dibuat_pada,
    karier: { id: r.karier_id, nama: r.karier_nama, areaFungsi: r.area_fungsi },
    hasil: r.detail,
    penjelasan: r.narasi ? { narasi: r.narasi, sumber: r.sumber, model: r.model } : null,
  };
}

// Kirim jawaban → hitung skor (UC-11) → simpan hasil (FR-04 s.d. FR-06).
asesmenRouter.post('/assessments', wajibLogin('mahasiswa'), h(async (req, res) => {
  const d = z.object({
    karierId: z.number().int(),
    jawaban: z.record(z.string(), z.number().int().min(1).max(5)),
  }).parse(req.body);
  const db = await getDb();
  const model = await muatModel(db);
  const jawaban: Record<number, number> = {};
  for (const b of model.butir) {
    const n = d.jawaban[String(b.id)];
    if (n === undefined) throw new HttpError(400, 'Masih ada butir yang belum dijawab.');
    jawaban[b.id] = n;
  }
  let hasil: Hasil;
  try {
    hasil = hitung({ ...model, jawaban, karierPilihanId: d.karierId });
  } catch (e) {
    throw new HttpError(400, (e as Error).message);
  }
  const rekomendasi = {
    utama: model.aturan[hasil.aturan],
    tambahan: hasil.aturanTambahan.map((k) => model.aturan[k]).filter(Boolean),
  };
  const penggunaId = req.pengguna!.id;
  const id = await db.tx(async (q) => {
    const lama = await q.query('SELECT 1 FROM asesmen WHERE pengguna_id = $1 LIMIT 1', [penggunaId]);
    const a = await q.query(
      'INSERT INTO asesmen (pengguna_id, karier_id, jenis) VALUES ($1,$2,$3) RETURNING id',
      [penggunaId, d.karierId, lama.rows.length ? 'ulang' : 'awal'],
    );
    const asesmenId: number = a.rows[0].id;
    const ids = Object.keys(jawaban).map(Number);
    await q.query(
      `INSERT INTO jawaban (asesmen_id, butir_id, nilai)
       SELECT $1, x.butir_id, x.nilai FROM unnest($2::int[], $3::int[]) AS x(butir_id, nilai)`,
      [asesmenId, ids, ids.map((i) => jawaban[i])],
    );
    await q.query(
      `INSERT INTO hasil_skor (asesmen_id, skor_y, skor_x1, skor_x2, sfs_pilihan, aturan_kode, status_kesesuaian, karier_teratas_id, detail)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb)`,
      [asesmenId, hasil.skor.Y, hasil.skor.X1, hasil.skor.X2, hasil.sfsPilihan, hasil.aturan, hasil.status, hasil.karierTeratas.karierId, JSON.stringify({ ...hasil, rekomendasi })],
    );
    return asesmenId;
  });
  res.status(201).json({ asesmen: await ambilAsesmen(db, id, penggunaId) });
}));

asesmenRouter.get('/assessments', wajibLogin('mahasiswa'), h(async (req, res) => {
  const db = await getDb();
  const { rows } = await db.query(
    `SELECT a.id, a.jenis, a.dibuat_pada AS "dibuatPada", k.nama AS karier,
            h.skor_y AS y, h.skor_x1 AS x1, h.skor_x2 AS x2, h.sfs_pilihan AS sfs,
            h.aturan_kode AS aturan, h.status_kesesuaian AS status
     FROM asesmen a JOIN karier k ON k.id = a.karier_id JOIN hasil_skor h ON h.asesmen_id = a.id
     WHERE a.pengguna_id = $1 ORDER BY a.dibuat_pada DESC, a.id DESC`,
    [req.pengguna!.id],
  );
  res.json({ asesmen: rows });
}));

asesmenRouter.get('/assessments/:id', wajibLogin('mahasiswa'), h(async (req, res) => {
  const db = await getDb();
  res.json({ asesmen: await ambilAsesmen(db, Number(req.params.id), req.pengguna!.id) });
}));

// Penjelasan AI (UC-12) dipanggil terpisah setelah skor tampil (NFR-Performance).
asesmenRouter.post('/assessments/:id/explanation', wajibLogin('mahasiswa'), h(async (req, res) => {
  const db = await getDb();
  const a = await ambilAsesmen(db, Number(req.params.id), req.pengguna!.id);
  if (a.penjelasan && !req.body?.ulang) {
    res.json({ penjelasan: a.penjelasan });
    return;
  }
  const hs = a.hasil as Hasil & { rekomendasi: { utama: any; tambahan: any[] } };
  const softSkill = hs.skorIndikator.filter((s) => s.variabel !== 'Y');
  // Tanpa identitas: hanya nama karier, skor, dan aturan.
  const data: DataPenjelasan = {
    karierPilihan: a.karier.nama,
    skor: { Y: hs.skor.Y, X1: hs.skor.X1, X2: hs.skor.X2, SFS: hs.sfsPilihan },
    kategori: hs.kategori,
    status: hs.status,
    karierTeratas: { nama: hs.karierTeratas.nama, sfs: hs.karierTeratas.sfs },
    aturan: hs.rekomendasi.utama,
    tambahan: hs.rekomendasi.tambahan,
    prioritas: hs.prioritas.map((p) => ({ nama: p.nama, skor: p.skor, req: p.req, gap: p.gap, saran: p.saran })),
    kekuatan: [...softSkill].sort((x, y) => y.skor - x.skor).slice(0, 3).map((s) => ({ nama: s.nama, skor: s.skor })),
  };
  const p = await susunPenjelasan(data);
  await db.query(
    `INSERT INTO penjelasan_ai (asesmen_id, narasi, sumber, model) VALUES ($1,$2,$3,$4)
     ON CONFLICT (asesmen_id) DO UPDATE SET narasi = EXCLUDED.narasi, sumber = EXCLUDED.sumber, model = EXCLUDED.model, dibuat_pada = now()`,
    [a.id, p.narasi, p.sumber, p.model],
  );
  res.json({ penjelasan: p });
}));

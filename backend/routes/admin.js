import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { z } from 'zod';
import { wajibLogin } from '../auth.js';
import { getDb } from '../db.js';
import { HttpError, h } from '../http.js';
export const adminRouter = Router();
adminRouter.use(wajibLogin('admin'));
const teks = (label, maks = 500) =>
  z.string().trim().min(1, `${label} wajib diisi.`).max(maks, `${label} terlalu panjang.`);
/* ---------- Instrumen: butir kuesioner (UC-06) ---------- */
adminRouter.get(
  '/items',
  h(async (_req, res) => {
    const db = await getDb();
    const [butir, indikator] = await Promise.all([
      db.query(`SELECT b.id, b.teks, b.teks_en, b.dasar, b.aktif, b.urutan, i.id AS indikator_id, i.nama AS indikator, i.variabel
       FROM butir b JOIN indikator i ON i.id = b.indikator_id ORDER BY i.urutan, b.urutan, b.id`),
      db.query('SELECT id, kode, nama, variabel, dasar, saran FROM indikator ORDER BY urutan'),
    ]);
    res.json({ butir: butir.rows, indikator: indikator.rows });
  }),
);
const skemaButir = z.object({
  indikatorId: z.number({ invalid_type_error: 'Pilih indikator.', required_error: 'Pilih indikator.' }).int(),
  teks: teks('Teks pertanyaan'),
  // Terjemahan bahasa Inggris (opsional). Kosong = mahasiswa yang memilih English melihat teks Indonesia.
  teksEn: z.string().trim().max(500).default(''),
  dasar: z.string().trim().max(200).default(''),
  aktif: z.boolean().default(true),
});
adminRouter.post(
  '/items',
  h(async (req, res) => {
    const d = skemaButir.parse(req.body);
    const db = await getDb();
    const { rows } = await db.query(
      `INSERT INTO butir (indikator_id, teks, teks_en, dasar, aktif, urutan)
     VALUES ($1,$2,$3,$4,$5,(SELECT COALESCE(MAX(urutan),0)+1 FROM butir)) RETURNING id`,
      [d.indikatorId, d.teks, d.teksEn || null, d.dasar, d.aktif],
    );
    res.status(201).json({ id: rows[0].id });
  }),
);
async function pastikanIndikatorPunyaButir(db, butirId, indikatorBaru) {
  const { rows } = await db.query(
    `SELECT b.indikator_id, (SELECT COUNT(*)::int FROM butir x WHERE x.indikator_id = b.indikator_id AND x.aktif AND x.id <> b.id) AS sisa
     FROM butir b WHERE b.id = $1`,
    [butirId],
  );
  if (!rows[0]) throw new HttpError(404, 'Butir tidak ditemukan.');
  if (rows[0].sisa === 0 && indikatorBaru !== rows[0].indikator_id) {
    throw new HttpError(
      400,
      'Setiap indikator harus memiliki minimal satu butir aktif. Tambahkan butir pengganti dahulu.',
    );
  }
}
adminRouter.put(
  '/items/:id',
  h(async (req, res) => {
    const d = skemaButir.parse(req.body);
    const id = Number(req.params.id);
    const db = await getDb();
    await pastikanIndikatorPunyaButir(db, id, d.aktif ? d.indikatorId : undefined);
    await db.query(
      'UPDATE butir SET indikator_id = $1, teks = $2, teks_en = $3, dasar = $4, aktif = $5 WHERE id = $6',
      [d.indikatorId, d.teks, d.teksEn || null, d.dasar, d.aktif, id],
    );
    res.json({ ok: true });
  }),
);
adminRouter.delete(
  '/items/:id',
  h(async (req, res) => {
    const id = Number(req.params.id);
    const db = await getDb();
    await pastikanIndikatorPunyaButir(db, id);
    // Butir yang sudah pernah dijawab dinonaktifkan agar riwayat jawaban tetap utuh.
    const dipakai = await db.query('SELECT 1 FROM jawaban WHERE butir_id = $1 LIMIT 1', [id]);
    if (dipakai.rows.length) {
      await db.query('UPDATE butir SET aktif = FALSE WHERE id = $1', [id]);
      res.json({ ok: true, dinonaktifkan: true });
      return;
    }
    await db.query('DELETE FROM butir WHERE id = $1', [id]);
    res.json({ ok: true, dinonaktifkan: false });
  }),
);
/* ---------- Model penilaian: ambang, aturan tabel keputusan, templat penjelasan (UC-06, UC-07) ---------- */
adminRouter.get(
  '/model',
  h(async (_req, res) => {
    const db = await getDb();
    const [indikator, pengaturan, aturan, templat] = await Promise.all([
      db.query('SELECT id, kode, nama, variabel, saran, saran_en FROM indikator ORDER BY urutan'),
      db.query(`SELECT kunci, nilai, keterangan FROM pengaturan
              ORDER BY array_position(ARRAY['ambang_rendah','ambang_tinggi','jumlah_prioritas']::text[], kunci)`),
      db.query(`SELECT kode, kondisi, interpretasi, jenis, teks, teks_en FROM aturan_rekomendasi
              ORDER BY array_position(ARRAY['R1','R2','R3','R4','X1_RENDAH','X2_RENDAH']::text[], kode)`),
      db.query(`SELECT kode, teks, teks_en FROM templat_penjelasan
              ORDER BY array_position(ARRAY['R1','R2','R3','R4','X1_RENDAH','X2_RENDAH']::text[], kode)`),
    ]);
    res.json({ indikator: indikator.rows, pengaturan: pengaturan.rows, aturan: aturan.rows, templat: templat.rows });
  }),
);
adminRouter.put(
  '/indicators/:id',
  h(async (req, res) => {
    const d = z
      .object({
        saran: z.string().trim().max(500).default(''),
        saranEn: z.string().trim().max(500).default(''),
      })
      .parse(req.body);
    const db = await getDb();
    await db.query('UPDATE indikator SET saran = $1, saran_en = $2 WHERE id = $3', [
      d.saran,
      d.saranEn || null,
      Number(req.params.id),
    ]);
    res.json({ ok: true });
  }),
);
adminRouter.put(
  '/settings',
  h(async (req, res) => {
    const d = z
      .record(
        z.string(),
        z
          .number({ invalid_type_error: 'Ambang harus berupa angka.' })
          .min(0, 'Nilai minimal 0.')
          .max(100, 'Nilai maksimal 100.'),
      )
      .parse(req.body);
    if (d.ambang_rendah !== undefined && d.ambang_tinggi !== undefined && d.ambang_rendah >= d.ambang_tinggi) {
      throw new HttpError(400, 'Batas "Perlu Dikembangkan" harus lebih kecil dari batas "Sangat Cocok".');
    }
    if (d.jumlah_prioritas !== undefined && (d.jumlah_prioritas < 1 || d.jumlah_prioritas > 14)) {
      throw new HttpError(400, 'Jumlah indikator prioritas harus antara 1 dan 14.');
    }
    const db = await getDb();
    for (const [k, v] of Object.entries(d)) await db.query('UPDATE pengaturan SET nilai = $1 WHERE kunci = $2', [v, k]);
    res.json({ ok: true });
  }),
);
adminRouter.put(
  '/rules/:kode',
  h(async (req, res) => {
    const d = z
      .object({
        interpretasi: teks('Interpretasi', 200),
        jenis: teks('Jenis rekomendasi', 200),
        teks: teks('Teks rekomendasi', 800),
        teksEn: z.string().trim().max(800).default(''),
      })
      .parse(req.body);
    const db = await getDb();
    await db.query(
      'UPDATE aturan_rekomendasi SET interpretasi = $1, jenis = $2, teks = $3, teks_en = $4 WHERE kode = $5',
      [d.interpretasi, d.jenis, d.teks, d.teksEn || null, req.params.kode],
    );
    res.json({ ok: true });
  }),
);
adminRouter.put(
  '/templates/:kode',
  h(async (req, res) => {
    const d = z
      .object({
        teks: teks('Templat penjelasan', 1000),
        teksEn: z.string().trim().max(1000).default(''),
      })
      .parse(req.body);
    const db = await getDb();
    const { rowCount } = await db.query('UPDATE templat_penjelasan SET teks = $1, teks_en = $2 WHERE kode = $3', [
      d.teks,
      d.teksEn || null,
      req.params.kode,
    ]);
    if (rowCount === 0) throw new HttpError(404, 'Templat tidak ditemukan.');
    res.json({ ok: true });
  }),
);
/* ---------- Akun pengguna (UC-09) ---------- */
adminRouter.get(
  '/users',
  h(async (_req, res) => {
    const db = await getDb();
    const { rows } = await db.query(`SELECT p.id, p.nama, p.email, p.peran, p.aktif, p.dibuat_pada AS "dibuatPada",
            (SELECT COUNT(*)::int FROM asesmen a WHERE a.pengguna_id = p.id) AS "jumlahAsesmen"
     FROM pengguna p ORDER BY p.peran, p.nama`);
    res.json({ pengguna: rows });
  }),
);
const skemaAkun = z.object({
  nama: teks('Nama', 80),
  email: z.string().trim().toLowerCase().email('Format email tidak valid.'),
  peran: z.enum(['mahasiswa', 'admin'], { errorMap: () => ({ message: 'Pilih peran.' }) }),
  aktif: z.boolean().default(true),
  password: z.string().min(8, 'Kata sandi minimal 8 karakter.').max(72).optional(),
});
adminRouter.post(
  '/users',
  h(async (req, res) => {
    const d = skemaAkun.parse(req.body);
    if (!d.password) throw new HttpError(400, 'Kata sandi wajib diisi untuk akun baru.');
    const db = await getDb();
    const ada = await db.query('SELECT 1 FROM pengguna WHERE email = $1', [d.email]);
    if (ada.rows.length) throw new HttpError(409, 'Email ini sudah terdaftar.');
    const { rows } = await db.query(
      'INSERT INTO pengguna (nama, email, kata_sandi_hash, peran, aktif) VALUES ($1,$2,$3,$4,$5) RETURNING id',
      [d.nama, d.email, await bcrypt.hash(d.password, 10), d.peran, d.aktif],
    );
    res.status(201).json({ id: rows[0].id });
  }),
);
async function jagaAdminTerakhir(db, id) {
  const { rows } = await db.query(
    "SELECT COUNT(*)::int AS n FROM pengguna WHERE peran = 'admin' AND aktif = TRUE AND id <> $1",
    [id],
  );
  if (rows[0].n === 0) throw new HttpError(400, 'Harus ada minimal satu Operator Admin yang aktif.');
}
adminRouter.put(
  '/users/:id',
  h(async (req, res) => {
    const d = skemaAkun.parse(req.body);
    const id = Number(req.params.id);
    const db = await getDb();
    const lama = await db.query('SELECT peran FROM pengguna WHERE id = $1', [id]);
    if (!lama.rows[0]) throw new HttpError(404, 'Akun tidak ditemukan.');
    if (lama.rows[0].peran === 'admin' && (d.peran !== 'admin' || !d.aktif)) await jagaAdminTerakhir(db, id);
    const bentrok = await db.query('SELECT 1 FROM pengguna WHERE email = $1 AND id <> $2', [d.email, id]);
    if (bentrok.rows.length) throw new HttpError(409, 'Email ini sudah dipakai akun lain.');
    await db.query('UPDATE pengguna SET nama = $1, email = $2, peran = $3, aktif = $4 WHERE id = $5', [
      d.nama,
      d.email,
      d.peran,
      d.aktif,
      id,
    ]);
    if (d.password)
      await db.query('UPDATE pengguna SET kata_sandi_hash = $1 WHERE id = $2', [await bcrypt.hash(d.password, 10), id]);
    res.json({ ok: true });
  }),
);
adminRouter.delete(
  '/users/:id',
  h(async (req, res) => {
    const id = Number(req.params.id);
    if (id === req.pengguna.id) throw new HttpError(400, 'Hapus akun sendiri lewat menu Pengaturan.');
    const db = await getDb();
    const lama = await db.query('SELECT peran FROM pengguna WHERE id = $1', [id]);
    if (!lama.rows[0]) throw new HttpError(404, 'Akun tidak ditemukan.');
    if (lama.rows[0].peran === 'admin') await jagaAdminTerakhir(db, id);
    await db.query('DELETE FROM pengguna WHERE id = $1', [id]);
    res.json({ ok: true });
  }),
);
/* ---------- Pemantauan hasil agregat dan anonim (UC-09) ---------- */
adminRouter.get(
  '/aggregate',
  h(async (_req, res) => {
    const db = await getDb();
    // Hanya asesmen terbaru tiap mahasiswa yang dihitung, tanpa identitas.
    const terbaru = `SELECT DISTINCT ON (a.pengguna_id) a.id, a.karier_id FROM asesmen a
                     JOIN hasil_asesmen h ON h.asesmen_id = a.id
                     ORDER BY a.pengguna_id, a.dibuat_pada DESC, a.id DESC`;
    const sebaran = (kolom) =>
      db.query(`SELECT h.${kolom} AS kategori, COUNT(*)::int AS n FROM (${terbaru}) t
                JOIN hasil_asesmen h ON h.asesmen_id = t.id GROUP BY h.${kolom}`);
    const [ringkas, y, x1, x2, x, aturan, karier, detail, akun] = await Promise.all([
      db.query(`SELECT COUNT(*)::int AS responden, AVG(h.nilai_y) AS y, AVG(h.nilai_x1) AS x1,
                       AVG(h.nilai_x2) AS x2, AVG(h.nilai_x) AS x
                FROM (${terbaru}) t JOIN hasil_asesmen h ON h.asesmen_id = t.id`),
      sebaran('kategori_y'),
      sebaran('kategori_x1'),
      sebaran('kategori_x2'),
      sebaran('kategori_x'),
      db.query(`SELECT h.aturan_kode AS kode, COUNT(*)::int AS n FROM (${terbaru}) t
                JOIN hasil_asesmen h ON h.asesmen_id = t.id GROUP BY h.aturan_kode`),
      db.query(`SELECT k.nama, COUNT(t.id)::int AS n, AVG(h.nilai_y) AS y
                FROM karier k LEFT JOIN (${terbaru}) t ON t.karier_id = k.id
                LEFT JOIN hasil_asesmen h ON h.asesmen_id = t.id
                GROUP BY k.id, k.nama, k.urutan ORDER BY n DESC, k.urutan`),
      db.query(`SELECT h.detail FROM (${terbaru}) t JOIN hasil_asesmen h ON h.asesmen_id = t.id`),
      db.query(`SELECT (SELECT COUNT(*)::int FROM pengguna WHERE peran = 'mahasiswa') AS mahasiswa,
                       (SELECT COUNT(*)::int FROM asesmen) AS asesmen`),
    ]);
    const keObjek = (r) => Object.fromEntries(r.rows.map((x) => [x.kategori, x.n]));
    // Rata-rata tiap indikator soft skill dan berapa kali indikator itu jadi prioritas.
    const indikator = new Map();
    for (const { detail: d } of detail.rows) {
      for (const s of d.nilaiIndikator ?? []) {
        if (s.variabel === 'Y') continue;
        const c = indikator.get(s.kode) ?? { nama: s.nama, variabel: s.variabel, total: 0, n: 0, prioritas: 0 };
        c.total += s.nilai;
        c.n += 1;
        indikator.set(s.kode, c);
      }
      for (const p of d.prioritas ?? []) {
        const c = indikator.get(p.kode);
        if (c) c.prioritas += 1;
      }
    }
    res.json({
      ...akun.rows[0],
      ...ringkas.rows[0],
      kategori: { Y: keObjek(y), X1: keObjek(x1), X2: keObjek(x2), X: keObjek(x) },
      aturan: aturan.rows,
      karier: karier.rows,
      indikator: [...indikator.values()].map((c) => ({
        nama: c.nama,
        variabel: c.variabel,
        rata: c.total / c.n,
        prioritas: c.prioritas,
      })),
    });
  }),
);

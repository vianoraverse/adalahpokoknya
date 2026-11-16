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
      db.query(`SELECT b.id, b.teks, b.dasar, b.aktif, b.urutan, i.id AS indikator_id, i.nama AS indikator, i.variabel
       FROM butir b JOIN indikator i ON i.id = b.indikator_id ORDER BY i.urutan, b.urutan, b.id`),
      db.query('SELECT id, kode, nama, variabel, bobot, dasar, saran FROM indikator ORDER BY urutan'),
    ]);
    res.json({ butir: butir.rows, indikator: indikator.rows });
  }),
);
const skemaButir = z.object({
  indikatorId: z.number({ invalid_type_error: 'Pilih indikator.', required_error: 'Pilih indikator.' }).int(),
  teks: teks('Teks pertanyaan'),
  dasar: z.string().trim().max(200).default(''),
  aktif: z.boolean().default(true),
});
adminRouter.post(
  '/items',
  h(async (req, res) => {
    const d = skemaButir.parse(req.body);
    const db = await getDb();
    const { rows } = await db.query(
      `INSERT INTO butir (indikator_id, teks, dasar, aktif, urutan)
     VALUES ($1,$2,$3,$4,(SELECT COALESCE(MAX(urutan),0)+1 FROM butir)) RETURNING id`,
      [d.indikatorId, d.teks, d.dasar, d.aktif],
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
    await db.query('UPDATE butir SET indikator_id = $1, teks = $2, dasar = $3, aktif = $4 WHERE id = $5', [
      d.indikatorId,
      d.teks,
      d.dasar,
      d.aktif,
      id,
    ]);
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
/* ---------- Model penilaian: bobot indikator, ambang, aturan (UC-07) ---------- */
adminRouter.get(
  '/model',
  h(async (_req, res) => {
    const db = await getDb();
    const [indikator, pengaturan, aturan] = await Promise.all([
      db.query('SELECT id, kode, nama, variabel, bobot, saran FROM indikator ORDER BY urutan'),
      db.query(`SELECT kunci, nilai, keterangan FROM pengaturan
              ORDER BY array_position(ARRAY['ambang_rendah','ambang_tinggi','ambang_aturan_y','ambang_aturan_sfs','selisih_alternatif','jumlah_prioritas']::text[], kunci)`),
      db.query('SELECT kode, kondisi, interpretasi, jenis, teks FROM aturan_rekomendasi ORDER BY kode'),
    ]);
    res.json({ indikator: indikator.rows, pengaturan: pengaturan.rows, aturan: aturan.rows });
  }),
);
adminRouter.put(
  '/indicators/:id',
  h(async (req, res) => {
    const d = z
      .object({
        bobot: z
          .number({ invalid_type_error: 'Bobot harus berupa angka.' })
          .positive('Bobot harus lebih dari 0.')
          .max(100),
        saran: z.string().trim().max(500).default(''),
      })
      .parse(req.body);
    const db = await getDb();
    await db.query('UPDATE indikator SET bobot = $1, saran = $2 WHERE id = $3', [
      d.bobot,
      d.saran,
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
      throw new HttpError(400, 'Ambang rendah harus lebih kecil dari ambang tinggi.');
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
      })
      .parse(req.body);
    const db = await getDb();
    await db.query('UPDATE aturan_rekomendasi SET interpretasi = $1, jenis = $2, teks = $3 WHERE kode = $4', [
      d.interpretasi,
      d.jenis,
      d.teks,
      req.params.kode,
    ]);
    res.json({ ok: true });
  }),
);
/* ---------- Profil kebutuhan soft skill per karier (UC-08) ---------- */
adminRouter.get(
  '/profiles/:karierId',
  h(async (req, res) => {
    const db = await getDb();
    const { rows } = await db.query(
      `SELECT i.id AS indikator_id, i.nama, i.variabel, p.req, p.bobot
     FROM indikator i LEFT JOIN profil_karier p ON p.indikator_id = i.id AND p.karier_id = $1
     WHERE i.variabel <> 'Y' ORDER BY i.urutan`,
      [Number(req.params.karierId)],
    );
    res.json({ profil: rows });
  }),
);
adminRouter.put(
  '/profiles/:karierId',
  h(async (req, res) => {
    const d = z
      .object({
        baris: z
          .array(
            z.object({
              indikatorId: z.number().int(),
              req: z
                .number({ invalid_type_error: 'Level kebutuhan harus berupa angka.' })
                .min(0, 'Level kebutuhan minimal 0.')
                .max(100, 'Level kebutuhan maksimal 100.'),
              bobot: z.number({ invalid_type_error: 'Bobot harus berupa angka.' }).min(0, 'Bobot tidak boleh negatif.'),
            }),
          )
          .min(1),
      })
      .parse(req.body);
    const total = d.baris.reduce((a, b) => a + b.bobot, 0);
    if (total <= 0) throw new HttpError(400, 'Jumlah bobot harus lebih dari 0.');
    const karierId = Number(req.params.karierId);
    const db = await getDb();
    await db.tx(async (q) => {
      for (const b of d.baris) {
        // Bobot dinormalkan agar Σ w(r, i) = 1.
        await q.query(
          `INSERT INTO profil_karier (karier_id, indikator_id, req, bobot) VALUES ($1,$2,$3,$4)
         ON CONFLICT (karier_id, indikator_id) DO UPDATE SET req = EXCLUDED.req, bobot = EXCLUDED.bobot`,
          [karierId, b.indikatorId, b.req, b.bobot / total],
        );
      }
    });
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
/* ---------- Pemantauan hasil agregat dan anonim (UC-10) ---------- */
adminRouter.get(
  '/aggregate',
  h(async (_req, res) => {
    const db = await getDb();
    // Hanya asesmen terbaru tiap mahasiswa yang dihitung, tanpa identitas.
    const terbaru = `SELECT DISTINCT ON (a.pengguna_id) a.id, a.karier_id FROM asesmen a ORDER BY a.pengguna_id, a.dibuat_pada DESC, a.id DESC`;
    const [ringkas, aturan, karier, detail, akun] = await Promise.all([
      db.query(`SELECT COUNT(*)::int AS responden, AVG(h.skor_y) AS y, AVG(h.skor_x1) AS x1, AVG(h.skor_x2) AS x2, AVG(h.sfs_pilihan) AS sfs,
                     SUM(CASE WHEN h.status_kesesuaian = 'Selaras' THEN 1 ELSE 0 END)::int AS selaras
              FROM (${terbaru}) t JOIN hasil_skor h ON h.asesmen_id = t.id`),
      db.query(
        `SELECT h.aturan_kode AS kode, COUNT(*)::int AS n FROM (${terbaru}) t JOIN hasil_skor h ON h.asesmen_id = t.id GROUP BY h.aturan_kode ORDER BY h.aturan_kode`,
      ),
      db.query(`SELECT k.nama, COUNT(t.id)::int AS n, AVG(h.sfs_pilihan) AS sfs, AVG(h.skor_y) AS y
              FROM karier k LEFT JOIN (${terbaru}) t ON t.karier_id = k.id LEFT JOIN hasil_skor h ON h.asesmen_id = t.id
              GROUP BY k.id, k.nama, k.urutan ORDER BY n DESC, k.urutan`),
      db.query(`SELECT h.detail FROM (${terbaru}) t JOIN hasil_skor h ON h.asesmen_id = t.id`),
      db.query(
        `SELECT (SELECT COUNT(*)::int FROM pengguna WHERE peran = 'mahasiswa') AS mahasiswa, (SELECT COUNT(*)::int FROM asesmen) AS asesmen`,
      ),
    ]);
    const jumlah = new Map();
    for (const r of detail.rows) {
      for (const s of r.detail.skorIndikator ?? []) {
        const c = jumlah.get(s.kode) ?? { nama: s.nama, variabel: s.variabel, total: 0, n: 0 };
        c.total += s.skor;
        c.n += 1;
        jumlah.set(s.kode, c);
      }
    }
    res.json({
      ...akun.rows[0],
      ...ringkas.rows[0],
      aturan: aturan.rows,
      karier: karier.rows,
      indikator: [...jumlah.values()].map((c) => ({ nama: c.nama, variabel: c.variabel, rata: c.total / c.n })),
    });
  }),
);

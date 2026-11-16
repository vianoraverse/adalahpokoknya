import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { z } from 'zod';
import { hapusSesi, pasangSesi, wajibLogin } from '../auth.js';
import { getDb } from '../db.js';
import { HttpError, batasiLaju, h } from '../http.js';

export const authRouter = Router();
const laju = batasiLaju(20, 10 * 60 * 1000);

const email = z.string().trim().toLowerCase().email('Format email tidak valid.');
const sandi = z.string().min(8, 'Kata sandi minimal 8 karakter.').max(72, 'Kata sandi maksimal 72 karakter.');
const nama = z.string().trim().min(2, 'Nama minimal 2 karakter.').max(80, 'Nama maksimal 80 karakter.');

authRouter.post('/register', laju, h(async (req, res) => {
  const d = z.object({
    nama,
    email,
    password: sandi,
    setuju: z.literal(true, { errorMap: () => ({ message: 'Centang persetujuan pengumpulan data untuk mendaftar.' }) }),
  }).parse(req.body);
  const db = await getDb();
  const ada = await db.query('SELECT 1 FROM pengguna WHERE email = $1', [d.email]);
  if (ada.rows.length) throw new HttpError(409, 'Email ini sudah terdaftar. Masuk dengan email tersebut.');
  const hash = await bcrypt.hash(d.password, 10);
  const { rows } = await db.query(
    `INSERT INTO pengguna (nama, email, kata_sandi_hash, peran, persetujuan_pada)
     VALUES ($1,$2,$3,'mahasiswa', now()) RETURNING id, nama, email, peran`,
    [d.nama, d.email, hash],
  );
  pasangSesi(res, rows[0]);
  res.status(201).json({ pengguna: rows[0] });
}));

authRouter.post('/login', laju, h(async (req, res) => {
  const d = z.object({ email, password: z.string().min(1, 'Isi kata sandi.') }).parse(req.body);
  const db = await getDb();
  const { rows } = await db.query('SELECT id, nama, email, peran, aktif, kata_sandi_hash FROM pengguna WHERE email = $1', [d.email]);
  const p = rows[0];
  if (!p || !(await bcrypt.compare(d.password, p.kata_sandi_hash))) throw new HttpError(401, 'Email atau kata sandi salah.');
  if (!p.aktif) throw new HttpError(403, 'Akun ini dinonaktifkan. Hubungi Operator Admin.');
  pasangSesi(res, p);
  res.json({ pengguna: { id: p.id, nama: p.nama, email: p.email, peran: p.peran } });
}));

authRouter.post('/logout', (_req, res) => {
  hapusSesi(res);
  res.json({ ok: true });
});

authRouter.get('/me', wajibLogin(), (req, res) => {
  res.json({ pengguna: req.pengguna });
});

authRouter.patch('/me', wajibLogin(), h(async (req, res) => {
  const d = z.object({ nama: nama.optional(), passwordLama: z.string().optional(), passwordBaru: sandi.optional() }).parse(req.body);
  const db = await getDb();
  const id = req.pengguna!.id;
  if (d.nama) await db.query('UPDATE pengguna SET nama = $1 WHERE id = $2', [d.nama, id]);
  if (d.passwordBaru) {
    const { rows } = await db.query('SELECT kata_sandi_hash FROM pengguna WHERE id = $1', [id]);
    if (!d.passwordLama || !(await bcrypt.compare(d.passwordLama, rows[0].kata_sandi_hash))) {
      throw new HttpError(400, 'Kata sandi lama salah.');
    }
    await db.query('UPDATE pengguna SET kata_sandi_hash = $1 WHERE id = $2', [await bcrypt.hash(d.passwordBaru, 10), id]);
  }
  const { rows } = await db.query('SELECT id, nama, email, peran FROM pengguna WHERE id = $1', [id]);
  res.json({ pengguna: rows[0] });
}));

// Kendali pengguna atas datanya (UU PDP): menghapus akun beserta seluruh asesmen.
authRouter.delete('/me', wajibLogin(), h(async (req, res) => {
  const d = z.object({ password: z.string().min(1, 'Isi kata sandi untuk menghapus akun.') }).parse(req.body);
  const db = await getDb();
  const p = req.pengguna!;
  const { rows } = await db.query('SELECT kata_sandi_hash FROM pengguna WHERE id = $1', [p.id]);
  if (!(await bcrypt.compare(d.password, rows[0].kata_sandi_hash))) throw new HttpError(400, 'Kata sandi salah.');
  if (p.peran === 'admin') {
    const n = await db.query("SELECT COUNT(*)::int AS n FROM pengguna WHERE peran = 'admin' AND aktif = TRUE");
    if (n.rows[0].n <= 1) throw new HttpError(400, 'Akun admin terakhir tidak dapat dihapus.');
  }
  await db.query('DELETE FROM pengguna WHERE id = $1', [p.id]);
  hapusSesi(res);
  res.json({ ok: true });
}));

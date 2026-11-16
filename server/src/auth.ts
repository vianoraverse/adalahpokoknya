import type { Request, RequestHandler, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from './config.js';
import { getDb } from './db.js';
import { HttpError } from './http.js';

export interface Pengguna { id: number; nama: string; email: string; peran: 'mahasiswa' | 'admin' }

declare global {
  namespace Express {
    interface Request { pengguna?: Pengguna }
  }
}

const COOKIE = 'yw_token';

export function pasangSesi(res: Response, p: { id: number; peran: string }): void {
  const token = jwt.sign({ sub: p.id, peran: p.peran }, config.jwtSecret, { expiresIn: '7d' });
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.isProd,
    maxAge: 7 * 24 * 3600 * 1000,
    path: '/',
  });
}

export function hapusSesi(res: Response): void {
  res.clearCookie(COOKIE, { path: '/' });
}

async function muatPengguna(req: Request): Promise<Pengguna | null> {
  const token = req.cookies?.[COOKIE];
  if (!token) return null;
  try {
    const data = jwt.verify(token, config.jwtSecret) as unknown as { sub: number };
    const db = await getDb();
    const { rows } = await db.query<Pengguna>(
      'SELECT id, nama, email, peran FROM pengguna WHERE id = $1 AND aktif = TRUE',
      [Number(data.sub)],
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

/** Role-Based Access Control (FR-01): wajib login, opsional dibatasi per peran. */
export function wajibLogin(...peran: Array<Pengguna['peran']>): RequestHandler {
  return (req, _res, next) => {
    muatPengguna(req)
      .then((p) => {
        if (!p) throw new HttpError(401, 'Sesi berakhir. Masuk kembali untuk melanjutkan.');
        if (peran.length && !peran.includes(p.peran)) throw new HttpError(403, 'Akun ini tidak memiliki akses ke halaman tersebut.');
        req.pengguna = p;
        next();
      })
      .catch(next);
  };
}

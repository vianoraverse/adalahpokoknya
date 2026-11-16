import type { NextFunction, Request, RequestHandler, Response } from 'express';
import { ZodError } from 'zod';

export class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

/** Pembungkus handler async agar galat diteruskan ke penangan galat Express. */
export const h = (fn: (req: Request, res: Response) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    fn(req, res).catch(next);
  };

export function penanganGalat(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    const pesan = err.issues.map((i) => i.message).join(' ');
    res.status(400).json({ pesan: pesan || 'Data tidak lengkap.' });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ pesan: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ pesan: 'Terjadi kesalahan pada server. Coba lagi sebentar lagi.' });
}

/** Pembatas laju sederhana di memori, untuk endpoint autentikasi. */
export function batasiLaju(maks: number, jendelaMs: number): RequestHandler {
  const catatan = new Map<string, { n: number; reset: number }>();
  return (req, res, next) => {
    const kunci = req.ip ?? 'x';
    const kini = Date.now();
    const c = catatan.get(kunci);
    if (!c || c.reset < kini) {
      catatan.set(kunci, { n: 1, reset: kini + jendelaMs });
      return next();
    }
    if (c.n >= maks) {
      res.status(429).json({ pesan: 'Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.' });
      return;
    }
    c.n += 1;
    next();
  };
}

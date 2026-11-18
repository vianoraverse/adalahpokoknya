import { ZodError } from 'zod';
export class HttpError extends Error {
  status;
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
/** Pembungkus handler async agar galat diteruskan ke penangan galat Express. */
export const h = (fn) => (req, res, next) => {
  fn(req, res).catch(next);
};
export function penanganGalat(err, _req, res, _next) {
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
export function batasiLaju(maks, jendelaMs) {
  const catatan = new Map();
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

/** Bahasa tampilan yang diminta frontend lewat header X-Bahasa ('id' atau 'en'). */
export const bahasa = (req) => (req.get('X-Bahasa') === 'en' ? 'en' : 'id');

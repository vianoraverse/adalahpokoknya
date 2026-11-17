import path from 'node:path';
import cookieParser from 'cookie-parser';
import express from 'express';
import { config } from './config.js';
import { getDb } from './db.js';
import { penanganGalat } from './http.js';
import { adminRouter } from './routes/admin.js';
import { asesmenRouter } from './routes/asesmen.js';
import { authRouter } from './routes/auth.js';
import { seed } from './seed/seed.js';
import { isiDemo } from './demo.js';
const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'same-origin');
  next();
});
app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter);
app.use('/api', asesmenRouter);
app.use('/api', (_req, res) => res.status(404).json({ pesan: 'Alamat API tidak ditemukan.' }));
// Frontend: berkas HTML, CSS, dan JS statis pada folder public/.
// extensions: ['html'] membuat /masuk membuka masuk.html, /app/hasil membuka app/hasil.html, dst.
app.use(express.static(config.publik, { extensions: ['html'] }));
app.use((_req, res) => res.status(404).sendFile(path.join(config.publik, '404.html')));
app.use(penanganGalat);
const db = await getDb();
await seed(db);
// `npm run demo` menambahkan akun demo dan mahasiswa contoh (sekali saja).
if (process.argv.includes('--demo')) await isiDemo(db);
app.listen(config.port, () => {
  console.log(`YourWay API berjalan di http://localhost:${config.port} (basis data: ${db.jenis})`);
});

import fs from 'node:fs';
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

// Pada mode production, server juga menyajikan hasil build frontend.
if (fs.existsSync(path.join(config.clientDist, 'index.html'))) {
  app.use(express.static(config.clientDist));
  app.get('*', (_req, res) => res.sendFile(path.join(config.clientDist, 'index.html')));
}

app.use(penanganGalat);

const db = await getDb();
await seed(db);
app.listen(config.port, () => {
  console.log(`YourWay API berjalan di http://localhost:${config.port} (basis data: ${db.jenis})`);
});

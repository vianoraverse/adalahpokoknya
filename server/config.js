import path from 'node:path';
import { fileURLToPath } from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
// Muat .env (jika ada) tanpa dependensi tambahan.
for (const p of [path.resolve(here, '../.env')]) {
  try {
    process.loadEnvFile(p);
  } catch {
    /* tidak ada .env di lokasi ini */
  }
}
const isProd = process.env.NODE_ENV === 'production';
if (isProd && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET wajib diisi pada mode production.');
}
export const config = {
  isProd,
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  // Tanpa DATABASE_URL, server memakai PGlite (PostgreSQL tertanam) pada folder ini.
  pgliteDir: process.env.PGLITE_DIR ?? path.resolve(here, '../data/pglite'),
  jwtSecret: process.env.JWT_SECRET ?? 'yourway-dev-secret-ganti-di-production',
  adminEmail: (process.env.ADMIN_EMAIL ?? 'admin@yourway.local').toLowerCase(),
  adminPassword: process.env.ADMIN_PASSWORD ?? 'admin12345',
  ai: {
    provider: (process.env.AI_PROVIDER ?? 'none').toLowerCase(),
    apiKey: process.env.AI_API_KEY ?? '',
    model: process.env.AI_MODEL ?? '',
    baseUrl: process.env.AI_BASE_URL ?? '',
  },
  publik: path.resolve(here, '../public'),
  schemaPath: path.resolve(here, 'schema.sql'),
};

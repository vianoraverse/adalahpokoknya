import fs from 'node:fs';
import { config } from './config.js';
let instance = null;
async function buatPostgres() {
  const pg = await import('pg');
  const pool = new pg.default.Pool({
    connectionString: config.databaseUrl,
    ssl: /sslmode=require/.test(config.databaseUrl) ? { rejectUnauthorized: false } : undefined,
  });
  return {
    jenis: 'postgres',
    query: (text, params) => pool.query(text, params),
    exec: async (sql) => {
      await pool.query(sql);
    },
    tx: async (fn) => {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const hasil = await fn({ query: (t, p) => client.query(t, p) });
        await client.query('COMMIT');
        return hasil;
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      } finally {
        client.release();
      }
    },
  };
}
async function buatPglite() {
  const { PGlite } = await import('@electric-sql/pglite');
  const dir = config.pgliteDir;
  if (dir !== 'memory://') fs.mkdirSync(dir, { recursive: true });
  const db = new PGlite(dir);
  await db.waitReady;
  return {
    jenis: 'pglite',
    query: (text, params) => db.query(text, params),
    exec: async (sql) => {
      await db.exec(sql);
    },
    tx: (fn) => db.transaction((t) => fn({ query: (text, params) => t.query(text, params) })),
  };
}
export async function getDb() {
  if (!instance) {
    instance = config.databaseUrl ? await buatPostgres() : await buatPglite();
    await instance.exec(fs.readFileSync(config.schemaPath, 'utf8'));
  }
  return instance;
}

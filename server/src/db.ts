import fs from 'node:fs';
import { config } from './config.js';

export interface Queryable {
  query<T = any>(text: string, params?: unknown[]): Promise<{ rows: T[] }>;
}

export interface Database extends Queryable {
  tx<T>(fn: (q: Queryable) => Promise<T>): Promise<T>;
  exec(sql: string): Promise<void>;
  jenis: 'postgres' | 'pglite';
}

let instance: Database | null = null;

async function buatPostgres(): Promise<Database> {
  const pg = await import('pg');
  const pool = new pg.default.Pool({
    connectionString: config.databaseUrl,
    ssl: /sslmode=require/.test(config.databaseUrl) ? { rejectUnauthorized: false } : undefined,
  });
  return {
    jenis: 'postgres',
    query: (text, params) => pool.query(text, params as any[]) as any,
    exec: async (sql) => {
      await pool.query(sql);
    },
    tx: async (fn) => {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const hasil = await fn({ query: (t, p) => client.query(t, p as any[]) as any });
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

async function buatPglite(): Promise<Database> {
  const { PGlite } = await import('@electric-sql/pglite');
  const dir = config.pgliteDir;
  if (dir !== 'memory://') fs.mkdirSync(dir, { recursive: true });
  const db = new PGlite(dir);
  await db.waitReady;
  return {
    jenis: 'pglite',
    query: (text, params) => db.query(text, params as any[]) as any,
    exec: async (sql) => {
      await db.exec(sql);
    },
    tx: (fn) => db.transaction((t) => fn({ query: (text, params) => t.query(text, params as any[]) as any })) as any,
  };
}

export async function getDb(): Promise<Database> {
  if (!instance) {
    instance = config.databaseUrl ? await buatPostgres() : await buatPglite();
    await instance.exec(fs.readFileSync(config.schemaPath, 'utf8'));
  }
  return instance;
}

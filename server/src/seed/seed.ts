import bcrypt from 'bcryptjs';
import { config } from '../config.js';
import type { Database } from '../db.js';
import { ATURAN, BUTIR, FREKUENSI, INDIKATOR, KARIER, PENGATURAN, levelKebutuhan } from './data.js';

/** Mengisi data awal bila tabel masih kosong. Aman dijalankan berulang. */
export async function seed(db: Database): Promise<void> {
  const { rows } = await db.query<{ n: number }>('SELECT COUNT(*)::int AS n FROM karier');
  if (rows[0].n === 0) {
    await db.tx(async (q) => {
      for (const [i, k] of KARIER.entries()) {
        await q.query(
          'INSERT INTO karier (kode, nama, area_fungsi, padanan, status_padanan, deskripsi, urutan) VALUES ($1,$2,$3,$4,$5,$6,$7)',
          [...k, i + 1],
        );
      }
      for (const [i, ind] of INDIKATOR.entries()) {
        await q.query(
          'INSERT INTO indikator (kode, nama, variabel, dasar, saran, urutan) VALUES ($1,$2,$3,$4,$5,$6)',
          [...ind, i + 1],
        );
      }
      for (const [i, b] of BUTIR.entries()) {
        await q.query(
          'INSERT INTO butir (indikator_id, teks, dasar, urutan) SELECT id, $2, $3, $4 FROM indikator WHERE kode = $1',
          [b[0], b[1], b[2], i + 1],
        );
      }
      const softSkill = INDIKATOR.filter((x) => x[2] !== 'Y').map((x) => x[0]);
      for (const [kode, frek] of Object.entries(FREKUENSI)) {
        const total = frek.reduce((a, b) => a + b, 0);
        for (const [i, f] of frek.entries()) {
          await q.query(
            `INSERT INTO profil_karier (karier_id, indikator_id, req, bobot)
             SELECT k.id, i.id, $3, $4 FROM karier k, indikator i WHERE k.kode = $1 AND i.kode = $2`,
            [kode, softSkill[i], levelKebutuhan(f), f / total],
          );
        }
      }
      for (const a of ATURAN) {
        await q.query('INSERT INTO aturan_rekomendasi (kode, kondisi, interpretasi, jenis, teks) VALUES ($1,$2,$3,$4,$5)', [...a]);
      }
      for (const p of PENGATURAN) {
        await q.query('INSERT INTO pengaturan (kunci, nilai, keterangan) VALUES ($1,$2,$3)', [...p]);
      }
    });
    console.log('[seed] Data awal dimuat: 16 karier, 18 indikator, 36 butir, profil karier, aturan.');
  }

  const admin = await db.query('SELECT 1 FROM pengguna WHERE peran = $1 LIMIT 1', ['admin']);
  if (admin.rows.length === 0) {
    const hash = await bcrypt.hash(config.adminPassword, 10);
    await db.query(
      'INSERT INTO pengguna (nama, email, kata_sandi_hash, peran) VALUES ($1,$2,$3,$4)',
      ['Operator Admin', config.adminEmail, hash, 'admin'],
    );
    console.log(`[seed] Akun Operator Admin dibuat: ${config.adminEmail}`);
  }
}

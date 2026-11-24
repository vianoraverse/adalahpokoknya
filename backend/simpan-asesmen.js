// Menghitung dan menyimpan hasil asesmen. Dipakai oleh API (routes/asesmen.js), data demo (demo.js),
// dan pembaruan basis data lama (database/seed.js).
import { hitung } from '../behavioral-model/engine.js';
import { HttpError } from './http.js';
import { muatModel } from './model.js';

/** Menyimpan hasil hitungan mesin BMS untuk satu asesmen. */
async function simpanHasil(q, asesmenId, hasil) {
  await q.query(
    `INSERT INTO hasil_asesmen (asesmen_id, nilai_y, nilai_x1, nilai_x2, nilai_x,
       kategori_y, kategori_x1, kategori_x2, kategori_x, aturan_kode, detail)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb)`,
    [
      asesmenId,
      hasil.nilai.Y,
      hasil.nilai.X1,
      hasil.nilai.X2,
      hasil.nilai.X,
      hasil.kategori.Y,
      hasil.kategori.X1,
      hasil.kategori.X2,
      hasil.kategori.X,
      hasil.aturan,
      JSON.stringify(hasil),
    ],
  );
}

/**
 * @param db           koneksi basis data (getDb())
 * @param penggunaId   id mahasiswa
 * @param karierId     id karier yang dipilih
 * @param jawabanMasuk objek { idButir: nilai 1–5 } untuk semua butir aktif
 * @param dibuatPada   opsional, tanggal asesmen (dipakai data demo)
 * @returns id asesmen yang baru dibuat
 */
export async function simpanAsesmen(db, penggunaId, karierId, jawabanMasuk, dibuatPada = null) {
  const model = await muatModel(db);
  const karier = await db.query('SELECT 1 FROM karier WHERE id = $1', [karierId]);
  if (!karier.rows.length) throw new HttpError(400, 'Karier pilihan tidak ditemukan.');
  const jawaban = {};
  for (const b of model.butir) {
    const n = jawabanMasuk[String(b.id)];
    if (n === undefined) throw new HttpError(400, 'Masih ada butir yang belum dijawab.');
    jawaban[b.id] = n;
  }
  let hasil;
  try {
    hasil = hitung({ ...model, jawaban });
  } catch (e) {
    throw new HttpError(400, e.message);
  }
  return db.tx(async (q) => {
    const lama = await q.query('SELECT 1 FROM asesmen WHERE pengguna_id = $1 LIMIT 1', [penggunaId]);
    const a = await q.query(
      'INSERT INTO asesmen (pengguna_id, karier_id, jenis, dibuat_pada) VALUES ($1, $2, $3, COALESCE($4, now())) RETURNING id',
      [penggunaId, karierId, lama.rows.length ? 'ulang' : 'awal', dibuatPada],
    );
    const asesmenId = a.rows[0].id;
    const ids = Object.keys(jawaban).map(Number);
    await q.query(
      `INSERT INTO jawaban (asesmen_id, butir_id, nilai)
       SELECT $1, x.butir_id, x.nilai FROM unnest($2::int[], $3::int[]) AS x(butir_id, nilai)`,
      [asesmenId, ids, ids.map((i) => jawaban[i])],
    );
    await simpanHasil(q, asesmenId, hasil);
    return asesmenId;
  });
}

/**
 * Menghitung ulang asesmen yang belum punya hasil (misalnya hasil dari model lama yang tabelnya sudah
 * dihapus). Jawaban mahasiswa tetap tersimpan, jadi hasil baru bisa dihitung dari situ. Asesmen yang
 * jawabannya tidak lengkap untuk butir aktif sekarang dilewati.
 */
export async function hitungUlangHasil(db) {
  const { rows } = await db.query(
    'SELECT a.id FROM asesmen a LEFT JOIN hasil_asesmen h ON h.asesmen_id = a.id WHERE h.asesmen_id IS NULL',
  );
  if (!rows.length) return;
  const model = await muatModel(db);
  let berhasil = 0;
  for (const { id } of rows) {
    const j = await db.query('SELECT butir_id, nilai FROM jawaban WHERE asesmen_id = $1', [id]);
    const jawaban = Object.fromEntries(j.rows.map((r) => [r.butir_id, Number(r.nilai)]));
    try {
      const hasil = hitung({ ...model, jawaban });
      await simpanHasil(db, id, hasil);
      berhasil += 1;
    } catch {
      /* jawaban tidak lengkap untuk butir aktif sekarang: dilewati */
    }
  }
  console.log(`[seed] ${berhasil} dari ${rows.length} hasil asesmen dihitung ulang dengan model terbaru.`);
}

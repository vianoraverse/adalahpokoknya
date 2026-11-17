// Menghitung dan menyimpan satu asesmen. Dipakai oleh API (routes/asesmen.js) dan oleh data demo (demo.js).
import { hitung } from './bms/engine.js';
import { HttpError } from './http.js';
import { muatModel } from './model.js';

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
  const jawaban = {};
  for (const b of model.butir) {
    const n = jawabanMasuk[String(b.id)];
    if (n === undefined) throw new HttpError(400, 'Masih ada butir yang belum dijawab.');
    jawaban[b.id] = n;
  }
  let hasil;
  try {
    hasil = hitung({ ...model, jawaban, karierPilihanId: karierId });
  } catch (e) {
    throw new HttpError(400, e.message);
  }
  const rekomendasi = {
    utama: model.aturan[hasil.aturan],
    tambahan: hasil.aturanTambahan.map((k) => model.aturan[k]).filter(Boolean),
  };
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
    await q.query(
      `INSERT INTO hasil_skor (asesmen_id, skor_y, skor_x1, skor_x2, sfs_pilihan, aturan_kode, status_kesesuaian, karier_teratas_id, detail)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::jsonb)`,
      [
        asesmenId,
        hasil.skor.Y,
        hasil.skor.X1,
        hasil.skor.X2,
        hasil.sfsPilihan,
        hasil.aturan,
        hasil.status,
        hasil.karierTeratas.karierId,
        JSON.stringify({ ...hasil, rekomendasi }),
      ],
    );
    return asesmenId;
  });
}

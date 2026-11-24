import { AMBANG_BAWAAN } from '../behavioral-model/engine.js';

/** Memuat parameter model dari basis data: indikator, butir aktif, dan ambang. */
export async function muatModel(q) {
  const [ind, but, set] = await Promise.all([
    q.query('SELECT id, kode, nama, variabel, saran, saran_en FROM indikator ORDER BY urutan'),
    q.query('SELECT id, indikator_id FROM butir WHERE aktif = TRUE ORDER BY urutan, id'),
    q.query('SELECT kunci, nilai FROM pengaturan'),
  ]);
  const ambang = { ...AMBANG_BAWAAN };
  for (const r of set.rows) if (r.kunci in ambang) ambang[r.kunci] = Number(r.nilai);
  return {
    indikator: ind.rows.map((r) => ({
      id: r.id,
      kode: r.kode,
      nama: r.nama,
      variabel: r.variabel,
      saran: r.saran,
      saranEn: r.saran_en ?? '',
    })),
    butir: but.rows.map((r) => ({ id: r.id, indikatorId: r.indikator_id })),
    ambang,
  };
}

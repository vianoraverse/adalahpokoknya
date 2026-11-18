import { AMBANG_BAWAAN } from '../behavioral-model/engine.js';
/** Memuat parameter model (indikator, butir aktif, profil karier, ambang) dari basis data. */
export async function muatModel(q) {
  const [ind, but, prof, kar, set, atr] = await Promise.all([
    q.query('SELECT id, kode, nama, variabel, bobot, saran, saran_en FROM indikator ORDER BY urutan'),
    q.query('SELECT id, indikator_id FROM butir WHERE aktif = TRUE ORDER BY urutan, id'),
    q.query('SELECT karier_id, indikator_id, req, bobot FROM profil_karier'),
    q.query('SELECT id, nama FROM karier ORDER BY urutan'),
    q.query('SELECT kunci, nilai FROM pengaturan'),
    q.query('SELECT kode, kondisi, interpretasi, jenis, teks FROM aturan_rekomendasi'),
  ]);
  const ambang = { ...AMBANG_BAWAAN };
  for (const r of set.rows) if (r.kunci in ambang) ambang[r.kunci] = Number(r.nilai);
  return {
    indikator: ind.rows.map((r) => ({
      id: r.id,
      kode: r.kode,
      nama: r.nama,
      variabel: r.variabel,
      bobot: Number(r.bobot),
      saran: r.saran,
      saranEn: r.saran_en ?? '',
    })),
    butir: but.rows.map((r) => ({ id: r.id, indikatorId: r.indikator_id })),
    profil: prof.rows.map((r) => ({
      karierId: r.karier_id,
      indikatorId: r.indikator_id,
      req: Number(r.req),
      bobot: Number(r.bobot),
    })),
    karier: kar.rows,
    ambang,
    aturan: Object.fromEntries(atr.rows.map((r) => [r.kode, r])),
  };
}

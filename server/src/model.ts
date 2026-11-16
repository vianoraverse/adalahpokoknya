import type { Queryable } from './db.js';
import { AMBANG_BAWAAN, type Ambang, type Butir, type Indikator, type Karier, type ProfilKarier } from './bms/engine.js';

/** Memuat parameter model (indikator, butir aktif, profil karier, ambang) dari basis data. */
export async function muatModel(q: Queryable) {
  const [ind, but, prof, kar, set, atr] = await Promise.all([
    q.query('SELECT id, kode, nama, variabel, bobot, saran FROM indikator ORDER BY urutan'),
    q.query('SELECT id, indikator_id FROM butir WHERE aktif = TRUE ORDER BY urutan, id'),
    q.query('SELECT karier_id, indikator_id, req, bobot FROM profil_karier'),
    q.query('SELECT id, nama FROM karier ORDER BY urutan'),
    q.query('SELECT kunci, nilai FROM pengaturan'),
    q.query('SELECT kode, kondisi, interpretasi, jenis, teks FROM aturan_rekomendasi'),
  ]);
  const ambang: Ambang = { ...AMBANG_BAWAAN };
  for (const r of set.rows) if (r.kunci in ambang) (ambang as any)[r.kunci] = Number(r.nilai);
  return {
    indikator: ind.rows.map((r: any): Indikator => ({ id: r.id, kode: r.kode, nama: r.nama, variabel: r.variabel, bobot: Number(r.bobot), saran: r.saran })),
    butir: but.rows.map((r: any): Butir => ({ id: r.id, indikatorId: r.indikator_id })),
    profil: prof.rows.map((r: any): ProfilKarier => ({ karierId: r.karier_id, indikatorId: r.indikator_id, req: Number(r.req), bobot: Number(r.bobot) })),
    karier: kar.rows as Karier[],
    ambang,
    aturan: Object.fromEntries(atr.rows.map((r: any) => [r.kode, r])) as Record<string, { kode: string; kondisi: string; interpretasi: string; jenis: string; teks: string }>,
  };
}

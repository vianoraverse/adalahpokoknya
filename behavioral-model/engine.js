/**
 * Mesin BMS YourWay: skor berbobot dan aturan (rule-based), tanpa machine learning.
 * Rumus mengikuti Subbab 2.7 dan 3.5 laporan. Seluruh fungsi murni (tanpa I/O)
 * agar hasilnya dapat diuji terhadap perhitungan manual.
 */
export const AMBANG_BAWAAN = {
  ambang_rendah: 50,
  ambang_tinggi: 75,
  ambang_aturan_y: 75,
  ambang_aturan_sfs: 75,
  selisih_alternatif: 10,
  jumlah_prioritas: 3,
};
/** Normalisasi min-max skala Likert 1–5 ke 0–100: x' = (x − 1) / 4 × 100. */
export function normalisasi(x) {
  return ((x - 1) / 4) * 100;
}
export function kategori(skor, ambang) {
  if (skor < ambang.ambang_rendah) return 'rendah';
  if (skor < ambang.ambang_tinggi) return 'sedang';
  return 'tinggi';
}
/** Skor indikator = rata-rata jawaban butirnya, lalu dinormalisasi. */
export function hitungSkorIndikator(indikator, butir, jawaban) {
  return indikator.map((ind) => {
    const nilai = butir.filter((b) => b.indikatorId === ind.id).map((b) => jawaban[b.id]);
    if (nilai.length === 0) throw new Error(`Indikator "${ind.nama}" tidak memiliki butir aktif.`);
    for (const n of nilai) {
      if (!Number.isInteger(n) || n < 1 || n > 5)
        throw new Error(`Jawaban untuk indikator "${ind.nama}" belum lengkap.`);
    }
    const rata = nilai.reduce((a, b) => a + b, 0) / nilai.length;
    return { indikatorId: ind.id, kode: ind.kode, nama: ind.nama, variabel: ind.variabel, skor: normalisasi(rata) };
  });
}
/**
 * Membuang galat pembulatan bilangan pecahan (mis. 350 / 7 menjadi 49,99999999999999),
 * supaya skor yang tepat berada di ambang tidak jatuh ke kategori di bawahnya.
 */
export function rapikan(x) {
  return Math.round(x * 1e6) / 1e6;
}

/** Skor variabel = S = Σ (wᵢ × sᵢ) dengan bobot dinormalkan agar Σ wᵢ = 1. */
export function hitungSkorVariabel(skor, indikator, variabel) {
  const anggota = indikator.filter((i) => i.variabel === variabel);
  const total = anggota.reduce((a, i) => a + i.bobot, 0);
  if (anggota.length === 0 || total <= 0) throw new Error(`Bobot indikator variabel ${variabel} tidak valid.`);
  return rapikan(anggota.reduce((a, i) => a + (i.bobot / total) * skor.find((s) => s.indikatorId === i.id).skor, 0));
}
/** Gap(r, i) = max(Req(r, i) − S(i), 0) dan SFS(r) = 100 − Σ (w(r, i) × Gap(r, i)). */
export function hitungGap(skor, indikator, profil, karierId) {
  const baris = profil.filter((p) => p.karierId === karierId);
  const total = baris.reduce((a, p) => a + p.bobot, 0);
  if (baris.length === 0 || total <= 0) throw new Error('Profil kebutuhan soft skill karier belum diisi.');
  const gap = [];
  for (const p of baris) {
    const s = skor.find((x) => x.indikatorId === p.indikatorId);
    const ind = indikator.find((x) => x.id === p.indikatorId);
    if (!s || !ind) continue;
    const w = p.bobot / total;
    const g = Math.max(p.req - s.skor, 0);
    gap.push({
      indikatorId: ind.id,
      kode: ind.kode,
      nama: ind.nama,
      variabel: ind.variabel,
      skor: s.skor,
      req: p.req,
      bobot: w,
      gap: g,
      tertimbang: w * g,
      saran: ind.saran ?? '',
      saranEn: ind.saranEn ?? '',
    });
  }
  const sfs = rapikan(100 - gap.reduce((a, g) => a + g.tertimbang, 0));
  return { gap, sfs };
}
export function tentukanAturan(y, sfs, ambang) {
  const niatKuat = y >= ambang.ambang_aturan_y;
  const selaras = sfs >= ambang.ambang_aturan_sfs;
  if (niatKuat && selaras) return 'R1';
  if (niatKuat) return 'R2';
  if (selaras) return 'R3';
  return 'R4';
}
export function hitung(m) {
  const skorIndikator = hitungSkorIndikator(m.indikator, m.butir, m.jawaban);
  const skor = {
    Y: hitungSkorVariabel(skorIndikator, m.indikator, 'Y'),
    X1: hitungSkorVariabel(skorIndikator, m.indikator, 'X1'),
    X2: hitungSkorVariabel(skorIndikator, m.indikator, 'X2'),
  };
  const pilihan = m.karier.find((k) => k.id === m.karierPilihanId);
  if (!pilihan) throw new Error('Karier pilihan tidak ditemukan.');
  const sfsSemua = m.karier.map((k) => ({
    karierId: k.id,
    nama: k.nama,
    sfs: hitungGap(skorIndikator, m.indikator, m.profil, k.id).sfs,
  }));
  const { gap: gapPilihan, sfs: sfsPilihan } = hitungGap(skorIndikator, m.indikator, m.profil, pilihan.id);
  // Karier teratas; bila seri dengan karier pilihan, karier pilihan diutamakan.
  const EPS = 1e-9;
  const maks = Math.max(...sfsSemua.map((s) => s.sfs));
  const karierTeratas =
    sfsPilihan >= maks - EPS
      ? { karierId: pilihan.id, nama: pilihan.nama, sfs: sfsPilihan }
      : sfsSemua.find((s) => s.sfs >= maks - EPS);
  const status = karierTeratas.karierId === pilihan.id ? 'Selaras' : 'Berbeda';
  const aturan = tentukanAturan(skor.Y, sfsPilihan, m.ambang);
  const aturanTambahan = [];
  if (skor.X1 < m.ambang.ambang_rendah) aturanTambahan.push('X1_RENDAH');
  if (skor.X2 < m.ambang.ambang_rendah) aturanTambahan.push('X2_RENDAH');
  if (karierTeratas.sfs - sfsPilihan >= m.ambang.selisih_alternatif - EPS) aturanTambahan.push('ALTERNATIF');
  // Prioritas pengembangan: hasil kali bobot × selisih terbesar.
  const jumlahPrioritas = Math.max(0, Math.round(m.ambang.jumlah_prioritas));
  const urutkanPrioritas = (gap) =>
    gap
      .filter((g) => g.gap > 0)
      .sort((a, b) => b.tertimbang - a.tertimbang || b.gap - a.gap)
      .slice(0, jumlahPrioritas);
  const prioritas = urutkanPrioritas(gapPilihan);

  // Yang ditampilkan ke mahasiswa: karier paling cocok sebagai hasil akhir,
  // soft skill yang perlu dikembangkan untuk karier itu, 3 soft skill terkuat,
  // dan 3 karier alternatif berikutnya.
  const gapTeratas =
    karierTeratas.karierId === pilihan.id ? gapPilihan : hitungGap(skorIndikator, m.indikator, m.profil, karierTeratas.karierId).gap;
  const prioritasHasil = urutkanPrioritas(gapTeratas);
  const kekuatan = skorIndikator
    .filter((s) => s.variabel !== 'Y')
    .sort((a, b) => b.skor - a.skor)
    .slice(0, 3);
  const alternatif = sfsSemua
    .filter((s) => s.karierId !== karierTeratas.karierId)
    .sort((a, b) => b.sfs - a.sfs)
    .slice(0, 3);
  return {
    skorIndikator,
    skor,
    kategori: {
      Y: kategori(skor.Y, m.ambang),
      X1: kategori(skor.X1, m.ambang),
      X2: kategori(skor.X2, m.ambang),
      SFS: kategori(sfsPilihan, m.ambang),
    },
    sfsPilihan,
    gapPilihan,
    sfsSemua,
    karierTeratas,
    status,
    aturan,
    aturanTambahan,
    prioritas,
    prioritasHasil,
    gapHasil: gapTeratas,
    kekuatan,
    alternatif,
    ambang: m.ambang,
  };
}

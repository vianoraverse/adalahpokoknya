/**
 * Penjelasan hasil (FR-07): templat kalimat per aturan tabel keputusan yang diisi dengan
 * label kategori, nama karier pilihan, dan tiga indikator prioritas. Tanpa angka dan tanpa AI,
 * jadi hasil yang sama selalu menghasilkan penjelasan yang sama.
 */
export const LABEL_KATEGORI = {
  id: { sangat: 'Sangat Cocok', cukup: 'Cukup Cocok', perlu: 'Perlu Dikembangkan' },
  en: { sangat: 'Highly Suitable', cukup: 'Fairly Suitable', perlu: 'Needs Development' },
};

// ['A'] → 'A', ['A', 'B'] → 'A dan B', ['A', 'B', 'C'] → 'A, B, dan C'
function gabung(xs, bhs) {
  const dan = bhs === 'en' ? 'and' : 'dan';
  if (xs.length <= 2) return xs.join(` ${dan} `);
  return `${xs.slice(0, -1).join(', ')}, ${dan} ${xs[xs.length - 1]}`;
}

/** Mengganti {isian} pada templat. Isian yang tidak dikenal dibiarkan apa adanya. */
export function isiTemplat(templat, isian) {
  return templat.replace(/\{(\w+)\}/g, (asli, k) => (k in isian ? isian[k] : asli));
}

/**
 * @param d.templat   { kode: { teks, teks_en } } dari tabel templat_penjelasan
 * @param d.hasil     hasil mesin BMS (aturan, aturanTambahan, kategori, prioritas)
 * @param d.karier    nama karier pilihan
 * @param d.bahasa    'id' atau 'en'
 * @returns paragraf-paragraf penjelasan, dipisah baris kosong
 */
export function susunRingkasan({ templat, hasil, karier, bahasa }) {
  const label = LABEL_KATEGORI[bahasa] ?? LABEL_KATEGORI.id;
  const isian = {
    karier,
    niat: label[hasil.kategori.Y],
    softskill: label[hasil.kategori.X],
    intrapersonal: label[hasil.kategori.X1],
    interpersonal: label[hasil.kategori.X2],
    prioritas: gabung(
      hasil.prioritas.map((p) => p.nama),
      bahasa,
    ),
  };
  return [hasil.aturan, ...hasil.aturanTambahan]
    .map((kode) => templat[kode])
    .filter(Boolean)
    .map((t) => isiTemplat((bahasa === 'en' && t.teks_en) || t.teks, isian))
    .join('\n\n');
}

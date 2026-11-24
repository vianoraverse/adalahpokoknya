/**
 * Mesin BMS YourWay. Rumus mengikuti Subbab 2.7 dan 3.5 laporan:
 * rata-rata tanpa bobot, normalisasi min-max, tiga kategori, tiga indikator prioritas,
 * dan tabel keputusan R1–R4. Tanpa machine learning dan tanpa AI.
 * Seluruh fungsi murni (tanpa I/O) supaya hasilnya bisa diuji terhadap perhitungan manual.
 */
export const AMBANG_BAWAAN = {
  ambang_rendah: 56, // di bawah ini: Perlu Dikembangkan
  ambang_tinggi: 76, // mulai nilai ini: Sangat Cocok (juga batas pada aturan R1–R4)
  jumlah_prioritas: 3,
};

/** Kode kategori yang disimpan. Labelnya ("Sangat Cocok" dan seterusnya) diatur di tampilan. */
export const KATEGORI = ['perlu', 'cukup', 'sangat'];

/** Normalisasi min-max skala Likert 1–5 ke 0–100: x' = (x − 1) / 4 × 100. */
export function normalisasi(x) {
  return ((x - 1) / 4) * 100;
}

/**
 * Membuang galat pembulatan bilangan pecahan (mis. 350 / 7 menjadi 49,99999999999999),
 * supaya nilai yang tepat berada di ambang tidak jatuh ke kategori di bawahnya.
 */
export function rapikan(x) {
  return Math.round(x * 1e6) / 1e6;
}

/** Perlu Dikembangkan (< 56), Cukup Cocok (56 sampai < 76), Sangat Cocok (≥ 76). */
export function kategori(nilai, ambang) {
  if (nilai < ambang.ambang_rendah) return 'perlu';
  if (nilai < ambang.ambang_tinggi) return 'cukup';
  return 'sangat';
}

const rataRata = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

/** Nilai indikator = rata-rata jawaban butirnya (1–5), lalu dinormalisasi ke 0–100. */
export function hitungNilaiIndikator(indikator, butir, jawaban) {
  return indikator.map((ind) => {
    const nilai = butir.filter((b) => b.indikatorId === ind.id).map((b) => jawaban[b.id]);
    if (nilai.length === 0) throw new Error(`Indikator "${ind.nama}" tidak memiliki butir aktif.`);
    for (const n of nilai) {
      if (!Number.isInteger(n) || n < 1 || n > 5)
        throw new Error(`Jawaban untuk indikator "${ind.nama}" belum lengkap.`);
    }
    return {
      indikatorId: ind.id,
      kode: ind.kode,
      nama: ind.nama,
      variabel: ind.variabel,
      nilai: rapikan(normalisasi(rataRata(nilai))),
    };
  });
}

/** Nilai variabel = rata-rata nilai indikator anggotanya (semua indikator sama penting). */
export function hitungNilaiVariabel(nilaiIndikator, variabel) {
  const anggota = nilaiIndikator.filter((i) => i.variabel === variabel);
  if (anggota.length === 0) throw new Error(`Variabel ${variabel} tidak memiliki indikator.`);
  return rapikan(rataRata(anggota.map((i) => i.nilai)));
}

/** Tabel keputusan (Tabel 3.3): kombinasi Y dan X terhadap ambang Sangat Cocok. */
export function tentukanAturan(y, x, ambang) {
  const niatTinggi = y >= ambang.ambang_tinggi;
  const softSkillTinggi = x >= ambang.ambang_tinggi;
  if (niatTinggi && softSkillTinggi) return 'R1';
  if (niatTinggi) return 'R2';
  if (softSkillTinggi) return 'R3';
  return 'R4';
}

/**
 * Tiga indikator soft skill dengan nilai terendah. Bila nilainya sama, urutan mengikuti
 * nomor indikator pada Tabel 2.3 (urutan daftar `indikator`), karena sort di JavaScript stabil.
 */
export function tentukanPrioritas(nilaiIndikator, indikator, jumlah) {
  return nilaiIndikator
    .filter((i) => i.variabel !== 'Y')
    .sort((a, b) => a.nilai - b.nilai)
    .slice(0, Math.max(0, Math.round(jumlah)))
    .map((i) => {
      const ind = indikator.find((x) => x.id === i.indikatorId) ?? {};
      return { ...i, saran: ind.saran ?? '', saranEn: ind.saranEn ?? '' };
    });
}

/**
 * @param m.indikator daftar indikator (urut sesuai Tabel 2.3)
 * @param m.butir     butir aktif { id, indikatorId }
 * @param m.jawaban   { idButir: 1–5 }
 * @param m.ambang    ambang kategori dan jumlah prioritas
 */
export function hitung(m) {
  const nilaiIndikator = hitungNilaiIndikator(m.indikator, m.butir, m.jawaban);
  const Y = hitungNilaiVariabel(nilaiIndikator, 'Y');
  const X1 = hitungNilaiVariabel(nilaiIndikator, 'X1');
  const X2 = hitungNilaiVariabel(nilaiIndikator, 'X2');
  const X = rapikan((X1 + X2) / 2);
  const nilai = { Y, X1, X2, X };

  const aturanTambahan = [];
  if (X1 < m.ambang.ambang_rendah) aturanTambahan.push('X1_RENDAH');
  if (X2 < m.ambang.ambang_rendah) aturanTambahan.push('X2_RENDAH');

  return {
    nilaiIndikator,
    nilai,
    kategori: {
      Y: kategori(Y, m.ambang),
      X1: kategori(X1, m.ambang),
      X2: kategori(X2, m.ambang),
      X: kategori(X, m.ambang),
    },
    prioritas: tentukanPrioritas(nilaiIndikator, m.indikator, m.ambang.jumlah_prioritas),
    aturan: tentukanAturan(Y, X, m.ambang),
    aturanTambahan,
    ambang: { ...m.ambang },
  };
}

/**
 * Teks "Ringkasnya" di halaman hasil. Disusun dari kalimat templat berdasarkan hasil
 * yang sudah dihitung mesin BMS (behavioral-model/engine.js). Tidak memakai layanan AI.
 */
// ['A'] → 'A', ['A', 'B'] → 'A dan B', ['A', 'B', 'C'] → 'A, B, dan C'
const daftar = (xs) =>
  xs.length <= 2 ? xs.join(' dan ') : `${xs.slice(0, -1).join(', ')}, dan ${xs[xs.length - 1]}`;

/** Menyusun paragraf "Ringkasnya" dari data hasil. Bahasanya sengaja dibuat sederhana. */
export function susunRingkasan(d) {
  if (d.bahasa === 'en') return ringkasanEn(d);
  const p = [];
  p.push(
    d.samaDenganPilihan
      ? `Dari jawabanmu, ${d.karierHasil} memang karier yang paling cocok dengan soft skill kamu saat ini.`
      : `Kamu awalnya memilih ${d.karierPilihan}, tapi dari jawabanmu, soft skill kamu saat ini lebih cocok ke ${d.karierHasil}.`,
  );
  if (d.kembangkan === null) {
    p.push('Ulangi tesnya untuk melihat soft skill yang bisa kamu latih untuk karier ini.');
  } else if (d.kembangkan.length) {
    p.push(
      `Kalau mau makin siap jadi ${d.karierHasil}, mulai dari melatih ${daftar(d.kembangkan.map((k) => k.nama))}.` +
        (d.kembangkan.length > 1 ? ' Nggak harus sekaligus, satu per satu juga cukup.' : ''),
    );
  } else {
    p.push(`Soft skill kamu sudah sesuai dengan kebutuhan ${d.karierHasil}. Langkah berikutnya, cari pengalaman nyata seperti proyek, lomba, atau magang.`);
  }
  p.push('Hasil ini cuma gambaran dari jawabanmu sendiri, bukan penilaian pasti. Kamu bisa mengulang tesnya kapan saja.');
  return p.join('\n\n');
}

// ['A', 'B', 'C'] → 'A, B, and C'
const daftarEn = (xs) =>
  xs.length <= 2 ? xs.join(' and ') : `${xs.slice(0, -1).join(', ')}, and ${xs[xs.length - 1]}`;

function ringkasanEn(d) {
  const p = [];
  p.push(
    d.samaDenganPilihan
      ? `Based on your answers, ${d.karierHasil} is the career that fits your soft skills best right now.`
      : `You first picked ${d.karierPilihan}, but based on your answers, your soft skills currently fit ${d.karierHasil} better.`,
  );
  if (d.kembangkan === null) {
    p.push('Retake the test to see which soft skills to practice for this career.');
  } else if (d.kembangkan.length) {
    p.push(
      `To get more ready for ${d.karierHasil}, start by practicing ${daftarEn(d.kembangkan.map((k) => k.nama))}.` +
        (d.kembangkan.length > 1 ? ' No need to do them all at once, one at a time is fine.' : ''),
    );
  } else {
    p.push(`Your soft skills already match what ${d.karierHasil} needs. Next, look for real experience such as projects, competitions, or internships.`);
  }
  p.push('This result is only a picture based on your own answers, not a final judgment. You can retake the test any time.');
  return p.join('\n\n');
}

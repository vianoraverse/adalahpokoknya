// Validasi mesin skor terhadap perhitungan manual (Tabel 3.8: "Validasi mesin skor").
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { AMBANG_BAWAAN, hitung, kategori, normalisasi, tentukanAturan } from './engine.js';

const dekat = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} ≠ ${b}`);

// Model kecil: 1 indikator Y, 1 indikator X1, 1 indikator X2, dua karier.
function model(jawaban, pilihan = 1) {
  return {
    indikator: [
      { id: 1, kode: 'minat', nama: 'Minat', variabel: 'Y', bobot: 1 },
      { id: 2, kode: 'ct', nama: 'Critical Thinking', variabel: 'X1', bobot: 1 },
      { id: 3, kode: 'tw', nama: 'Teamwork', variabel: 'X2', bobot: 1 },
    ],
    butir: [
      { id: 1, indikatorId: 1 },
      { id: 2, indikatorId: 1 },
      { id: 3, indikatorId: 2 },
      { id: 4, indikatorId: 2 },
      { id: 5, indikatorId: 3 },
      { id: 6, indikatorId: 3 },
    ],
    jawaban: Object.fromEntries(jawaban.map((n, i) => [i + 1, n])),
    profil: [
      { karierId: 1, indikatorId: 2, req: 80, bobot: 0.75 },
      { karierId: 1, indikatorId: 3, req: 65, bobot: 0.25 },
      { karierId: 2, indikatorId: 2, req: 50, bobot: 0.5 },
      { karierId: 2, indikatorId: 3, req: 50, bobot: 0.5 },
    ],
    karier: [
      { id: 1, nama: 'A' },
      { id: 2, nama: 'B' },
    ],
    karierPilihanId: pilihan,
    ambang: AMBANG_BAWAAN,
  };
}

test('normalisasi min-max: 1→0, 3→50, 5→100', () => {
  dekat(normalisasi(1), 0);
  dekat(normalisasi(3), 50);
  dekat(normalisasi(4.5), 87.5);
  dekat(normalisasi(5), 100);
});

test('kategori memakai ambang <50 rendah, 50–74 sedang, ≥75 tinggi (nilai batas)', () => {
  assert.equal(kategori(49.99, AMBANG_BAWAAN), 'rendah');
  assert.equal(kategori(50, AMBANG_BAWAAN), 'sedang');
  assert.equal(kategori(74.99, AMBANG_BAWAAN), 'sedang');
  assert.equal(kategori(75, AMBANG_BAWAAN), 'tinggi');
});

test('aturan R1–R4 pada nilai batas 75', () => {
  assert.equal(tentukanAturan(75, 75, AMBANG_BAWAAN), 'R1');
  assert.equal(tentukanAturan(75, 74.9, AMBANG_BAWAAN), 'R2');
  assert.equal(tentukanAturan(74.9, 75, AMBANG_BAWAAN), 'R3');
  assert.equal(tentukanAturan(74.9, 74.9, AMBANG_BAWAAN), 'R4');
});

test('skor, gap, dan SFS sama dengan perhitungan manual', () => {
  // Y: (5+4)/2=4,5 → 87,5. X1: (3+3)/2=3 → 50. X2: (4+2)/2=3 → 50.
  const h = hitung(model([5, 4, 3, 3, 4, 2]));
  dekat(h.skor.Y, 87.5);
  dekat(h.skor.X1, 50);
  dekat(h.skor.X2, 50);
  // Karier A: gap CT = 80−50 = 30, gap TW = 65−50 = 15 → SFS = 100 − (0,75×30 + 0,25×15) = 73,75.
  dekat(h.sfsPilihan, 73.75);
  // Karier B: tidak ada gap → SFS 100.
  dekat(h.sfsSemua.find((s) => s.karierId === 2).sfs, 100);
  assert.equal(h.aturan, 'R2');
  assert.equal(h.status, 'Berbeda');
  assert.equal(h.karierTeratas.karierId, 2);
  assert.deepEqual(h.aturanTambahan, ['ALTERNATIF']); // 100 − 73,75 ≥ 10
  assert.equal(h.prioritas[0].kode, 'ct'); // 22,5 > 3,75
  dekat(h.prioritas[0].tertimbang, 22.5);
});

test('gap tidak pernah negatif dan SFS maksimal 100', () => {
  const h = hitung(model([5, 5, 5, 5, 5, 5]));
  dekat(h.sfsPilihan, 100);
  assert.ok(h.gapPilihan.every((g) => g.gap === 0));
  assert.equal(h.prioritas.length, 0);
  assert.equal(h.aturan, 'R1');
  assert.equal(h.status, 'Selaras'); // seri 100 vs 100 → karier pilihan diutamakan
});

test('X1 dan X2 rendah memicu aturan tambahan', () => {
  const h = hitung(model([2, 2, 1, 2, 2, 2]));
  assert.ok(h.aturanTambahan.includes('X1_RENDAH'));
  assert.ok(h.aturanTambahan.includes('X2_RENDAH'));
  assert.equal(h.aturan, 'R4');
});

test('bobot indikator memengaruhi skor variabel (S = Σ wᵢ sᵢ)', () => {
  const m = model([5, 5, 5, 5, 1, 1]);
  m.indikator.push({ id: 4, kode: 'ps', nama: 'Problem Solving', variabel: 'X1', bobot: 3 });
  m.butir.push({ id: 7, indikatorId: 4 });
  m.jawaban[7] = 1;
  // X1 = (1×100 + 3×0) / 4 = 25
  dekat(hitung(m).skor.X1, 25);
});

test('jawaban tidak lengkap atau di luar 1–5 ditolak', () => {
  assert.throws(() => hitung(model([5, 4, 3, 3, 4])));
  assert.throws(() => hitung(model([5, 4, 3, 3, 4, 6])));
  assert.throws(() => hitung(model([5, 4, 3, 3, 4, 0])));
});

test('skor tepat di ambang tidak turun kategori karena galat pembulatan', () => {
  // Tujuh indikator X1 dengan skor 37,5; 25; 50; 75; 37,5; 62,5; 62,5 → rata-rata tepat 50 (sedang, bukan rendah).
  const m = model([5, 5, 3, 2, 3, 3]);
  const jawabX1 = [[2, 2], [3, 3], [4, 4], [3, 2], [4, 3], [4, 3]];
  jawabX1.forEach((pasangan, k) => {
    const id = 10 + k;
    m.indikator.push({ id, kode: `x${id}`, nama: `X${id}`, variabel: 'X1', bobot: 1 });
    pasangan.forEach((n, j) => {
      m.butir.push({ id: id * 10 + j, indikatorId: id });
      m.jawaban[id * 10 + j] = n;
    });
  });
  const h = hitung(m);
  assert.equal(h.skor.X1, 50);
  assert.equal(h.kategori.X1, 'sedang');
  assert.ok(!h.aturanTambahan.includes('X1_RENDAH'));
});

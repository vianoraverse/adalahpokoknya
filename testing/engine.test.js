// Validasi logika perhitungan dan kategori terhadap perhitungan manual (Tabel 3.8).
// Jalankan dengan: npm test
import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  AMBANG_BAWAAN,
  hitung,
  kategori,
  normalisasi,
  rapikan,
  tentukanAturan,
  tentukanPrioritas,
} from '../behavioral-model/engine.js';

const dekat = (a, b) => assert.ok(Math.abs(a - b) < 1e-9, `${a} ≠ ${b}`);

/**
 * Model kecil: 2 indikator Y, 2 indikator X1, 2 indikator X2, masing-masing 2 butir.
 * `jawaban` berisi 12 angka, urut per indikator: [Y1a, Y1b, Y2a, Y2b, X1a..., X2...].
 */
function model(jawaban, ambang = AMBANG_BAWAAN) {
  const indikator = [
    { id: 1, kode: 'minat', nama: 'Minat', variabel: 'Y' },
    { id: 2, kode: 'rencana', nama: 'Rencana', variabel: 'Y' },
    { id: 3, kode: 'ct', nama: 'Critical Thinking', variabel: 'X1', saran: 'saran ct' },
    { id: 4, kode: 'ps', nama: 'Problem Solving', variabel: 'X1', saran: 'saran ps' },
    { id: 5, kode: 'tw', nama: 'Teamwork', variabel: 'X2', saran: 'saran tw' },
    { id: 6, kode: 'oc', nama: 'Oral Communication', variabel: 'X2', saran: 'saran oc' },
  ];
  const butir = indikator.flatMap((ind) => [
    { id: ind.id * 2 - 1, indikatorId: ind.id },
    { id: ind.id * 2, indikatorId: ind.id },
  ]);
  return {
    indikator,
    butir,
    jawaban: Object.fromEntries(jawaban.map((n, i) => [i + 1, n])),
    ambang,
  };
}

test('normalisasi min-max: 1→0, 3→50, 5→100', () => {
  dekat(normalisasi(1), 0);
  dekat(normalisasi(3), 50);
  dekat(normalisasi(5), 100);
  dekat(normalisasi(4.5), 87.5);
});

test('kategori mengikuti Arikunto: <56 Perlu, 56–<76 Cukup, ≥76 Sangat', () => {
  assert.equal(kategori(55.99, AMBANG_BAWAAN), 'perlu');
  assert.equal(kategori(56, AMBANG_BAWAAN), 'cukup');
  assert.equal(kategori(75.99, AMBANG_BAWAAN), 'cukup');
  assert.equal(kategori(76, AMBANG_BAWAAN), 'sangat');
  assert.equal(kategori(100, AMBANG_BAWAAN), 'sangat');
});

test('nilai variabel = rata-rata indikator tanpa bobot, X = (X1 + X2) / 2', () => {
  // Y:  minat (5,5)→100, rencana (4,4)→75  → Y  = 87,5
  // X1: ct (3,4)→62,5,  ps (2,2)→25       → X1 = 43,75
  // X2: tw (5,4)→87,5,  oc (4,4)→75       → X2 = 81,25
  // X = (43,75 + 81,25) / 2 = 62,5
  const h = hitung(model([5, 5, 4, 4, 3, 4, 2, 2, 5, 4, 4, 4]));
  dekat(h.nilai.Y, 87.5);
  dekat(h.nilai.X1, 43.75);
  dekat(h.nilai.X2, 81.25);
  dekat(h.nilai.X, 62.5);
  assert.deepEqual(h.kategori, { Y: 'sangat', X1: 'perlu', X2: 'sangat', X: 'cukup' });
});

test('tabel keputusan R1–R4 memakai Y dan X terhadap ambang 76', () => {
  assert.equal(tentukanAturan(76, 76, AMBANG_BAWAAN), 'R1');
  assert.equal(tentukanAturan(80, 75.9, AMBANG_BAWAAN), 'R2');
  assert.equal(tentukanAturan(75.9, 90, AMBANG_BAWAAN), 'R3');
  assert.equal(tentukanAturan(40, 40, AMBANG_BAWAAN), 'R4');
});

test('contoh lengkap: Y tinggi, X sedang → R2 dan aturan tambahan X1', () => {
  const h = hitung(model([5, 5, 4, 4, 3, 4, 2, 2, 5, 4, 4, 4]));
  assert.equal(h.aturan, 'R2');
  assert.deepEqual(h.aturanTambahan, ['X1_RENDAH']);
});

test('aturan tambahan X1 dan X2 muncul bila nilainya < 56', () => {
  // X1: ct (2,3)→37,5, ps (3,3)→50 → 43,75. X2: tw (3,3)→50, oc (2,2)→25 → 37,5.
  const h = hitung(model([3, 3, 3, 3, 2, 3, 3, 3, 3, 3, 2, 2]));
  assert.deepEqual(h.aturanTambahan, ['X1_RENDAH', 'X2_RENDAH']);
  assert.equal(h.aturan, 'R4');
});

test('prioritas = tiga soft skill dengan nilai terendah (indikator Y tidak ikut)', () => {
  // ct 62,5; ps 25; tw 87,5; oc 75 → urutan terendah: ps, ct, oc
  const h = hitung(model([1, 1, 1, 1, 3, 4, 2, 2, 5, 4, 4, 4]));
  assert.deepEqual(
    h.prioritas.map((p) => p.kode),
    ['ps', 'ct', 'oc'],
  );
  assert.equal(h.prioritas[0].saran, 'saran ps');
});

test('prioritas seri mengikuti nomor indikator pada Tabel 2.3', () => {
  // Semua soft skill bernilai sama (50) → ambil tiga indikator pertama: ct, ps, tw.
  const h = hitung(model([4, 4, 4, 4, 3, 3, 3, 3, 3, 3, 3, 3]));
  assert.deepEqual(
    h.prioritas.map((p) => p.kode),
    ['ct', 'ps', 'tw'],
  );
});

test('jumlah prioritas mengikuti pengaturan admin', () => {
  const nilai = [
    { indikatorId: 3, kode: 'ct', variabel: 'X1', nilai: 10 },
    { indikatorId: 4, kode: 'ps', variabel: 'X1', nilai: 20 },
  ];
  assert.equal(tentukanPrioritas(nilai, [], 1).length, 1);
  assert.equal(tentukanPrioritas(nilai, [], 0).length, 0);
});

test('nilai tepat di ambang tidak jatuh ke kategori bawah karena pembulatan', () => {
  // 350 / 7 di JavaScript menghasilkan 49,99999999999999; setelah rapikan() menjadi 50.
  dekat(rapikan(350 / 7), 50);
  // Rata-rata 7 indikator yang jumlahnya 7 × 76 tetap 76 (Sangat Cocok).
  const ambang = { ...AMBANG_BAWAAN };
  assert.equal(kategori(rapikan((76 * 7) / 7), ambang), 'sangat');
});

test('jawaban kosong atau di luar 1–5 ditolak', () => {
  const m = model([5, 5, 4, 4, 3, 4, 2, 2, 5, 4, 4, 4]);
  delete m.jawaban[3];
  assert.throws(() => hitung(m), /belum lengkap/);
  const m2 = model([5, 5, 4, 4, 3, 4, 2, 2, 5, 4, 4, 6]);
  assert.throws(() => hitung(m2), /belum lengkap/);
});

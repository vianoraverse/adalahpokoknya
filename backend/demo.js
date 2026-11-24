// Data demo untuk presentasi: satu akun mahasiswa demo yang sudah punya hasil tes, dan 15 mahasiswa
// contoh supaya ringkasan admin ada isinya. Dijalankan lewat `npm run demo`.
// Semua jawaban dibuat acak (tapi selalu sama setiap kali dijalankan), bukan data mahasiswa sungguhan.
import bcrypt from 'bcryptjs';
import { simpanAsesmen } from './simpan-asesmen.js';

export const AKUN_DEMO = { email: 'demo@yourway.local', password: 'demo12345', nama: 'Mahasiswa Demo' };
const JUMLAH_CONTOH = 15;

// Pengacak sederhana dengan "seed", supaya data demo selalu sama.
function pengacak(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Jawaban 1–5 di sekitar nilai `pusat`.
const jawab = (acak, pusat) => Math.max(1, Math.min(5, Math.round(pusat + (acak() - 0.5) * 2.4)));

/** Membuat jawaban semua butir aktif. Pertanyaan niat (Y) cenderung tinggi, soft skill bervariasi. */
async function buatJawaban(db, acak, kekuatanPribadi, pusatNiat = 3.8) {
  const { rows } = await db.query(
    `SELECT b.id, i.kode, i.variabel FROM butir b JOIN indikator i ON i.id = b.indikator_id WHERE b.aktif = TRUE`,
  );
  const hasil = {};
  for (const b of rows) {
    const pusat = b.variabel === 'Y' ? pusatNiat : (kekuatanPribadi[b.kode] ??= 2.4 + acak() * 2.2);
    hasil[b.id] = jawab(acak, pusat);
  }
  return hasil;
}

async function buatAkun(db, nama, email, password) {
  const hash = await bcrypt.hash(password, 10);
  const { rows } = await db.query(
    `INSERT INTO pengguna (nama, email, kata_sandi_hash, peran, persetujuan_pada)
     VALUES ($1, $2, $3, 'mahasiswa', now()) RETURNING id`,
    [nama, email, hash],
  );
  return rows[0].id;
}

const hariLalu = (n) => new Date(Date.now() - n * 24 * 3600 * 1000);

/** Mengisi data demo bila akun demo belum ada. Aman dijalankan berulang. */
export async function isiDemo(db) {
  const ada = await db.query('SELECT 1 FROM pengguna WHERE email = $1', [AKUN_DEMO.email]);
  if (ada.rows.length) {
    console.log(`[demo] Data demo sudah ada. Akun demo: ${AKUN_DEMO.email} / ${AKUN_DEMO.password}`);
    return;
  }
  const { rows: karier } = await db.query('SELECT id, kode FROM karier ORDER BY urutan');
  const idKarier = (kode) => karier.find((k) => k.kode === kode).id;

  // Akun demo: dua kali tes, supaya riwayat dan hasil terakhir sama-sama terisi.
  const acak = pengacak(2026);
  const demoId = await buatAkun(db, AKUN_DEMO.nama, AKUN_DEMO.email, AKUN_DEMO.password);
  const profilDemo = { 'problem-solving': 4.4, 'critical-thinking': 4.1, teamwork: 3.2, 'oral-communication': 2.6 };
  await simpanAsesmen(db, demoId, idKarier('it-pm'), await buatJawaban(db, acak, { ...profilDemo }), hariLalu(21));
  // Tes kedua: niat sudah mantap (kategori Sangat Cocok), soft skill masih campuran → aturan R2.
  await simpanAsesmen(db, demoId, idKarier('software-engineer'), await buatJawaban(db, acak, { ...profilDemo, teamwork: 3.8 }, 4.7), hariLalu(2));

  // Mahasiswa contoh dengan pilihan karier yang beragam.
  for (let i = 1; i <= JUMLAH_CONTOH; i++) {
    const no = String(i).padStart(2, '0');
    const id = await buatAkun(db, `Mahasiswa Contoh ${no}`, `contoh${no}@yourway.local`, `contoh-${no}-${Math.random()}`);
    const pilihan = karier[Math.floor(acak() * karier.length)].id;
    await simpanAsesmen(db, id, pilihan, await buatJawaban(db, acak, {}), hariLalu(1 + Math.floor(acak() * 30)));
  }
  console.log(`[demo] Data demo dibuat: 1 akun demo dan ${JUMLAH_CONTOH} mahasiswa contoh.`);
  console.log(`[demo] Akun demo: ${AKUN_DEMO.email} / ${AKUN_DEMO.password}`);
}

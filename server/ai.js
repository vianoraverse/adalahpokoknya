/**
 * Layanan penjelasan AI (FR-08). AI hanya menyusun narasi dari hasil yang SUDAH
 * dihitung mesin BMS; skor, klasifikasi, dan rekomendasi tidak ditentukan AI.
 * Data yang dikirim tidak memuat identitas mahasiswa (NFR-Privacy). Bila layanan
 * AI tidak tersedia, dipakai penjelasan templat (NFR-Reliability).
 */
import { config } from './config.js';
const PENYEDIA = {
  groq: { baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile' },
  gemini: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-2.0-flash' },
  qwen: { baseUrl: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus' },
};
// ['A'] → 'A', ['A', 'B'] → 'A dan B', ['A', 'B', 'C'] → 'A, B, dan C'
const daftar = (xs) =>
  xs.length <= 2 ? xs.join(' dan ') : `${xs.slice(0, -1).join(', ')}, dan ${xs[xs.length - 1]}`;

/** Penjelasan cadangan (dipakai kalau AI tidak aktif atau gagal). Bahasanya sengaja dibuat sederhana. */
export function penjelasanTemplat(d) {
  if (d.bahasa === 'en') return penjelasanTemplatEn(d);
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

function penjelasanTemplatEn(d) {
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

const SISTEM = `Kamu menulis penjelasan singkat untuk halaman hasil YourWay, tugas kuliah yang membantu mahasiswa Teknik Informatika melihat karier TIK yang cocok dengan soft skill-nya.
Aturan:
- Hanya pakai data yang diberikan. Jangan menambah karier, angka, atau saran baru.
- Jangan menyebut angka, skor, persentase, rumus, atau istilah teknis.
- Tulis dalam bahasa yang diminta pada field "bahasa" ("id" = Bahasa Indonesia santai dengan sapaan "kamu", "en" = plain, friendly English).
- Jangan berlebihan atau terlalu memotivasi.
- Maksimal 3 paragraf pendek, tanpa markdown, tanpa daftar.
- Isi: karier hasil (sebut juga pilihan awalnya kalau berbeda), soft skill yang sebaiknya dilatih dulu, lalu satu kalimat bahwa ini hanya gambaran dan tesnya bisa diulang.`;

export async function susunPenjelasan(d) {
  const { provider, apiKey } = config.ai;
  const preset = PENYEDIA[provider];
  const baseUrl = config.ai.baseUrl || preset?.baseUrl;
  const model = config.ai.model || preset?.model;
  if (!apiKey || !baseUrl || !model) {
    return { narasi: penjelasanTemplat(d), sumber: 'templat', model: null };
  }
  try {
    const res = await fetch(`${baseUrl.replace(/\/$/, '')}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 700,
        messages: [
          { role: 'system', content: SISTEM },
          { role: 'user', content: `Susun penjelasan dari data hasil berikut (JSON):\n${JSON.stringify(d)}` },
        ],
      }),
      signal: AbortSignal.timeout(20000),
    });
    if (!res.ok) throw new Error(`Layanan AI membalas ${res.status}`);
    const json = await res.json();
    const narasi = json.choices?.[0]?.message?.content?.trim();
    if (!narasi) throw new Error('Balasan AI kosong');
    return { narasi, sumber: 'ai', model };
  } catch (e) {
    console.warn('[ai] Gagal, memakai penjelasan templat:', e.message);
    return { narasi: penjelasanTemplat(d), sumber: 'templat', model: null };
  }
}

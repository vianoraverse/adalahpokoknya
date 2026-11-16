/**
 * Layanan penjelasan AI (FR-08). AI hanya menyusun narasi dari hasil yang SUDAH
 * dihitung mesin BMS; skor, klasifikasi, dan rekomendasi tidak ditentukan AI.
 * Data yang dikirim tidak memuat identitas mahasiswa (NFR-Privacy). Bila layanan
 * AI tidak tersedia, dipakai penjelasan templat (NFR-Reliability).
 */
import { config } from './config.js';

export interface DataPenjelasan {
  karierPilihan: string;
  skor: { Y: number; X1: number; X2: number; SFS: number };
  kategori: { Y: string; X1: string; X2: string; SFS: string };
  status: string;
  karierTeratas: { nama: string; sfs: number };
  aturan: { kode: string; interpretasi: string; jenis: string; teks: string };
  tambahan: Array<{ kode: string; interpretasi: string; teks: string }>;
  prioritas: Array<{ nama: string; skor: number; req: number; gap: number; saran: string }>;
  kekuatan: Array<{ nama: string; skor: number }>;
}

export interface Penjelasan { narasi: string; sumber: 'ai' | 'templat'; model: string | null }

const PENYEDIA: Record<string, { baseUrl: string; model: string }> = {
  groq: { baseUrl: 'https://api.groq.com/openai/v1', model: 'llama-3.3-70b-versatile' },
  gemini: { baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai', model: 'gemini-2.0-flash' },
  qwen: { baseUrl: 'https://dashscope-intl.aliyuncs.com/compatible-mode/v1', model: 'qwen-plus' },
};

const b = (n: number) => (Math.round(n * 10) / 10).toLocaleString('id-ID', { maximumFractionDigits: 1 });

export function penjelasanTemplat(d: DataPenjelasan): string {
  const p: string[] = [];
  p.push(
    `Kamu memilih karier ${d.karierPilihan}. Skor niat karier (Y) kamu ${b(d.skor.Y)} dari 100 (${d.kategori.Y}), ` +
    `soft skill intrapersonal (X1) ${b(d.skor.X1)} (${d.kategori.X1}), dan soft skill interpersonal (X2) ${b(d.skor.X2)} (${d.kategori.X2}). ` +
    `Soft Skill Fit Score terhadap karier pilihanmu ${b(d.skor.SFS)} dari 100 (${d.kategori.SFS}).`,
  );
  p.push(`Kombinasi niat dan kesesuaian ini masuk aturan ${d.aturan.kode}: ${d.aturan.interpretasi.toLowerCase()}. ${d.aturan.teks}`);
  if (d.kekuatan.length) {
    p.push(`Soft skill terkuatmu saat ini: ${d.kekuatan.map((k) => `${k.nama} (${b(k.skor)})`).join(', ')}.`);
  }
  if (d.prioritas.length) {
    p.push(
      'Prioritas pengembangan, diurutkan dari yang paling berpengaruh terhadap kesesuaian:\n' +
      d.prioritas
        .map((x, i) => `${i + 1}. ${x.nama}: skormu ${b(x.skor)}, kebutuhan karier ${b(x.req)} (selisih ${b(x.gap)}). ${x.saran}`)
        .join('\n'),
    );
  } else {
    p.push('Semua indikator soft skill kamu sudah memenuhi level kebutuhan karier ini.');
  }
  for (const t of d.tambahan) {
    if (t.kode === 'ALTERNATIF') {
      p.push(`${d.karierTeratas.nama} memiliki Soft Skill Fit Score ${b(d.karierTeratas.sfs)}, lebih tinggi dari karier pilihanmu. Karier ini layak kamu eksplorasi sebagai alternatif.`);
    } else {
      p.push(t.teks);
    }
  }
  p.push('Hasil ini adalah gambaran dari jawabanmu sendiri, bukan penilaian mutlak. Kamu bisa mengulang asesmen kapan saja untuk melihat perkembangannya.');
  return p.join('\n\n');
}

const SISTEM = `Kamu adalah penyusun penjelasan pada aplikasi YourWay, alat ukur niat karier mahasiswa Teknik Informatika berbasis soft skill.
Tugasmu HANYA menarasikan hasil yang sudah dihitung sistem. Aturan:
- Jangan mengubah, menambah, atau menafsir ulang angka, kategori, aturan, karier, maupun prioritas yang diberikan.
- Jangan membuat rekomendasi karier baru atau menyebut skor yang tidak ada di data.
- Tulis dalam bahasa Indonesia yang hangat dan lugas untuk mahasiswa, sapa dengan "kamu".
- 3 sampai 5 paragraf pendek, tanpa markdown, tanpa judul, tanpa daftar bernomor selain untuk prioritas pengembangan.
- Jelaskan: arti skor niat dan soft skill, arti Soft Skill Fit Score terhadap karier pilihan, aturan yang terpicu, lalu langkah konkret untuk tiap prioritas pengembangan.
- Tutup dengan satu kalimat bahwa hasil berasal dari penilaian diri dan dapat diulang.`;

export async function susunPenjelasan(d: DataPenjelasan): Promise<Penjelasan> {
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
    const json = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
    const narasi = json.choices?.[0]?.message?.content?.trim();
    if (!narasi) throw new Error('Balasan AI kosong');
    return { narasi, sumber: 'ai', model };
  } catch (e) {
    console.warn('[ai] Gagal, memakai penjelasan templat:', (e as Error).message);
    return { narasi: penjelasanTemplat(d), sumber: 'templat', model: null };
  }
}

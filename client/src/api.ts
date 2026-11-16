export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function api<T = any>(path: string, opsi: { method?: string; body?: unknown } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`/api${path}`, {
      method: opsi.method ?? (opsi.body !== undefined ? 'POST' : 'GET'),
      headers: opsi.body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: opsi.body !== undefined ? JSON.stringify(opsi.body) : undefined,
      credentials: 'same-origin',
    });
  } catch {
    throw new ApiError(0, 'Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, data.pesan ?? 'Permintaan gagal. Coba lagi.');
  return data as T;
}

export interface Pengguna { id: number; nama: string; email: string; peran: 'mahasiswa' | 'admin' }
export interface Karier { id: number; kode: string; nama: string; area_fungsi: string; padanan: string; status_padanan: string; deskripsi: string }
export interface ButirKuesioner { id: number; teks: string; indikator_kode: string; indikator: string; variabel: 'Y' | 'X1' | 'X2' }
export type Kategori = 'rendah' | 'sedang' | 'tinggi';

export interface SkorIndikator { indikatorId: number; kode: string; nama: string; variabel: 'Y' | 'X1' | 'X2'; skor: number }
export interface GapIndikator extends SkorIndikator { req: number; bobot: number; gap: number; tertimbang: number; saran: string }
export interface AturanTeks { kode: string; kondisi: string; interpretasi: string; jenis: string; teks: string }

export interface Hasil {
  skorIndikator: SkorIndikator[];
  skor: { Y: number; X1: number; X2: number };
  kategori: { Y: Kategori; X1: Kategori; X2: Kategori; SFS: Kategori };
  sfsPilihan: number;
  gapPilihan: GapIndikator[];
  sfsSemua: Array<{ karierId: number; nama: string; sfs: number }>;
  karierTeratas: { karierId: number; nama: string; sfs: number };
  status: 'Selaras' | 'Berbeda';
  aturan: string;
  aturanTambahan: string[];
  prioritas: GapIndikator[];
  ambang: Record<string, number>;
  rekomendasi: { utama: AturanTeks; tambahan: AturanTeks[] };
}

export interface Asesmen {
  id: number;
  jenis: 'awal' | 'ulang';
  dibuatPada: string;
  karier: { id: number; nama: string; areaFungsi: string };
  hasil: Hasil;
  penjelasan: { narasi: string; sumber: 'ai' | 'templat'; model: string | null } | null;
}

export interface RingkasAsesmen {
  id: number; jenis: string; dibuatPada: string; karier: string;
  y: number; x1: number; x2: number; sfs: number; aturan: string; status: string;
}

/** Skor 0–100 dengan paling banyak satu desimal (49,6 tidak ditampilkan sebagai 50). */
export const bulat = (n: number | null | undefined) =>
  n == null ? '–' : (Math.round(n * 10) / 10).toLocaleString('id-ID', { maximumFractionDigits: 1 });
export const tanggal = (s: string) =>
  new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
export const LABEL_VARIABEL = { Y: 'Niat karier', X1: 'Soft skill intrapersonal', X2: 'Soft skill interpersonal' } as const;

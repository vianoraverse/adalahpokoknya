// Potongan tampilan hasil tes yang dipakai di Dasbor dan halaman Hasil.
// Yang ditampilkan ke mahasiswa sengaja dibuat sederhana: tanpa angka dan tanpa istilah teknis.
import { bhs, catatanSementara, html, ikon, t, tHtml } from './umum.js';
import { IKON_KARIER, IKON_SOFT_SKILL } from './ikon.js';

/** Label kecocokan dari skor kesesuaian (SFS) karier hasil, memakai ambang yang diatur admin. */
export function labelCocok(h) {
  const sfs = h.karierTeratas.sfs;
  if (sfs >= h.ambang.ambang_tinggi) return t('hasil.label.tinggi');
  if (sfs >= h.ambang.ambang_rendah) return t('hasil.label.sedang');
  return t('hasil.label.rendah');
}

/**
 * Data yang ditampilkan. Hasil tes yang disimpan sebelum perubahan tampilan ini belum punya
 * `prioritasHasil`, `kekuatan`, dan `alternatif`, jadi dihitung ulang dari data yang ada.
 */
export function dataTampil(a) {
  const h = a.hasil;
  const samaDenganPilihan = h.karierTeratas.karierId === a.karier.id;
  return {
    karierHasil: h.karierTeratas,
    samaDenganPilihan,
    label: labelCocok(h),
    // null = tidak diketahui (hasil lama yang karier hasilnya beda dari pilihan); mahasiswa diminta ulang tes.
    kembangkan: h.prioritasHasil ?? (samaDenganPilihan ? h.prioritas : null),
    // Data spider chart. Hasil lama hanya punya data untuk karier pilihan, jadi chart hanya tampil kalau sama.
    radar: h.gapHasil ?? (samaDenganPilihan ? h.gapPilihan : null),
    kekuatan:
      h.kekuatan ?? [...h.skorIndikator].filter((s) => s.variabel !== 'Y').sort((x, y) => y.skor - x.skor).slice(0, 3),
    alternatif:
      h.alternatif ??
      [...h.sfsSemua].filter((s) => s.karierId !== h.karierTeratas.karierId).sort((x, y) => y.sfs - x.sfs).slice(0, 3),
  };
}

/** Kotak paling atas: satu karier hasil akhir. `semuaKarier` = daftar dari /api/careers (untuk ikon dan deskripsi). */
export function kotakHasil(a, semuaKarier = []) {
  const d = dataTampil(a);
  const k = semuaKarier.find((x) => x.id === d.karierHasil.karierId);
  return html`<section class="hasil-papan gelap" aria-label="Hasil utama">
    <div class="hasil-papan__ikon">${ikon(IKON_KARIER[k?.kode])}</div>
    <div class="hasil-papan__isi">
      <p class="hasil-papan__label">${t('hasil.palingCocok')}</p>
      <p class="hasil-papan__tujuan">${d.karierHasil.nama}</p>
      <p class="hasil-papan__cap"><span class="cap cap--isi">${d.label}</span></p>
      ${k?.deskripsi ? html`<p class="hasil-papan__desk">${k.deskripsi}</p>` : ''}
      <p class="hasil-papan__desk">${
        d.samaDenganPilihan ? t('hasil.sama') : tHtml('hasil.beda', { pilihan: a.karier.nama })
      }</p>
    </div>
    ${catatanSementara()}
  </section>`;
}

/** Ikon soft skill di dalam lingkaran kuning. */
export const ikonSoftSkill = (kode) => html`<span class="ikon-bulat">${ikon(IKON_SOFT_SKILL[kode])}</span>`;

/** Saran sesuai bahasa. Hasil lama belum punya saranEn, jadi memakai saran bahasa Indonesia. */
const saran = (p) => (bhs() === 'en' && p.saranEn ? p.saranEn : p.saran);

/** Daftar soft skill yang bisa dilatih, masing-masing dengan satu saran. */
export function daftarLatih(d) {
  if (d.kembangkan === null) return html`<p>${t('hasil.latihUlang')}</p>`;
  if (d.kembangkan.length === 0) {
    return html`<p>${t('hasil.latihSudah', { karier: d.karierHasil.nama })}</p>`;
  }
  return html`<ul class="daftar-latih">
    ${d.kembangkan.map((p) => html`<li>${ikonSoftSkill(p.kode)}<div><h3>${p.nama}</h3><p>${saran(p)}</p></div></li>`)}
  </ul>`;
}

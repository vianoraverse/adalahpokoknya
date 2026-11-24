// Potongan tampilan hasil tes yang dipakai di Dasbor dan halaman Hasil.
// Yang ditampilkan ke mahasiswa sengaja tanpa angka: hanya kategori (Sangat Cocok, Cukup Cocok,
// Perlu Dikembangkan), soft skill prioritas, rekomendasi, dan penjelasan.
import { html, ikon, t } from './umum.js';
import { IKON_KARIER, IKON_SOFT_SKILL } from './ikon.js';

/** Urutan kategori dari rendah ke tinggi; dipakai untuk mengisi meteran tiga kotak. */
const TINGKAT = { perlu: 1, cukup: 2, sangat: 3 };

export const labelKategori = (k) => t(`kategori.${k}`);

/** Label kategori dengan meteran tiga kotak di depannya (meteran hanya hiasan; artinya ada di teks). */
export const capKategori = (k) => html`<span class="kategori kategori--${k}">
  <span class="kategori__meter" aria-hidden="true">${[1, 2, 3].map((i) => html`<i class="${i <= TINGKAT[k] ? 'isi' : ''}"></i>`)}</span>
  ${labelKategori(k)}
</span>`;

/** Kotak paling atas: karier yang dipilih mahasiswa. `semuaKarier` = daftar dari /api/careers. */
export function kotakKarier(a, semuaKarier = []) {
  const k = semuaKarier.find((x) => x.id === a.karier.id);
  return html`<section class="hasil-papan gelap" aria-label="${t('hasil.karierPilihan')}">
    <div class="hasil-papan__ikon">${ikon(IKON_KARIER[a.karier.kode])}</div>
    <div class="hasil-papan__isi">
      <p class="hasil-papan__label">${t('hasil.karierPilihan')}</p>
      <p class="hasil-papan__tujuan">${a.karier.nama}</p>
      ${k?.deskripsi ? html`<p class="hasil-papan__desk">${k.deskripsi}</p>` : ''}
    </div>
  </section>`;
}

/** Empat kategori kecocokan: Y, X, X1, X2 (FR-06), masing-masing dengan penjelasan singkat. */
export function daftarKategori(a) {
  return html`<ul class="daftar-kategori">
    ${['Y', 'X', 'X1', 'X2'].map((v) => html`<li>
      <div>
        <h3>${t(`variabel.${v}`)}</h3>
        <p>${t(`variabel.${v}.p`)}</p>
      </div>
      ${capKategori(a.kategori[v])}
    </li>`)}
  </ul>`;
}

/** Ikon soft skill di dalam lingkaran kuning. */
export const ikonSoftSkill = (kode) => html`<span class="ikon-bulat">${ikon(IKON_SOFT_SKILL[kode])}</span>`;

/** Tiga soft skill prioritas (nilai terendah), masing-masing dengan satu saran. `baris` = tiga kolom di layar lebar. */
export function daftarLatih(prioritas, baris = false) {
  return html`<ul class="daftar-latih ${baris ? 'daftar-latih--baris' : ''}">
    ${prioritas.map((p) => html`<li>${ikonSoftSkill(p.kode)}<div><h3>${p.nama}</h3><p>${p.saran}</p></div></li>`)}
  </ul>`;
}

/** Rekomendasi dari aturan tabel keputusan yang terpicu, ditambah aturan tambahan bila ada. */
export function teksRekomendasi(a) {
  const { utama, tambahan } = a.rekomendasi;
  return html`${utama ? html`<p class="rekomendasi__utama">${utama.teks}</p>` : ''}
    ${tambahan.length ? html`<ul class="rekomendasi__tambahan">${tambahan.map((r) => html`<li>${r.teks}</li>`)}</ul>` : ''}`;
}

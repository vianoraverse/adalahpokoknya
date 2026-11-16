// Potongan tampilan hasil asesmen yang dipakai di Dasbor dan halaman Hasil.
import { NAMA_VARIABEL, bulat, html, kode, tingkat, trek } from './umum.js';

/** Papan hasil: karier tujuan, arti aturan yang terpicu, dan Soft Skill Fit Score. */
export function papanHasil(a) {
  const h = a.hasil;
  return html`<section class="hasil-papan gelap" aria-label="Ringkasan hasil">
    <div class="hasil-papan__teks">
      <p class="hasil-papan__label">Tujuan</p>
      <p class="hasil-papan__tujuan">${a.karier.nama}</p>
      <p class="hasil-papan__arti">${h.rekomendasi.utama.interpretasi}</p>
      <p>${
        h.status === 'Selaras'
          ? 'Dari 16 karier, pilihanmu adalah yang paling selaras dengan profil soft skill-mu.'
          : html`Karier yang paling selaras dengan profil soft skill-mu adalah <strong>${h.karierTeratas.nama}</strong> (SFS ${bulat(h.karierTeratas.sfs)}).`
      }</p>
      <p class="hasil-papan__cap">
        <span class="cap ${h.status === 'Selaras' ? 'cap--isi' : ''}">${h.status}</span>
        <span class="cap">Aturan ${h.aturan}</span>
      </p>
    </div>
    <div class="hasil-papan__skor">
      <span>Soft Skill Fit Score</span>
      <strong class="hasil-papan__angka">${bulat(h.sfsPilihan)}</strong>
      ${tingkat(h.kategori.SFS)}
    </div>
  </section>`;
}

/** Tiga skor variabel (Y, X1, X2) sebagai trek dengan batas kategori. */
export function skorTiga(h) {
  const batas = [h.ambang.ambang_rendah, h.ambang.ambang_tinggi];
  return html`<section class="panel" aria-label="Skor niat karier dan soft skill">
    <div class="skor-tiga">
      ${['Y', 'X1', 'X2'].map((v) => html`<div>
        <p class="skor-tiga__kepala">${kode(v)} ${NAMA_VARIABEL[v]}</p>
        <p class="skor-tiga__nilai"><strong>${bulat(h.skor[v])}</strong> ${tingkat(h.kategori[v])}</p>
        ${trek(h.skor[v], { jalur: v, batas, label: `${NAMA_VARIABEL[v]}: ${bulat(h.skor[v])} dari 100, kategori ${h.kategori[v]}` })}
        <p class="skor-tiga__skala" aria-hidden="true">
          <span style="left:0;transform:none">0</span>
          ${batas.map((b) => html`<span style="left:${b}%">${b}</span>`)}
          <span style="left:auto;right:0;transform:none">100</span>
        </p>
      </div>`)}
    </div>
  </section>`;
}

/** Rute pengembangan: dari posisi sekarang, lewat soft skill prioritas, ke karier tujuan. */
export function rutePengembangan(a, { ringkas = false } = {}) {
  const h = a.hasil;
  if (h.prioritas.length === 0) {
    return html`<p>Semua indikator soft skill-mu sudah memenuhi level kebutuhan ${a.karier.nama}.</p>`;
  }
  return html`<ol class="rute-kembang">
    <li class="rute-kembang__awal"><p class="rute-kembang__ujung">Posisimu sekarang <span>SFS ${bulat(h.sfsPilihan)}</span></p></li>
    ${h.prioritas.map((p) => html`<li class="rute-kembang__stasiun">
      <div class="rute-kembang__kepala">
        <h3>${p.nama} ${kode(p.variabel)}</h3>
        <span>skor ${bulat(p.skor)}, kebutuhan ${bulat(p.req)}</span>
      </div>
      ${trek(p.skor, { req: p.req, jalur: p.variabel })}
      ${ringkas ? '' : html`<p>${p.saran}</p>`}
    </li>`)}
    <li class="rute-kembang__tujuan"><p class="rute-kembang__ujung">${a.karier.nama}</p></li>
  </ol>`;
}

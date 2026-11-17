// Halaman hasil tes.
import { $, api, catatanSementara, html, ikon, mulaiHalaman, pasang, t, tanggal } from '../umum.js';
import { IKON_KARIER } from '../ikon.js';
import { daftarLatih, dataTampil, ikonSoftSkill, kotakHasil } from '../hasil-bagian.js';
import { gambarRadar } from '../grafik.js';

await mulaiHalaman('mahasiswa');
const utama = $('#utama');
const id = Number(new URLSearchParams(location.search).get('id'));

/** Penjelasan dimuat setelah halaman tampil, supaya hasil tidak menunggu layanan AI. */
async function muatPenjelasan(a) {
  const wadah = $('#penjelasan');
  try {
    const { penjelasan } = await api(`/assessments/${a.id}/explanation`, { method: 'POST', body: {} });
    pasang(wadah, html`${penjelasan.narasi.split(/\n{2,}/).map((par) => html`<p>${par}</p>`)}`);
  } catch (e) {
    pasang(wadah, html`<p class="galat" role="alert">${t('hasil.penjelasanGagal')} ${e.message}</p>`);
  }
}

try {
  const [{ asesmen: a }, { karier }] = await Promise.all([api(`/assessments/${id}`), api('/careers')]);
  const cari = (karierId) => karier.find((k) => k.id === karierId) ?? {};
  const d = dataTampil(a);

  pasang(utama, html`<div class="halaman halaman--sedang">
    <header class="halaman__kepala halaman__kepala--baris">
      <div>
        <h1>${t('hasil.judul')}</h1>
        <p>${tanggal(a.dibuatPada)}</p>
      </div>
      <a class="tombol" href="/app/asesmen">${t('hasil.ulangi')}</a>
    </header>

    ${kotakHasil(a, karier)}

    <div class="dua-kolom">
      <section class="panel" aria-labelledby="judul-kekuatan">
        <h2 id="judul-kekuatan">${t('hasil.kekuatan')}</h2>
        <ul class="daftar-kekuatan">${d.kekuatan.map((k) => html`<li>${ikonSoftSkill(k.kode)} ${k.nama}</li>`)}</ul>
      </section>
      <section class="panel" aria-labelledby="judul-latih">
        <h2 id="judul-latih">${t('hasil.latih')}</h2>
        ${daftarLatih(d)}
        ${catatanSementara()}
      </section>
    </div>

    ${d.radar
      ? html`<section class="panel" aria-labelledby="judul-radar">
          <h2 id="judul-radar">${t('hasil.radarJudul', { karier: d.karierHasil.nama })}</h2>
          <p class="panel__sub">${t('hasil.radarP')}</p>
          <figure class="radar" id="radar"></figure>
          ${catatanSementara()}
        </section>`
      : ''}

    <section class="panel" aria-labelledby="judul-alternatif">
      <h2 id="judul-alternatif">${t('hasil.alternatif')}</h2>
      <ul class="alternatif">
        ${d.alternatif.map((k) => html`<li>
          <span class="alternatif__ikon">${ikon(IKON_KARIER[cari(k.karierId).kode])}</span>
          <h3>${k.nama}</h3>
          <p>${cari(k.karierId).deskripsi ?? ''}</p>
        </li>`)}
      </ul>
      ${catatanSementara()}
    </section>

    <section class="panel penjelasan" aria-labelledby="judul-penjelasan">
      <h2 id="judul-penjelasan">${t('hasil.ringkas')}</h2>
      <div id="penjelasan"><p class="memuat">${t('hasil.menyusun')}</p></div>
      ${catatanSementara()}
    </section>
  </div>`);

  if (d.radar) gambarRadar($('#radar'), d.radar, d.karierHasil.nama, (d.kembangkan ?? []).map((k) => k.kode));
  muatPenjelasan(a);
} catch (e) {
  pasang(utama, html`<div class="halaman">
    <p class="galat" role="alert">${e.message}</p>
    <p><a href="/app/riwayat">${t('hasil.lihatRiwayat')}</a></p>
  </div>`);
}

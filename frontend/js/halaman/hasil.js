// Halaman hasil tes.
import { $, api, html, mulaiHalaman, pasang, t, tanggal } from '../umum.js';
import { daftarKategori, daftarLatih, kotakKarier, teksRekomendasi } from '../hasil-bagian.js';
import { gambarRadar } from '../grafik.js';

await mulaiHalaman('mahasiswa');
const utama = $('#utama');
const id = Number(new URLSearchParams(location.search).get('id'));

try {
  const [{ asesmen: a }, { karier }] = await Promise.all([api(`/assessments/${id}`), api('/careers')]);

  pasang(utama, html`<div class="halaman halaman--sedang">
    <header class="halaman__kepala halaman__kepala--baris">
      <div>
        <h1>${t('hasil.judul')}</h1>
        <p>${tanggal(a.dibuatPada)}</p>
      </div>
      <a class="tombol" href="/app/asesmen">${t('hasil.ulangi')}</a>
    </header>

    ${kotakKarier(a, karier)}

    <section class="panel" aria-labelledby="judul-kategori">
      <h2 id="judul-kategori">${t('hasil.kategoriJudul')}</h2>
      ${daftarKategori(a)}
    </section>

    <section class="panel penjelasan" aria-labelledby="judul-penjelasan">
      <h2 id="judul-penjelasan">${t('hasil.ringkas')}</h2>
      ${a.ringkasan.split(/\n{2,}/).map((par) => html`<p>${par}</p>`)}
    </section>

    <section class="panel rekomendasi" aria-labelledby="judul-rekomendasi">
      <h2 id="judul-rekomendasi">${t('hasil.rekomendasi')}</h2>
      ${teksRekomendasi(a)}
    </section>

    <section class="panel" aria-labelledby="judul-latih">
      <h2 id="judul-latih">${t('hasil.latih')}</h2>
      ${daftarLatih(a.prioritas, true)}
    </section>

    <section class="panel" aria-labelledby="judul-radar">
      <h2 id="judul-radar">${t('hasil.radarJudul')}</h2>
      <p class="panel__sub">${t('hasil.radarP')}</p>
      <figure class="radar" id="radar"></figure>
    </section>

    <p class="catatan-hasil">${t('hasil.catatan')}</p>
  </div>`);

  gambarRadar($('#radar'), a.softSkill, a.ambang, a.prioritas.map((p) => p.kode));
} catch (e) {
  pasang(utama, html`<div class="halaman">
    <p class="galat" role="alert">${e.message}</p>
    <p><a href="/app/riwayat">${t('hasil.lihatRiwayat')}</a></p>
  </div>`);
}

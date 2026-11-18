// Riwayat tes mahasiswa.
import { $, api, catatanSementara, gagalMuat, html, ikon, mulaiHalaman, pasang, t, tanggal } from '../umum.js';
import { IKON_KARIER } from '../ikon.js';

await mulaiHalaman('mahasiswa');

try {
  const { asesmen } = await api('/assessments');
  pasang($('#utama'), html`<div class="halaman halaman--sedang">
    <header class="halaman__kepala">
      <h1>${t('riwayat.judul')}</h1>
      <p>${t('riwayat.p')}</p>
    </header>
    ${asesmen.length === 0
      ? html`<div class="kosong">
          <p>${t('riwayat.kosong')}</p>
          <a class="tombol tombol--utama" href="/app/asesmen">${t('dasbor.mulai')}</a>
        </div>`
      : html`<div class="panel tabel-gulir">
          <table class="tabel">
            <thead>
              <tr>
                <th>${t('riwayat.tanggal')}</th><th>${t('riwayat.pilihan')}</th><th>${t('riwayat.cocok')}</th>
                <th><span class="sr">${t('riwayat.buka')}</span></th>
              </tr>
            </thead>
            <tbody>
              ${asesmen.map((a) => html`<tr>
                <td>${tanggal(a.dibuatPada)}</td>
                <td>${a.karier}</td>
                <th scope="row"><span class="dengan-ikon">${ikon(IKON_KARIER[a.kodeHasil])} ${a.karierHasil}</span></th>
                <td><a href="/app/hasil?id=${a.id}">${t('riwayat.lihat')}</a></td>
              </tr>`)}
            </tbody>
          </table>
          ${catatanSementara()}
        </div>`}
  </div>`);
} catch (e) {
  gagalMuat(e);
}

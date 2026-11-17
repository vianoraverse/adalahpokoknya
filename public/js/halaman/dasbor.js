// Dasbor mahasiswa: ringkasan hasil tes terakhir.
import { $, api, catatanSementara, gagalMuat, html, mulaiHalaman, pasang, t, tanggal } from '../umum.js';
import { daftarLatih, dataTampil, kotakHasil } from '../hasil-bagian.js';

const pengguna = await mulaiHalaman('mahasiswa');
const utama = $('#utama');
const namaDepan = pengguna.nama.split(' ')[0];

try {
  const { asesmen: daftar } = await api('/assessments');

  if (daftar.length === 0) {
    pasang(utama, html`<div class="halaman halaman--sempit">
      <div class="kosong">
        <h1>${t('dasbor.halo', { nama: namaDepan })}</h1>
        <p>${t('dasbor.kosong')}</p>
        <a class="tombol tombol--utama tombol--besar" href="/app/asesmen">${t('dasbor.mulai')}</a>
      </div>
    </div>`);
  } else {
    const terakhir = daftar[0];
    const [{ asesmen: a }, { karier }] = await Promise.all([api(`/assessments/${terakhir.id}`), api('/careers')]);
    const d = dataTampil(a);

    pasang(utama, html`<div class="halaman halaman--sedang">
      <header class="halaman__kepala halaman__kepala--baris">
        <div>
          <h1>${t('dasbor.halo', { nama: namaDepan })}</h1>
          <p>${t('dasbor.terakhir', { tanggal: tanggal(terakhir.dibuatPada) })}</p>
        </div>
        <a class="tombol" href="/app/asesmen">${t('hasil.ulangi')}</a>
      </header>

      ${kotakHasil(a, karier)}

      <section class="panel">
        <h2>${t('hasil.latih')}</h2>
        ${daftarLatih(d)}
        <p><a class="tombol tombol--utama" href="/app/hasil?id=${terakhir.id}">${t('dasbor.lihat')}</a></p>
        ${catatanSementara()}
      </section>
    </div>`);
  }
} catch (e) {
  gagalMuat(e);
}

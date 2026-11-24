// Dasbor mahasiswa: ringkasan hasil tes terakhir.
import { $, api, gagalMuat, html, mulaiHalaman, pasang, t, tanggal } from '../umum.js';
import { daftarKategori, daftarLatih, kotakKarier } from '../hasil-bagian.js';

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

    pasang(utama, html`<div class="halaman halaman--sedang">
      <header class="halaman__kepala halaman__kepala--baris">
        <div>
          <h1>${t('dasbor.halo', { nama: namaDepan })}</h1>
          <p>${t('dasbor.terakhir', { tanggal: tanggal(terakhir.dibuatPada) })}</p>
        </div>
        <a class="tombol" href="/app/asesmen">${t('hasil.ulangi')}</a>
      </header>

      ${kotakKarier(a, karier)}

      <div class="dua-kolom">
        <section class="panel">
          <h2>${t('hasil.kategoriJudul')}</h2>
          ${daftarKategori(a)}
        </section>
        <section class="panel">
          <h2>${t('hasil.latih')}</h2>
          ${daftarLatih(a.prioritas)}
        </section>
      </div>
      <p><a class="tombol tombol--utama" href="/app/hasil?id=${terakhir.id}">${t('dasbor.lihat')}</a></p>
    </div>`);
  }
} catch (e) {
  gagalMuat(e);
}

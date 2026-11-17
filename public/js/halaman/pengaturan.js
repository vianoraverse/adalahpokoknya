// Pengaturan akun: nama, kata sandi, dan hapus akun. Dipakai mahasiswa dan admin.
import { $, api, html, isian, modal, mulaiHalaman, pasang, t, toast } from '../umum.js';

const peran = location.pathname.startsWith('/admin') ? 'admin' : 'mahasiswa';
const pengguna = await mulaiHalaman(peran);

pasang($('#utama'), html`<div class="halaman halaman--sempit">
  <header class="halaman__kepala"><h1>${t('set.judul')}</h1></header>

  <section class="panel">
    <h2>${t('set.profil')}</h2>
    <form class="formulir" id="form-profil">
      <label>${t('auth.nama')} <input name="nama" value="${pengguna.nama}" required minlength="2" maxlength="80" /></label>
      <label>${t('auth.email')} <input value="${pengguna.email}" disabled /></label>
      <button class="tombol tombol--utama">${t('set.simpanNama')}</button>
    </form>
  </section>

  <section class="panel">
    <h2>${t('set.sandi')}</h2>
    <form class="formulir" id="form-sandi">
      <label>${t('set.sandiLama')} <input name="passwordLama" type="password" autocomplete="current-password" required /></label>
      <label>${t('set.sandiBaru')}
        <input name="passwordBaru" type="password" autocomplete="new-password" required minlength="8" maxlength="72" />
        <small>${t('auth.sandiMin')}</small>
      </label>
      <button class="tombol tombol--utama">${t('set.ganti')}</button>
    </form>
  </section>

  <section class="panel panel--bahaya">
    <h2>${t('set.hapus')}</h2>
    <p>${t('set.hapusP')}</p>
    <p><button type="button" class="tombol tombol--bahaya" id="tombol-hapus">${t('set.hapus')}</button></p>
  </section>
</div>`);

$('#form-profil').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const { pengguna: baru } = await api('/auth/me', { method: 'PATCH', body: { nama: isian(e.target).nama } });
    $('.sisi__bawah strong').textContent = baru.nama;
    toast(t('set.namaDisimpan'));
  } catch (err) {
    toast(err.message, 'galat');
  }
});

$('#form-sandi').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await api('/auth/me', { method: 'PATCH', body: isian(e.target) });
    e.target.reset();
    toast(t('set.sandiDiganti'));
  } catch (err) {
    toast(err.message, 'galat');
  }
});

$('#tombol-hapus').addEventListener('click', () => {
  const d = modal(t('set.hapusJudul'), html`<form class="formulir">
    <p>${t('set.hapusKonfirmasi')}</p>
    <label>${t('auth.sandi')} <input name="password" type="password" autocomplete="current-password" required /></label>
    <p class="galat" role="alert" hidden></p>
    <div class="formulir__aksi">
      <button type="button" class="tombol" data-tutup>${t('set.batal')}</button>
      <button class="tombol tombol--bahaya">${t('set.hapus')}</button>
    </div>
  </form>`);
  $('form', d).addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await api('/auth/me', { method: 'DELETE', body: isian(e.target) });
      location.href = '/';
    } catch (err) {
      const g = $('.galat', d);
      g.textContent = err.message;
      g.hidden = false;
    }
  });
});

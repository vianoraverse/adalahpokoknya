// Pengaturan akun: nama, kata sandi, dan hapus akun. Dipakai mahasiswa dan admin.
import { $, api, html, isian, modal, mulaiHalaman, pasang, toast } from '../umum.js';

const peran = location.pathname.startsWith('/admin') ? 'admin' : 'mahasiswa';
const pengguna = await mulaiHalaman(peran);

pasang($('#utama'), html`<div class="halaman halaman--sempit">
  <header class="halaman__kepala"><h1>Pengaturan</h1></header>

  <section class="panel">
    <h2>Profil</h2>
    <form class="formulir" id="form-profil">
      <label>Nama <input name="nama" value="${pengguna.nama}" required minlength="2" maxlength="80" /></label>
      <label>Email <input value="${pengguna.email}" disabled /></label>
      <button class="tombol tombol--utama">Simpan nama</button>
    </form>
  </section>

  <section class="panel">
    <h2>Kata sandi</h2>
    <form class="formulir" id="form-sandi">
      <label>Kata sandi lama <input name="passwordLama" type="password" autocomplete="current-password" required /></label>
      <label>Kata sandi baru
        <input name="passwordBaru" type="password" autocomplete="new-password" required minlength="8" maxlength="72" />
        <small>Minimal 8 karakter.</small>
      </label>
      <button class="tombol tombol--utama">Ganti kata sandi</button>
    </form>
  </section>

  <section class="panel panel--bahaya">
    <h2>Hapus akun</h2>
    <p>Akun, jawaban, dan seluruh hasil asesmenmu dihapus permanen dan tidak bisa dikembalikan.</p>
    <p><button type="button" class="tombol tombol--bahaya" id="tombol-hapus">Hapus akun</button></p>
  </section>
</div>`);

$('#form-profil').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    const { pengguna: baru } = await api('/auth/me', { method: 'PATCH', body: { nama: isian(e.target).nama } });
    $('.sisi__bawah strong').textContent = baru.nama;
    toast('Nama disimpan.');
  } catch (err) {
    toast(err.message, 'galat');
  }
});

$('#form-sandi').addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await api('/auth/me', { method: 'PATCH', body: isian(e.target) });
    e.target.reset();
    toast('Kata sandi diganti.');
  } catch (err) {
    toast(err.message, 'galat');
  }
});

$('#tombol-hapus').addEventListener('click', () => {
  const d = modal('Hapus akun ini?', html`<form class="formulir">
    <p>Masukkan kata sandi untuk menghapus akun beserta seluruh datanya secara permanen.</p>
    <label>Kata sandi <input name="password" type="password" autocomplete="current-password" required /></label>
    <p class="galat" role="alert" hidden></p>
    <div class="formulir__aksi">
      <button type="button" class="tombol" data-tutup>Batal</button>
      <button class="tombol tombol--bahaya">Hapus akun</button>
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

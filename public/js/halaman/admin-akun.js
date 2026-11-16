// Admin: kelola akun pengguna (UC-09).
import { $, api, gagalMuat, html, isian, modal, mulaiHalaman, pasang, tanggal, toast } from '../umum.js';

const saya = await mulaiHalaman('admin');
const utama = $('#utama');
let akun = [];

function tampil() {
  pasang(utama, html`<div class="halaman">
    <header class="halaman__kepala halaman__kepala--baris">
      <div>
        <h1>Akun pengguna</h1>
        <p>Hasil asesmen perorangan tidak ditampilkan di sini. Hanya pemilik akun yang bisa melihatnya.</p>
      </div>
      <button type="button" class="tombol tombol--utama" data-aksi="tambah">Tambah akun</button>
    </header>
    <div class="panel tabel-gulir">
      <table class="tabel">
        <thead><tr><th>Nama</th><th>Email</th><th>Peran</th><th>Status</th><th class="angka">Asesmen</th><th>Terdaftar</th><th><span class="sr">Aksi</span></th></tr></thead>
        <tbody>
          ${akun.map((a) => html`<tr class="${a.aktif ? '' : 'baris-redup'}">
            <th scope="row">${a.nama}${a.id === saya.id ? html` <small>(kamu)</small>` : ''}</th>
            <td>${a.email}</td>
            <td>${a.peran === 'admin' ? 'Operator Admin' : 'Mahasiswa'}</td>
            <td>${a.aktif ? 'Aktif' : 'Nonaktif'}</td>
            <td class="angka">${a.jumlahAsesmen}</td>
            <td>${tanggal(a.dibuatPada)}</td>
            <td class="aksi">
              <button type="button" class="tautan" data-aksi="ubah" data-id="${a.id}">Ubah</button>
              ${a.id !== saya.id ? html`<button type="button" class="tautan tautan--bahaya" data-aksi="hapus" data-id="${a.id}">Hapus</button>` : ''}
            </td>
          </tr>`)}
        </tbody>
      </table>
    </div>
  </div>`);
}

async function muat() {
  akun = (await api('/admin/users')).pengguna;
  tampil();
}

function bukaFormulir(a) {
  const d = modal(a ? 'Ubah akun' : 'Tambah akun', html`<form class="formulir" novalidate>
    <label>Nama <input name="nama" value="${a?.nama ?? ''}" maxlength="80" /></label>
    <label>Email <input name="email" type="email" value="${a?.email ?? ''}" /></label>
    <label>Peran
      <select name="peran">
        <option value="mahasiswa" ${a?.peran !== 'admin' ? html`selected` : ''}>Mahasiswa</option>
        <option value="admin" ${a?.peran === 'admin' ? html`selected` : ''}>Operator Admin</option>
      </select>
    </label>
    <label>${a ? 'Kata sandi baru' : 'Kata sandi'}
      <input name="password" type="password" autocomplete="new-password" />
      <small>${a ? 'Kosongkan bila tidak diganti. Minimal 8 karakter.' : 'Minimal 8 karakter.'}</small>
    </label>
    <label class="centang"><input type="checkbox" name="aktif" ${!a || a.aktif ? html`checked` : ''} /><span>Akun aktif dan bisa masuk</span></label>
    <div class="formulir__aksi">
      <button type="button" class="tombol" data-tutup>Batal</button>
      <button class="tombol tombol--utama">${a ? 'Simpan akun' : 'Tambah akun'}</button>
    </div>
  </form>`);
  $('form', d).addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = isian(e.target);
    const body = { nama: f.nama, email: f.email, peran: f.peran, aktif: f.aktif === 'on', password: f.password || undefined };
    try {
      if (a) await api(`/admin/users/${a.id}`, { method: 'PUT', body });
      else await api('/admin/users', { body });
      d.close();
      toast(a ? 'Akun disimpan.' : 'Akun ditambahkan.');
      await muat();
    } catch (err) {
      toast(err.message, 'galat');
    }
  });
}

utama.addEventListener('click', async (e) => {
  const tombol = e.target.closest('[data-aksi]');
  if (!tombol) return;
  const a = akun.find((x) => x.id === Number(tombol.dataset.id));
  if (tombol.dataset.aksi === 'tambah') return bukaFormulir(null);
  if (tombol.dataset.aksi === 'ubah') return bukaFormulir(a);
  if (tombol.dataset.aksi === 'hapus') {
    if (!confirm(`Hapus akun ${a.nama} beserta seluruh asesmennya? Tindakan ini tidak bisa dibatalkan.`)) return;
    try {
      await api(`/admin/users/${a.id}`, { method: 'DELETE' });
      toast('Akun dihapus.');
      await muat();
    } catch (err) {
      toast(err.message, 'galat');
    }
  }
});

muat().catch(gagalMuat);

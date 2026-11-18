// Admin: kelola butir kuesioner (UC-06).
import { $, api, gagalMuat, html, isian, kode, modal, mulaiHalaman, pasang, toast } from '../umum.js';

await mulaiHalaman('admin');
const utama = $('#utama');

let data = { butir: [], indikator: [] };
let saring = '';

function tampil() {
  const daftar = data.butir.filter((b) => !saring || b.variabel === saring);
  const tab = [['', 'Semua'], ['Y', 'Niat karier (Y)'], ['X1', 'Intrapersonal (X1)'], ['X2', 'Interpersonal (X2)']];
  pasang(utama, html`<div class="halaman">
    <header class="halaman__kepala halaman__kepala--baris">
      <div>
        <h1>Butir kuesioner</h1>
        <p>${data.butir.filter((b) => b.aktif).length} butir aktif. Tulis [okupasi] pada butir niat karier agar diganti dengan karier pilihan mahasiswa.</p>
      </div>
      <button type="button" class="tombol tombol--utama" data-aksi="tambah">Tambah butir</button>
    </header>
    <div class="saring" role="group" aria-label="Saring variabel">
      ${tab.map(([v, label]) => html`<button type="button" data-saring="${v}" aria-pressed="${String(saring === v)}">${label}</button>`)}
    </div>
    <div class="panel tabel-gulir">
      <table class="tabel">
        <thead><tr><th>ID</th><th>Indikator</th><th>Teks pertanyaan</th><th>Dasar</th><th>Status</th><th><span class="sr">Aksi</span></th></tr></thead>
        <tbody>
          ${daftar.map((b) => html`<tr class="${b.aktif ? '' : 'baris-redup'}">
            <td class="angka">${b.id}</td>
            <td>${kode(b.variabel)} ${b.indikator}</td>
            <td>${b.teks}</td>
            <td><small>${b.dasar}</small></td>
            <td>${b.aktif ? 'Aktif' : 'Nonaktif'}</td>
            <td class="aksi">
              <button type="button" class="tautan" data-aksi="ubah" data-id="${b.id}">Ubah</button>
              <button type="button" class="tautan tautan--bahaya" data-aksi="hapus" data-id="${b.id}">Hapus</button>
            </td>
          </tr>`)}
        </tbody>
      </table>
    </div>
  </div>`);
}

async function muat() {
  data = await api('/admin/items');
  tampil();
}

function bukaFormulir(b) {
  const d = modal(b ? 'Ubah butir' : 'Tambah butir', html`<form class="formulir" novalidate>
    <label>Indikator
      <select name="indikatorId">
        <option value="">Pilih indikator</option>
        ${data.indikator.map((i) => html`<option value="${i.id}" ${b?.indikator_id === i.id ? html`selected` : ''}>${i.variabel}: ${i.nama}</option>`)}
      </select>
    </label>
    <label>Teks pertanyaan <textarea name="teks" rows="3" maxlength="500">${b?.teks ?? ''}</textarea></label>
    <label>Teks pertanyaan (English)
      <textarea name="teksEn" rows="3" maxlength="500">${b?.teks_en ?? ''}</textarea>
      <small>Opsional. Kalau kosong, mahasiswa yang memilih English melihat teks bahasa Indonesia. Tulis [okupasi] juga di sini.</small>
    </label>
    <label>Dasar sumber <input name="dasar" value="${b?.dasar ?? ''}" maxlength="200" /></label>
    <label class="centang"><input type="checkbox" name="aktif" ${!b || b.aktif ? html`checked` : ''} /><span>Tampilkan pada kuesioner</span></label>
    <div class="formulir__aksi">
      <button type="button" class="tombol" data-tutup>Batal</button>
      <button class="tombol tombol--utama">${b ? 'Simpan butir' : 'Tambah butir'}</button>
    </div>
  </form>`);
  $('form', d).addEventListener('submit', async (e) => {
    e.preventDefault();
    const f = isian(e.target);
    const body = {
      indikatorId: Number(f.indikatorId) || undefined,
      teks: f.teks,
      teksEn: f.teksEn,
      dasar: f.dasar,
      aktif: f.aktif === 'on',
    };
    try {
      if (b) await api(`/admin/items/${b.id}`, { method: 'PUT', body });
      else await api('/admin/items', { body });
      d.close();
      toast(b ? 'Butir disimpan.' : 'Butir ditambahkan.');
      await muat();
    } catch (err) {
      toast(err.message, 'galat');
    }
  });
}

utama.addEventListener('click', async (e) => {
  const tab = e.target.closest('[data-saring]');
  if (tab) {
    saring = tab.dataset.saring;
    return tampil();
  }
  const tombol = e.target.closest('[data-aksi]');
  if (!tombol) return;
  const b = data.butir.find((x) => x.id === Number(tombol.dataset.id));
  if (tombol.dataset.aksi === 'tambah') return bukaFormulir(null);
  if (tombol.dataset.aksi === 'ubah') return bukaFormulir(b);
  if (tombol.dataset.aksi === 'hapus') {
    if (!confirm(`Hapus butir "${b.teks}"?`)) return;
    try {
      const r = await api(`/admin/items/${b.id}`, { method: 'DELETE' });
      toast(r.dinonaktifkan ? 'Butir sudah pernah dijawab, jadi dinonaktifkan agar riwayat tetap utuh.' : 'Butir dihapus.');
      await muat();
    } catch (err) {
      toast(err.message, 'galat');
    }
  }
});

muat().catch(gagalMuat);

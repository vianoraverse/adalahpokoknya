// Admin: ambang, bobot indikator, dan teks aturan rekomendasi (UC-07).
import { $, api, gagalMuat, html, isian, kode, modal, mulaiHalaman, pasang, toast } from '../umum.js';

await mulaiHalaman('admin');
const utama = $('#utama');
const angka = (v) => Number(String(v).replace(',', '.'));
let data;

function tampil() {
  pasang(utama, html`<div class="halaman">
    <header class="halaman__kepala">
      <h1>Bobot dan aturan</h1>
      <p>Perubahan berlaku untuk asesmen berikutnya. Hasil yang sudah tersimpan tidak dihitung ulang.</p>
    </header>

    <section class="panel">
      <h2>Ambang</h2>
      <form class="ambang" id="form-ambang">
        ${data.pengaturan.map((p) => html`<label>${p.keterangan}
          <input name="${p.kunci}" type="number" min="0" max="100" step="1" value="${p.nilai}" required />
        </label>`)}
        <button class="tombol tombol--utama">Simpan ambang</button>
      </form>
    </section>

    <section class="panel tabel-gulir">
      <h2>Bobot indikator</h2>
      <p class="panel__sub">Bobot dipakai saat menggabungkan indikator menjadi skor Y, X1, dan X2. Bobot sama berarti rata-rata biasa.</p>
      <table class="tabel tabel--rapat">
        <thead><tr><th>Indikator</th><th class="angka">Bobot</th><th>Saran pengembangan</th><th><span class="sr">Aksi</span></th></tr></thead>
        <tbody>
          ${data.indikator.map((i) => html`<tr>
            <th scope="row">${kode(i.variabel)} ${i.nama}</th>
            <td class="angka">${i.bobot}</td>
            <td><small>${i.saran || '–'}</small></td>
            <td class="aksi"><button type="button" class="tautan" data-indikator="${i.id}">Ubah</button></td>
          </tr>`)}
        </tbody>
      </table>
    </section>

    <section class="panel tabel-gulir">
      <h2>Aturan rekomendasi</h2>
      <table class="tabel tabel--rapat">
        <thead><tr><th>Kode</th><th>Kondisi</th><th>Interpretasi</th><th>Jenis rekomendasi</th><th>Teks untuk mahasiswa</th><th><span class="sr">Aksi</span></th></tr></thead>
        <tbody>
          ${data.aturan.map((a) => html`<tr>
            <th scope="row">${a.kode}</th>
            <td><small>${a.kondisi}</small></td>
            <td>${a.interpretasi}</td>
            <td>${a.jenis}</td>
            <td><small>${a.teks}</small></td>
            <td class="aksi"><button type="button" class="tautan" data-aturan="${a.kode}">Ubah</button></td>
          </tr>`)}
        </tbody>
      </table>
    </section>
  </div>`);
}

async function muat() {
  data = await api('/admin/model');
  tampil();
}

/** Menjalankan penyimpanan, menampilkan toast, lalu memuat ulang. */
async function simpan(fn, pesan, dialog) {
  try {
    await fn();
    dialog?.close();
    toast(pesan);
    await muat();
  } catch (err) {
    toast(err.message, 'galat');
  }
}

utama.addEventListener('submit', (e) => {
  if (e.target.id !== 'form-ambang') return;
  e.preventDefault();
  const f = isian(e.target);
  const body = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, angka(v)]));
  simpan(() => api('/admin/settings', { method: 'PUT', body }), 'Ambang disimpan.');
});

utama.addEventListener('click', (e) => {
  const tInd = e.target.closest('[data-indikator]');
  const tAtr = e.target.closest('[data-aturan]');

  if (tInd) {
    const i = data.indikator.find((x) => x.id === Number(tInd.dataset.indikator));
    const d = modal(`Ubah ${i.nama}`, html`<form class="formulir" novalidate>
      <label>Bobot <input name="bobot" type="number" step="0.1" min="0.1" value="${i.bobot}" /></label>
      ${i.variabel !== 'Y' ? html`<label>Saran pengembangan <textarea name="saran" rows="3" maxlength="500">${i.saran}</textarea></label>` : ''}
      <div class="formulir__aksi">
        <button type="button" class="tombol" data-tutup>Batal</button>
        <button class="tombol tombol--utama">Simpan indikator</button>
      </div>
    </form>`);
    $('form', d).addEventListener('submit', (ev) => {
      ev.preventDefault();
      const f = isian(ev.target);
      simpan(() => api(`/admin/indicators/${i.id}`, { method: 'PUT', body: { bobot: angka(f.bobot), saran: f.saran ?? '' } }), 'Indikator disimpan.', d);
    });
  }

  if (tAtr) {
    const a = data.aturan.find((x) => x.kode === tAtr.dataset.aturan);
    const d = modal(`Ubah aturan ${a.kode}`, html`<form class="formulir" novalidate>
      <p class="catatan">Kondisi: ${a.kondisi}. Nilai ambangnya diatur pada bagian Ambang.</p>
      <label>Interpretasi <input name="interpretasi" value="${a.interpretasi}" maxlength="200" /></label>
      <label>Jenis rekomendasi <input name="jenis" value="${a.jenis}" maxlength="200" /></label>
      <label>Teks untuk mahasiswa <textarea name="teks" rows="4" maxlength="800">${a.teks}</textarea></label>
      <div class="formulir__aksi">
        <button type="button" class="tombol" data-tutup>Batal</button>
        <button class="tombol tombol--utama">Simpan aturan</button>
      </div>
    </form>`);
    $('form', d).addEventListener('submit', (ev) => {
      ev.preventDefault();
      simpan(() => api(`/admin/rules/${a.kode}`, { method: 'PUT', body: isian(ev.target) }), 'Aturan disimpan.', d);
    });
  }
});

muat().catch(gagalMuat);

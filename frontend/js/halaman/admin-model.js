// Admin: ambang kategori, aturan tabel keputusan, templat penjelasan, dan saran per soft skill (UC-06, UC-07).
import { $, api, gagalMuat, html, isian, kode, modal, mulaiHalaman, pasang, toast } from '../umum.js';

await mulaiHalaman('admin');
const utama = $('#utama');
const angka = (v) => Number(String(v).replace(',', '.'));
let data;

const ISIAN_TEMPLAT = [
  ['{karier}', 'nama karier pilihan'],
  ['{niat}', 'kategori niat karier (Y)'],
  ['{softskill}', 'kategori soft skill gabungan (X)'],
  ['{intrapersonal}', 'kategori X1'],
  ['{interpersonal}', 'kategori X2'],
  ['{prioritas}', 'tiga soft skill prioritas'],
];

function tampil() {
  pasang(utama, html`<div class="halaman">
    <header class="halaman__kepala">
      <h1>Ambang dan aturan</h1>
      <p>Perubahan ambang berlaku untuk asesmen berikutnya. Teks rekomendasi dan templat langsung dipakai saat hasil dibuka.</p>
    </header>

    <section class="panel">
      <h2>Ambang kategori</h2>
      <p class="panel__sub">Nilai internal 0–100 tidak ditampilkan ke mahasiswa; nilai ini hanya dipakai untuk menentukan kategori.</p>
      <form class="ambang" id="form-ambang">
        ${data.pengaturan.map((p) => html`<label>${p.keterangan}
          <input name="${p.kunci}" type="number" min="0" max="100" step="1" value="${p.nilai}" required />
        </label>`)}
        <button class="tombol tombol--utama">Simpan ambang</button>
      </form>
    </section>

    <section class="panel tabel-gulir">
      <h2>Aturan rekomendasi (tabel keputusan)</h2>
      <table class="tabel tabel--rapat">
        <thead><tr><th>Kode</th><th>Kondisi</th><th>Interpretasi</th><th>Jenis rekomendasi</th><th>Teks untuk mahasiswa</th><th><span class="sr">Aksi</span></th></tr></thead>
        <tbody>
          ${data.aturan.map((a) => html`<tr>
            <th scope="row">${a.kode}</th>
            <td class="tanpa-putus"><small>${a.kondisi}</small></td>
            <td><small>${a.interpretasi}</small></td>
            <td>${a.jenis}</td>
            <td><small>${a.teks}</small></td>
            <td class="aksi"><button type="button" class="tautan" data-aturan="${a.kode}">Ubah</button></td>
          </tr>`)}
        </tbody>
      </table>
    </section>

    <section class="panel tabel-gulir">
      <h2>Templat penjelasan</h2>
      <p class="panel__sub">Dipakai untuk bagian "Ringkasnya" di halaman hasil. Isian dalam kurung kurawal diganti otomatis:
        ${ISIAN_TEMPLAT.map(([k, ket], i) => html`<code>${k}</code> ${ket}${i < ISIAN_TEMPLAT.length - 1 ? ', ' : '.'}`)}</p>
      <table class="tabel tabel--rapat">
        <thead><tr><th>Aturan</th><th>Templat</th><th><span class="sr">Aksi</span></th></tr></thead>
        <tbody>
          ${data.templat.map((tp) => html`<tr>
            <th scope="row">${tp.kode}</th>
            <td><small>${tp.teks}</small></td>
            <td class="aksi"><button type="button" class="tautan" data-templat="${tp.kode}">Ubah</button></td>
          </tr>`)}
        </tbody>
      </table>
    </section>

    <section class="panel tabel-gulir">
      <h2>Saran pengembangan per soft skill</h2>
      <p class="panel__sub">Tampil di bawah setiap soft skill prioritas pada halaman hasil.</p>
      <table class="tabel tabel--rapat">
        <thead><tr><th>Indikator</th><th>Saran pengembangan</th><th><span class="sr">Aksi</span></th></tr></thead>
        <tbody>
          ${data.indikator
            .filter((i) => i.variabel !== 'Y')
            .map((i) => html`<tr>
              <th scope="row">${kode(i.variabel)} ${i.nama}</th>
              <td><small>${i.saran || '–'}</small></td>
              <td class="aksi"><button type="button" class="tautan" data-indikator="${i.id}">Ubah</button></td>
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

const catatanEn = html`<small>Opsional. Kalau kosong, mahasiswa yang memilih English melihat teks bahasa Indonesia.</small>`;

utama.addEventListener('submit', (e) => {
  if (e.target.id !== 'form-ambang') return;
  e.preventDefault();
  const f = isian(e.target);
  const body = Object.fromEntries(Object.entries(f).map(([k, v]) => [k, angka(v)]));
  simpan(() => api('/admin/settings', { method: 'PUT', body }), 'Ambang disimpan.');
});

utama.addEventListener('click', (e) => {
  const tAtr = e.target.closest('[data-aturan]');
  const tTpl = e.target.closest('[data-templat]');
  const tInd = e.target.closest('[data-indikator]');

  if (tAtr) {
    const a = data.aturan.find((x) => x.kode === tAtr.dataset.aturan);
    const d = modal(`Ubah aturan ${a.kode}`, html`<form class="formulir" novalidate>
      <p class="catatan">Kondisi: ${a.kondisi}. Nilai batasnya diatur pada bagian Ambang kategori.</p>
      <label>Interpretasi <input name="interpretasi" value="${a.interpretasi}" maxlength="200" /></label>
      <label>Jenis rekomendasi <input name="jenis" value="${a.jenis}" maxlength="200" /></label>
      <label>Teks untuk mahasiswa <textarea name="teks" rows="4" maxlength="800">${a.teks}</textarea></label>
      <label>Teks untuk mahasiswa (English) <textarea name="teksEn" rows="4" maxlength="800">${a.teks_en ?? ''}</textarea>${catatanEn}</label>
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

  if (tTpl) {
    const tp = data.templat.find((x) => x.kode === tTpl.dataset.templat);
    const d = modal(`Ubah templat ${tp.kode}`, html`<form class="formulir" novalidate>
      <p class="catatan">Isian: ${ISIAN_TEMPLAT.map(([k]) => k).join(' ')}</p>
      <label>Templat <textarea name="teks" rows="5" maxlength="1000">${tp.teks}</textarea></label>
      <label>Templat (English) <textarea name="teksEn" rows="5" maxlength="1000">${tp.teks_en ?? ''}</textarea>${catatanEn}</label>
      <div class="formulir__aksi">
        <button type="button" class="tombol" data-tutup>Batal</button>
        <button class="tombol tombol--utama">Simpan templat</button>
      </div>
    </form>`);
    $('form', d).addEventListener('submit', (ev) => {
      ev.preventDefault();
      simpan(() => api(`/admin/templates/${tp.kode}`, { method: 'PUT', body: isian(ev.target) }), 'Templat disimpan.', d);
    });
  }

  if (tInd) {
    const i = data.indikator.find((x) => x.id === Number(tInd.dataset.indikator));
    const d = modal(`Ubah saran ${i.nama}`, html`<form class="formulir" novalidate>
      <label>Saran pengembangan <textarea name="saran" rows="3" maxlength="500">${i.saran}</textarea></label>
      <label>Saran pengembangan (English) <textarea name="saranEn" rows="3" maxlength="500">${i.saran_en ?? ''}</textarea>${catatanEn}</label>
      <div class="formulir__aksi">
        <button type="button" class="tombol" data-tutup>Batal</button>
        <button class="tombol tombol--utama">Simpan saran</button>
      </div>
    </form>`);
    $('form', d).addEventListener('submit', (ev) => {
      ev.preventDefault();
      simpan(() => api(`/admin/indicators/${i.id}`, { method: 'PUT', body: isian(ev.target) }), 'Saran disimpan.', d);
    });
  }
});

muat().catch(gagalMuat);

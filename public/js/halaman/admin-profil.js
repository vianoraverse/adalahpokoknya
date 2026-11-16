// Admin: profil kebutuhan soft skill per karier (UC-08).
import { $, $$, api, bulat, gagalMuat, html, kode, mulaiHalaman, pasang, toast } from '../umum.js';

await mulaiHalaman('admin');
const utama = $('#utama');

async function tampilProfil(karierId) {
  const wadah = $('#profil');
  pasang(wadah, html`<p class="memuat">Memuat…</p>`);
  const { profil } = await api(`/admin/profiles/${karierId}`);
  pasang(wadah, html`
    <div class="tabel-gulir">
      <table class="tabel tabel--rapat">
        <thead><tr><th>Indikator</th><th class="angka">Level kebutuhan</th><th class="angka">Bobot (%)</th></tr></thead>
        <tbody>
          ${profil.map((p) => html`<tr data-indikator="${p.indikator_id}">
            <th scope="row" class="tengah-v">${kode(p.variabel)} ${p.nama}</th>
            <td class="angka"><input class="sel-angka" name="req" type="number" min="0" max="100" step="1" value="${p.req ?? 50}" aria-label="Level kebutuhan ${p.nama}" required /></td>
            <td class="angka"><input class="sel-angka" name="bobot" type="number" min="0" step="0.1" value="${((p.bobot ?? 0) * 100).toFixed(1)}" aria-label="Bobot ${p.nama}" required /></td>
          </tr>`)}
        </tbody>
        <tfoot><tr><th colspan="2" scope="row">Jumlah bobot</th><td class="angka"><strong id="total-bobot"></strong></td></tr></tfoot>
      </table>
    </div>
    <p class="catatan">Bila jumlah bobot tidak 100%, sistem menormalkannya secara proporsional saat disimpan.</p>
    <p><button class="tombol tombol--utama">Simpan profil karier</button></p>`);
  hitungTotal();
}

function hitungTotal() {
  const total = $$('input[name="bobot"]', utama).reduce((a, el) => a + (Number(el.value) || 0), 0);
  $('#total-bobot').textContent = `${bulat(total)}%`;
}

try {
  const { karier } = await api('/careers');
  pasang(utama, html`<div class="halaman">
    <header class="halaman__kepala">
      <h1>Profil karier</h1>
      <p>Level kebutuhan (0–100) dan bobot kepentingan tiap soft skill untuk satu karier, pada jenjang awal.</p>
    </header>
    <p class="pemberitahuan">
      Nilai bawaan adalah data awal ilustratif. Ganti dengan hasil pemetaan lowongan kerja 2026: level 80 untuk soft skill yang
      muncul pada 60% lowongan atau lebih, 65 untuk 30–59%, 50 untuk 10–29%, dan 35 untuk di bawah 10%. Bobot adalah frekuensi
      indikator dibagi jumlah frekuensi.
    </p>
    <form class="panel" id="form-profil">
      <label class="pilih-lebar">Karier
        <select id="pilih-karier">${karier.map((k) => html`<option value="${k.id}">${k.nama}</option>`)}</select>
      </label>
      <div id="profil"></div>
    </form>
  </div>`);

  const pilih = $('#pilih-karier');
  pilih.addEventListener('change', () => tampilProfil(pilih.value).catch((e) => toast(e.message, 'galat')));
  utama.addEventListener('input', (e) => { if (e.target.name === 'bobot') hitungTotal(); });
  $('#form-profil').addEventListener('submit', async (e) => {
    e.preventDefault();
    const baris = $$('tr[data-indikator]', utama).map((tr) => ({
      indikatorId: Number(tr.dataset.indikator),
      req: Number($('[name="req"]', tr).value),
      bobot: Number($('[name="bobot"]', tr).value),
    }));
    try {
      await api(`/admin/profiles/${pilih.value}`, { method: 'PUT', body: { baris } });
      toast('Profil karier disimpan.');
      await tampilProfil(pilih.value);
    } catch (err) {
      toast(err.message, 'galat');
    }
  });
  await tampilProfil(pilih.value);
} catch (e) {
  gagalMuat(e);
}

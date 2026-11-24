// Admin: ringkasan hasil gabungan tanpa nama (UC-09).
import { $, api, bulat, gagalMuat, html, kode, mulaiHalaman, pasang, trek } from '../umum.js';

await mulaiHalaman('admin');

const KATEGORI = [
  ['sangat', 'Sangat Cocok'],
  ['cukup', 'Cukup Cocok'],
  ['perlu', 'Perlu Dikembangkan'],
];
const VARIABEL = [
  ['Y', 'Niat karier'],
  ['X', 'Soft skill gabungan'],
  ['X1', 'Intrapersonal'],
  ['X2', 'Interpersonal'],
];

try {
  const d = await api('/admin/aggregate');
  const softSkill = d.indikator.sort((a, b) => a.rata - b.rata);
  const rata = [
    ['Niat karier', 'Y', d.y],
    ['Soft skill gabungan', null, d.x],
    ['Intrapersonal', 'X1', d.x1],
    ['Interpersonal', 'X2', d.x2],
  ];

  pasang($('#utama'), html`<div class="halaman">
    <header class="halaman__kepala">
      <h1>Ringkasan hasil</h1>
      <p>Data gabungan tanpa nama, dihitung dari asesmen terbaru setiap mahasiswa.</p>
    </header>
    <dl class="angka-besar gelap">
      <div><dt>Akun mahasiswa</dt><dd>${d.mahasiswa}</dd></div>
      <div><dt>Sudah asesmen</dt><dd>${d.responden}</dd></div>
      <div><dt>Total asesmen</dt><dd>${d.asesmen}</dd></div>
      <div><dt>Niat karier Sangat Cocok</dt><dd>${d.responden ? `${d.kategori.Y.sangat ?? 0}/${d.responden}` : '–'}</dd></div>
    </dl>
    ${d.responden === 0
      ? html`<div class="kosong"><p>Belum ada mahasiswa yang menyelesaikan asesmen. Ringkasan akan muncul setelah asesmen pertama masuk.</p></div>`
      : html`
        <section class="panel tabel-gulir">
          <h2>Sebaran kategori</h2>
          <table class="tabel tabel--rapat">
            <thead><tr><th>Variabel</th>${KATEGORI.map(([, label]) => html`<th class="angka">${label}</th>`)}</tr></thead>
            <tbody>
              ${VARIABEL.map(([v, nama]) => html`<tr>
                <th scope="row">${v === 'X' ? '' : kode(v)} ${nama}</th>
                ${KATEGORI.map(([k]) => html`<td class="angka">${d.kategori[v][k] ?? 0}</td>`)}
              </tr>`)}
            </tbody>
          </table>
        </section>
        <div class="dua-kolom">
          <section class="panel">
            <h2>Rata-rata nilai internal</h2>
            <p class="panel__sub">Skala 0–100. Hanya terlihat oleh admin.</p>
            <ul class="daftar-trek">
              ${rata.map(([nama, v, nilai]) => html`<li>
                <span>${v ? kode(v) : ''} ${nama}</span>${trek(nilai ?? 0, { jalur: v ?? undefined })}<strong>${bulat(nilai)}</strong>
              </li>`)}
            </ul>
          </section>
          <section class="panel">
            <h2>Sebaran aturan rekomendasi</h2>
            <table class="tabel tabel--rapat">
              <thead><tr><th>Aturan</th><th class="angka">Mahasiswa</th><th class="angka">Porsi</th></tr></thead>
              <tbody>
                ${['R1', 'R2', 'R3', 'R4'].map((k) => {
                  const n = d.aturan.find((a) => a.kode === k)?.n ?? 0;
                  return html`<tr><th scope="row"><span class="kode">${k}</span></th><td class="angka">${n}</td><td class="angka">${bulat((n / d.responden) * 100)}%</td></tr>`;
                })}
              </tbody>
            </table>
          </section>
        </div>
        <div class="dua-kolom">
          <section class="panel tabel-gulir">
            <h2>Soft skill</h2>
            <p class="panel__sub">Diurutkan dari rata-rata terendah. "Prioritas" = berapa mahasiswa yang mendapat soft skill ini sebagai prioritas latihan.</p>
            <table class="tabel tabel--rapat">
              <thead><tr><th>Indikator</th><th class="angka">Rata-rata</th><th class="angka">Prioritas</th></tr></thead>
              <tbody>
                ${softSkill.map((i) => html`<tr>
                  <th scope="row">${kode(i.variabel)} ${i.nama}</th><td class="angka">${bulat(i.rata)}</td><td class="angka">${i.prioritas}</td>
                </tr>`)}
              </tbody>
            </table>
          </section>
          <section class="panel tabel-gulir">
            <h2>Karier pilihan</h2>
            <table class="tabel tabel--rapat">
              <thead><tr><th>Karier</th><th class="angka">Pemilih</th><th class="angka">Rata Y</th></tr></thead>
              <tbody>
                ${d.karier.map((k) => html`<tr class="${k.n ? '' : 'baris-redup'}">
                  <th scope="row">${k.nama}</th><td class="angka">${k.n}</td><td class="angka">${bulat(k.y)}</td>
                </tr>`)}
              </tbody>
            </table>
          </section>
        </div>`}
  </div>`);
} catch (e) {
  gagalMuat(e);
}

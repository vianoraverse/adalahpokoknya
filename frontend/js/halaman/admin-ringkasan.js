// Admin: ringkasan hasil gabungan tanpa nama (UC-10).
import { $, api, bulat, catatanSementara, gagalMuat, html, kode, mulaiHalaman, pasang, trek } from '../umum.js';

await mulaiHalaman('admin');

try {
  const d = await api('/admin/aggregate');
  const softSkill = d.indikator.filter((i) => i.variabel !== 'Y').sort((a, b) => a.rata - b.rata);
  const rata = [['Niat karier', 'Y', d.y], ['Intrapersonal', 'X1', d.x1], ['Interpersonal', 'X2', d.x2], ['Soft Skill Fit Score', null, d.sfs]];

  pasang($('#utama'), html`<div class="halaman">
    <header class="halaman__kepala">
      <h1>Ringkasan hasil</h1>
      <p>Data gabungan tanpa nama, dihitung dari asesmen terbaru setiap mahasiswa.</p>
    </header>
    <dl class="angka-besar gelap">
      <div><dt>Akun mahasiswa</dt><dd>${d.mahasiswa}</dd></div>
      <div><dt>Sudah asesmen</dt><dd>${d.responden}</dd></div>
      <div><dt>Total asesmen</dt><dd>${d.asesmen}</dd></div>
      <div><dt>Pilihan selaras dengan profil</dt><dd>${d.responden ? `${d.selaras ?? 0}/${d.responden}` : '–'}</dd></div>
    </dl>
    ${catatanSementara()}
    ${d.responden === 0
      ? html`<div class="kosong"><p>Belum ada mahasiswa yang menyelesaikan asesmen. Ringkasan akan muncul setelah asesmen pertama masuk.</p></div>`
      : html`
        <div class="dua-kolom">
          <section class="panel">
            <h2>Rata-rata skor</h2>
            <ul class="daftar-trek">
              ${rata.map(([nama, v, nilai]) => html`<li>
                <span>${v ? kode(v) : ''} ${nama}</span>${trek(nilai ?? 0, { jalur: v ?? undefined })}<strong>${bulat(nilai)}</strong>
              </li>`)}
            </ul>
            ${catatanSementara()}
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
            ${catatanSementara()}
          </section>
        </div>
        <div class="dua-kolom">
          <section class="panel">
            <h2>Rata-rata soft skill</h2>
            <p class="panel__sub">Diurutkan dari yang paling rendah.</p>
            <ul class="daftar-trek daftar-trek--lebar">
              ${softSkill.map((i) => html`<li><span>${i.nama}</span>${trek(i.rata, { jalur: i.variabel })}<strong>${bulat(i.rata)}</strong></li>`)}
            </ul>
          </section>
          <section class="panel tabel-gulir">
            <h2>Karier pilihan</h2>
            <table class="tabel tabel--rapat">
              <thead><tr><th>Karier</th><th class="angka">Pemilih</th><th class="angka">Rata Y</th><th class="angka">Rata SFS</th></tr></thead>
              <tbody>
                ${d.karier.map((k) => html`<tr class="${k.n ? '' : 'baris-redup'}">
                  <th scope="row">${k.nama}</th><td class="angka">${k.n}</td><td class="angka">${bulat(k.y)}</td><td class="angka">${bulat(k.sfs)}</td>
                </tr>`)}
              </tbody>
            </table>
            ${catatanSementara()}
          </section>
        </div>`}
  </div>`);
} catch (e) {
  gagalMuat(e);
}

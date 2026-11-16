// Dasbor mahasiswa: ringkasan asesmen terbaru dan perubahan dari asesmen sebelumnya.
import { $, api, bulat, gagalMuat, html, mulaiHalaman, pasang, tanggal } from '../umum.js';
import { papanHasil, rutePengembangan, skorTiga } from '../hasil-bagian.js';

const pengguna = await mulaiHalaman('mahasiswa');
const utama = $('#utama');

function perubahan(kini, lalu) {
  const d = Math.round((kini - lalu) * 10) / 10;
  if (d === 0) return html`<span class="redup">tetap</span>`;
  return html`<span class="${d > 0 ? 'naik' : 'turun'}">${d > 0 ? 'naik' : 'turun'} ${bulat(Math.abs(d))}</span>`;
}

try {
  const { asesmen: daftar } = await api('/assessments');

  if (daftar.length === 0) {
    pasang(utama, html`<div class="halaman halaman--sempit">
      <div class="kosong">
        <h1>Halo, ${pengguna.nama.split(' ')[0]}</h1>
        <p>
          Kamu belum punya hasil asesmen. Pilih satu karier TIK, jawab 36 pernyataan, lalu lihat skor niat, soft skill, dan
          kesesuaianmu. Butuh sekitar 10 menit.
        </p>
        <a class="tombol tombol--utama tombol--besar" href="/app/asesmen">Mulai asesmen</a>
      </div>
    </div>`);
  } else {
    const [kini, lalu] = daftar;
    const { asesmen: a } = await api(`/assessments/${kini.id}`);
    const baris = [['Niat karier (Y)', 'y'], ['Intrapersonal (X1)', 'x1'], ['Interpersonal (X2)', 'x2'], ['Soft Skill Fit Score', 'sfs']];

    pasang(utama, html`<div class="halaman">
      <header class="halaman__kepala halaman__kepala--baris">
        <div>
          <h1>Arah kariermu</h1>
          <p>Asesmen terakhir ${tanggal(kini.dibuatPada)}.</p>
        </div>
        <a class="tombol" href="/app/asesmen">Ulangi asesmen</a>
      </header>

      ${papanHasil(a)}
      ${skorTiga(a.hasil)}

      <div class="dua-kolom">
        <section class="panel">
          <h2>Rute pengembangan</h2>
          ${rutePengembangan(a, { ringkas: true })}
          <p><a class="tombol tombol--utama" href="/app/hasil?id=${kini.id}">Lihat hasil lengkap</a></p>
        </section>
        <section class="panel">
          <h2>Perubahan dari asesmen sebelumnya</h2>
          ${lalu
            ? html`<table class="tabel tabel--rapat">
                <thead><tr><th>Skor</th><th class="angka">Sebelumnya</th><th class="angka">Sekarang</th><th class="angka">Perubahan</th></tr></thead>
                <tbody>
                  ${baris.map(([label, k]) => html`<tr>
                    <th scope="row">${label}</th>
                    <td class="angka">${bulat(lalu[k])}</td>
                    <td class="angka">${bulat(kini[k])}</td>
                    <td class="angka">${perubahan(kini[k], lalu[k])}</td>
                  </tr>`)}
                </tbody>
              </table>
              ${lalu.karier !== kini.karier
                ? html`<p class="catatan">Karier pilihan berubah dari ${lalu.karier} ke ${kini.karier}, sehingga SFS tidak sepenuhnya sebanding.</p>`
                : ''}`
            : html`<p>Ini asesmen pertamamu. Setelah mengembangkan soft skill prioritas, ulangi asesmen untuk melihat perubahannya di sini.</p>`}
        </section>
      </div>
    </div>`);
  }
} catch (e) {
  gagalMuat(e);
}

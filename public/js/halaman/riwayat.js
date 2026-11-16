// Riwayat asesmen mahasiswa.
import { $, api, bulat, gagalMuat, html, mulaiHalaman, pasang, tanggal } from '../umum.js';

await mulaiHalaman('mahasiswa');

try {
  const { asesmen } = await api('/assessments');
  pasang($('#utama'), html`<div class="halaman">
    <header class="halaman__kepala">
      <h1>Riwayat asesmen</h1>
      <p>Semua asesmen yang pernah kamu kerjakan, dari yang terbaru.</p>
    </header>
    ${asesmen.length === 0
      ? html`<div class="kosong">
          <p>Belum ada asesmen. Hasil pertamamu akan muncul di sini.</p>
          <a class="tombol tombol--utama" href="/app/asesmen">Mulai asesmen</a>
        </div>`
      : html`<div class="panel tabel-gulir">
          <table class="tabel">
            <thead>
              <tr>
                <th>Tanggal</th><th>Karier pilihan</th>
                <th class="angka">Y</th><th class="angka">X1</th><th class="angka">X2</th><th class="angka">SFS</th>
                <th>Aturan</th><th>Status</th><th><span class="sr">Buka</span></th>
              </tr>
            </thead>
            <tbody>
              ${asesmen.map((a) => html`<tr>
                <td>${tanggal(a.dibuatPada)} <small>${a.jenis === 'awal' ? 'pertama' : 'ulang'}</small></td>
                <th scope="row">${a.karier}</th>
                <td class="angka">${bulat(a.y)}</td>
                <td class="angka">${bulat(a.x1)}</td>
                <td class="angka">${bulat(a.x2)}</td>
                <td class="angka"><strong>${bulat(a.sfs)}</strong></td>
                <td>${a.aturan}</td>
                <td>${a.status}</td>
                <td><a href="/app/hasil?id=${a.id}">Lihat hasil</a></td>
              </tr>`)}
            </tbody>
          </table>
        </div>`}
  </div>`);
} catch (e) {
  gagalMuat(e);
}

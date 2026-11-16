// Halaman hasil asesmen: skor, rekomendasi, penjelasan, profil kesesuaian, dan peringkat 16 karier.
import { $, api, bulat, gagalMuat, html, kode, mulaiHalaman, pasang, tanggal, trek } from '../umum.js';
import { papanHasil, rutePengembangan, skorTiga } from '../hasil-bagian.js';
import { gambarRadar } from '../grafik.js';

await mulaiHalaman('mahasiswa');
const utama = $('#utama');
const id = Number(new URLSearchParams(location.search).get('id'));

/** Tabel rincian 14 indikator, dikelompokkan per jalur. */
function rincian(h) {
  const grup = (v, nama) => {
    const baris = h.gapPilihan.filter((g) => g.variabel === v).sort((x, y) => y.tertimbang - x.tertimbang);
    return html`<tbody>
      <tr class="rincian__grup"><th colspan="6" scope="colgroup">${kode(v)} ${nama}</th></tr>
      ${baris.map((g) => html`<tr>
        <th scope="row">${g.nama}</th>
        <td class="rincian__trek">${trek(g.skor, { req: g.req, jalur: v })}</td>
        <td class="angka">${bulat(g.skor)}</td>
        <td class="angka">${bulat(g.req)}</td>
        <td class="angka">${g.gap > 0 ? bulat(g.gap) : html`<span class="redup">0</span>`}</td>
        <td class="angka">${bulat(g.bobot * 100)}%</td>
      </tr>`)}
    </tbody>`;
  };
  return html`<div class="tabel-gulir">
    <table class="tabel tabel--rapat rincian">
      <thead>
        <tr><th>Indikator</th><th><span class="sr">Posisi</span></th><th class="angka">Skor</th><th class="angka">Butuh</th><th class="angka">Selisih</th><th class="angka">Bobot</th></tr>
      </thead>
      ${grup('X1', 'Intrapersonal')}
      ${grup('X2', 'Interpersonal')}
    </table>
  </div>
  <p class="legenda" aria-hidden="true">
    <span><i class="legenda__skor"></i> Skormu</span>
    <span><i class="legenda__butuh"></i> Kebutuhan karier</span>
    <span><i class="legenda__celah"></i> Selisih yang perlu dikejar</span>
  </p>`;
}

/** Peringkat Soft Skill Fit Score untuk 16 karier. */
function peringkat(a) {
  const h = a.hasil;
  const urut = [...h.sfsSemua].sort((x, y) => y.sfs - x.sfs);
  return html`<ol class="peringkat">
    ${urut.map((k, i) => html`<li class="${k.karierId === a.karier.id ? 'peringkat__pilihan' : ''}">
      <span class="peringkat__no">${i + 1}</span>
      <span class="peringkat__nama">
        ${k.nama}
        ${k.karierId === a.karier.id ? html`<span class="cap cap--isi">Pilihanmu</span>` : ''}
        ${k.karierId === h.karierTeratas.karierId && k.karierId !== a.karier.id ? html`<span class="cap">Paling selaras</span>` : ''}
      </span>
      <span class="peringkat__nilai">${bulat(k.sfs)}</span>
    </li>`)}
  </ol>`;
}

function aturanTambahan(a, t) {
  const h = a.hasil;
  const teks =
    t.kode === 'ALTERNATIF'
      ? `${h.karierTeratas.nama} memiliki SFS ${bulat(h.karierTeratas.sfs)}, ${bulat(h.karierTeratas.sfs - h.sfsPilihan)} poin di atas karier pilihanmu. Karier ini layak kamu eksplorasi.`
      : t.teks;
  return html`<div class="aturan aturan--tambahan"><span class="kode kode--sun">+</span><h3>${t.jenis}</h3><p>${teks}</p></div>`;
}

/** Penjelasan dimuat terpisah setelah skor tampil, supaya skor tidak menunggu layanan AI. */
async function muatPenjelasan(a) {
  const wadah = $('#penjelasan');
  const tampil = (p) =>
    pasang(wadah, html`
      ${p.narasi.split(/\n{2,}/).map((par) => html`<p>${par}</p>`)}
      <p class="catatan">${
        p.sumber === 'ai'
          ? 'Narasi ini disusun AI dari skor dan aturan di halaman ini. AI tidak menentukan skor maupun rekomendasi, dan tidak menerima identitasmu.'
          : 'Penjelasan standar dari sistem. Skor dan rekomendasi di halaman ini berasal dari perhitungan yang sama.'
      }</p>`);
  if (a.penjelasan) return tampil(a.penjelasan);
  try {
    tampil((await api(`/assessments/${a.id}/explanation`, { method: 'POST', body: {} })).penjelasan);
  } catch (e) {
    pasang(wadah, html`<p class="galat" role="alert">Penjelasan belum bisa dimuat. ${e.message}</p>`);
  }
}

try {
  const { asesmen: a } = await api(`/assessments/${id}`);
  const h = a.hasil;
  const niat = h.skorIndikator.filter((s) => s.variabel === 'Y');

  pasang(utama, html`<div class="halaman">
    <header class="halaman__kepala halaman__kepala--baris">
      <div>
        <h1>Hasil asesmen</h1>
        <p>${tanggal(a.dibuatPada)}, ${a.jenis === 'awal' ? 'asesmen pertama' : 'asesmen ulang'}</p>
      </div>
      <a class="tombol" href="/app/asesmen">Ulangi asesmen</a>
    </header>

    ${papanHasil(a)}
    ${skorTiga(h)}

    <div class="dua-kolom">
      <section class="panel" aria-labelledby="judul-rekomendasi">
        <h2 id="judul-rekomendasi">Rekomendasi</h2>
        <div class="aturan">
          <span class="kode">${h.aturan}</span>
          <h3>${h.rekomendasi.utama.jenis}</h3>
          <p>${h.rekomendasi.utama.teks}</p>
        </div>
        ${h.rekomendasi.tambahan.map((t) => aturanTambahan(a, t))}
        ${h.prioritas.length ? html`<h3>Rute pengembangan soft skill</h3>` : ''}
        ${rutePengembangan(a)}
      </section>
      <section class="panel penjelasan" aria-labelledby="judul-penjelasan">
        <h2 id="judul-penjelasan">Penjelasan hasil</h2>
        <div id="penjelasan"><p class="memuat">Menyusun penjelasan…</p></div>
      </section>
    </div>

    <section class="panel" aria-labelledby="judul-profil">
      <h2 id="judul-profil">Profil kesesuaian soft skill</h2>
      <p class="panel__sub">Skor tiap soft skill-mu dibandingkan dengan level kebutuhan ${a.karier.nama} pada jenjang awal.</p>
      <div class="profil">
        <figure class="radar" id="radar"></figure>
        <div>${rincian(h)}</div>
      </div>
    </section>

    <section class="panel" aria-labelledby="judul-peringkat">
      <h2 id="judul-peringkat">Kesesuaian dengan 16 karier</h2>
      <p class="panel__sub">Soft Skill Fit Score profilmu terhadap setiap karier, dari yang paling selaras.</p>
      ${peringkat(a)}
    </section>

    <section class="panel" aria-labelledby="judul-niat">
      <h2 id="judul-niat">Rincian niat karier</h2>
      <p class="panel__sub">Empat indikator yang membentuk skor Y.</p>
      <ul class="daftar-trek daftar-trek--dua">
        ${niat.map((s) => html`<li><span>${s.nama}</span>${trek(s.skor, { jalur: 'Y' })}<strong>${bulat(s.skor)}</strong></li>`)}
      </ul>
    </section>

    <p class="catatan">
      Kategori: rendah di bawah ${h.ambang.ambang_rendah}, sedang ${h.ambang.ambang_rendah} sampai di bawah ${h.ambang.ambang_tinggi},
      tinggi mulai ${h.ambang.ambang_tinggi}. Hasil berasal dari penilaian dirimu sendiri dan bersifat gambaran, bukan keputusan.
    </p>
  </div>`);

  gambarRadar($('#radar'), h.gapPilihan, a.karier.nama);
  muatPenjelasan(a);
} catch (e) {
  pasang(utama, html`<div class="halaman">
    <p class="galat" role="alert">${e.message}</p>
    <p><a href="/app/riwayat">Lihat riwayat asesmen</a></p>
  </div>`);
}

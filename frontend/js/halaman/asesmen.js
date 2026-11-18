// Asesmen: pilih satu karier, lalu jawab kuesioner Likert halaman demi halaman.
import { $, api, bhs, gagalMuat, html, ikon, mulaiHalaman, pasang, t, tHtml } from '../umum.js';
import { IKON_KARIER } from '../ikon.js';

await mulaiHalaman('mahasiswa');
const utama = $('#utama');

const SKALA = [1, 2, 3, 4, 5].map((n) => t(`tes.skala.${n}`));
const PER_HALAMAN = 6;
const KUNCI_DRAF = 'yourway.draf-asesmen';

/** Mengganti [okupasi] di teks pertanyaan dengan nama karier. Di bahasa Inggris, "a" jadi "an" bila perlu. */
function isiOkupasi(teks, nama) {
  if (bhs() === 'en') teks = teks.replace(/\ba \[okupasi\]/g, `${/^[aeiou]/i.test(nama) ? 'an' : 'a'} [okupasi]`);
  return teks.replaceAll('[okupasi]', nama);
}

// Draf disimpan di peramban supaya jawaban tidak hilang bila halaman tertutup.
function bacaDraf() {
  try {
    const d = JSON.parse(localStorage.getItem(KUNCI_DRAF) ?? 'null');
    if (d && typeof d === 'object') return { karierId: d.karierId ?? null, jawaban: d.jawaban ?? {} };
  } catch { /* penyimpanan tidak tersedia */ }
  return { karierId: null, jawaban: {} };
}
function simpanDraf() {
  try { localStorage.setItem(KUNCI_DRAF, JSON.stringify(draf)); } catch { /* abaikan */ }
}

const draf = bacaDraf();
let karier = [];
let butir = [];
let halaman = 0;

const pilihan = () => karier.find((k) => k.id === draf.karierId) ?? null;
const terjawab = () => butir.filter((b) => draf.jawaban[b.id]).length;
const jumlahHalaman = () => Math.ceil(butir.length / PER_HALAMAN);

/* ---------- Tahap 1: pilih karier ---------- */

function tampilPilihKarier() {
  pasang(utama, html`<div class="halaman">
    <header class="halaman__kepala">
      <h1>${t('tes.pilihJudul')}</h1>
      <p>${t('tes.pilihP')}</p>
    </header>
    <div class="pilih-karier" role="radiogroup" aria-label="Karier pilihan">
      ${karier.map((k, i) => html`<label>
        <input type="radio" name="karier" value="${k.id}" ${draf.karierId === k.id ? html`checked` : ''} />
        <span class="pilih-karier__no">${String(i + 1).padStart(2, '0')}</span>
        <span class="pilih-karier__teks"><strong>${ikon(IKON_KARIER[k.kode])} ${k.nama}</strong><span>${k.deskripsi}</span></span>
        <span class="pilih-karier__tanda cap">${t('tes.dipilih')}</span>
      </label>`)}
    </div>
    <div class="lengket-bawah">
      <p id="info-pilihan"></p>
      <button type="button" class="tombol tombol--utama" id="tombol-lanjut"></button>
    </div>
  </div>`);

  const segarkan = () => {
    const p = pilihan();
    pasang($('#info-pilihan'), p ? tHtml('tes.pilihan', { nama: p.nama }) : t('tes.belumPilih'));
    const tombol = $('#tombol-lanjut');
    tombol.disabled = !p;
    tombol.textContent = t(terjawab() > 0 ? 'tes.lanjutkan' : 'tes.lanjutKe');
  };
  segarkan();

  $('.pilih-karier').addEventListener('change', (e) => {
    draf.karierId = Number(e.target.value);
    simpanDraf();
    segarkan();
  });
  $('#tombol-lanjut').addEventListener('click', () => {
    // Lanjut dari halaman pertama yang belum lengkap.
    const pertamaKosong = butir.findIndex((b) => !draf.jawaban[b.id]);
    halaman = pertamaKosong === -1 ? jumlahHalaman() - 1 : Math.floor(pertamaKosong / PER_HALAMAN);
    tampilKuesioner();
  });
}

/* ---------- Tahap 2: kuesioner ---------- */

function tampilKuesioner(galat = '') {
  const p = pilihan();
  const awal = halaman * PER_HALAMAN;
  const bagian = butir.slice(awal, awal + PER_HALAMAN);
  const variabel = [...new Set(bagian.map((b) => b.variabel))];
  const terakhir = halaman === jumlahHalaman() - 1;

  pasang(utama, html`<div class="halaman halaman--sempit">
    <div class="kemajuan">
      <div class="kemajuan__teks"><span>${p.nama}</span><span id="hitung-jawab"></span></div>
      <div id="trek-kemajuan"></div>
    </div>
    <header class="halaman__kepala">
      <h1>${t(`tes.bagian.${variabel[0]}`)}</h1>
      <p>${t('tes.petunjuk')}</p>
    </header>

    <ol class="butir">
      ${bagian.map((b, i) => html`<li>
        <fieldset>
          <legend>${isiOkupasi(b.teks, p.nama)}</legend>
          <div class="likert">
            ${SKALA.map((s, n) => html`<label>
              <input type="radio" name="butir-${b.id}" value="${n + 1}" ${draf.jawaban[b.id] === n + 1 ? html`checked` : ''}
                aria-label="${n + 1}, ${s}" />
              <b aria-hidden="true">${n + 1}</b>
              <span>${s}</span>
            </label>`)}
          </div>
        </fieldset>
      </li>`)}
    </ol>

    ${galat ? html`<p class="galat" role="alert">${galat}</p>` : ''}
    <div class="lengket-bawah">
      <button type="button" class="tombol" id="tombol-mundur">${t(halaman === 0 ? 'tes.gantiKarier' : 'tes.sebelumnya')}</button>
      <span class="lengket-bawah__hal">${t('tes.halaman', { n: halaman + 1, total: jumlahHalaman() })}</span>
      <button type="button" class="tombol tombol--utama" id="tombol-maju">${t(terakhir ? 'tes.kirim' : 'tes.lanjut')}</button>
    </div>
  </div>`);

  const segarkan = () => {
    const n = terjawab();
    $('#hitung-jawab').textContent = t('tes.terjawab', { n, total: butir.length });
    pasang($('#trek-kemajuan'), html`<div class="trek" style="--v:${(n / butir.length) * 100}" role="progressbar"
      aria-label="${t('tes.kemajuan')}" aria-valuemin="0" aria-valuemax="${butir.length}" aria-valuenow="${n}">
      <span class="trek__isi"></span><span class="trek__titik"></span></div>`);
    $('#tombol-maju').disabled = terakhir ? n < butir.length : !bagian.every((b) => draf.jawaban[b.id]);
  };
  segarkan();

  $('.butir').addEventListener('change', (e) => {
    draf.jawaban[Number(e.target.name.replace('butir-', ''))] = Number(e.target.value);
    simpanDraf();
    segarkan();
  });
  $('#tombol-mundur').addEventListener('click', () => {
    if (halaman === 0) return tampilPilihKarier();
    halaman -= 1;
    tampilKuesioner();
    window.scrollTo(0, 0);
  });
  $('#tombol-maju').addEventListener('click', () => {
    if (terakhir) return kirim();
    halaman += 1;
    tampilKuesioner();
    window.scrollTo(0, 0);
  });
}

/* ---------- Kirim jawaban ---------- */

async function kirim() {
  pasang(utama, html`<div class="tengah"><p class="memuat" role="status">${t('tes.menghitung')}</p></div>`);
  try {
    const jawaban = Object.fromEntries(butir.map((b) => [b.id, draf.jawaban[b.id]]));
    const { asesmen } = await api('/assessments', { body: { karierId: draf.karierId, jawaban } });
    try { localStorage.removeItem(KUNCI_DRAF); } catch { /* abaikan */ }
    location.replace(`/app/hasil?id=${asesmen.id}`);
  } catch (e) {
    tampilKuesioner(e.message);
  }
}

/* ---------- Mulai ---------- */

try {
  [{ karier }, { butir }] = await Promise.all([api('/careers'), api('/instrument')]);
  // Buang jawaban draf untuk butir yang sudah tidak ada.
  const idAktif = new Set(butir.map((b) => b.id));
  for (const id of Object.keys(draf.jawaban)) if (!idAktif.has(Number(id))) delete draf.jawaban[id];
  // Karier dari tautan halaman depan (?karier=kode).
  const dariTautan = karier.find((k) => k.kode === new URLSearchParams(location.search).get('karier'));
  if (dariTautan) draf.karierId = dariTautan.id;
  if (!pilihan()) draf.karierId = null;
  simpanDraf();
  tampilPilihKarier();
} catch (e) {
  gagalMuat(e);
}

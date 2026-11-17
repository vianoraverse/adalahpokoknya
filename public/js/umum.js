// Fungsi bersama untuk semua halaman YourWay: panggilan API, templat HTML yang aman,
// sesi pengguna, kerangka (menu samping), toast, modal, tombol tema dan bahasa, dan komponen kecil.
import { bhs, gantiBahasa, t, terjemahGalat } from './bahasa.js';
import { IKON_MENU } from './ikon.js';

export { bhs, t } from './bahasa.js';

/* ---------- Panggilan API ---------- */

export async function api(path, { method, body } = {}) {
  let res;
  try {
    const headers = { 'X-Bahasa': bhs() };
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    res = await fetch(`/api${path}`, {
      method: method ?? (body !== undefined ? 'POST' : 'GET'),
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: 'same-origin',
    });
  } catch {
    throw Object.assign(new Error(t('galat.koneksi')), { status: 0 });
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.pesan ? terjemahGalat(data.pesan) : t('galat.umum')), { status: res.status });
  return data;
}

/* ---------- Templat HTML yang aman ----------
   html`<p>${teks}</p>` otomatis meng-escape setiap nilai yang disisipkan, sehingga teks
   dari pengguna atau admin tidak bisa menyisipkan tag. Hasil html`` lain (atau array-nya)
   disisipkan apa adanya. */

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);

class Aman {
  constructor(s) { this.s = s; }
  toString() { return this.s; }
}
function sisip(v) {
  if (v instanceof Aman) return v.s;
  if (Array.isArray(v)) return v.map(sisip).join('');
  if (v === null || v === undefined || v === false) return '';
  return esc(v);
}
export function html(potongan, ...nilai) {
  return new Aman(potongan.reduce((hasil, p, i) => hasil + p + (i < nilai.length ? sisip(nilai[i]) : ''), ''));
}
/** Seperti t(), tapi untuk teks yang mengandung tag (mis. <strong>): nilai {isian} di-escape. */
export function tHtml(kunci, isi = {}) {
  return new Aman(t(kunci, Object.fromEntries(Object.entries(isi).map(([k, v]) => [k, esc(v)]))));
}

/** Mengisi sebuah elemen dengan hasil html``. */
export function pasang(el, templat) {
  el.innerHTML = String(templat);
  return el;
}
export const $ = (pemilih, akar = document) => akar.querySelector(pemilih);
export const $$ = (pemilih, akar = document) => [...akar.querySelectorAll(pemilih)];

/* ---------- Format ---------- */

/** Skor 0–100 dengan paling banyak satu desimal (49,6 tidak ditampilkan sebagai 50). */
export const bulat = (n) =>
  n === null || n === undefined ? '–' : (Math.round(n * 10) / 10).toLocaleString(bhs() === 'en' ? 'en-GB' : 'id-ID', { maximumFractionDigits: 1 });
export const tanggal = (s) =>
  new Date(s).toLocaleDateString(bhs() === 'en' ? 'en-GB' : 'id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

/* ---------- Catatan data sementara ----------
   Profil kebutuhan soft skill tiap karier masih memakai angka sementara, belum dari data lowongan kerja.
   Semua bagian yang hasilnya bergantung pada angka itu diberi catatan kecil di pojok bawah.
   Kalau profil karier sudah diisi data asli, ubah DATA_SEMENTARA jadi false: semua catatan hilang sekaligus. */

export const DATA_SEMENTARA = true;

export function catatanSementara() {
  if (!DATA_SEMENTARA) return '';
  return html`<p class="catatan-sementara">${tHtml('catatan.sementara')}</p>`;
}

/* ---------- Komponen kecil ---------- */

export const logo = html`<svg viewBox="0 0 32 32" width="30" height="30" aria-hidden="true">
  <path d="M8 6l8 10v10M24 6l-8 10" fill="none" stroke="currentColor" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" />
  <circle cx="24" cy="6" r="4.5" fill="#ffce2e" stroke="#14163f" stroke-width="2" />
</svg>`;

/**
 * Ikon vector (dari js/ikon.js). `isi` adalah garis-garis ikon; dekoratif, jadi disembunyikan dari pembaca layar.
 * Contoh: ikon(IKON_KARIER.dba, 'ikon--besar')
 */
export function ikon(isi, kelas = '') {
  if (!isi) return '';
  return new Aman(
    `<svg class="ikon ${esc(kelas)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${isi}</svg>`,
  );
}

/** Lencana jalur: Y, X1, atau X2. */
export const kode = (v) => html`<span class="kode kode--${v.toLowerCase()}">${v}</span>`;

/** Trek: skor sebagai posisi pada jalur 0–100. `req` menambah penanda kebutuhan dan celah. */
export function trek(v, { req, jalur, batas = [], label } = {}) {
  const nilai = Math.max(0, Math.min(100, v));
  const adaCelah = req !== undefined && req > nilai;
  return html`<div class="trek ${jalur ? `trek--${jalur.toLowerCase()}` : ''}" style="--v:${nilai};${req !== undefined ? `--req:${req}` : ''}"
    role="img" aria-label="${label ?? `Skor ${bulat(v)} dari 100${req !== undefined ? `, kebutuhan ${bulat(req)}` : ''}`}">
    <span class="trek__isi"></span>
    ${batas.map((b) => html`<span class="trek__batas" style="left:${b}%"></span>`)}
    ${adaCelah ? html`<span class="trek__celah"></span>` : ''}
    ${req !== undefined ? html`<span class="trek__butuh"></span>` : ''}
    <span class="trek__titik"></span>
  </div>`;
}

/* ---------- Toast ---------- */

export function toast(pesan, jenis = 'ok') {
  let area = $('.toast-area');
  if (!area) {
    area = document.createElement('div');
    area.className = 'toast-area';
    area.setAttribute('role', 'status');
    area.setAttribute('aria-live', 'polite');
    area.setAttribute('popover', 'manual'); // agar tampil di atas modal yang sedang terbuka
    document.body.append(area);
  }
  const el = document.createElement('div');
  el.className = `toast${jenis === 'galat' ? ' toast--galat' : ''}`;
  el.textContent = pesan;
  area.append(el);
  try {
    if (area.matches(':popover-open')) area.hidePopover();
    area.showPopover();
  } catch { /* peramban lama: toast tetap tampil sebagai elemen biasa */ }
  setTimeout(() => {
    el.remove();
    if (!area.children.length) { try { area.hidePopover(); } catch { /* abaikan */ } }
  }, 4500);
}

/* ---------- Modal ---------- */

/** Membuka dialog. `isi` adalah hasil html``. Mengembalikan elemen <dialog>; panggil .close() untuk menutup. */
export function modal(judul, isi) {
  const d = document.createElement('dialog');
  d.className = 'modal';
  pasang(d, html`<div class="modal__isi">
    <header class="modal__kepala"><h2>${judul}</h2><button type="button" class="modal__tutup" data-tutup>${t('tutup')}</button></header>
    ${isi}
  </div>`);
  d.addEventListener('click', (e) => {
    if (e.target === d || e.target.closest('[data-tutup]')) d.close();
  });
  d.addEventListener('close', () => d.remove());
  document.body.append(d);
  d.showModal();
  return d;
}

/** Membaca isian formulir menjadi objek biasa. */
export const isian = (form) => Object.fromEntries(new FormData(form));

/* ---------- Sesi dan kerangka halaman ---------- */

const MENU = {
  mahasiswa: [
    ['/app/', 'menu.dasbor', 'dasbor'],
    ['/app/asesmen', 'menu.tes', 'tes'],
    ['/app/riwayat', 'menu.riwayat', 'riwayat'],
    ['/app/pengaturan', 'menu.pengaturan', 'pengaturan'],
  ],
  admin: [
    ['/admin/', 'Ringkasan hasil', 'ringkasan'],
    ['/admin/butir', 'Butir kuesioner', 'butir'],
    ['/admin/model', 'Bobot dan aturan', 'model'],
    ['/admin/profil-karier', 'Profil karier', 'profil'],
    ['/admin/akun', 'Akun pengguna', 'akun'],
    ['/admin/pengaturan', 'Pengaturan', 'pengaturan'],
  ],
};

export const berandaPeran = (peran) => (peran === 'admin' ? '/admin/' : '/app/');

/** Pengguna yang sedang masuk, atau null. */
export async function sesi() {
  try {
    return (await api('/auth/me')).pengguna;
  } catch {
    return null;
  }
}

/**
 * Dipanggil di awal setiap halaman aplikasi. Memastikan pengguna sudah masuk dengan peran
 * yang benar, lalu menggambar menu samping. Mengembalikan data pengguna.
 */
export async function mulaiHalaman(peran) {
  const pengguna = await sesi();
  if (!pengguna) {
    location.replace(`/masuk?lanjut=${encodeURIComponent(location.pathname + location.search)}`);
    return new Promise(() => {});
  }
  if (pengguna.peran !== peran) {
    location.replace(berandaPeran(pengguna.peran));
    return new Promise(() => {});
  }
  const sisi = $('#sisi');
  const kini = location.pathname.replace(/\.html$/, '').replace(/\/index$/, '/');
  const JUDUL = {
    '/app/': 'judul.dasbor',
    '/app/asesmen': 'judul.tes',
    '/app/hasil': 'judul.hasil',
    '/app/riwayat': 'judul.riwayat',
    '/app/pengaturan': 'judul.pengaturan',
  };
  if (peran === 'mahasiswa' && JUDUL[kini]) document.title = t(JUDUL[kini]);
  pasang(sisi, html`
    <div class="sisi__atas">
      <a class="logo" href="${berandaPeran(peran)}">${logo} YourWay</a>
      <button type="button" class="sisi__menu" aria-expanded="false" aria-controls="navigasi">${t('menu')}</button>
    </div>
    <nav id="navigasi" aria-label="Navigasi utama">
      ${MENU[peran].map(([ke, label, namaIkon]) => {
        const aktif = kini === ke || (ke === '/app/asesmen' && kini === '/app/hasil');
        // Menu mahasiswa memakai kunci terjemahan, menu admin langsung teks Indonesia.
        return html`<a href="${ke}" ${aktif ? html`aria-current="page"` : ''}>
          ${ikon(IKON_MENU[namaIkon])} ${peran === 'mahasiswa' ? t(label) : label}
        </a>`;
      })}
    </nav>
    <div class="sisi__bawah">
      <p><strong>${pengguna.nama}</strong><span>${t(peran === 'admin' ? 'peran.admin' : 'peran.mahasiswa')}</span></p>
      ${tombolTampilan({ bahasa: peran === 'mahasiswa' })}
      <button type="button" class="sisi__keluar">${ikon(IKON_MENU.keluar)} ${t('keluar')}</button>
    </div>`);
  pasangTombolTampilan(sisi);
  $('.sisi__menu', sisi).addEventListener('click', (e) => {
    const buka = sisi.toggleAttribute('data-buka');
    e.currentTarget.setAttribute('aria-expanded', String(buka));
    e.currentTarget.textContent = t(buka ? 'tutup' : 'menu');
  });
  $('.sisi__keluar', sisi).addEventListener('click', async () => {
    await api('/auth/logout', { method: 'POST' }).catch(() => {});
    location.href = '/';
  });
  return pengguna;
}

/** Menampilkan galat pemuatan di area utama. */
export function gagalMuat(e) {
  pasang($('#utama'), html`<p class="galat" role="alert">${e.message}</p>`);
}

/* ---------- Tombol tema (terang/gelap) dan bahasa ---------- */

const IKON_BULAN = html`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" fill="currentColor" /></svg>`;
const IKON_MATAHARI = html`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="4.5" fill="currentColor" /><g stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8" /></g></svg>`;

const temaGelap = () => document.documentElement.dataset.tema === 'gelap';

function isiTombolTema(tombol) {
  pasang(tombol, html`${temaGelap() ? IKON_MATAHARI : IKON_BULAN}<span class="sr">${t(temaGelap() ? 'tema.keTerang' : 'tema.keGelap')}</span>`);
  tombol.title = t(temaGelap() ? 'tema.keTerang' : 'tema.keGelap');
}

/** Tombol ganti tema, plus tombol ganti bahasa bila `bahasa` true. Pasang event-nya dengan pasangTombolTampilan(). */
export function tombolTampilan({ bahasa = true } = {}) {
  return html`<div class="tampilan">
    <button type="button" class="tampilan__tombol" data-tema-tombol></button>
    ${bahasa
      ? html`<button type="button" class="tampilan__tombol" data-bahasa-tombol lang="${bhs() === 'en' ? 'id' : 'en'}"
          aria-label="${t('bahasa.aria')}" title="${t('bahasa.aria')}">${t('bahasa.label')}</button>`
      : ''}
  </div>`;
}

export function pasangTombolTampilan(akar = document) {
  for (const tombol of $$('[data-tema-tombol]', akar)) {
    isiTombolTema(tombol);
    tombol.addEventListener('click', () => {
      const baru = temaGelap() ? 'terang' : 'gelap';
      document.documentElement.dataset.tema = baru;
      try {
        localStorage.setItem('yourway.tema', baru);
      } catch {
        /* penyimpanan tidak tersedia: tema tetap berganti sampai halaman ditutup */
      }
      for (const tb of $$('[data-tema-tombol]')) isiTombolTema(tb);
    });
  }
  for (const tombol of $$('[data-bahasa-tombol]', akar)) tombol.addEventListener('click', gantiBahasa);
}

/** Untuk halaman HTML biasa (depan, masuk, daftar, 404): terjemahkan teks dan pasang tombol tampilan. */
export function siapkanHalamanStatis({ bahasa = true } = {}) {
  for (const el of $$('[data-teks]')) el.innerHTML = t(el.dataset.teks);
  for (const wadah of $$('[data-tampilan]')) pasang(wadah, tombolTampilan({ bahasa }));
  pasangTombolTampilan();
}

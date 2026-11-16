// Halaman masuk.
import { $, $$, api, berandaPeran, isian, sesi } from '../umum.js';

const lanjut = new URLSearchParams(location.search).get('lanjut');
// Tautan "Daftar" membawa serta tujuan setelah masuk.
for (const a of $$('[data-bawa-lanjut]')) if (lanjut) a.href += `?lanjut=${encodeURIComponent(lanjut)}`;

function setelahMasuk(pengguna) {
  const aman = lanjut && lanjut.startsWith('/app/') && pengguna.peran === 'mahasiswa';
  location.replace(aman ? lanjut : berandaPeran(pengguna.peran));
}

const sudahMasuk = await sesi();
if (sudahMasuk) setelahMasuk(sudahMasuk);

const form = $('#form-masuk');
const galat = $('.galat', form);
const tombol = $('button', form);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  galat.hidden = true;
  tombol.disabled = true;
  tombol.textContent = 'Memeriksa…';
  try {
    const { pengguna } = await api('/auth/login', { body: isian(form) });
    setelahMasuk(pengguna);
  } catch (err) {
    galat.textContent = err.message;
    galat.hidden = false;
    tombol.disabled = false;
    tombol.textContent = 'Masuk';
  }
});

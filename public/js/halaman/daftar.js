// Halaman daftar akun mahasiswa.
import { $, $$, api, berandaPeran, isian, sesi } from '../umum.js';

const lanjut = new URLSearchParams(location.search).get('lanjut');
for (const a of $$('[data-bawa-lanjut]')) if (lanjut) a.href += `?lanjut=${encodeURIComponent(lanjut)}`;

const sudahMasuk = await sesi();
if (sudahMasuk) location.replace(berandaPeran(sudahMasuk.peran));

const form = $('#form-daftar');
const galat = $('.galat', form);
const tombol = $('button', form);

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  galat.hidden = true;
  tombol.disabled = true;
  tombol.textContent = 'Membuat akun…';
  const d = isian(form);
  try {
    await api('/auth/register', { body: { nama: d.nama, email: d.email, password: d.password, setuju: d.setuju === 'on' } });
    location.replace(lanjut && lanjut.startsWith('/app/') ? lanjut : '/app/');
  } catch (err) {
    galat.textContent = err.message;
    galat.hidden = false;
    tombol.disabled = false;
    tombol.textContent = 'Buat akun';
  }
});

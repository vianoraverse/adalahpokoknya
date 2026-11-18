// Halaman depan: tombol "Mulai tes" membawa ke daftar/masuk dulu (kalau belum masuk), lalu ke halaman tes.
import { $, berandaPeran, html, pasang, sesi, siapkanHalamanStatis, t } from '../umum.js';

siapkanHalamanStatis();
const pengguna = await sesi();

if (!pengguna) {
  // Belum masuk: daftar dulu (halaman daftar punya tautan ke Masuk), lalu otomatis lanjut ke tes.
  $('#tombol-mulai').href = `/daftar?lanjut=${encodeURIComponent('/app/asesmen')}`;
} else {
  $('#tombol-mulai').href = pengguna.peran === 'mahasiswa' ? '/app/asesmen' : '/admin/';
  pasang($('#nav-akun'), html`<a class="tombol tombol--utama" href="${berandaPeran(pengguna.peran)}">${t('depan.bukaDasbor')}</a>`);
}

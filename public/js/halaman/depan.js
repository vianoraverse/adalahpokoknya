// Halaman depan: mengisi papan tujuan dengan 16 karier dan menyesuaikan tombol bila sudah masuk.
import { $, api, berandaPeran, html, ikon, pasang, sesi, siapkanHalamanStatis, t } from '../umum.js';
import { IKON_KARIER } from '../ikon.js';

siapkanHalamanStatis();
const pengguna = await sesi();

// Ke mana pengunjung dibawa saat memilih karier atau menekan "Mulai asesmen".
function tujuan(kodeKarier) {
  const asesmen = `/app/asesmen${kodeKarier ? `?karier=${kodeKarier}` : ''}`;
  if (pengguna?.peran === 'mahasiswa') return asesmen;
  if (pengguna?.peran === 'admin') return '/admin/';
  return `/daftar?lanjut=${encodeURIComponent(asesmen)}`;
}

if (pengguna) {
  pasang($('#nav-akun'), html`<a class="tombol tombol--terang" href="${berandaPeran(pengguna.peran)}">${t('depan.bukaDasbor')}</a>`);
}
$('#tombol-mulai').href = tujuan();

try {
  const { karier } = await api('/careers');
  pasang($('#papan-karier'), html`${karier.map((k, i) => html`<li>
    <a class="papan__baris" href="${tujuan(k.kode)}">
      <span class="papan__no">${String(i + 1).padStart(2, '0')}</span>
      <span class="papan__nama">${ikon(IKON_KARIER[k.kode])} ${k.nama}</span>
      <span class="papan__area">${k.area_fungsi}</span>
    </a>
  </li>`)}`);
} catch (e) {
  pasang($('#papan-karier'), html`<li class="papan__baris">${e.message}</li>`);
}

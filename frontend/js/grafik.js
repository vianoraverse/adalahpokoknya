// Spider chart di halaman hasil: nilai 14 soft skill mahasiswa, digambar tanpa angka.
// Zona kuning = kategori Sangat Cocok, garis putus-putus = batas Perlu Dikembangkan.
// Soft skill prioritas latihan (sama dengan daftar "Yang perlu kamu latih") ditandai titik kuning.
import { $, $$, html, pasang, t } from './umum.js';

// Label dipecah jadi dua baris supaya muat di sekeliling diagram.
const SINGKAT = {
  'critical-thinking': ['Critical', 'Thinking'],
  'problem-solving': ['Problem', 'Solving'],
  'ethical-analysis': ['Ethical', 'Analysis'],
  'self-development': ['Self-', 'development'],
  teamwork: ['Teamwork'],
  'oral-communication': ['Oral', 'Communication'],
  'written-communication': ['Written', 'Communication'],
  intercultural: ['Intercultural', 'Competency'],
  'conflict-management': ['Conflict', 'Management'],
};


/**
 * Menggambar spider chart ke dalam `wadah`.
 * `data`: daftar soft skill { kode, nama, nilai } (nilai 0–100, tidak ditampilkan).
 * `ambang`: { rendah, tinggi } batas kategori.
 * `prioritas`: kode soft skill yang ditandai titik kuning.
 */
export function gambarRadar(wadah, data, ambang, prioritas = []) {
  const n = data.length;
  // Di layar sempit diagramnya diperkecil supaya label yang dibesarkan tetap muat.
  const kecil = wadah.clientWidth < 500;
  const W = kecil ? 420 : 580;
  const H = kecil ? 440 : 480;
  const CX = W / 2;
  const CY = H / 2 + 4;
  const R = kecil ? 112 : 152;
  const ukuranLabel = kecil ? 16 : 13;
  const titik = (i, v) => {
    const sudut = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [CX + Math.cos(sudut) * R * (v / 100), CY + Math.sin(sudut) * R * (v / 100)];
  };
  const teks = (pts) => pts.map((p) => p.map((x) => x.toFixed(1)).join(',')).join(' ');
  const cincin = (g) => teks(data.map((_, i) => titik(i, g)));
  // Jalur cincin untuk zona (luar searah jarum jam, dalam berlawanan) supaya bagian tengahnya kosong.
  const jalurCincin = (g) => `M${data.map((_, i) => titik(i, g).map((x) => x.toFixed(1)).join(',')).join('L')}Z`;
  const utama = (d) => prioritas.includes(d.kode);
  const kat = (d) => (d.nilai >= ambang.tinggi ? 'sangat' : d.nilai >= ambang.rendah ? 'cukup' : 'perlu');
  const status = (d) => t(`kategori.${kat(d)}`) + (utama(d) ? ` · ${t('radar.prioritas')}` : '');

  pasang(wadah, html`
    <ul class="legenda" aria-hidden="true">
      <li><i class="legenda__kamu"></i> ${t('radar.kamu')}</li>
      <li><i class="legenda__zona"></i> ${t('radar.zona')}</li>
      <li><i class="legenda__batas"></i> ${t('radar.batas')}</li>
      <li><i class="legenda__kurang"></i> ${t('radar.prioritas')}</li>
    </ul>
    <div class="radar__kanvas">
      <svg viewBox="0 0 ${W} ${H}" role="img"
        aria-label="${t('radar.aria', { daftar: data.filter(utama).map((d) => d.nama).join(', ') })}">
        <path d="${jalurCincin(100)} ${jalurCincin(ambang.tinggi)}" fill="var(--sun)" fill-opacity="0.28" fill-rule="evenodd" />
        <polygon points="${cincin(100)}" fill="none" stroke="var(--line)" stroke-width="1.5" />
        <polygon points="${cincin(ambang.rendah)}" fill="none" stroke="var(--ink-2)" stroke-width="1.5" stroke-dasharray="5 5" />
        ${data.map((_, i) => {
          const [x, y] = titik(i, 100);
          return html`<line x1="${CX}" y1="${CY}" x2="${x}" y2="${y}" stroke="var(--line)" />`;
        })}
        <polygon points="${teks(data.map((d, i) => titik(i, d.nilai)))}" fill="var(--aksen)" fill-opacity="0.16"
          stroke="var(--aksen)" stroke-width="2.5" stroke-linejoin="round" />
        ${data.map((d, i) => {
          if (!utama(d)) return '';
          const [x, y] = titik(i, d.nilai);
          return html`<circle cx="${x}" cy="${y}" r="7" fill="var(--sun)" stroke="var(--ink)" stroke-width="2" />`;
        })}
        ${data.map((d, i) => {
          const [x, y] = titik(i, 120);
          const baris = SINGKAT[d.kode] ?? [d.nama];
          const jangkar = Math.abs(x - CX) < 12 ? 'middle' : x > CX ? 'start' : 'end';
          return html`<text x="${x}" y="${y - ((baris.length - 1) * (ukuranLabel + 2)) / 2}" text-anchor="${jangkar}"
            class="radar__label ${utama(d) ? 'radar__label--kurang' : ''}" style="font-size:${ukuranLabel}px" data-label="${i}">
            ${baris.map((b, j) => html`<tspan x="${x}" dy="${j === 0 ? 4 : ukuranLabel + 2}">${b}</tspan>`)}
          </text>`;
        })}
        ${data.map((d, i) => {
          const [x, y] = titik(i, 68);
          return html`<circle cx="${x}" cy="${y}" r="36" fill="transparent" tabindex="0" data-sentuh="${i}"
            aria-label="${d.nama}: ${status(d)}" />`;
        })}
      </svg>
      <div class="tip" hidden></div>
    </div>`);

  // Keterangan singkat saat soft skill disorot atau difokus (pakai keyboard).
  const tip = $('.tip', wadah);
  const svg = $('svg', wadah);
  const tampil = (i) => {
    const d = data[i];
    const [x, y] = titik(i, 68);
    pasang(tip, html`<strong>${d.nama}</strong><span>${status(d)}</span>`);
    tip.style.left = `${(x / W) * 100}%`;
    tip.style.top = `${(y / H) * svg.clientHeight}px`;
    tip.hidden = false;
    $(`[data-label="${i}"]`, wadah).setAttribute('data-aktif', '');
  };
  const sembunyi = (i) => {
    tip.hidden = true;
    $(`[data-label="${i}"]`, wadah).removeAttribute('data-aktif');
  };
  for (const el of $$('[data-sentuh]', wadah)) {
    const i = Number(el.dataset.sentuh);
    el.addEventListener('mouseenter', () => tampil(i));
    el.addEventListener('mouseleave', () => sembunyi(i));
    el.addEventListener('focus', () => tampil(i));
    el.addEventListener('blur', () => sembunyi(i));
  }
}

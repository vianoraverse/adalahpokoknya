// Spider chart di halaman hasil: soft skill mahasiswa dibandingkan dengan yang dibutuhkan karier hasil.
// Sengaja tanpa angka. Soft skill yang jadi prioritas latihan (sama dengan daftar "Yang bisa kamu latih")
// ditandai titik kuning.
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
 * `data`: daftar soft skill dengan skor (skor) dan kebutuhan (req).
 * `prioritas`: kode soft skill yang ditandai titik kuning.
 */
export function gambarRadar(wadah, data, namaKarier, prioritas = []) {
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
  const poligon = (ambil) => data.map((d, i) => titik(i, ambil(d)).map((x) => x.toFixed(1)).join(',')).join(' ');
  const cincin = (g) => data.map((_, i) => titik(i, g).map((x) => x.toFixed(1)).join(',')).join(' ');
  const kurang = (d) => d.skor < d.req;
  const utama = (d) => prioritas.includes(d.kode);
  const status = (d) => t(utama(d) ? 'radar.prioritas' : kurang(d) ? 'radar.kurang' : 'radar.cukup');

  pasang(wadah, html`
    <ul class="legenda" aria-hidden="true">
      <li><i class="legenda__kamu"></i> ${t('radar.kamu')}</li>
      <li><i class="legenda__butuh"></i> ${t('radar.butuh', { karier: namaKarier })}</li>
      <li><i class="legenda__kurang"></i> ${t('radar.prioritas')}</li>
    </ul>
    <div class="radar__kanvas">
      <svg viewBox="0 0 ${W} ${H}" role="img"
        aria-label="${t('radar.aria', { karier: namaKarier, daftar: data.filter(utama).map((d) => d.nama).join(', ') || t('radar.tidakAda') })}">
        ${[50, 100].map((g) => html`<polygon points="${cincin(g)}" fill="none" stroke="var(--line)" stroke-width="${g === 100 ? 1.5 : 1}" />`)}
        ${data.map((_, i) => {
          const [x, y] = titik(i, 100);
          return html`<line x1="${CX}" y1="${CY}" x2="${x}" y2="${y}" stroke="var(--line)" />`;
        })}
        <polygon points="${poligon((d) => d.skor)}" fill="var(--aksen)" fill-opacity="0.16" stroke="var(--aksen)" stroke-width="2.5" stroke-linejoin="round" />
        <polygon points="${poligon((d) => d.req)}" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="6 5" stroke-linejoin="round" />
        ${data.map((d, i) => {
          if (!utama(d)) return '';
          const [x, y] = titik(i, d.req);
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
            aria-label="${d.nama}: ${status(d).toLowerCase()}" />`;
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

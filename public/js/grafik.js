// Diagram radar (FR-07): skor soft skill mahasiswa terhadap level kebutuhan karier.
import { $, $$, bulat, html, pasang } from './umum.js';

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

const W = 580;
const H = 480;
const CX = W / 2;
const CY = H / 2 + 4;
const R = 152;

/** Menggambar radar ke dalam `wadah`. `data` adalah daftar gap per indikator dari hasil asesmen. */
export function gambarRadar(wadah, data, namaKarier) {
  const n = data.length;
  const titik = (i, v) => {
    const sudut = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [CX + Math.cos(sudut) * R * (v / 100), CY + Math.sin(sudut) * R * (v / 100)];
  };
  const poligon = (ambil) => data.map((d, i) => titik(i, ambil(d)).map((x) => x.toFixed(1)).join(',')).join(' ');
  const cincin = (g) => data.map((_, i) => titik(i, g).map((x) => x.toFixed(1)).join(',')).join(' ');

  pasang(wadah, html`
    <div class="legenda" aria-hidden="true">
      <span><i class="legenda__skor"></i> Skormu</span>
      <span><i class="legenda__req"></i> Kebutuhan ${namaKarier}</span>
    </div>
    <svg viewBox="0 0 ${W} ${H}" role="img"
      aria-label="Diagram radar skor soft skill kamu terhadap kebutuhan ${namaKarier}. Rincian angka ada pada tabel.">
      ${[25, 50, 75, 100].map((g) => html`<polygon points="${cincin(g)}" fill="none" stroke="var(--line)" stroke-width="${g === 100 ? 1.5 : 1}" />`)}
      ${data.map((_, i) => {
        const [x, y] = titik(i, 100);
        return html`<line x1="${CX}" y1="${CY}" x2="${x}" y2="${y}" stroke="var(--line)" />`;
      })}
      ${[50, 100].map((g) => html`<text x="${CX + 5}" y="${CY - (R * g) / 100 + 13}" class="radar__tik">${g}</text>`)}
      <polygon points="${poligon((d) => d.skor)}" fill="var(--x1)" fill-opacity="0.14" stroke="var(--x1)" stroke-width="2.5" stroke-linejoin="round" />
      <polygon points="${poligon((d) => d.req)}" fill="none" stroke="var(--ink)" stroke-width="2" stroke-dasharray="6 5" stroke-linejoin="round" />
      ${data.map((d, i) => {
        const [x, y] = titik(i, d.skor);
        return html`<circle cx="${x}" cy="${y}" r="5.5" fill="var(--surface)" stroke="var(--x1)" stroke-width="3.5" data-titik="${i}" />`;
      })}
      ${data.map((d, i) => {
        const [x, y] = titik(i, 119);
        const baris = SINGKAT[d.kode] ?? [d.nama];
        const jangkar = Math.abs(x - CX) < 12 ? 'middle' : x > CX ? 'start' : 'end';
        return html`<text x="${x}" y="${y - (baris.length - 1) * 7.5}" text-anchor="${jangkar}" class="radar__label" data-label="${i}">
          ${baris.map((b, j) => html`<tspan x="${x}" dy="${j === 0 ? 4 : 15}">${b}</tspan>`)}
        </text>`;
      })}
      ${data.map((d, i) => {
        const [x, y] = titik(i, 68);
        return html`<circle cx="${x}" cy="${y}" r="36" fill="transparent" tabindex="0" data-sentuh="${i}"
          aria-label="${d.nama}: skor ${bulat(d.skor)}, kebutuhan ${bulat(d.req)}" />`;
      })}
    </svg>
    <div class="tip" hidden></div>`);

  // Tooltip saat titik disorot atau difokus.
  const tip = $('.tip', wadah);
  const tampil = (i) => {
    const d = data[i];
    const [x, y] = titik(i, 68);
    pasang(tip, html`<strong>${d.nama}</strong>
      <span>Skormu <b>${bulat(d.skor)}</b></span>
      <span>Kebutuhan <b>${bulat(d.req)}</b></span>
      <span>${d.gap > 0 ? html`Selisih <b>${bulat(d.gap)}</b>` : 'Kebutuhan terpenuhi'}</span>`);
    const svg = $('svg', wadah);
    tip.style.left = `${(x / W) * 100}%`;
    tip.style.top = `${svg.offsetTop + (y / H) * svg.clientHeight}px`;
    tip.hidden = false;
    $(`[data-label="${i}"]`, wadah).setAttribute('data-aktif', '');
    $(`[data-titik="${i}"]`, wadah).setAttribute('r', '7.5');
  };
  const sembunyi = (i) => {
    tip.hidden = true;
    $(`[data-label="${i}"]`, wadah).removeAttribute('data-aktif');
    $(`[data-titik="${i}"]`, wadah).setAttribute('r', '5.5');
  };
  for (const el of $$('[data-sentuh]', wadah)) {
    const i = Number(el.dataset.sentuh);
    el.addEventListener('mouseenter', () => tampil(i));
    el.addEventListener('mouseleave', () => sembunyi(i));
    el.addEventListener('focus', () => tampil(i));
    el.addEventListener('blur', () => sembunyi(i));
  }
}

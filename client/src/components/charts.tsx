import { useState } from 'react';
import { bulat, type GapIndikator } from '../api';

/* Cincin skor 0–100. */
export function Cincin({ nilai, label, ukuran = 168 }: { nilai: number; label: string; ukuran?: number }) {
  const r = 44;
  const keliling = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, nilai));
  return (
    <div className="cincin" style={{ width: ukuran, height: ukuran }} role="img" aria-label={`${label}: ${bulat(nilai)} dari 100`}>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={r} fill="none" stroke="var(--brand-soft)" strokeWidth="8" />
        <circle
          cx="50" cy="50" r={r} fill="none" stroke="var(--brand)" strokeWidth="8" strokeLinecap="round"
          strokeDasharray={`${(v / 100) * keliling} ${keliling}`} transform="rotate(-90 50 50)"
        />
      </svg>
      <div className="cincin__teks">
        <strong>{bulat(nilai)}</strong>
        <span>{label}</span>
      </div>
    </div>
  );
}

const SINGKAT: Record<string, string[]> = {
  'critical-thinking': ['Critical', 'Thinking'],
  'problem-solving': ['Problem', 'Solving'],
  'creativity': ['Creativity'],
  'ethical-analysis': ['Ethical', 'Analysis'],
  'self-development': ['Self-', 'development'],
  'flexibility': ['Flexibility'],
  'discipline': ['Discipline'],
  'teamwork': ['Teamwork'],
  'oral-communication': ['Oral', 'Communication'],
  'written-communication': ['Written', 'Communication'],
  'negotiation': ['Negotiation'],
  'leadership': ['Leadership'],
  'intercultural': ['Intercultural', 'Competency'],
  'conflict-management': ['Conflict', 'Management'],
};

/**
 * Diagram radar (FR-07): skor soft skill mahasiswa terhadap level kebutuhan karier.
 * Dua seri: "Skormu" (isi biru) dan "Kebutuhan karier" (garis putus oranye).
 */
export function Radar({ data, namaKarier }: { data: GapIndikator[]; namaKarier: string }) {
  const [aktif, setAktif] = useState<number | null>(null);
  const W = 560, H = 470, cx = W / 2, cy = H / 2 + 4, R = 150;
  const n = data.length;
  const titik = (i: number, v: number) => {
    const sudut = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [cx + Math.cos(sudut) * R * (v / 100), cy + Math.sin(sudut) * R * (v / 100)] as const;
  };
  const poli = (ambil: (d: GapIndikator) => number) => data.map((d, i) => titik(i, ambil(d)).join(',')).join(' ');
  const d = aktif !== null ? data[aktif] : null;

  return (
    <figure className="radar">
      <div className="legenda" aria-hidden="true">
        <span><i className="legenda__skor" /> Skormu</span>
        <span><i className="legenda__req" /> Kebutuhan {namaKarier}</span>
      </div>
      <div className="radar__kanvas">
        <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Diagram radar skor soft skill kamu terhadap kebutuhan ${namaKarier}. Rincian angka ada pada tabel di bawah.`}>
          {[25, 50, 75, 100].map((g) => (
            <polygon key={g} points={data.map((_, i) => titik(i, g).join(',')).join(' ')} fill="none" stroke="var(--line)" strokeWidth="1" />
          ))}
          {data.map((_, i) => {
            const [x, y] = titik(i, 100);
            return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--line)" strokeWidth="1" />;
          })}
          {[25, 50, 75, 100].map((g) => (
            <text key={g} x={cx + 4} y={cy - (R * g) / 100 + 11} className="radar__tik">{g}</text>
          ))}
          <polygon points={poli((x) => x.skor)} fill="var(--brand)" fillOpacity="0.12" stroke="var(--brand)" strokeWidth="2" strokeLinejoin="round" />
          <polygon points={poli((x) => x.req)} fill="none" stroke="var(--need)" strokeWidth="2" strokeDasharray="6 4" strokeLinejoin="round" />
          {data.map((x, i) => {
            const [rx, ry] = titik(i, x.req);
            const [sx, sy] = titik(i, x.skor);
            return (
              <g key={x.kode}>
                <rect x={rx - 3.5} y={ry - 3.5} width="7" height="7" fill="var(--need)" stroke="var(--surface)" strokeWidth="1.5" transform={`rotate(45 ${rx} ${ry})`} />
                <circle cx={sx} cy={sy} r={aktif === i ? 6 : 4.5} fill="var(--brand)" stroke="var(--surface)" strokeWidth="2" />
              </g>
            );
          })}
          {data.map((x, i) => {
            const [lx, ly] = titik(i, 118);
            const baris = SINGKAT[x.kode] ?? [x.nama];
            const jangkar = Math.abs(lx - cx) < 12 ? 'middle' : lx > cx ? 'start' : 'end';
            return (
              <text key={x.kode} x={lx} y={ly - (baris.length - 1) * 7} textAnchor={jangkar} className={`radar__label${aktif === i ? ' radar__label--aktif' : ''}`}>
                {baris.map((b, j) => <tspan key={j} x={lx} dy={j === 0 ? 4 : 14}>{b}</tspan>)}
              </text>
            );
          })}
          {/* Area sentuh yang lebih besar dari titiknya */}
          {data.map((x, i) => {
            const [hx, hy] = titik(i, 70);
            return (
              <circle
                key={x.kode} cx={hx} cy={hy} r="34" fill="transparent" tabIndex={0}
                aria-label={`${x.nama}: skor ${bulat(x.skor)}, kebutuhan ${bulat(x.req)}`}
                onMouseEnter={() => setAktif(i)} onMouseLeave={() => setAktif(null)}
                onFocus={() => setAktif(i)} onBlur={() => setAktif(null)}
              />
            );
          })}
        </svg>
        {d && (
          <div className="tip" style={{ left: `${(titik(aktif!, 70)[0] / W) * 100}%`, top: `${(titik(aktif!, 70)[1] / H) * 100}%` }}>
            <strong>{d.nama}</strong>
            <span><i className="legenda__skor" /> Skormu <b>{bulat(d.skor)}</b></span>
            <span><i className="legenda__req" /> Kebutuhan <b>{bulat(d.req)}</b></span>
            <span>{d.gap > 0 ? `Selisih ${bulat(d.gap)} poin` : 'Sudah memenuhi'}</span>
          </div>
        )}
      </div>
    </figure>
  );
}

/* Batang horizontal sederhana 0–100. */
export function Batang({ nilai, tanda }: { nilai: number; tanda?: number }) {
  return (
    <div className="batang" aria-hidden="true">
      <div className="batang__isi" style={{ width: `${Math.max(0, Math.min(100, nilai))}%` }} />
      {tanda !== undefined && <div className="batang__tanda" style={{ left: `${tanda}%` }} />}
    </div>
  );
}

/* SFS seluruh 16 karier (FR-06), diurutkan dari yang paling selaras. */
export function DaftarSfs({ data, pilihanId, teratasId }: { data: Array<{ karierId: number; nama: string; sfs: number }>; pilihanId: number; teratasId: number }) {
  const urut = [...data].sort((a, b) => b.sfs - a.sfs);
  return (
    <ol className="sfs-daftar">
      {urut.map((k) => (
        <li key={k.karierId} className={k.karierId === pilihanId ? 'sfs-daftar__pilihan' : undefined}>
          <span className="sfs-daftar__nama">
            {k.nama}
            {k.karierId === pilihanId && <em className="tag tag--brand">Pilihanmu</em>}
            {k.karierId === teratasId && <em className="tag">Paling selaras</em>}
          </span>
          <Batang nilai={k.sfs} />
          <span className="sfs-daftar__nilai">{bulat(k.sfs)}</span>
        </li>
      ))}
    </ol>
  );
}

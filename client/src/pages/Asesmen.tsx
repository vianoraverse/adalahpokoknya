import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api, LABEL_VARIABEL, type Asesmen as TAsesmen, type ButirKuesioner, type Karier } from '../api';
import { Galat, Memuat } from '../components/ui';

const SKALA = ['Sangat tidak setuju', 'Tidak setuju', 'Netral', 'Setuju', 'Sangat setuju'];
const PER_HALAMAN = 6;
const KUNCI_DRAF = 'yourway.draf-asesmen';

interface Draf { karierId: number | null; jawaban: Record<number, number> }

function bacaDraf(): Draf {
  try {
    const d = JSON.parse(localStorage.getItem(KUNCI_DRAF) ?? 'null');
    if (d && typeof d === 'object') return { karierId: d.karierId ?? null, jawaban: d.jawaban ?? {} };
  } catch { /* penyimpanan tidak tersedia */ }
  return { karierId: null, jawaban: {} };
}

export default function Asesmen() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const [karier, setKarier] = useState<Karier[] | null>(null);
  const [butir, setButir] = useState<ButirKuesioner[]>([]);
  const [draf, setDraf] = useState<Draf>(bacaDraf);
  const [tahap, setTahap] = useState<'karier' | 'kuesioner' | 'hitung'>('karier');
  const [halaman, setHalaman] = useState(0);
  const [galat, setGalat] = useState('');
  const atas = useRef<HTMLDivElement>(null);

  useEffect(() => {
    Promise.all([api<{ karier: Karier[] }>('/careers'), api<{ butir: ButirKuesioner[] }>('/instrument')])
      .then(([k, b]) => {
        setKarier(k.karier);
        setButir(b.butir);
        const kode = params.get('karier');
        const dariTautan = k.karier.find((x) => x.kode === kode);
        if (dariTautan) setDraf((d) => ({ ...d, karierId: dariTautan.id }));
      })
      .catch((e) => setGalat(e.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try { localStorage.setItem(KUNCI_DRAF, JSON.stringify(draf)); } catch { /* abaikan */ }
  }, [draf]);

  const pilihan = karier?.find((k) => k.id === draf.karierId) ?? null;
  const jumlahHalaman = Math.ceil(butir.length / PER_HALAMAN);
  const butirHalaman = useMemo(() => butir.slice(halaman * PER_HALAMAN, (halaman + 1) * PER_HALAMAN), [butir, halaman]);
  const terjawab = butir.filter((b) => draf.jawaban[b.id]).length;
  const halamanLengkap = butirHalaman.every((b) => draf.jawaban[b.id]);

  const pindah = (h: number) => {
    setHalaman(h);
    requestAnimationFrame(() => atas.current?.scrollIntoView({ block: 'start' }));
  };

  const kirim = async () => {
    if (!pilihan) return;
    setTahap('hitung');
    setGalat('');
    try {
      const jawaban = Object.fromEntries(butir.map((b) => [b.id, draf.jawaban[b.id]]));
      const d = await api<{ asesmen: TAsesmen }>('/assessments', { body: { karierId: pilihan.id, jawaban } });
      try { localStorage.removeItem(KUNCI_DRAF); } catch { /* abaikan */ }
      navigate(`/app/hasil/${d.asesmen.id}`, { replace: true });
    } catch (e) {
      setGalat((e as Error).message);
      setTahap('kuesioner');
    }
  };

  if (galat && !karier) return <Galat pesan={galat} />;
  if (!karier) return <Memuat teks="Menyiapkan asesmen…" />;

  if (tahap === 'hitung') {
    return (
      <div className="tengah">
        <Memuat teks="Jawaban terkirim. Menghitung skor dan kesesuaian…" />
      </div>
    );
  }

  if (tahap === 'karier') {
    return (
      <div className="halaman">
        <header className="halaman__kepala">
          <h1>Karier mana yang paling ingin kamu tempuh?</h1>
          <p>Pilih satu. Pernyataan niat karier akan menanyakan karier ini, dan soft skill-mu dicocokkan dengan kebutuhannya.</p>
        </header>
        <div className="pilih-karier" role="radiogroup" aria-label="Karier pilihan">
          {karier.map((k) => (
            <label key={k.id} className={draf.karierId === k.id ? 'terpilih' : undefined}>
              <input type="radio" name="karier" checked={draf.karierId === k.id} onChange={() => setDraf((d) => ({ ...d, karierId: k.id }))} />
              <strong>{k.nama}</strong>
              <span>{k.deskripsi}</span>
              <small>{k.area_fungsi}</small>
            </label>
          ))}
        </div>
        <div className="lengket-bawah">
          <p>{pilihan ? <>Karier pilihan: <strong>{pilihan.nama}</strong></> : 'Belum ada karier yang dipilih.'}</p>
          <button type="button" className="tombol tombol--utama" disabled={!pilihan} onClick={() => { setTahap('kuesioner'); pindah(0); }}>
            {terjawab > 0 ? 'Lanjutkan kuesioner' : 'Lanjut ke kuesioner'}
          </button>
        </div>
      </div>
    );
  }

  const variabel = butirHalaman[0]?.variabel;
  return (
    <div className="halaman halaman--sempit" ref={atas}>
      <div className="kemajuan">
        <div className="kemajuan__teks">
          <span>{pilihan?.nama}</span>
          <span>{terjawab} dari {butir.length} terjawab</span>
        </div>
        <progress max={butir.length} value={terjawab} aria-label="Kemajuan kuesioner" />
      </div>
      <header className="halaman__kepala">
        <h1>{variabel ? LABEL_VARIABEL[variabel] : ''}</h1>
        <p>Jawab sesuai keadaanmu saat ini. Tidak ada jawaban benar atau salah.</p>
      </header>

      <ol className="butir" start={halaman * PER_HALAMAN + 1}>
        {butirHalaman.map((b) => (
          <li key={b.id}>
            <fieldset>
              <legend>{b.teks.replaceAll('[okupasi]', pilihan?.nama ?? 'karier pilihan')}</legend>
              <div className="likert">
                {SKALA.map((s, i) => (
                  <label key={s} className={draf.jawaban[b.id] === i + 1 ? 'terpilih' : undefined}>
                    <input
                      type="radio" name={`butir-${b.id}`} value={i + 1}
                      checked={draf.jawaban[b.id] === i + 1}
                      onChange={() => setDraf((d) => ({ ...d, jawaban: { ...d.jawaban, [b.id]: i + 1 } }))}
                    />
                    <b>{i + 1}</b>
                    <span>{s}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          </li>
        ))}
      </ol>

      {galat && <Galat pesan={galat} />}
      <div className="lengket-bawah">
        <button type="button" className="tombol" onClick={() => (halaman === 0 ? setTahap('karier') : pindah(halaman - 1))}>
          {halaman === 0 ? 'Ganti karier' : 'Sebelumnya'}
        </button>
        <span className="lengket-bawah__hal">Halaman {halaman + 1} dari {jumlahHalaman}</span>
        {halaman < jumlahHalaman - 1 ? (
          <button type="button" className="tombol tombol--utama" disabled={!halamanLengkap} onClick={() => pindah(halaman + 1)}>Lanjut</button>
        ) : (
          <button type="button" className="tombol tombol--utama" disabled={terjawab < butir.length} onClick={kirim}>Kirim jawaban</button>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, bulat, tanggal, type Asesmen, type RingkasAsesmen } from '../api';
import { useSesi } from '../auth';
import { Galat, Memuat } from '../components/ui';
import { RingkasanHasil } from './Hasil';

function Selisih({ kini, lalu }: { kini: number; lalu: number }) {
  const d = Math.round((kini - lalu) * 10) / 10;
  if (d === 0) return <span className="redup">tetap</span>;
  return <span className={d > 0 ? 'naik' : 'turun'}>{d > 0 ? '▲' : '▼'} {bulat(Math.abs(d))}</span>;
}

export default function Dasbor() {
  const { pengguna } = useSesi();
  const [daftar, setDaftar] = useState<RingkasAsesmen[] | null>(null);
  const [terbaru, setTerbaru] = useState<Asesmen | null>(null);
  const [galat, setGalat] = useState('');

  useEffect(() => {
    api<{ asesmen: RingkasAsesmen[] }>('/assessments')
      .then(async (d) => {
        setDaftar(d.asesmen);
        if (d.asesmen[0]) setTerbaru((await api<{ asesmen: Asesmen }>(`/assessments/${d.asesmen[0].id}`)).asesmen);
      })
      .catch((e) => setGalat(e.message));
  }, []);

  if (galat) return <Galat pesan={galat} />;
  if (!daftar) return <Memuat />;

  if (daftar.length === 0) {
    return (
      <div className="halaman halaman--sempit">
        <div className="kosong">
          <h1>Halo, {pengguna?.nama.split(' ')[0]}.</h1>
          <p>
            Kamu belum punya hasil asesmen. Pilih satu karier TIK, jawab 36 pernyataan, lalu lihat skor niat, soft skill, dan
            kesesuaianmu. Butuh sekitar 10 menit.
          </p>
          <Link className="tombol tombol--utama tombol--besar" to="/app/asesmen">Mulai asesmen</Link>
        </div>
      </div>
    );
  }

  const [kini, lalu] = daftar;
  return (
    <div className="halaman">
      <header className="halaman__kepala halaman__kepala--baris">
        <div>
          <h1>Arah kariermu</h1>
          <p>Asesmen terakhir {tanggal(kini.dibuatPada)}.</p>
        </div>
        <Link className="tombol tombol--utama" to="/app/asesmen">Ulangi asesmen</Link>
      </header>

      {terbaru ? <RingkasanHasil a={terbaru} /> : <Memuat />}

      <div className="dua-kolom">
        <section className="panel">
          <h2>Langkah berikutnya</h2>
          {terbaru && terbaru.hasil.prioritas.length > 0 ? (
            <ol className="prioritas prioritas--ringkas">
              {terbaru.hasil.prioritas.map((p) => (
                <li key={p.kode}><strong>{p.nama}</strong><p>{p.saran}</p></li>
              ))}
            </ol>
          ) : (
            <p>{terbaru?.hasil.rekomendasi.utama.teks}</p>
          )}
          <Link className="tombol" to={`/app/hasil/${kini.id}`}>Lihat hasil lengkap</Link>
        </section>
        <section className="panel">
          <h2>Perubahan dari asesmen sebelumnya</h2>
          {lalu ? (
            <table className="tabel tabel--rapat">
              <thead><tr><th>Skor</th><th className="angka">Sebelumnya</th><th className="angka">Sekarang</th><th className="angka">Perubahan</th></tr></thead>
              <tbody>
                {([['Niat karier (Y)', 'y'], ['Intrapersonal (X1)', 'x1'], ['Interpersonal (X2)', 'x2'], ['Soft Skill Fit Score', 'sfs']] as const).map(([label, k]) => (
                  <tr key={k}>
                    <th scope="row">{label}</th>
                    <td className="angka">{bulat(lalu[k])}</td>
                    <td className="angka">{bulat(kini[k])}</td>
                    <td className="angka"><Selisih kini={kini[k]} lalu={lalu[k]} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Ini asesmen pertamamu. Setelah mengembangkan soft skill prioritas, ulangi asesmen untuk melihat perubahannya di sini.</p>
          )}
          {lalu && lalu.karier !== kini.karier && <p className="catatan">Karier pilihan berubah dari {lalu.karier} ke {kini.karier}, sehingga SFS tidak sepenuhnya sebanding.</p>}
        </section>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, bulat, tanggal, type RingkasAsesmen } from '../api';
import { Galat, Memuat } from '../components/ui';

export default function Riwayat() {
  const [daftar, setDaftar] = useState<RingkasAsesmen[] | null>(null);
  const [galat, setGalat] = useState('');
  useEffect(() => {
    api<{ asesmen: RingkasAsesmen[] }>('/assessments').then((d) => setDaftar(d.asesmen)).catch((e) => setGalat(e.message));
  }, []);

  if (galat) return <Galat pesan={galat} />;
  if (!daftar) return <Memuat />;

  return (
    <div className="halaman">
      <header className="halaman__kepala">
        <h1>Riwayat asesmen</h1>
        <p>Semua asesmen yang pernah kamu kerjakan, dari yang terbaru.</p>
      </header>
      {daftar.length === 0 ? (
        <div className="kosong">
          <p>Belum ada asesmen. Hasil pertamamu akan muncul di sini.</p>
          <Link className="tombol tombol--utama" to="/app/asesmen">Mulai asesmen</Link>
        </div>
      ) : (
        <div className="panel tabel-gulir">
          <table className="tabel">
            <thead>
              <tr>
                <th>Tanggal</th><th>Karier pilihan</th>
                <th className="angka">Y</th><th className="angka">X1</th><th className="angka">X2</th><th className="angka">SFS</th>
                <th>Aturan</th><th>Status</th><th><span className="sr">Buka</span></th>
              </tr>
            </thead>
            <tbody>
              {daftar.map((a) => (
                <tr key={a.id}>
                  <td>{tanggal(a.dibuatPada)} <small>{a.jenis === 'awal' ? 'pertama' : 'ulang'}</small></td>
                  <th scope="row">{a.karier}</th>
                  <td className="angka">{bulat(a.y)}</td>
                  <td className="angka">{bulat(a.x1)}</td>
                  <td className="angka">{bulat(a.x2)}</td>
                  <td className="angka"><strong>{bulat(a.sfs)}</strong></td>
                  <td>{a.aturan}</td>
                  <td>{a.status}</td>
                  <td><Link to={`/app/hasil/${a.id}`}>Lihat hasil</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

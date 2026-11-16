import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { api, type Pengguna } from '../api';
import { useSesi } from '../auth';
import { Galat, Logo } from '../components/ui';

function Bingkai({ judul, sub, children }: { judul: string; sub: ReactNode; children: ReactNode }) {
  return (
    <div className="masuk">
      <Link to="/" aria-label="YourWay, ke halaman depan"><Logo /></Link>
      <div className="masuk__kartu">
        <h1>{judul}</h1>
        <p className="masuk__sub">{sub}</p>
        {children}
      </div>
    </div>
  );
}

function useSetelahMasuk() {
  const { setPengguna } = useSesi();
  const navigate = useNavigate();
  const lokasi = useLocation();
  return (p: Pengguna) => {
    setPengguna(p);
    const dari = (lokasi.state as { dari?: string } | null)?.dari;
    if (p.peran === 'admin') navigate('/admin', { replace: true });
    else navigate(dari && dari.startsWith('/app') ? dari : '/app', { replace: true });
  };
}

export function Masuk() {
  const { pengguna } = useSesi();
  const lokasi = useLocation();
  const selesai = useSetelahMasuk();
  const [galat, setGalat] = useState('');
  const [sibuk, setSibuk] = useState(false);

  if (pengguna) return <Navigate to={pengguna.peran === 'admin' ? '/admin' : '/app'} replace />;

  const kirim = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSibuk(true);
    setGalat('');
    try {
      const d = await api<{ pengguna: Pengguna }>('/auth/login', { body: { email: f.get('email'), password: f.get('password') } });
      selesai(d.pengguna);
    } catch (err) {
      setGalat((err as Error).message);
      setSibuk(false);
    }
  };

  return (
    <Bingkai judul="Masuk" sub={<>Belum punya akun? <Link to="/daftar" state={lokasi.state}>Daftar</Link></>}>
      <form onSubmit={kirim} className="formulir">
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Kata sandi<input name="password" type="password" autoComplete="current-password" required /></label>
        {galat && <Galat pesan={galat} />}
        <button className="tombol tombol--utama" disabled={sibuk}>{sibuk ? 'Memeriksa…' : 'Masuk'}</button>
      </form>
    </Bingkai>
  );
}

export function Daftar() {
  const { pengguna } = useSesi();
  const lokasi = useLocation();
  const selesai = useSetelahMasuk();
  const [galat, setGalat] = useState('');
  const [sibuk, setSibuk] = useState(false);

  if (pengguna) return <Navigate to={pengguna.peran === 'admin' ? '/admin' : '/app'} replace />;

  const kirim = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setSibuk(true);
    setGalat('');
    try {
      const d = await api<{ pengguna: Pengguna }>('/auth/register', {
        body: { nama: f.get('nama'), email: f.get('email'), password: f.get('password'), setuju: f.get('setuju') === 'on' },
      });
      selesai(d.pengguna);
    } catch (err) {
      setGalat((err as Error).message);
      setSibuk(false);
    }
  };

  return (
    <Bingkai judul="Buat akun mahasiswa" sub={<>Sudah punya akun? <Link to="/masuk" state={lokasi.state}>Masuk</Link></>}>
      <form onSubmit={kirim} className="formulir">
        <label>Nama<input name="nama" autoComplete="name" required minLength={2} maxLength={80} /></label>
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>
          Kata sandi
          <input name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={72} aria-describedby="petunjuk-sandi" />
          <small id="petunjuk-sandi">Minimal 8 karakter.</small>
        </label>
        <label className="centang">
          <input name="setuju" type="checkbox" required />
          <span>
            Saya setuju YourWay menyimpan nama, email, dan jawaban kuesioner saya untuk menghitung hasil asesmen. Hasil hanya bisa
            saya lihat sendiri, dan saya bisa menghapus akun kapan saja.
          </span>
        </label>
        {galat && <Galat pesan={galat} />}
        <button className="tombol tombol--utama" disabled={sibuk}>{sibuk ? 'Membuat akun…' : 'Buat akun'}</button>
      </form>
    </Bingkai>
  );
}

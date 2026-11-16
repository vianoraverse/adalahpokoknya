import { useEffect, useState } from 'react';
import { Navigate, NavLink, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useSesi } from './auth';
import { Logo, Memuat } from './components/ui';
import { AdminAkun, AdminButir, AdminModel, AdminProfil, AdminRingkasan } from './pages/Admin';
import Asesmen from './pages/Asesmen';
import { Daftar, Masuk } from './pages/Auth';
import Dasbor from './pages/Dasbor';
import HasilHalaman from './pages/Hasil';
import Landing from './pages/Landing';
import Pengaturan from './pages/Pengaturan';
import Riwayat from './pages/Riwayat';

const MENU = {
  mahasiswa: [
    ['/app', 'Dasbor'],
    ['/app/asesmen', 'Asesmen'],
    ['/app/riwayat', 'Riwayat'],
    ['/app/pengaturan', 'Pengaturan'],
  ],
  admin: [
    ['/admin', 'Ringkasan hasil'],
    ['/admin/butir', 'Butir kuesioner'],
    ['/admin/model', 'Bobot dan aturan'],
    ['/admin/profil-karier', 'Profil karier'],
    ['/admin/akun', 'Akun pengguna'],
    ['/admin/pengaturan', 'Pengaturan'],
  ],
} as const;

function Kerangka({ peran }: { peran: 'mahasiswa' | 'admin' }) {
  const { pengguna, memuat, keluar } = useSesi();
  const lokasi = useLocation();
  const navigate = useNavigate();
  const [buka, setBuka] = useState(false);
  useEffect(() => setBuka(false), [lokasi.pathname]);

  if (memuat) return <div className="tengah"><Memuat /></div>;
  if (!pengguna) return <Navigate to="/masuk" replace state={{ dari: lokasi.pathname }} />;
  if (pengguna.peran !== peran) return <Navigate to={pengguna.peran === 'admin' ? '/admin' : '/app'} replace />;

  return (
    <div className="kerangka">
      <aside className={`sisi${buka ? ' sisi--buka' : ''}`}>
        <div className="sisi__atas">
          <Logo />
          <button type="button" className="tombol-ikon sisi__menu" onClick={() => setBuka((b) => !b)} aria-expanded={buka} aria-controls="navigasi">
            {buka ? 'Tutup' : 'Menu'}
          </button>
        </div>
        <nav id="navigasi" aria-label="Navigasi utama">
          {MENU[peran].map(([ke, label]) => (
            <NavLink key={ke} to={ke} end={ke === '/app' || ke === '/admin'}>{label}</NavLink>
          ))}
        </nav>
        <div className="sisi__bawah">
          <p>
            <strong>{pengguna.nama}</strong>
            <span>{peran === 'admin' ? 'Operator Admin' : 'Mahasiswa'}</span>
          </p>
          <button type="button" className="tombol tombol--senyap" onClick={async () => { await keluar(); navigate('/'); }}>Keluar</button>
        </div>
      </aside>
      <main className="utama"><Outlet /></main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/masuk" element={<Masuk />} />
      <Route path="/daftar" element={<Daftar />} />
      <Route path="/app" element={<Kerangka peran="mahasiswa" />}>
        <Route index element={<Dasbor />} />
        <Route path="asesmen" element={<Asesmen />} />
        <Route path="hasil/:id" element={<HasilHalaman />} />
        <Route path="riwayat" element={<Riwayat />} />
        <Route path="pengaturan" element={<Pengaturan />} />
      </Route>
      <Route path="/admin" element={<Kerangka peran="admin" />}>
        <Route index element={<AdminRingkasan />} />
        <Route path="butir" element={<AdminButir />} />
        <Route path="model" element={<AdminModel />} />
        <Route path="profil-karier" element={<AdminProfil />} />
        <Route path="akun" element={<AdminAkun />} />
        <Route path="pengaturan" element={<Pengaturan />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

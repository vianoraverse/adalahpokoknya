import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, type Pengguna } from '../api';
import { useSesi } from '../auth';
import { Galat, Modal, useToast } from '../components/ui';

export default function Pengaturan() {
  const { pengguna, setPengguna } = useSesi();
  const toast = useToast();
  const navigate = useNavigate();
  const [hapus, setHapus] = useState(false);
  const [galatHapus, setGalatHapus] = useState('');

  const simpanProfil = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      const d = await api<{ pengguna: Pengguna }>('/auth/me', { method: 'PATCH', body: { nama: f.get('nama') } });
      setPengguna(d.pengguna);
      toast('Nama disimpan.');
    } catch (err) { toast((err as Error).message, 'galat'); }
  };

  const gantiSandi = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    try {
      await api('/auth/me', { method: 'PATCH', body: { passwordLama: f.get('lama'), passwordBaru: f.get('baru') } });
      form.reset();
      toast('Kata sandi diganti.');
    } catch (err) { toast((err as Error).message, 'galat'); }
  };

  const hapusAkun = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    try {
      await api('/auth/me', { method: 'DELETE', body: { password: f.get('password') } });
      setPengguna(null);
      navigate('/');
    } catch (err) { setGalatHapus((err as Error).message); }
  };

  return (
    <div className="halaman halaman--sempit">
      <header className="halaman__kepala"><h1>Pengaturan</h1></header>

      <section className="panel">
        <h2>Profil</h2>
        <form className="formulir" onSubmit={simpanProfil}>
          <label>Nama<input name="nama" defaultValue={pengguna?.nama} required minLength={2} maxLength={80} /></label>
          <label>Email<input value={pengguna?.email ?? ''} readOnly disabled /></label>
          <button className="tombol tombol--utama">Simpan nama</button>
        </form>
      </section>

      <section className="panel">
        <h2>Kata sandi</h2>
        <form className="formulir" onSubmit={gantiSandi}>
          <label>Kata sandi lama<input name="lama" type="password" autoComplete="current-password" required /></label>
          <label>Kata sandi baru<input name="baru" type="password" autoComplete="new-password" required minLength={8} maxLength={72} /><small>Minimal 8 karakter.</small></label>
          <button className="tombol tombol--utama">Ganti kata sandi</button>
        </form>
      </section>

      <section className="panel panel--bahaya">
        <h2>Hapus akun</h2>
        <p>Akun, jawaban, dan seluruh hasil asesmenmu dihapus permanen dan tidak bisa dikembalikan.</p>
        <button type="button" className="tombol tombol--bahaya" onClick={() => { setGalatHapus(''); setHapus(true); }}>Hapus akun</button>
      </section>

      {hapus && (
        <Modal judul="Hapus akun ini?" tutup={() => setHapus(false)}>
          <form className="formulir" onSubmit={hapusAkun}>
            <p>Masukkan kata sandi untuk menghapus akun beserta seluruh datanya secara permanen.</p>
            <label>Kata sandi<input name="password" type="password" autoComplete="current-password" required autoFocus /></label>
            {galatHapus && <Galat pesan={galatHapus} />}
            <div className="formulir__aksi">
              <button type="button" className="tombol" onClick={() => setHapus(false)}>Batal</button>
              <button className="tombol tombol--bahaya">Hapus akun</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

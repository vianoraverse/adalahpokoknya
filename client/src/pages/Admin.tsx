import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { api, bulat, tanggal, type Karier } from '../api';
import { useSesi } from '../auth';
import { Batang } from '../components/charts';
import { Galat, Memuat, Modal, useToast } from '../components/ui';

function useData<T>(path: string) {
  const [data, setData] = useState<T | null>(null);
  const [galat, setGalat] = useState('');
  const muat = useCallback(() => {
    api<T>(path).then(setData).catch((e) => setGalat(e.message));
  }, [path]);
  useEffect(() => { setData(null); muat(); }, [muat]);
  return { data, galat, muat };
}

const angka = (v: FormDataEntryValue | null) => Number(String(v).replace(',', '.'));

/* ---------- Ringkasan hasil agregat (UC-10) ---------- */

interface Agregat {
  mahasiswa: number; asesmen: number; responden: number; selaras: number | null;
  y: number | null; x1: number | null; x2: number | null; sfs: number | null;
  aturan: Array<{ kode: string; n: number }>;
  karier: Array<{ nama: string; n: number; sfs: number | null; y: number | null }>;
  indikator: Array<{ nama: string; variabel: string; rata: number }>;
}

export function AdminRingkasan() {
  const { data, galat } = useData<Agregat>('/admin/aggregate');
  if (galat) return <Galat pesan={galat} />;
  if (!data) return <Memuat />;
  const softSkill = data.indikator.filter((i) => i.variabel !== 'Y').sort((a, b) => a.rata - b.rata);
  return (
    <div className="halaman">
      <header className="halaman__kepala">
        <h1>Ringkasan hasil</h1>
        <p>Data gabungan tanpa nama, dihitung dari asesmen terbaru setiap mahasiswa.</p>
      </header>
      <dl className="angka-besar">
        <div><dt>Akun mahasiswa</dt><dd>{data.mahasiswa}</dd></div>
        <div><dt>Mahasiswa yang sudah asesmen</dt><dd>{data.responden}</dd></div>
        <div><dt>Total asesmen</dt><dd>{data.asesmen}</dd></div>
        <div><dt>Pilihan selaras dengan profil</dt><dd>{data.responden ? `${data.selaras ?? 0} dari ${data.responden}` : '–'}</dd></div>
      </dl>
      {data.responden === 0 ? (
        <div className="kosong"><p>Belum ada mahasiswa yang menyelesaikan asesmen. Ringkasan akan muncul setelah asesmen pertama masuk.</p></div>
      ) : (
        <>
          <div className="dua-kolom">
            <section className="panel">
              <h2>Rata-rata skor</h2>
              <ul className="niat">
                {([['Niat karier (Y)', data.y], ['Intrapersonal (X1)', data.x1], ['Interpersonal (X2)', data.x2], ['Soft Skill Fit Score', data.sfs]] as const).map(([l, v]) => (
                  <li key={l}><span>{l}</span><Batang nilai={v ?? 0} /><strong>{bulat(v)}</strong></li>
                ))}
              </ul>
            </section>
            <section className="panel">
              <h2>Sebaran aturan rekomendasi</h2>
              <ul className="niat">
                {['R1', 'R2', 'R3', 'R4'].map((k) => {
                  const n = data.aturan.find((a) => a.kode === k)?.n ?? 0;
                  return <li key={k}><span>{k}</span><Batang nilai={(n / data.responden) * 100} /><strong>{n}</strong></li>;
                })}
              </ul>
            </section>
          </div>
          <div className="dua-kolom">
            <section className="panel">
              <h2>Rata-rata soft skill</h2>
              <p className="panel__sub">Diurutkan dari yang paling rendah.</p>
              <ul className="niat niat--lebar">
                {softSkill.map((i) => <li key={i.nama}><span>{i.nama}</span><Batang nilai={i.rata} /><strong>{bulat(i.rata)}</strong></li>)}
              </ul>
            </section>
            <section className="panel tabel-gulir">
              <h2>Karier pilihan</h2>
              <table className="tabel tabel--rapat">
                <thead><tr><th>Karier</th><th className="angka">Pemilih</th><th className="angka">Rata Y</th><th className="angka">Rata SFS</th></tr></thead>
                <tbody>
                  {data.karier.map((k) => (
                    <tr key={k.nama}><th scope="row">{k.nama}</th><td className="angka">{k.n}</td><td className="angka">{bulat(k.y)}</td><td className="angka">{bulat(k.sfs)}</td></tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

/* ---------- Butir kuesioner (UC-06) ---------- */

interface Indikator { id: number; kode: string; nama: string; variabel: string; bobot: number; saran: string }
interface Butir { id: number; teks: string; dasar: string; aktif: boolean; indikator_id: number; indikator: string; variabel: string }

export function AdminButir() {
  const { data, galat, muat } = useData<{ butir: Butir[]; indikator: Indikator[] }>('/admin/items');
  const toast = useToast();
  const [sunting, setSunting] = useState<Partial<Butir> | null>(null);
  const [saring, setSaring] = useState('');

  if (galat) return <Galat pesan={galat} />;
  if (!data) return <Memuat />;

  const simpan = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = { indikatorId: Number(f.get('indikator')) || undefined, teks: f.get('teks'), dasar: f.get('dasar'), aktif: f.get('aktif') === 'on' };
    try {
      if (sunting?.id) await api(`/admin/items/${sunting.id}`, { method: 'PUT', body });
      else await api('/admin/items', { body });
      toast(sunting?.id ? 'Butir disimpan.' : 'Butir ditambahkan.');
      setSunting(null);
      muat();
    } catch (err) { toast((err as Error).message, 'galat'); }
  };

  const hapus = async (b: Butir) => {
    if (!window.confirm(`Hapus butir "${b.teks}"?`)) return;
    try {
      const r = await api<{ dinonaktifkan: boolean }>(`/admin/items/${b.id}`, { method: 'DELETE' });
      toast(r.dinonaktifkan ? 'Butir sudah pernah dijawab, jadi dinonaktifkan agar riwayat tetap utuh.' : 'Butir dihapus.');
      muat();
    } catch (err) { toast((err as Error).message, 'galat'); }
  };

  const tampil = data.butir.filter((b) => !saring || b.variabel === saring);
  return (
    <div className="halaman">
      <header className="halaman__kepala halaman__kepala--baris">
        <div>
          <h1>Butir kuesioner</h1>
          <p>{data.butir.filter((b) => b.aktif).length} butir aktif. Tulis [okupasi] pada butir niat karier agar diganti dengan karier pilihan mahasiswa.</p>
        </div>
        <button type="button" className="tombol tombol--utama" onClick={() => setSunting({ aktif: true })}>Tambah butir</button>
      </header>
      <div className="saring" role="group" aria-label="Saring variabel">
        {[['', 'Semua'], ['Y', 'Niat karier (Y)'], ['X1', 'Intrapersonal (X1)'], ['X2', 'Interpersonal (X2)']].map(([v, l]) => (
          <button key={v} type="button" aria-pressed={saring === v} onClick={() => setSaring(v)}>{l}</button>
        ))}
      </div>
      <div className="panel tabel-gulir">
        <table className="tabel">
          <thead><tr><th>ID</th><th>Indikator</th><th>Teks pertanyaan</th><th>Dasar</th><th>Status</th><th><span className="sr">Aksi</span></th></tr></thead>
          <tbody>
            {tampil.map((b) => (
              <tr key={b.id} className={b.aktif ? undefined : 'baris-redup'}>
                <td className="angka">{b.id}</td>
                <td>{b.indikator} <small>{b.variabel}</small></td>
                <td>{b.teks}</td>
                <td><small>{b.dasar}</small></td>
                <td>{b.aktif ? 'Aktif' : 'Nonaktif'}</td>
                <td className="aksi">
                  <button type="button" className="tautan" onClick={() => setSunting(b)}>Ubah</button>
                  <button type="button" className="tautan tautan--bahaya" onClick={() => hapus(b)}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sunting && (
        <Modal judul={sunting.id ? 'Ubah butir' : 'Tambah butir'} tutup={() => setSunting(null)}>
          <form className="formulir" onSubmit={simpan} noValidate>
            <label>
              Indikator
              <select name="indikator" defaultValue={sunting.indikator_id ?? ''}>
                <option value="">Pilih indikator</option>
                {data.indikator.map((i) => <option key={i.id} value={i.id}>{i.variabel}: {i.nama}</option>)}
              </select>
            </label>
            <label>Teks pertanyaan<textarea name="teks" rows={3} defaultValue={sunting.teks} maxLength={500} /></label>
            <label>Dasar sumber<input name="dasar" defaultValue={sunting.dasar} maxLength={200} /></label>
            <label className="centang"><input type="checkbox" name="aktif" defaultChecked={sunting.aktif ?? true} /><span>Tampilkan pada kuesioner</span></label>
            <div className="formulir__aksi">
              <button type="button" className="tombol" onClick={() => setSunting(null)}>Batal</button>
              <button className="tombol tombol--utama">{sunting.id ? 'Simpan butir' : 'Tambah butir'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ---------- Bobot, ambang, dan aturan (UC-07) ---------- */

interface Model {
  indikator: Indikator[];
  pengaturan: Array<{ kunci: string; nilai: number; keterangan: string }>;
  aturan: Array<{ kode: string; kondisi: string; interpretasi: string; jenis: string; teks: string }>;
}

export function AdminModel() {
  const { data, galat, muat } = useData<Model>('/admin/model');
  const toast = useToast();
  const [ind, setInd] = useState<Indikator | null>(null);
  const [atr, setAtr] = useState<Model['aturan'][number] | null>(null);

  if (galat) return <Galat pesan={galat} />;
  if (!data) return <Memuat />;

  const jalankan = async (fn: () => Promise<unknown>, pesan: string, tutup?: () => void) => {
    try { await fn(); toast(pesan); tutup?.(); muat(); } catch (err) { toast((err as Error).message, 'galat'); }
  };

  const simpanAmbang = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = Object.fromEntries(data.pengaturan.map((p) => [p.kunci, angka(f.get(p.kunci))]));
    jalankan(() => api('/admin/settings', { method: 'PUT', body }), 'Ambang disimpan.');
  };

  return (
    <div className="halaman">
      <header className="halaman__kepala">
        <h1>Bobot dan aturan</h1>
        <p>Perubahan berlaku untuk asesmen berikutnya. Hasil yang sudah tersimpan tidak dihitung ulang.</p>
      </header>

      <section className="panel">
        <h2>Ambang</h2>
        <form className="ambang" onSubmit={simpanAmbang}>
          {data.pengaturan.map((p) => (
            <label key={p.kunci}>{p.keterangan}<input name={p.kunci} type="number" min={0} max={100} step="1" defaultValue={p.nilai} required /></label>
          ))}
          <button className="tombol tombol--utama">Simpan ambang</button>
        </form>
      </section>

      <section className="panel tabel-gulir">
        <h2>Bobot indikator</h2>
        <p className="panel__sub">Bobot dipakai saat menggabungkan indikator menjadi skor Y, X1, dan X2. Bobot sama berarti rata-rata biasa.</p>
        <table className="tabel tabel--rapat">
          <thead><tr><th>Variabel</th><th>Indikator</th><th className="angka">Bobot</th><th>Saran pengembangan</th><th><span className="sr">Aksi</span></th></tr></thead>
          <tbody>
            {data.indikator.map((i) => (
              <tr key={i.id}>
                <td>{i.variabel}</td><th scope="row">{i.nama}</th><td className="angka">{i.bobot}</td><td><small>{i.saran || '–'}</small></td>
                <td className="aksi"><button type="button" className="tautan" onClick={() => setInd(i)}>Ubah</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="panel tabel-gulir">
        <h2>Aturan rekomendasi</h2>
        <table className="tabel tabel--rapat">
          <thead><tr><th>Kode</th><th>Kondisi</th><th>Interpretasi</th><th>Jenis rekomendasi</th><th>Teks untuk mahasiswa</th><th><span className="sr">Aksi</span></th></tr></thead>
          <tbody>
            {data.aturan.map((a) => (
              <tr key={a.kode}>
                <th scope="row">{a.kode}</th><td><small>{a.kondisi}</small></td><td>{a.interpretasi}</td><td>{a.jenis}</td><td><small>{a.teks}</small></td>
                <td className="aksi"><button type="button" className="tautan" onClick={() => setAtr(a)}>Ubah</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {ind && (
        <Modal judul={`Ubah ${ind.nama}`} tutup={() => setInd(null)}>
          <form className="formulir" noValidate onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            jalankan(() => api(`/admin/indicators/${ind.id}`, { method: 'PUT', body: { bobot: angka(f.get('bobot')), saran: f.get('saran') } }), 'Indikator disimpan.', () => setInd(null));
          }}>
            <label>Bobot<input name="bobot" type="number" step="0.1" min="0.1" defaultValue={ind.bobot} /></label>
            {ind.variabel !== 'Y' && <label>Saran pengembangan<textarea name="saran" rows={3} defaultValue={ind.saran} maxLength={500} /></label>}
            <div className="formulir__aksi">
              <button type="button" className="tombol" onClick={() => setInd(null)}>Batal</button>
              <button className="tombol tombol--utama">Simpan indikator</button>
            </div>
          </form>
        </Modal>
      )}
      {atr && (
        <Modal judul={`Ubah aturan ${atr.kode}`} tutup={() => setAtr(null)}>
          <form className="formulir" noValidate onSubmit={(e) => {
            e.preventDefault();
            const f = new FormData(e.currentTarget);
            jalankan(() => api(`/admin/rules/${atr.kode}`, { method: 'PUT', body: { interpretasi: f.get('interpretasi'), jenis: f.get('jenis'), teks: f.get('teks') } }), 'Aturan disimpan.', () => setAtr(null));
          }}>
            <p className="catatan">Kondisi: {atr.kondisi}. Nilai ambangnya diatur pada bagian Ambang.</p>
            <label>Interpretasi<input name="interpretasi" defaultValue={atr.interpretasi} maxLength={200} /></label>
            <label>Jenis rekomendasi<input name="jenis" defaultValue={atr.jenis} maxLength={200} /></label>
            <label>Teks untuk mahasiswa<textarea name="teks" rows={4} defaultValue={atr.teks} maxLength={800} /></label>
            <div className="formulir__aksi">
              <button type="button" className="tombol" onClick={() => setAtr(null)}>Batal</button>
              <button className="tombol tombol--utama">Simpan aturan</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

/* ---------- Profil kebutuhan soft skill per karier (UC-08) ---------- */

interface BarisProfil { indikator_id: number; nama: string; variabel: string; req: number | null; bobot: number | null }

export function AdminProfil() {
  const { data: karier, galat } = useData<{ karier: Karier[] }>('/careers');
  const [karierId, setKarierId] = useState<number | null>(null);
  const [baris, setBaris] = useState<Array<{ indikatorId: number; nama: string; variabel: string; req: string; bobot: string }> | null>(null);
  const toast = useToast();

  useEffect(() => { if (karier && karierId === null) setKarierId(karier.karier[0]?.id ?? null); }, [karier, karierId]);
  useEffect(() => {
    if (karierId === null) return;
    setBaris(null);
    api<{ profil: BarisProfil[] }>(`/admin/profiles/${karierId}`)
      .then((d) => setBaris(d.profil.map((p) => ({ indikatorId: p.indikator_id, nama: p.nama, variabel: p.variabel, req: String(p.req ?? 50), bobot: ((p.bobot ?? 0) * 100).toFixed(1) }))))
      .catch((e) => toast(e.message, 'galat'));
  }, [karierId, toast]);

  if (galat) return <Galat pesan={galat} />;
  if (!karier) return <Memuat />;

  const total = baris?.reduce((a, b) => a + (Number(b.bobot) || 0), 0) ?? 0;
  const ubah = (i: number, kunci: 'req' | 'bobot', v: string) => setBaris((b) => b!.map((x, j) => (j === i ? { ...x, [kunci]: v } : x)));

  const simpan = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await api(`/admin/profiles/${karierId}`, { method: 'PUT', body: { baris: baris!.map((b) => ({ indikatorId: b.indikatorId, req: Number(b.req), bobot: Number(b.bobot) })) } });
      toast('Profil karier disimpan.');
    } catch (err) { toast((err as Error).message, 'galat'); }
  };

  return (
    <div className="halaman">
      <header className="halaman__kepala">
        <h1>Profil karier</h1>
        <p>Level kebutuhan (0–100) dan bobot kepentingan tiap soft skill untuk satu karier, pada jenjang awal.</p>
      </header>
      <p className="pemberitahuan">
        Nilai bawaan adalah data awal ilustratif. Ganti dengan hasil pemetaan lowongan kerja 2026: level 80 untuk soft skill yang muncul
        pada ≥ 60% lowongan, 65 untuk 30–59%, 50 untuk 10–29%, dan 35 untuk di bawah 10%. Bobot adalah frekuensi indikator dibagi jumlah frekuensi.
      </p>
      <form className="panel" onSubmit={simpan}>
        <label className="pilih-lebar">
          Karier
          <select value={karierId ?? ''} onChange={(e) => setKarierId(Number(e.target.value))}>
            {karier.karier.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
          </select>
        </label>
        {!baris ? <Memuat /> : (
          <>
            <div className="tabel-gulir">
              <table className="tabel tabel--rapat">
                <thead><tr><th>Variabel</th><th>Indikator</th><th className="angka">Level kebutuhan</th><th className="angka">Bobot (%)</th></tr></thead>
                <tbody>
                  {baris.map((b, i) => (
                    <tr key={b.indikatorId}>
                      <td>{b.variabel}</td>
                      <th scope="row">{b.nama}</th>
                      <td className="angka"><input className="sel-angka" type="number" min={0} max={100} step="1" value={b.req} onChange={(e) => ubah(i, 'req', e.target.value)} aria-label={`Level kebutuhan ${b.nama}`} required /></td>
                      <td className="angka"><input className="sel-angka" type="number" min={0} step="0.1" value={b.bobot} onChange={(e) => ubah(i, 'bobot', e.target.value)} aria-label={`Bobot ${b.nama}`} required /></td>
                    </tr>
                  ))}
                </tbody>
                <tfoot><tr><th colSpan={3} scope="row">Jumlah bobot</th><td className="angka"><strong>{total.toFixed(1)}%</strong></td></tr></tfoot>
              </table>
            </div>
            <p className="catatan">Bila jumlah bobot tidak 100%, sistem menormalkannya secara proporsional saat disimpan.</p>
            <button className="tombol tombol--utama">Simpan profil karier</button>
          </>
        )}
      </form>
    </div>
  );
}

/* ---------- Akun pengguna (UC-09) ---------- */

interface Akun { id: number; nama: string; email: string; peran: 'mahasiswa' | 'admin'; aktif: boolean; dibuatPada: string; jumlahAsesmen: number }

export function AdminAkun() {
  const { data, galat, muat } = useData<{ pengguna: Akun[] }>('/admin/users');
  const { pengguna: saya } = useSesi();
  const toast = useToast();
  const [sunting, setSunting] = useState<Partial<Akun> | null>(null);

  if (galat) return <Galat pesan={galat} />;
  if (!data) return <Memuat />;

  const simpan = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = { nama: f.get('nama'), email: f.get('email'), peran: f.get('peran'), aktif: f.get('aktif') === 'on', password: String(f.get('password') ?? '') || undefined };
    try {
      if (sunting?.id) await api(`/admin/users/${sunting.id}`, { method: 'PUT', body });
      else await api('/admin/users', { body });
      toast(sunting?.id ? 'Akun disimpan.' : 'Akun ditambahkan.');
      setSunting(null);
      muat();
    } catch (err) { toast((err as Error).message, 'galat'); }
  };

  const hapus = async (a: Akun) => {
    if (!window.confirm(`Hapus akun ${a.nama} beserta seluruh asesmennya? Tindakan ini tidak bisa dibatalkan.`)) return;
    try { await api(`/admin/users/${a.id}`, { method: 'DELETE' }); toast('Akun dihapus.'); muat(); } catch (err) { toast((err as Error).message, 'galat'); }
  };

  return (
    <div className="halaman">
      <header className="halaman__kepala halaman__kepala--baris">
        <div>
          <h1>Akun pengguna</h1>
          <p>Hasil asesmen perorangan tidak ditampilkan di sini. Hanya pemilik akun yang bisa melihatnya.</p>
        </div>
        <button type="button" className="tombol tombol--utama" onClick={() => setSunting({ peran: 'mahasiswa', aktif: true })}>Tambah akun</button>
      </header>
      <div className="panel tabel-gulir">
        <table className="tabel">
          <thead><tr><th>Nama</th><th>Email</th><th>Peran</th><th>Status</th><th className="angka">Asesmen</th><th>Terdaftar</th><th><span className="sr">Aksi</span></th></tr></thead>
          <tbody>
            {data.pengguna.map((a) => (
              <tr key={a.id} className={a.aktif ? undefined : 'baris-redup'}>
                <th scope="row">{a.nama}{a.id === saya?.id && <small> (kamu)</small>}</th>
                <td>{a.email}</td>
                <td>{a.peran === 'admin' ? 'Operator Admin' : 'Mahasiswa'}</td>
                <td>{a.aktif ? 'Aktif' : 'Nonaktif'}</td>
                <td className="angka">{a.jumlahAsesmen}</td>
                <td>{tanggal(a.dibuatPada)}</td>
                <td className="aksi">
                  <button type="button" className="tautan" onClick={() => setSunting(a)}>Ubah</button>
                  {a.id !== saya?.id && <button type="button" className="tautan tautan--bahaya" onClick={() => hapus(a)}>Hapus</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sunting && (
        <Modal judul={sunting.id ? 'Ubah akun' : 'Tambah akun'} tutup={() => setSunting(null)}>
          <form className="formulir" onSubmit={simpan} noValidate>
            <label>Nama<input name="nama" defaultValue={sunting.nama} maxLength={80} /></label>
            <label>Email<input name="email" type="email" defaultValue={sunting.email} /></label>
            <label>
              Peran
              <select name="peran" defaultValue={sunting.peran}>
                <option value="mahasiswa">Mahasiswa</option>
                <option value="admin">Operator Admin</option>
              </select>
            </label>
            <label>
              {sunting.id ? 'Kata sandi baru' : 'Kata sandi'}
              <input name="password" type="password" autoComplete="new-password" />
              <small>{sunting.id ? 'Kosongkan bila tidak diganti. Minimal 8 karakter.' : 'Minimal 8 karakter.'}</small>
            </label>
            <label className="centang"><input type="checkbox" name="aktif" defaultChecked={sunting.aktif ?? true} /><span>Akun aktif dan bisa masuk</span></label>
            <div className="formulir__aksi">
              <button type="button" className="tombol" onClick={() => setSunting(null)}>Batal</button>
              <button className="tombol tombol--utama">{sunting.id ? 'Simpan akun' : 'Tambah akun'}</button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

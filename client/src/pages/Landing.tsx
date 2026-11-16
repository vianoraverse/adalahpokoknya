import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, type Karier } from '../api';
import { useSesi } from '../auth';
import { Logo } from '../components/ui';

const X1 = ['Critical Thinking', 'Problem Solving', 'Creativity', 'Ethical Analysis', 'Self-development', 'Flexibility', 'Discipline'];
const X2 = ['Collaboration and Teamwork', 'Oral Communication', 'Written Communication', 'Negotiation', 'Leadership', 'Intercultural Competency', 'Conflict Management'];
const Y = ['Minat', 'Rencana', 'Usaha persiapan', 'Kemantapan pilihan'];

const LANGKAH = [
  ['Pilih satu karier', 'Tentukan karier TIK yang paling ingin kamu tempuh dari 16 pilihan pada Peta Okupasi Kominfo.'],
  ['Isi 36 pernyataan', 'Jawab dengan skala 1 sampai 5: 8 pernyataan niat karier dan 28 pernyataan soft skill. Sekitar 10 menit.'],
  ['Lihat skor dan kesesuaian', 'Sistem menghitung skor niat, soft skill, dan Soft Skill Fit Score terhadap karier pilihanmu dan 15 karier lainnya.'],
  ['Kembangkan yang paling berpengaruh', 'Kamu mendapat tiga soft skill prioritas beserta langkah pengembangannya, dengan penjelasan yang mudah dibaca.'],
];

const ATURAN = [
  ['R1', 'Y ≥ 75 dan SFS ≥ 75', 'Niat mantap dan selaras', 'Pengayaan dan tantangan lanjutan'],
  ['R2', 'Y ≥ 75 dan SFS < 75', 'Niat kuat, soft skill perlu dikembangkan', 'Prioritas 3 indikator dengan selisih terbesar'],
  ['R3', 'Y < 75 dan SFS ≥ 75', 'Potensi selaras, niat belum mantap', 'Eksplorasi karier dan informasi karier'],
  ['R4', 'Y < 75 dan SFS < 75', 'Perlu eksplorasi dan penguatan dasar', 'Karier alternatif dan pengembangan dasar'],
];

const PRIVASI = [
  'Kami meminta persetujuanmu sebelum data dikumpulkan.',
  'Data yang diminta hanya nama, email, dan jawaban kuesioner.',
  'Kata sandi disimpan dalam bentuk hash Bcrypt, bukan teks biasa.',
  'Hasil asesmen hanya bisa dibuka oleh pemilik akun. Admin hanya melihat data gabungan tanpa nama.',
  'Kamu bisa menghapus akun beserta seluruh datanya kapan saja.',
];

export default function Landing() {
  const [karier, setKarier] = useState<Karier[]>([]);
  const { pengguna } = useSesi();
  const navigate = useNavigate();

  useEffect(() => {
    api<{ karier: Karier[] }>('/careers').then((d) => setKarier(d.karier)).catch(() => {});
  }, []);

  const mulai = (kode?: string) => {
    const tujuan = `/app/asesmen${kode ? `?karier=${kode}` : ''}`;
    if (pengguna?.peran === 'mahasiswa') navigate(tujuan);
    else if (pengguna?.peran === 'admin') navigate('/admin');
    else navigate('/daftar', { state: { dari: tujuan } });
  };

  return (
    <div className="depan">
      <header className="depan__hero">
        <nav className="depan__nav" aria-label="Navigasi situs">
          <Logo terang />
          <div>
            {pengguna ? (
              <Link className="tombol tombol--terang" to={pengguna.peran === 'admin' ? '/admin' : '/app'}>Buka dasbor</Link>
            ) : (
              <>
                <Link className="tautan-terang" to="/masuk">Masuk</Link>
                <Link className="tombol tombol--terang" to="/daftar">Daftar</Link>
              </>
            )}
          </div>
        </nav>
        <div className="depan__judul">
          <h1>Setelah lulus, kamu mau jadi apa?</h1>
          <p>
            YourWay mengukur seberapa kuat niatmu pada satu karier TIK dan seberapa cocok soft skill-mu dengan kebutuhan karier itu.
            Hasilnya berupa angka yang bisa kamu telusuri, bukan tebakan.
          </p>
        </div>
        <section aria-labelledby="pilih-karier" className="depan__karier">
          <h2 id="pilih-karier">Pilih satu karier untuk mulai</h2>
          <ul>
            {karier.map((k) => (
              <li key={k.id}>
                <button type="button" onClick={() => mulai(k.kode)}>
                  <strong>{k.nama}</strong>
                  <span>{k.area_fungsi}</span>
                </button>
              </li>
            ))}
          </ul>
          <p className="depan__catatan">16 karier jenjang awal (KKNI 5–6), diadaptasi dari Peta Okupasi Nasional bidang TIK, Kominfo (2017).</p>
        </section>
      </header>

      <main>
        <section className="bagian" aria-labelledby="cara-kerja">
          <h2 id="cara-kerja">Cara kerjanya</h2>
          <ol className="langkah">
            {LANGKAH.map(([judul, isi]) => (
              <li key={judul}>
                <h3>{judul}</h3>
                <p>{isi}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="bagian bagian--dua" aria-labelledby="yang-diukur">
          <div>
            <h2 id="yang-diukur">Tiga hal yang diukur</h2>
            <p>
              Niat karier menjadi pusat model, mengadaptasi konstruk <i>behavioral intention</i> pada TAM/UTAUT. Soft skill mengikuti
              MSIS 2016 dan ASEC (2016). Hard skill sengaja tidak diukur agar hasilnya tidak tumpang tindih dengan tes kesiapan kerja.
            </p>
          </div>
          <div className="variabel">
            <article>
              <h3><span>Y</span> Niat karier</h3>
              <p>Kecenderungan dan komitmenmu menempuh karier pilihan.</p>
              <ul>{Y.map((x) => <li key={x}>{x}</li>)}</ul>
            </article>
            <article>
              <h3><span>X1</span> Soft skill intrapersonal</h3>
              <p>Cara kamu mengelola pikiran, sikap, dan perilaku sendiri.</p>
              <ul>{X1.map((x) => <li key={x}>{x}</li>)}</ul>
            </article>
            <article>
              <h3><span>X2</span> Soft skill interpersonal</h3>
              <p>Cara kamu berinteraksi dan bekerja dengan orang lain.</p>
              <ul>{X2.map((x) => <li key={x}>{x}</li>)}</ul>
            </article>
          </div>
        </section>

        <section className="bagian bagian--dua" aria-labelledby="cara-hitung">
          <div>
            <h2 id="cara-hitung">Hitungannya terbuka</h2>
            <p>
              Skor dan rekomendasi ditentukan oleh rumus dan aturan, tanpa machine learning. AI hanya merangkai penjelasan dari hasil
              yang sudah dihitung, dan tidak menerima identitasmu.
            </p>
            <dl className="rumus">
              <div><dt>Normalisasi jawaban</dt><dd>x′ = (x − 1) / 4 × 100</dd></div>
              <div><dt>Selisih per indikator</dt><dd>Gap = max(Kebutuhan − Skor, 0)</dd></div>
              <div><dt>Soft Skill Fit Score</dt><dd>SFS = 100 − Σ (bobot × Gap)</dd></div>
            </dl>
          </div>
          <div className="tabel-gulir">
            <table className="tabel">
              <caption>Aturan rekomendasi berdasarkan niat (Y) dan kesesuaian (SFS)</caption>
              <thead><tr><th>Aturan</th><th>Kondisi</th><th>Artinya</th><th>Rekomendasi</th></tr></thead>
              <tbody>
                {ATURAN.map((a) => (
                  <tr key={a[0]}><th scope="row">{a[0]}</th><td className="angka">{a[1]}</td><td>{a[2]}</td><td>{a[3]}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="bagian bagian--dua" aria-labelledby="privasi">
          <div>
            <h2 id="privasi">Datamu tetap milikmu</h2>
            <p>YourWay mengikuti prinsip Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi.</p>
          </div>
          <ul className="daftar-centang">{PRIVASI.map((p) => <li key={p}>{p}</li>)}</ul>
        </section>

        <section className="ajakan">
          <h2>Butuh sekitar 10 menit</h2>
          <p>Kamu bisa mengulang asesmen kapan saja untuk melihat perkembanganmu.</p>
          <button type="button" className="tombol tombol--utama tombol--besar" onClick={() => mulai()}>Mulai asesmen</button>
        </section>
      </main>

      <footer className="kaki">
        <Logo />
        <p>
          Proyek Rekayasa Perangkat Lunak, Kelompok 4: Alexa Serrafona Juliet, Fina Hidayati, Giska Sisilia Putri, Salwa Syaharani Putri,
          dan Vida Maulida Nurul Ihsan.
        </p>
        <p>Program Studi Teknik Informatika, Fakultas Sains dan Teknologi, UIN Syarif Hidayatullah Jakarta, 2026.</p>
      </footer>
    </div>
  );
}

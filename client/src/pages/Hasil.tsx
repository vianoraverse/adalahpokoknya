import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, bulat, LABEL_VARIABEL, tanggal, type Asesmen } from '../api';
import { Batang, Cincin, DaftarSfs, Radar } from '../components/charts';
import { Galat, LencanaKategori, Memuat } from '../components/ui';

export function RingkasanHasil({ a }: { a: Asesmen }) {
  const h = a.hasil;
  return (
    <section className="panel hasil-utama" aria-label="Ringkasan hasil">
      <div className="hasil-utama__teks">
        <p className="hasil-utama__karier">{a.karier.nama}</p>
        <h2>{h.rekomendasi.utama.interpretasi}</h2>
        <p>
          {h.status === 'Selaras'
            ? 'Dari 16 karier, karier pilihanmu adalah yang paling selaras dengan profil soft skill-mu.'
            : <>Karier yang paling selaras dengan profil soft skill-mu adalah <strong>{h.karierTeratas.nama}</strong> (SFS {bulat(h.karierTeratas.sfs)}).</>}
        </p>
        <p className="lencana-baris">
          <span className={`lencana lencana--${h.status === 'Selaras' ? 'tinggi' : 'netral'}`}>
            <span aria-hidden="true">{h.status === 'Selaras' ? '✓' : '↔'}</span> {h.status}
          </span>
          <span className="lencana lencana--netral">Aturan {h.aturan}</span>
        </p>
      </div>
      <div className="hasil-utama__cincin">
        <Cincin nilai={h.sfsPilihan} label="Soft Skill Fit Score" />
        <LencanaKategori k={h.kategori.SFS} />
      </div>
      <dl className="skor-tiga">
        {(['Y', 'X1', 'X2'] as const).map((v) => (
          <div key={v}>
            <dt>{LABEL_VARIABEL[v]} <span>({v})</span></dt>
            <dd>
              <strong>{bulat(h.skor[v])}</strong>
              <LencanaKategori k={h.kategori[v]} />
            </dd>
            <Batang nilai={h.skor[v]} />
          </div>
        ))}
      </dl>
    </section>
  );
}

function PenjelasanAi({ a }: { a: Asesmen }) {
  const [p, setP] = useState(a.penjelasan);
  const [galat, setGalat] = useState('');
  useEffect(() => {
    if (p) return;
    let batal = false;
    api<{ penjelasan: NonNullable<Asesmen['penjelasan']> }>(`/assessments/${a.id}/explanation`, { method: 'POST', body: {} })
      .then((d) => { if (!batal) setP(d.penjelasan); })
      .catch((e) => { if (!batal) setGalat(e.message); });
    return () => { batal = true; };
  }, [a.id, p]);

  return (
    <section className="panel penjelasan" aria-labelledby="judul-penjelasan">
      <h2 id="judul-penjelasan">Penjelasan hasil</h2>
      {galat && <Galat pesan={`Penjelasan belum bisa dimuat. ${galat}`} />}
      {!p && !galat && <Memuat teks="Menyusun penjelasan…" />}
      {p && (
        <>
          {p.narasi.split(/\n{2,}/).map((par, i) => <p key={i} className="penjelasan__par">{par}</p>)}
          <p className="catatan">
            {p.sumber === 'ai'
              ? 'Narasi ini disusun AI dari skor dan aturan di halaman ini. AI tidak menentukan skor maupun rekomendasi, dan tidak menerima identitasmu.'
              : 'Penjelasan standar dari sistem. Skor dan rekomendasi di halaman ini tetap berasal dari perhitungan yang sama.'}
          </p>
        </>
      )}
    </section>
  );
}

export default function HasilHalaman() {
  const { id } = useParams();
  const [a, setA] = useState<Asesmen | null>(null);
  const [galat, setGalat] = useState('');

  useEffect(() => {
    setA(null);
    api<{ asesmen: Asesmen }>(`/assessments/${id}`).then((d) => setA(d.asesmen)).catch((e) => setGalat(e.message));
  }, [id]);

  if (galat) return <div className="halaman"><Galat pesan={galat} /><Link to="/app/riwayat">Lihat riwayat asesmen</Link></div>;
  if (!a) return <Memuat teks="Memuat hasil…" />;

  const h = a.hasil;
  const niat = h.skorIndikator.filter((s) => s.variabel === 'Y');

  return (
    <div className="halaman">
      <header className="halaman__kepala halaman__kepala--baris">
        <div>
          <h1>Hasil asesmen</h1>
          <p>{tanggal(a.dibuatPada)}, {a.jenis === 'awal' ? 'asesmen pertama' : 'asesmen ulang'}</p>
        </div>
        <Link className="tombol" to="/app/asesmen">Ulangi asesmen</Link>
      </header>

      <RingkasanHasil a={a} />

      <div className="dua-kolom">
        <section className="panel" aria-labelledby="judul-rekomendasi">
          <h2 id="judul-rekomendasi">Rekomendasi</h2>
          <p className="aturan-kotak">
            <strong>{h.rekomendasi.utama.jenis}</strong>
            {h.rekomendasi.utama.teks}
          </p>
          {h.prioritas.length > 0 ? (
            <>
              <h3>Soft skill yang paling perlu dikembangkan</h3>
              <ol className="prioritas">
                {h.prioritas.map((p) => (
                  <li key={p.kode}>
                    <div className="prioritas__kepala">
                      <strong>{p.nama}</strong>
                      <span>skor {bulat(p.skor)}, kebutuhan {bulat(p.req)}</span>
                    </div>
                    <Batang nilai={p.skor} tanda={p.req} />
                    <p>{p.saran}</p>
                  </li>
                ))}
              </ol>
            </>
          ) : (
            <p>Semua indikator soft skill-mu sudah memenuhi level kebutuhan karier ini.</p>
          )}
          {h.rekomendasi.tambahan.map((t) => (
            <p key={t.kode} className="aturan-kotak aturan-kotak--tambahan">
              <strong>{t.jenis}</strong>
              {t.kode === 'ALTERNATIF'
                ? `${h.karierTeratas.nama} memiliki SFS ${bulat(h.karierTeratas.sfs)}, ${bulat(h.karierTeratas.sfs - h.sfsPilihan)} poin di atas karier pilihanmu. Karier ini layak kamu eksplorasi.`
                : t.teks}
            </p>
          ))}
        </section>
        <PenjelasanAi a={a} />
      </div>

      <section className="panel" aria-labelledby="judul-profil">
        <h2 id="judul-profil">Profil kesesuaian soft skill</h2>
        <p className="panel__sub">Skor tiap soft skill-mu dibandingkan dengan level kebutuhan {a.karier.nama} pada jenjang awal.</p>
        <div className="profil">
          <Radar data={h.gapPilihan} namaKarier={a.karier.nama} />
          <div className="tabel-gulir">
            <table className="tabel tabel--rapat">
              <caption>Rincian per indikator, dari yang paling memengaruhi kesesuaian. Selisih 0 berarti kebutuhan terpenuhi.</caption>
              <thead>
                <tr><th>Indikator</th><th className="angka">Skor</th><th className="angka">Butuh</th><th className="angka">Selisih</th><th className="angka">Bobot</th></tr>
              </thead>
              <tbody>
                {[...h.gapPilihan].sort((x, y) => y.tertimbang - x.tertimbang).map((g) => (
                  <tr key={g.kode}>
                    <th scope="row">{g.nama} <small>{g.variabel}</small></th>
                    <td className="angka">{bulat(g.skor)}</td>
                    <td className="angka">{bulat(g.req)}</td>
                    <td className="angka">{g.gap > 0 ? bulat(g.gap) : <span className="redup">0</span>}</td>
                    <td className="angka">{bulat(g.bobot * 100)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="panel" aria-labelledby="judul-sfs">
        <h2 id="judul-sfs">Kesesuaian dengan 16 karier</h2>
        <p className="panel__sub">Soft Skill Fit Score profilmu terhadap setiap karier, dari yang paling selaras.</p>
        <DaftarSfs data={h.sfsSemua} pilihanId={a.karier.id} teratasId={h.karierTeratas.karierId} />
      </section>

      <section className="panel" aria-labelledby="judul-niat">
        <h2 id="judul-niat">Rincian niat karier</h2>
        <p className="panel__sub">Empat indikator yang membentuk skor Y.</p>
        <ul className="niat niat--dua">
          {niat.map((s) => (
            <li key={s.kode}>
              <span>{s.nama}</span>
              <Batang nilai={s.skor} />
              <strong>{bulat(s.skor)}</strong>
            </li>
          ))}
        </ul>
      </section>

      <p className="catatan">
        Kategori: rendah di bawah {h.ambang.ambang_rendah}, sedang {h.ambang.ambang_rendah}–{h.ambang.ambang_tinggi - 1}, tinggi mulai {h.ambang.ambang_tinggi}.
        Hasil berasal dari penilaian dirimu sendiri dan bersifat gambaran, bukan keputusan.
      </p>
    </div>
  );
}

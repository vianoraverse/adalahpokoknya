// Teks tampilan dalam dua bahasa: Indonesia (id) dan Inggris (en).
// Cara pakai: t('kunci') atau t('kunci', { nama: 'Dina' }) untuk teks yang punya {nama}.
// Mau mengubah teks? Ubah di sini. Kalau menambah kunci baru, isi untuk id dan en.
// Halaman admin selalu bahasa Indonesia, jadi teks admin tidak ada di sini.

const KAMUS = {
  id: {
    // Umum
    'judul.dasbor': 'Dasbor | YourWay',
    'judul.tes': 'Tes | YourWay',
    'judul.hasil': 'Hasil tes | YourWay',
    'judul.riwayat': 'Riwayat | YourWay',
    'judul.pengaturan': 'Pengaturan | YourWay',
    'judul.masuk': 'Masuk | YourWay',
    'judul.daftar': 'Daftar | YourWay',
    'judul.404': 'Halaman tidak ditemukan | YourWay',
    'menu.dasbor': 'Dasbor',
    'menu.tes': 'Tes',
    'menu.riwayat': 'Riwayat',
    'menu.pengaturan': 'Pengaturan',
    menu: 'Menu',
    tutup: 'Tutup',
    keluar: 'Keluar',
    memuat: 'Memuat…',
    'peran.mahasiswa': 'Mahasiswa',
    'peran.admin': 'Operator Admin',
    'tema.keGelap': 'Ganti ke mode gelap',
    'tema.keTerang': 'Ganti ke mode terang',
    'bahasa.label': 'EN',
    'bahasa.aria': 'Switch to English',
    'galat.koneksi': 'Tidak dapat terhubung ke server. Periksa koneksi lalu coba lagi.',
    'galat.umum': 'Permintaan gagal. Coba lagi.',
    'catatan.sementara':
      '<strong>Catatan:</strong> kebutuhan soft skill tiap karier masih memakai angka sementara (belum dari data lowongan kerja), jadi bagian ini belum final.',

    // Halaman depan
    'depan.masuk': 'Masuk',
    'depan.daftar': 'Daftar',
    'depan.bukaDasbor': 'Buka dasbor',
    'depan.judul': 'Kenali kemampuanmu.<br />Temukan arah kariermu.',
    'depan.label': 'Tes soft skill',
    'depan.intro': 'Jawab pertanyaan singkat untuk melihat rekomendasi karier TIK berdasarkan soft skill kamu.',
    'depan.mulai': 'Mulai tes',
    'depan.catatan': 'Tes dapat diulang kapan saja. Hasil merupakan gambaran, bukan penilaian pasti.',
    'depan.caraJudul': 'Cara pakai',
    'depan.c1': 'Daftar atau masuk',
    'depan.c1p': 'Cukup pakai email dan kata sandi.',
    'depan.c2': 'Kerjakan tes',
    'depan.c2p': 'Pilih karier yang kamu minati, lalu jawab pertanyaannya.',
    'depan.c3': 'Lihat hasil',
    'depan.c3p': 'Karier yang paling cocok dan soft skill yang perlu dilatih.',
    'depan.kaki': 'YourWay · Proyek Rekayasa Perangkat Lunak, Kelompok 4',

    // Masuk dan daftar
    'auth.slogan': 'Setelah lulus, mau ke mana?',
    'auth.proyek': 'Project mata kuliah RPL, Kelompok 4.',
    'auth.nama': 'Nama',
    'auth.email': 'Email',
    'auth.sandi': 'Kata sandi',
    'auth.sandiMin': 'Minimal 8 karakter.',
    'masuk.judul': 'Masuk',
    'masuk.belum': 'Belum punya akun?',
    'masuk.tombol': 'Masuk',
    'masuk.memeriksa': 'Memeriksa…',
    'daftar.judul': 'Buat akun',
    'daftar.sudah': 'Sudah punya akun?',
    'daftar.setuju':
      'Saya setuju nama, email, dan jawaban saya disimpan untuk menghitung hasil tes. Hasilnya hanya bisa saya lihat sendiri, dan akun bisa saya hapus kapan saja.',
    'daftar.tombol': 'Buat akun',
    'daftar.membuat': 'Membuat akun…',

    // 404
    'nf.judul': 'Jalur ini tidak ada',
    'nf.p': 'Alamat yang kamu buka tidak ditemukan. Mungkin tautannya salah ketik atau halamannya sudah dipindahkan.',
    'nf.kembali': 'Ke halaman depan',

    // Tes
    'tes.pilihJudul': 'Mau ke mana?',
    'tes.pilihP': 'Pilih satu karier yang paling kamu minati saat ini. Hasil akhirnya nanti bisa saja beda dari pilihan ini.',
    'tes.dipilih': 'Dipilih',
    'tes.pilihan': 'Pilihan: <strong>{nama}</strong>',
    'tes.belumPilih': 'Belum ada karier yang dipilih.',
    'tes.lanjutKe': 'Lanjut ke kuesioner',
    'tes.lanjutkan': 'Lanjutkan kuesioner',
    'tes.bagian.Y': 'Tentang karier pilihanmu',
    'tes.bagian.X1': 'Tentang dirimu',
    'tes.bagian.X2': 'Saat bekerja dengan orang lain',
    'tes.petunjuk': 'Jawab sesuai keadaanmu saat ini. Tidak ada jawaban benar atau salah.',
    'tes.skala.1': 'Sangat tidak setuju',
    'tes.skala.2': 'Tidak setuju',
    'tes.skala.3': 'Netral',
    'tes.skala.4': 'Setuju',
    'tes.skala.5': 'Sangat setuju',
    'tes.terjawab': '{n} dari {total} terjawab',
    'tes.kemajuan': 'Kemajuan kuesioner',
    'tes.halaman': 'Halaman {n} dari {total}',
    'tes.gantiKarier': 'Ganti karier',
    'tes.sebelumnya': 'Sebelumnya',
    'tes.lanjut': 'Lanjut',
    'tes.kirim': 'Kirim jawaban',
    'tes.menghitung': 'Jawaban terkirim. Menghitung hasil…',
    'tes.karierPilihan': 'karier pilihan',

    // Hasil
    'hasil.judul': 'Hasil tes',
    'hasil.ulangi': 'Ulangi tes',
    'hasil.palingCocok': 'Karier yang paling cocok buat kamu',
    'hasil.label.tinggi': 'Sangat cocok',
    'hasil.label.sedang': 'Cukup cocok',
    'hasil.label.rendah': 'Masih perlu dikembangkan',
    'hasil.sama': 'Sama dengan karier yang kamu pilih di awal.',
    'hasil.beda': 'Pilihan awalmu <strong>{pilihan}</strong>, tapi dari jawabanmu, karier ini yang paling cocok.',
    'hasil.kekuatan': 'Kekuatan kamu',
    'hasil.latih': 'Yang bisa kamu latih',
    'hasil.latihSudah':
      'Soft skill kamu sudah sesuai dengan kebutuhan {karier}. Coba cari pengalaman nyata seperti proyek, lomba, atau magang.',
    'hasil.latihUlang': 'Hasil ini dibuat dengan versi website yang lama. Ulangi tesnya untuk melihat soft skill yang bisa kamu latih.',
    'hasil.radarJudul': 'Soft skill kamu dibanding kebutuhan {karier}',
    'hasil.radarP':
      'Area berwarna adalah kamu, garis putus-putus adalah yang dibutuhkan karier ini. Makin area itu menutupi garis putus-putus, makin siap kamu. Titik kuning menandai soft skill yang paling perlu kamu latih dulu.',
    'hasil.alternatif': 'Karier lain yang bisa kamu lirik',
    'hasil.ringkas': 'Ringkasnya',
    'hasil.lihatRiwayat': 'Lihat riwayat tes',
    'radar.kamu': 'Kamu',
    'radar.butuh': 'Yang dibutuhkan {karier}',
    'radar.prioritas': 'Prioritas latihan',
    'radar.kurang': 'Sedikit di bawah kebutuhan',
    'radar.cukup': 'Sudah cukup',
    'radar.aria': 'Spider chart soft skill kamu dibandingkan dengan yang dibutuhkan {karier}. Prioritas latihan: {daftar}.',
    'radar.tidakAda': 'tidak ada',

    // Dasbor
    'dasbor.halo': 'Halo, {nama}',
    'dasbor.kosong': 'Kamu belum pernah ikut tes. Pilih satu karier, jawab 36 pertanyaan, lalu lihat hasilnya. Sekitar 10 menit.',
    'dasbor.mulai': 'Mulai tes',
    'dasbor.terakhir': 'Ini hasil tes terakhirmu, {tanggal}.',
    'dasbor.lihat': 'Lihat hasil lengkap',

    // Riwayat
    'riwayat.judul': 'Riwayat',
    'riwayat.p': 'Semua tes yang pernah kamu kerjakan, dari yang terbaru.',
    'riwayat.kosong': 'Belum ada tes. Hasil pertamamu akan muncul di sini.',
    'riwayat.tanggal': 'Tanggal',
    'riwayat.pilihan': 'Pilihan awal',
    'riwayat.cocok': 'Karier paling cocok',
    'riwayat.buka': 'Buka',
    'riwayat.lihat': 'Lihat hasil',

    // Pengaturan
    'set.judul': 'Pengaturan',
    'set.profil': 'Profil',
    'set.simpanNama': 'Simpan nama',
    'set.namaDisimpan': 'Nama disimpan.',
    'set.sandi': 'Kata sandi',
    'set.sandiLama': 'Kata sandi lama',
    'set.sandiBaru': 'Kata sandi baru',
    'set.ganti': 'Ganti kata sandi',
    'set.sandiDiganti': 'Kata sandi diganti.',
    'set.hapus': 'Hapus akun',
    'set.hapusP': 'Akun, jawaban, dan seluruh hasil tesmu dihapus permanen dan tidak bisa dikembalikan.',
    'set.hapusJudul': 'Hapus akun ini?',
    'set.hapusKonfirmasi': 'Masukkan kata sandi untuk menghapus akun beserta seluruh datanya secara permanen.',
    'set.batal': 'Batal',
  },

  en: {
    'judul.dasbor': 'Dashboard | YourWay',
    'judul.tes': 'Test | YourWay',
    'judul.hasil': 'Test result | YourWay',
    'judul.riwayat': 'History | YourWay',
    'judul.pengaturan': 'Settings | YourWay',
    'judul.masuk': 'Log in | YourWay',
    'judul.daftar': 'Sign up | YourWay',
    'judul.404': 'Page not found | YourWay',
    'menu.dasbor': 'Dashboard',
    'menu.tes': 'Test',
    'menu.riwayat': 'History',
    'menu.pengaturan': 'Settings',
    menu: 'Menu',
    tutup: 'Close',
    keluar: 'Log out',
    memuat: 'Loading…',
    'peran.mahasiswa': 'Student',
    'peran.admin': 'Admin Operator',
    'tema.keGelap': 'Switch to dark mode',
    'tema.keTerang': 'Switch to light mode',
    'bahasa.label': 'ID',
    'bahasa.aria': 'Ganti ke Bahasa Indonesia',
    'galat.koneksi': 'Cannot connect to the server. Check your connection and try again.',
    'galat.umum': 'Something went wrong. Try again.',
    'catatan.sementara':
      '<strong>Note:</strong> the soft skill needs of each career still use placeholder numbers (not yet from job posting data), so this part is not final.',

    'depan.masuk': 'Log in',
    'depan.daftar': 'Sign up',
    'depan.bukaDasbor': 'Open dashboard',
    'depan.judul': 'Know your skills.<br />Find your career path.',
    'depan.label': 'Soft skill test',
    'depan.intro': 'Answer a few short questions to see IT career recommendations based on your soft skills.',
    'depan.mulai': 'Start the test',
    'depan.catatan': 'You can retake the test any time. The result is a picture, not a final judgment.',
    'depan.caraJudul': 'How it works',
    'depan.c1': 'Sign up or log in',
    'depan.c1p': 'All you need is an email and a password.',
    'depan.c2': 'Take the test',
    'depan.c2p': 'Pick the career you are interested in, then answer the questions.',
    'depan.c3': 'See your result',
    'depan.c3p': 'Your best-fit career and the soft skills to work on.',
    'depan.kaki': 'YourWay · Software Engineering Project, Group 4',

    'auth.slogan': 'After graduation, where to?',
    'auth.proyek': 'Software Engineering course project, Group 4.',
    'auth.nama': 'Name',
    'auth.email': 'Email',
    'auth.sandi': 'Password',
    'auth.sandiMin': 'At least 8 characters.',
    'masuk.judul': 'Log in',
    'masuk.belum': 'No account yet?',
    'masuk.tombol': 'Log in',
    'masuk.memeriksa': 'Checking…',
    'daftar.judul': 'Create an account',
    'daftar.sudah': 'Already have an account?',
    'daftar.setuju':
      'I agree that my name, email, and answers are stored to calculate my test result. Only I can see the result, and I can delete my account any time.',
    'daftar.tombol': 'Create account',
    'daftar.membuat': 'Creating account…',

    'nf.judul': 'This route does not exist',
    'nf.p': 'The address you opened was not found. The link may be mistyped, or the page has moved.',
    'nf.kembali': 'Go to the home page',

    'tes.pilihJudul': 'Where to?',
    'tes.pilihP': 'Pick the one career you are most interested in right now. Your final result may turn out different from this choice.',
    'tes.dipilih': 'Selected',
    'tes.pilihan': 'Choice: <strong>{nama}</strong>',
    'tes.belumPilih': 'No career selected yet.',
    'tes.lanjutKe': 'Continue to the questions',
    'tes.lanjutkan': 'Resume the questions',
    'tes.bagian.Y': 'About your chosen career',
    'tes.bagian.X1': 'About yourself',
    'tes.bagian.X2': 'Working with other people',
    'tes.petunjuk': 'Answer based on how you are right now. There are no right or wrong answers.',
    'tes.skala.1': 'Strongly disagree',
    'tes.skala.2': 'Disagree',
    'tes.skala.3': 'Neutral',
    'tes.skala.4': 'Agree',
    'tes.skala.5': 'Strongly agree',
    'tes.terjawab': '{n} of {total} answered',
    'tes.kemajuan': 'Questionnaire progress',
    'tes.halaman': 'Page {n} of {total}',
    'tes.gantiKarier': 'Change career',
    'tes.sebelumnya': 'Back',
    'tes.lanjut': 'Next',
    'tes.kirim': 'Submit answers',
    'tes.menghitung': 'Answers sent. Calculating your result…',
    'tes.karierPilihan': 'your chosen career',

    'hasil.judul': 'Test result',
    'hasil.ulangi': 'Retake test',
    'hasil.palingCocok': 'The career that fits you best',
    'hasil.label.tinggi': 'Great fit',
    'hasil.label.sedang': 'Good fit',
    'hasil.label.rendah': 'Still needs work',
    'hasil.sama': 'Same as the career you picked at the start.',
    'hasil.beda': 'You first picked <strong>{pilihan}</strong>, but based on your answers, this career fits you best.',
    'hasil.kekuatan': 'Your strengths',
    'hasil.latih': 'What you can practice',
    'hasil.latihSudah':
      'Your soft skills already match what {karier} needs. Look for real experience such as projects, competitions, or internships.',
    'hasil.latihUlang': 'This result was made with an older version of the website. Retake the test to see which soft skills to practice.',
    'hasil.radarJudul': 'Your soft skills compared with what {karier} needs',
    'hasil.radarP':
      'The shaded area is you, the dashed line is what this career needs. The more that area covers the dashed line, the more ready you are. Yellow dots mark the soft skills to practice first.',
    'hasil.alternatif': 'Other careers to look into',
    'hasil.ringkas': 'In short',
    'hasil.lihatRiwayat': 'See test history',
    'radar.kamu': 'You',
    'radar.butuh': 'What {karier} needs',
    'radar.prioritas': 'Practice first',
    'radar.kurang': 'Slightly below what is needed',
    'radar.cukup': 'Already enough',
    'radar.aria': 'Spider chart of your soft skills compared with what {karier} needs. Practice first: {daftar}.',
    'radar.tidakAda': 'none',

    'dasbor.halo': 'Hi, {nama}',
    'dasbor.kosong': 'You have not taken the test yet. Pick one career, answer 36 questions, then see your result. About 10 minutes.',
    'dasbor.mulai': 'Start the test',
    'dasbor.terakhir': 'This is your latest test result, {tanggal}.',
    'dasbor.lihat': 'See full result',

    'riwayat.judul': 'History',
    'riwayat.p': 'Every test you have taken, newest first.',
    'riwayat.kosong': 'No tests yet. Your first result will show up here.',
    'riwayat.tanggal': 'Date',
    'riwayat.pilihan': 'First choice',
    'riwayat.cocok': 'Best-fit career',
    'riwayat.buka': 'Open',
    'riwayat.lihat': 'See result',

    'set.judul': 'Settings',
    'set.profil': 'Profile',
    'set.simpanNama': 'Save name',
    'set.namaDisimpan': 'Name saved.',
    'set.sandi': 'Password',
    'set.sandiLama': 'Current password',
    'set.sandiBaru': 'New password',
    'set.ganti': 'Change password',
    'set.sandiDiganti': 'Password changed.',
    'set.hapus': 'Delete account',
    'set.hapusP': 'Your account, answers, and all your test results are deleted permanently and cannot be restored.',
    'set.hapusJudul': 'Delete this account?',
    'set.hapusKonfirmasi': 'Enter your password to permanently delete your account and all its data.',
    'set.batal': 'Cancel',
  },
};

/** Pesan galat dari server (selalu bahasa Indonesia) beserta terjemahan Inggrisnya. */
const GALAT_EN = {
  'Email atau kata sandi salah.': 'Wrong email or password.',
  'Akun ini dinonaktifkan. Hubungi Operator Admin.': 'This account is disabled. Contact the Admin Operator.',
  'Akun ini tidak memiliki akses ke halaman tersebut.': 'This account cannot open that page.',
  'Centang persetujuan pengumpulan data untuk mendaftar.': 'Tick the data consent box to sign up.',
  'Data tidak lengkap.': 'Some data is missing.',
  'Email ini sudah terdaftar. Masuk dengan email tersebut.': 'This email is already registered. Log in with it instead.',
  'Format email tidak valid.': 'That email address is not valid.',
  'Hasil asesmen tidak ditemukan.': 'Test result not found.',
  'Isi kata sandi untuk menghapus akun.': 'Enter your password to delete the account.',
  'Isi kata sandi.': 'Enter your password.',
  'Karier pilihan tidak ditemukan.': 'The chosen career was not found.',
  'Kata sandi lama salah.': 'Your current password is wrong.',
  'Kata sandi maksimal 72 karakter.': 'Password can be at most 72 characters.',
  'Kata sandi minimal 8 karakter.': 'Password must be at least 8 characters.',
  'Kata sandi salah.': 'Wrong password.',
  'Masih ada butir yang belum dijawab.': 'Some questions are still unanswered.',
  'Nama maksimal 80 karakter.': 'Name can be at most 80 characters.',
  'Nama minimal 2 karakter.': 'Name must be at least 2 characters.',
  'Sesi berakhir. Masuk kembali untuk melanjutkan.': 'Your session ended. Log in again to continue.',
  'Terjadi kesalahan pada server. Coba lagi sebentar lagi.': 'Something went wrong on the server. Try again in a moment.',
  'Terlalu banyak percobaan. Tunggu beberapa menit lalu coba lagi.': 'Too many attempts. Wait a few minutes and try again.',
};

/** Bahasa yang sedang dipakai ('id' atau 'en'). Diatur oleh js/awal.js lewat atribut lang. */
export const bhs = () => (document.documentElement.lang === 'en' ? 'en' : 'id');

/** Mengambil teks sesuai bahasa. `isi` mengganti {nama}, {n}, dan seterusnya (tanpa escape, lihat tHtml di umum.js). */
export function t(kunci, isi = {}) {
  const teks = KAMUS[bhs()][kunci] ?? KAMUS.id[kunci];
  if (teks === undefined) {
    console.warn(`Teks "${kunci}" belum ada di js/bahasa.js`);
    return kunci;
  }
  return teks.replace(/\{(\w+)\}/g, (_, k) => String(isi[k] ?? ''));
}

/** Menerjemahkan pesan galat dari server. Pesan yang belum ada di daftar ditampilkan apa adanya. */
export function terjemahGalat(pesan) {
  if (bhs() !== 'en') return pesan;
  // Beberapa pesan bisa digabung jadi satu ("A. B."), jadi diterjemahkan per kalimat.
  return pesan
    .split(/(?<=\.)\s+/)
    .map((p) => GALAT_EN[p] ?? p)
    .join(' ');
}

/** Mengisi semua elemen statis bertanda data-teks="kunci" (dipakai di halaman HTML biasa). */
export function terjemahStatis(akar = document) {
  for (const el of akar.querySelectorAll('[data-teks]')) el.innerHTML = t(el.dataset.teks);
}

export function gantiBahasa() {
  try {
    localStorage.setItem('yourway.bahasa', bhs() === 'en' ? 'id' : 'en');
  } catch {
    /* penyimpanan tidak tersedia */
  }
  location.reload();
}

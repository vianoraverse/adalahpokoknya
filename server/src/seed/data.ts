// Data awal YourWay. Sumber: laporan Bab 2 dan Bab 3 (docs/LAPORAN_BAB_1-3.md).

export const KARIER = [
  ['programmer', 'Programmer / Software Developer', 'Programming and Software Development', 'Pemrogram, Senior Programmer, Software Development Expert', 'Sesuai', 'Menulis, menguji, dan memelihara kode program sesuai rancangan perangkat lunak.'],
  ['system-analyst', 'System Analyst', 'Information System and Technology Development', 'System Analyst, Senior Systems Analyst', 'Sesuai', 'Menggali kebutuhan pengguna dan menerjemahkannya menjadi rancangan sistem.'],
  ['software-engineer', 'Software Engineer', 'Programming and Software Development', 'Software Engineer, Lead/Senior Software Engineer', 'Sesuai', 'Merancang dan membangun perangkat lunak secara menyeluruh, dari arsitektur hingga rilis.'],
  ['dba', 'Database Administrator', 'Data Management System', 'Database Administrator', 'Sesuai', 'Menjaga basis data tetap tersedia, aman, dan cepat diakses.'],
  ['data-analyst', 'Data Analyst / Data Management Specialist', 'Data Management System', 'Data Analyst; “Data Management Specialist” tidak persis', 'Sebagian', 'Mengolah data menjadi temuan yang membantu pengambilan keputusan.'],
  ['network-admin', 'Network Administrator', 'Network and Infrastructure', 'Network Administrator (junior sampai utama)', 'Sesuai', 'Mengoperasikan dan memantau jaringan komputer sehari-hari.'],
  ['network-engineer', 'Network Engineer', 'Network and Infrastructure', 'Network Engineer', 'Sesuai', 'Merancang, membangun, dan mengoptimalkan infrastruktur jaringan.'],
  ['sysadmin', 'System Administrator', 'Operation and System Tools', 'System Administrator', 'Sesuai', 'Mengelola server, sistem operasi, dan layanan pendukungnya.'],
  ['it-support', 'IT Support / IT Technician', 'Hardware and Digital Peripherals', 'Technical Support, Help Desk Technician, Teknisi Komputer', 'Sebagian', 'Membantu pengguna menyelesaikan masalah perangkat keras dan lunak.'],
  ['it-pm', 'IT Project Manager', 'IT Project Management', 'Manajer Proyek TIK (ICT Project Manager)', 'Sesuai', 'Memimpin proyek TIK agar selesai sesuai lingkup, waktu, dan biaya.'],
  ['it-governance', 'IT Governance Specialist', 'IT Governance and Management', 'IT Management Coordinator/Staff; judul persis tidak ada', 'Sebagian', 'Memastikan pengelolaan TIK mengikuti kebijakan, standar, dan regulasi.'],
  ['cybersecurity', 'IT Security / Cybersecurity Specialist', 'IT Security and Compliance', 'Cyber Security Specialist/Analyst/Engineer', 'Sesuai', 'Melindungi sistem dan data dari ancaman keamanan.'],
  ['it-service-manager', 'IT Service Manager', 'IT Services Management System', 'Manajer Pengelola Layanan IT (ITSM Manager)', 'Sesuai', 'Mengelola layanan TI agar memenuhi tingkat layanan yang disepakati.'],
  ['enterprise-architect', 'Enterprise Architect', 'IT Enterprise Architecture', 'Enterprise Architect', 'Sesuai', 'Menyelaraskan arsitektur teknologi dengan arah bisnis organisasi.'],
  ['web-mobile-dev', 'Web / Mobile Developer', 'IT Mobility and IoT, Programming', 'Pengembang Web (Web Developer), Pemrogram Mobil, Mobile Computing', 'Sesuai', 'Membangun aplikasi web dan seluler yang dipakai langsung oleh pengguna.'],
  ['multimedia', 'Multimedia / Digital Content Specialist', 'IT Multimedia', 'Multimedia Specialist, Web Content Manager, Digital Artist', 'Sebagian', 'Membuat konten visual, audio, dan interaktif untuk media digital.'],
] as const;

// [kode, nama, variabel, dasar, saran pengembangan]
export const INDIKATOR = [
  ['minat', 'Minat', 'Y', 'Tech Career Scale', ''],
  ['rencana', 'Rencana', 'Y', 'UTAUT (Behavioral Intention)', ''],
  ['usaha', 'Usaha persiapan', 'Y', 'Tech Career Scale', ''],
  ['kemantapan', 'Kemantapan pilihan', 'Y', 'Harred dkk. (2023)', ''],
  ['critical-thinking', 'Critical Thinking', 'X1', 'MSIS 2016', 'Biasakan membandingkan minimal dua sumber sebelum menyimpulkan, dan tulis asumsi yang kamu pakai saat mengerjakan tugas analisis.'],
  ['problem-solving', 'Problem Solving', 'X1', 'MSIS 2016', 'Latih memecah masalah menjadi bagian kecil lewat soal pemrograman atau studi kasus, lalu evaluasi solusi yang kamu pilih.'],
  ['creativity', 'Creativity', 'X1', 'MSIS 2016', 'Ikuti hackathon atau proyek sampingan, dan coba minimal satu pendekatan berbeda setiap kali cara lama buntu.'],
  ['ethical-analysis', 'Ethical Analysis', 'X1', 'MSIS 2016; ASEC (integritas, kejujuran)', 'Pelajari kode etik profesi TIK dan biasakan menimbang siapa yang terdampak sebelum mengambil keputusan.'],
  ['self-development', 'Self-development', 'X1', 'Tambahan: Lifelong Learning; ASEC (pengembangan diri)', 'Tetapkan target belajar mingguan di luar tugas kuliah dan catat kemajuannya.'],
  ['flexibility', 'Flexibility', 'X1', 'Tambahan: Adaptability; ASEC (fleksibilitas)', 'Coba teknologi atau peran baru di proyek kelompok agar terbiasa menyesuaikan rencana.'],
  ['discipline', 'Discipline', 'X1', 'Tambahan: Self-Management; ASEC (disiplin)', 'Pakai jadwal dan tenggat pribadi, lalu kurangi gangguan saat mengerjakan hal penting.'],
  ['teamwork', 'Collaboration and Teamwork', 'X2', 'MSIS 2016; ASEC (kerja sama)', 'Ambil bagian yang jelas dalam kerja kelompok atau organisasi, dan tawarkan bantuan saat rekan kesulitan.'],
  ['oral-communication', 'Oral Communication', 'X2', 'MSIS 2016; ASEC (komunikasi verbal)', 'Perbanyak latihan presentasi dan minta umpan balik tentang kejelasan penyampaianmu.'],
  ['written-communication', 'Written Communication', 'X2', 'MSIS 2016; ASEC (komunikasi tertulis)', 'Biasakan menulis dokumentasi dan laporan singkat, lalu sesuaikan gaya dengan pembacanya.'],
  ['negotiation', 'Negotiation', 'X2', 'MSIS 2016; ASEC (negosiasi)', 'Latih menyampaikan keinginan sambil mencari titik temu saat membagi tugas atau menentukan prioritas.'],
  ['leadership', 'Leadership', 'X2', 'MSIS 2016', 'Ajukan diri memimpin tugas kecil, misalnya koordinator kelompok atau penanggung jawab acara.'],
  ['intercultural', 'Intercultural Competency', 'X2', 'MSIS 2016', 'Ikuti kegiatan lintas jurusan, daerah, atau negara untuk terbiasa bekerja dengan latar yang berbeda.'],
  ['conflict-management', 'Conflict Management', 'X2', 'ASEC (manajemen konflik)', 'Saat ada beda pendapat, coba jadi penengah: dengarkan kedua pihak dan fokus pada masalahnya.'],
] as const;

// 36 butir pada Subbab 3.3. [kode indikator, teks, dasar]
export const BUTIR = [
  ['minat', 'Saya tertarik untuk bekerja sebagai [okupasi].', 'Tech Career Scale'],
  ['minat', 'Saya senang membayangkan diri saya menjalani pekerjaan sebagai [okupasi].', 'Tech Career Scale'],
  ['rencana', 'Saya berniat bekerja sebagai [okupasi] setelah lulus.', 'UTAUT (Behavioral Intention)'],
  ['rencana', 'Saya memperkirakan akan melamar pekerjaan sebagai [okupasi] dalam waktu dekat.', 'UTAUT (Behavioral Intention)'],
  ['usaha', 'Saya aktif mencari informasi tentang [okupasi] (misalnya tugas, syarat, dan lowongan).', 'Tech Career Scale'],
  ['usaha', 'Saya sudah melakukan kegiatan untuk mempersiapkan diri menjadi [okupasi] (misalnya kursus, proyek, atau magang).', 'Tech Career Scale'],
  ['kemantapan', 'Saya yakin [okupasi] adalah pilihan karier saya, bukan sekadar coba-coba.', 'Harred dkk. (2023)'],
  ['kemantapan', 'Saya tetap akan memilih [okupasi] meskipun ada pilihan karier TIK lain.', 'Harred dkk. (2023)'],
  ['critical-thinking', 'Saya membandingkan beberapa sumber informasi sebelum menarik kesimpulan.', 'Sosu (2013)'],
  ['critical-thinking', 'Saya mempertanyakan asumsi di balik suatu pendapat sebelum menerimanya.', 'Sosu (2013)'],
  ['problem-solving', 'Saat menghadapi masalah, saya menguraikannya menjadi bagian kecil sebelum mencari solusi.', 'Heppner & Petersen (1982)'],
  ['problem-solving', 'Saya mengevaluasi solusi yang saya pilih dan memperbaikinya bila hasilnya belum baik.', 'Heppner & Petersen (1982)'],
  ['creativity', 'Saya percaya diri dapat menghasilkan ide baru untuk menyelesaikan tugas.', 'Tierney & Farmer (2002)'],
  ['creativity', 'Saya mencoba cara yang berbeda ketika cara lama tidak berhasil.', 'Tierney & Farmer (2002)'],
  ['ethical-analysis', 'Saya mempertimbangkan apakah suatu keputusan adil bagi pihak yang terdampak.', 'Reidenbach & Robin (1990)'],
  ['ethical-analysis', 'Saya menolak tindakan tidak jujur, misalnya menyontek atau menjiplak, meskipun menguntungkan saya.', 'ASEC (Integrity)'],
  ['self-development', 'Saya rutin mempelajari hal baru di luar tugas kuliah.', 'Fisher dkk. (2001); ASEC'],
  ['self-development', 'Saya menetapkan target belajar dan memantau kemajuannya.', 'Fisher dkk. (2001); ASEC'],
  ['flexibility', 'Saya dapat menyesuaikan rencana ketika situasi atau teknologi berubah.', 'Dennis & Vander Wal (2010)'],
  ['flexibility', 'Saya mampu melihat satu masalah dari beberapa sudut pandang.', 'Dennis & Vander Wal (2010)'],
  ['discipline', 'Saya menyelesaikan tugas sesuai tenggat tanpa harus diingatkan.', 'Tangney dkk. (2004); ASEC'],
  ['discipline', 'Saya dapat menahan diri dari hal yang mengganggu saat harus mengerjakan hal penting.', 'Tangney dkk. (2004); ASEC'],
  ['teamwork', 'Dalam kerja kelompok, saya menyelesaikan bagian saya tepat waktu.', 'Ponmalar dkk. (2018); ASEC (Cooperation)'],
  ['teamwork', 'Saya membantu anggota tim yang mengalami kesulitan.', 'Ponmalar dkk. (2018); ASEC (Cooperation)'],
  ['oral-communication', 'Saya dapat menjelaskan gagasan secara lisan dengan jelas dan runtut.', 'Rubin & Martin (1994)'],
  ['oral-communication', 'Saya mendengarkan lawan bicara dan menanggapi sesuai maksudnya.', 'Rubin & Martin (1994)'],
  ['written-communication', 'Saya dapat menulis laporan atau pesan kerja yang mudah dipahami pembaca.', 'Ponmalar dkk. (2018)'],
  ['written-communication', 'Saya menyesuaikan gaya tulisan dengan pembacanya (dosen, rekan, atau klien).', 'Ponmalar dkk. (2018)'],
  ['negotiation', 'Saya dapat menyampaikan keinginan sambil tetap memperhatikan kepentingan pihak lain.', 'Sullivan dkk. (2006)'],
  ['negotiation', 'Saat pendapat berbeda, saya mencari kesepakatan yang dapat diterima kedua pihak.', 'Sullivan dkk. (2006)'],
  ['leadership', 'Saya dapat mengarahkan anggota kelompok agar fokus pada tujuan bersama.', 'Posner (2004)'],
  ['leadership', 'Saya memotivasi anggota kelompok yang semangatnya menurun.', 'Posner (2004)'],
  ['intercultural', 'Saya nyaman bekerja dengan orang yang berbeda suku, agama, atau budaya dari saya.', 'Ang dkk. (2007)'],
  ['intercultural', 'Saya menyesuaikan cara berkomunikasi ketika berhadapan dengan orang dari latar budaya berbeda.', 'Ang dkk. (2007)'],
  ['conflict-management', 'Saya dapat menengahi perbedaan pendapat dalam kelompok tanpa memihak.', 'Rahim (1983); ASEC'],
  ['conflict-management', 'Saat terjadi konflik, saya tetap tenang dan fokus pada masalah, bukan pada orangnya.', 'Rahim (1983); ASEC'],
] as const;

/**
 * Frekuensi kemunculan soft skill pada lowongan jenjang awal, dalam persen lowongan,
 * per karier (urutan kolom mengikuti 14 indikator X1 lalu X2 pada INDIKATOR).
 *
 * PENTING: angka ini adalah DATA AWAL ILUSTRATIF untuk menjalankan sistem. Laporan
 * (Subbab 3.4) menetapkan bahwa angka sebenarnya dihitung dari lowongan kerja 2026
 * yang dikumpulkan tim. Ganti lewat menu Admin > Profil karier setelah survei selesai.
 */
export const FREKUENSI: Record<string, number[]> = {
  'programmer':           [55, 85, 40, 8, 65, 45, 50, 80, 45, 35, 5, 8, 12, 8],
  'system-analyst':       [85, 75, 35, 12, 40, 35, 40, 70, 80, 75, 35, 20, 15, 20],
  'software-engineer':    [65, 85, 45, 10, 70, 50, 55, 85, 50, 45, 8, 15, 15, 10],
  'dba':                  [60, 75, 15, 35, 45, 30, 70, 55, 40, 50, 5, 8, 8, 8],
  'data-analyst':         [85, 70, 40, 30, 55, 30, 50, 60, 75, 70, 10, 8, 12, 5],
  'network-admin':        [45, 80, 12, 20, 45, 45, 70, 60, 50, 45, 5, 8, 8, 10],
  'network-engineer':     [55, 85, 20, 15, 55, 50, 60, 65, 50, 45, 12, 10, 12, 8],
  'sysadmin':             [50, 85, 15, 25, 50, 50, 70, 60, 45, 50, 5, 8, 8, 10],
  'it-support':           [35, 85, 12, 15, 40, 60, 65, 65, 85, 45, 12, 5, 15, 35],
  'it-pm':                [55, 70, 25, 20, 30, 60, 65, 85, 85, 70, 65, 85, 30, 62],
  'it-governance':        [75, 45, 10, 85, 35, 25, 65, 55, 65, 85, 35, 25, 15, 20],
  'cybersecurity':        [85, 80, 35, 70, 70, 45, 65, 60, 45, 62, 5, 8, 10, 8],
  'it-service-manager':   [50, 70, 15, 30, 30, 55, 62, 80, 85, 62, 50, 75, 25, 62],
  'enterprise-architect': [85, 70, 50, 30, 45, 45, 40, 70, 85, 75, 60, 62, 30, 25],
  'web-mobile-dev':       [45, 80, 65, 8, 70, 62, 50, 80, 45, 35, 8, 8, 15, 8],
  'multimedia':           [35, 45, 90, 15, 55, 62, 62, 70, 62, 45, 30, 8, 20, 10],
};

/** Pita frekuensi pada Subbab 3.4: >=60% -> 80, 30-59% -> 65, 10-29% -> 50, <10% -> 35. */
export function levelKebutuhan(persen: number): number {
  if (persen >= 60) return 80;
  if (persen >= 30) return 65;
  if (persen >= 10) return 50;
  return 35;
}

export const ATURAN = [
  ['R1', 'Y ≥ ambang dan SFS ≥ ambang', 'Niat mantap dan selaras', 'Pengayaan dan tantangan lanjutan', 'Niat dan soft skill kamu sudah sejalan dengan karier ini. Cari tantangan yang lebih tinggi: proyek nyata, magang, sertifikasi, atau kompetisi di bidang tersebut.'],
  ['R2', 'Y ≥ ambang dan SFS < ambang', 'Niat kuat, soft skill perlu dikembangkan', 'Prioritas 3 indikator dengan selisih terbesar', 'Niat kamu sudah kuat. Fokuskan waktu pada tiga soft skill dengan selisih terbesar terhadap kebutuhan karier ini.'],
  ['R3', 'Y < ambang dan SFS ≥ ambang', 'Potensi selaras, niat belum mantap', 'Eksplorasi karier dan informasi karier', 'Soft skill kamu sudah mendukung karier ini, tetapi niatnya belum mantap. Gali lebih jauh: baca deskripsi kerja, ngobrol dengan praktisi, atau coba proyek kecil di bidang ini.'],
  ['R4', 'Y < ambang dan SFS < ambang', 'Perlu eksplorasi dan penguatan dasar', 'Karier alternatif dan pengembangan dasar', 'Niat dan kesesuaian soft skill masih perlu diperkuat. Jelajahi karier lain yang lebih selaras sambil membangun soft skill dasar.'],
  ['X1_RENDAH', 'X1 < ambang rendah', 'Soft skill intrapersonal rendah', 'Pengembangan intrapersonal', 'Perkuat pengelolaan diri, misalnya manajemen waktu, refleksi rutin, dan belajar mandiri.'],
  ['X2_RENDAH', 'X2 < ambang rendah', 'Soft skill interpersonal rendah', 'Pengembangan interpersonal', 'Perbanyak pengalaman bersama orang lain, misalnya kerja kelompok, organisasi, dan latihan presentasi.'],
  ['ALTERNATIF', 'SFS karier tertinggi − SFS karier pilihan ≥ selisih alternatif', 'Ada karier yang lebih selaras', 'Karier alternatif untuk dieksplorasi', 'Ada karier lain yang lebih selaras dengan profil soft skill kamu. Pertimbangkan untuk mengeksplorasinya.'],
] as const;

export const PENGATURAN = [
  ['ambang_rendah', 50, 'Skor di bawah nilai ini berkategori rendah'],
  ['ambang_tinggi', 75, 'Skor mulai nilai ini berkategori tinggi'],
  ['ambang_aturan_y', 75, 'Ambang niat (Y) pada aturan R1–R4'],
  ['ambang_aturan_sfs', 75, 'Ambang SFS pada aturan R1–R4'],
  ['selisih_alternatif', 10, 'Selisih SFS minimal untuk menampilkan karier alternatif'],
  ['jumlah_prioritas', 3, 'Jumlah indikator prioritas pengembangan'],
] as const;

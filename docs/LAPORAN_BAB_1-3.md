**LAPORAN PROYEK REKAYASA PERANGKAT LUNAK (RPL)**

# *YourWay*: Sistem Pemodelan Niat Karier (*Career Intention*) Mahasiswa Teknik Informatika Berbasis *SoftSkill* Pemodelan Perilaku (*Behavioral Modeling*)

##

**Disusun Oleh:**

**Kelompok 4**

1. Alexa Serrafona Juliet		1251420014  
2. Fina Hidayati		1251420010  
3. Giska Sisilia Putri		1251420116  
4. Salwa Syaharani Putri		1251420120  
5. Vida Maulida Nurul Ihsan		1251420011

**PROGRAM STUDI TEKNIK INFORMATIKA**

**FAKULTAS SAINS DAN TEKNOLOGI** 

**UIN SYARIF HIDAYATULLAH JAKARTA**

**2026**

# **DAFTAR ISI**  {#daftar-isi}

[DAFTAR ISI	2](#daftar-isi)

[ABSTRAK	4](#abstrak)

[BAB I PENDAHULUAN	5](#bab-i-pendahuluan)

[1.1. Latar Belakang	5](#1.1.-latar-belakang)

[1.2. Rumusan Masalah	6](#1.2.-rumusan-masalah)

[1.3 Tujuan	6](#1.3-tujuan)

[1.3.1 Tujuan Umum	6](#1.3.1-tujuan-umum)

[1.3.2 Tujuan Khusus	6](#1.3.2-tujuan-khusus)

[1.4 Output	6](#1.4-output)

[BAB II TINJAUAN PUSTAKA	8](#bab-ii-tinjauan-pustaka)

[2.1 Siklus Pengembangan Sistem	8](#2.1-siklus-pengembangan-sistem)

[2.1.1 Software Development Life Cycle (SDLC)	8](#2.1.1-software-development-life-cycle-\(sdlc\))

[2.1.2 Agile dan Scrum	8](#2.1.2-agile-dan-scrum)

[2.2 Niat Karier (Career Intention)	9](#2.2-niat-karier-\(career-intention\))

[2.2.1 Definisi Niat karier (Career Intention)	9](#2.2.1-definisi-niat-karier-\(career-intention\))

[2.2.2 Alasan Niat dijadikan variabel pusat	9](#2.2.2-alasan-niat-dijadikan-variabel-pusat)

[2.2.3 Perbedaan Niat Karier dan Kesiapan Kerja	9](#2.2.3-self-efficacy-dalam-pengambilan-keputusan-karier)

[2.2.4 Self-Efficacy dalam Pengambilan Keputusan Karier	10](#heading=h.1gh9ktnv0dug)

[2.3 Technology Acceptance Model (TAM) dan Unified Theory of Acceptance and Use of Technology (UTAUT)	11](#2.3-technology-acceptance-model-\(tam\)-dan-unified-theory-of-acceptance-and-use-of-technology-\(utaut\))

[2.3.1 TAM, UTAUT, dan Konstruk Behavorial Intention	11](#2.3.1-tam,-utaut,-dan-konstruk-behavorial-intention)

[2.3.2 Perluasan dengan Faktor Individu	11](#2.3.2-perluasan-dengan-faktor-individu)

[2.3.3 Adaptasi pada Penelitian	11](#2.3.3-adaptasi-pada-penelitian)

[2.3.4 Penelitian TAM/UTAUT dan Niat Karier	12](#2.3.4-penelitian-tam/utaut-dan-niat-karier)

[2.3.5 Batasan Penggunaan	13](#2.3.5-batasan-penggunaan)

[2.4 Soft Skill menurut MSIS 2016 dan ASEC (2016)	13](#2.4-soft-skill-menurut-msis-2016-dan-asec-\(2016\))

[2.4.1 MSIS 2016	13](#2.4.1-msis-2016)

[2.4.2 ASEC (2016)	13](#2.4.2-asec-\(2016\))

[2.4.3 Pemetaan MSIS 2016 dan ASEC ke Variabel Penelitian (crosswalk)	14](#2.4.3-pemetaan-msis-2016-dan-asec-ke-variabel-penelitian-\(crosswalk\))

[2.4.3 Pemetaan MSIS 2016 dan ASEC ke Variabel Penelitian (crosswalk)	15](#2.4.3-pemetaan-msis-2016-dan-asec-ke-variabel-penelitian-\(crosswalk\)-1)

[2.5 Peta Karier Nasional	15](#2.5-peta-karier-nasional)

[2.5.1 Struktur Peta Karier	15](#2.5.1-struktur-peta-karier)

[2.5.2 Daftar 16 Karier dan Padanannya	16](#2.5.2-daftar-16-karier-dan-padanannya)

[2.5.3 Alasan Jenjang Entry-Level	17](#2.5.3-alasan-jenjang-entry-level)

[2.6 Pemodelan Perilaku (Behavioral Modeling)	17](#2.6-pemodelan-perilaku-\(behavioral-modeling\))

[2.7 Skor Berbobot dan Sistem Berbasis Aturan (Rule-Based)	18](#2.7-skor-berbobot-dan-sistem-berbasis-aturan-\(rule-based\))

[2.7.1 Skala Likert dan Normalisasi min-max	18](#2.7.1-skala-likert-dan-normalisasi-min-max)

[2.7.2 Skor X1, X2, dan Y	18](#2.7.2-skor-x1,-x2,-dan-y)

[2.7.3 Kategori Skor	18](#2.7.3-kategori-skor)

[2.7.4 Profil Kebutuhan Soft Skill per Karier dan Konsep Gap	18](#2.7.4-profil-kebutuhan-soft-skill-per-karier-dan-konsep-gap)

[2.7.5 Sistem Berbasis Aturan (Rule-Based)	19](#2.7.5-sistem-berbasis-aturan-\(rule-based\))

[2.8 Sistem Rekomendasi Karier Berbasis Web	19](#2.8-sistem-rekomendasi-karier-berbasis-web)

[2.9 Pengujian Perangkat Lunak	19](#2.9-pengujian-perangkat-lunak)

[2.9.1 Black-Box Testing	19](#2.9.1-black-box-testing)

[2.9.2 User Acceptance Testing (UAT)	19](#2.9.2-user-acceptance-testing-\(uat\))

[2.9.3 System Usability Scale (SUS)	20](#2.9.3-system-usability-scale-\(sus\))

[2.10 Keamanan dan Privasi Data	20](#2.10-keamanan-dan-privasi-data)

[2.11 Penelitian Terdahulu	20](#2.11-penelitian-terdahulu)

[2.12 Kerangka Pemikiran dan Hipotesis	21](#2.12-kerangka-pemikiran-dan-hipotesis)

[2.12.1. Posisi Penelitian	21](#2.12.1.-posisi-penelitian)

[2.12.2. Kerangka Pemikiran	22](#2.12.2.-kerangka-pemikiran)

[2.12.3. Hipotesis	22](#2.12.3.-hipotesis)

[BAB III METODOLOGI	23](#bab-iii-metodologi)

[3.1. Metode Pengembangan Perangkat Lunak (Agile)	23](#3.1.-metode-pengembangan-perangkat-lunak-\(agile\))

[3.2. Model Penelitian dan Definisi Operasional Variabel	24](#3.2.-model-penelitian-dan-definisi-operasional-variabel)

[3.3. Metode Pengumpulan Data	1](#3.4.-metode-pengumpulan-data)

[3.4. Metode Analisis dan Pemodelan	1](#3.5.-metode-analisis-dan-pemodelan)

[3.6.1. Perhitungan Skor Variabel	1](#3.5.1.-perhitungan-skor-variabel)

[3.6.2. Profil Kesesuaian Soft Skill terhadap karier	1](#3.5.2.-profil-kesesuaian-soft-skill-terhadap-karier)

[3.6.3. Aturan Rekomendasi (Rule-Based)	1](#3.5.3.-aturan-rekomendasi-\(rule-based\))

[3.6.4. Analisis Hubungan Variabel	1](#3.5.4.-analisis-hubungan-variabel)

[3.7. Analisis Kebutuhan Sistem	1](#3.6.-analisis-kebutuhan-sistem)

[3.7.1. Stakeholder	1](#3.6.1.-stakeholder)

[3.7.2. Kebutuhan Fungsional	1](#3.6.2.-kebutuhan-fungsional)

[3.7.3. Kebutuhan Nonfungsional	1](#3.6.3.-kebutuhan-nonfungsional)

[3.8. Pemodelan Sistem (UML)	1](#3.7.-pemodelan-sistem-\(uml\))

[3.8.1. Use Case Diagram	1](#3.7.1.-use-case-diagram)

[3.8.2. Activity Diagram	1](#3.7.2.-activity-diagram)

[3.8.3. Sequence Diagram	1](#3.7.3.-sequence-diagram)

[3.8.4. Entity Relationship Diagram (ERD)	1](#3.7.4.-entity-relationship-diagram-\(erd\))

[3.9. Perancangan Antarmuka dan Arsitektur	1](#3.8.-perancangan-antarmuka-dan-arsitektur)

[3.9.1. Userflow	1](#3.8.1.-userflow)

[3.9.2 Prototype	1](#3.8.2-prototype)

[3.10 Arsitektur Sistem	1](#3.9-arsitektur-sistem)

[3.10.1 Arsitektur Sistem	1](#3.9.1-arsitektur-sistem)

[3.10.2 Lingkungan Pengembangan	1](#3.9.2-lingkungan-pengembangan)

[3.10. Rencana Pengujian dan Evaluasi	1](#3.10.-rencana-pengujian-dan-evaluasi)

[DAFTAR PUSTAKA	1](#daftar-pustaka)

# **ABSTRAK** {#abstrak}

Mahasiswa Teknik Informatika dihadapkan pada banyak pilihan okupasi bidang Teknologi Informasi dan Komunikasi (TIK), tetapi pilihan karier sering ditentukan berdasarkan perasaan atau pengaruh teman tanpa ukuran yang jelas. Kondisi ini menyulitkan mahasiswa dan program studi dalam memahami kekuatan niat karier serta soft skill yang perlu dikembangkan. Proyek ini bertujuan merancang dan membangun YourWay, aplikasi web yang mengukur niat karier (*Career Intention*) mahasiswa berdasarkan soft skill. Variabel yang diukur terdiri atas Career Intention (Y), Intrapersonal Soft Skill (X1), dan Interpersonal Soft Skill (X2), dengan landasan TAM/UTAUT untuk konstruk niat, MSIS 2016 dan ASEC (2016) untuk soft skill, serta Peta Okupasi Kominfo untuk 16 okupasi TIK. Mahasiswa memilih satu okupasi, lalu mengisi kuesioner berskala Likert. Sistem menghitung skor Y, X1, dan X2, kemudian membandingkan profil soft skill dengan kebutuhan okupasi pilihan dalam bentuk Soft Skill Fit Score. Hasilnya berupa skor, tingkat kesesuaian, serta rekomendasi pengembangan soft skill yang ditentukan oleh aturan (rule-based), sedangkan AI hanya menyusun penjelasan dari hasil yang telah dihitung. Sistem dikembangkan dengan metode Agile berlandaskan pemodelan perilaku (Behavioral Modeling) dan dirancang menggunakan UML. Pengujian akan dilakukan melalui black-box testing, User Acceptance Testing (UAT), dan System Usability Scale (SUS). Sistem ini diharapkan membantu mahasiswa memahami niat kariernya berdasarkan data serta menentukan soft skill yang perlu dikembangkan*.*

***Kata kunci:** career intention, soft skill, TAM/UTAUT, MSIS 2016, okupasi TIK, behavioral modeling, aplikasi web*

# **BAB I** **PENDAHULUAN** {#bab-i-pendahuluan}

## **1.1. Latar Belakang** {#1.1.-latar-belakang}

Banyak mahasiswa bidang Teknologi Informasi dan Komunikasi (TIK) memasuki perkuliahan tanpa pemikiran karier yang matang dan belum mampu menjabarkan karier seperti apa yang mereka inginkan (McKenzie & Bennett, 2022). Pilihan tersebut dipengaruhi antara lain oleh efikasi diri dan persepsi diri (McKenzie & Bennett, 2022), sehingga sulit dievaluasi secara objektif. Akibatnya, mahasiswa tidak memiliki gambaran apa yang perlu dikembangkan agar niat karier tersebut dapat diwujudkan. 

Masalah ini semakin terasa karena bidang TIK menyediakan ragam okupasi/pekerjaan yang luas. Peta Okupasi Nasional dalam Kerangka Kualifikasi Nasional Indonesia (KKNI) pada area fungsi TIK yang disusun Kominfo (2017) memetakan jabatan ke dalam 16 area fungsi, misalnya *Programming and Software Development*, *Network and Infrastructure*, *IT Security and Compliance*, dan *IT Multimedia*, dengan sembilan jenjang kualifikasi. Banyaknya pilihan membuka peluang, tetapi sekaligus menuntut mahasiswa memiliki dasar yang lebih kuat dalam menentukan okupasi/pekerjaan yang ingin ditempuh. Di sisi lain, pembelajaran di kampus belum sepenuhnya sejalan dengan kebutuhan industri, antara lain karena kurikulum yang kurang adaptif dan minimnya praktik lapangan (Ariani dkk., 2024). Karena itu, dasar yang kuat tersebut perlu dimulai dari pemahaman yang terukur terhadap arah karier mahasiswa sendiri.

Untuk memahami pilihan karier secara terukur, penelitian ini memakai konsep niat (*intention*). Dalam *Technology Acceptance Model* (TAM) dan *Unified Theory of Acceptance and Use of Technology* (UTAUT), niat berperilaku (*behavioral intention*) merupakan penentu terdekat dari perilaku yang kemudian dilakukan seseorang. Teori ini dapat diadaptasi untuk menjelaskan kecenderungan mahasiswa menempuh suatu okupasi/pekerjaan, yaitu niat karier (*career intention*). Adaptasi UTAUT pada bidang komputer telah dilakukan, misalnya oleh Idemudia dkk. (2016) menggunakan UTAUT untuk menjelaskan niat mahasiswa menulis kode program. Dengan demikian, niat karier layak menjadi variabel pusat penelitian. 

Faktor individu yang diduga membentuk niat karier dalam penelitian ini adalah *soft skill*. Model kompetensi global MSIS 2016 (Topi dkk., 2017\) menempatkan kompetensi fondasi individu, seperti berpikir kritis, pemecahan masalah, kolaborasi, dan komunikasi, sebagai bagian dari kompetensi lulusan, sedangkan ASEC (2016) membedakan *soft skill* menjadi kelompok intrapersonal dan interpersonal. Penelitian ini sengaja membatasi diri pada *soft skill* dan tidak memasukkan *hard skill*. Pembatasan ini menjaga variabel tetap terarah pada tujuan, yaitu memodelkan niat karier, serta menghindari tumpang tindih dengan kajian kesiapan kerja yang mengukur kemampuan teknis. Dengan demikian, niat karier (*career intention*) diposisikan sebagai variabel dependen dan *soft skill* sebagai variabel independen.

Penelitian terdahulu telah menjawab sebagian persoalan ini, tetapi belum sepenuhnya. Saifuddin (2024) mengembangkan sistem rekomendasi karier berbasis web untuk lulusan *Computer Science* dan TI dengan menyertakan atribut psikologis. Dari tinjauan yang dilakukan, belum ditemukan sistem yang menempatkan niat karier sebagai pusat model dengan variabel *soft skill* berbasis MSIS 2016 dan ASEC (2016) serta pilihan okupasi/pekerjaan berbasis Peta Okupasi Kominfo. Klaim ini dibatasi pada penelitian yang ditinjau. Kesenjangan tersebut juga nyata di Program Studi Teknik Informatika UIN Syarif Hidayatullah Jakarta, yang mahasiswanya memiliki latar minat dan karakter yang beragam, sementara gambaran terukur tentang niat karier dan *soft skill* mereka belum tersedia. Kondisi ini menunjukkan perlunya alat yang dapat memodelkan niat karier berdasarkan *soft skill*.

Berdasarkan hal tersebut, proyek ini mengembangkan *YourWay*, sebuah aplikasi web yang menempatkan *Career Intention* sebagai pusat model. Mahasiswa memilih karier TIK yang diinginkan dari 16 karier, lalu mengisi kuesioner niat karier dan *soft skill*. Dari jawaban tersebut, sistem menyusun profil berdasarkan tiga variabel, yaitu *Career Intention* (Y), *Intrapersonal Soft Skill* (X1), dan *Interpersonal Soft Skill* (X2). Profil *soft skill* dibandingkan dengan kebutuhan okupasi pilihan untuk menghasilkan *Soft Skill Fit Score* dan selisih (*gap*) per indikator. Hasilnya berupa skor niat dan *soft skill*, tingkat kesesuaian dengan okupasi pilihan, serta rekomendasi pengembangan *soft skill* yang penjelasannya disusun oleh AI. Perhitungan memakai pembobotan skor dan aturan (*rule-based*) agar hasilnya bisa ditelusuri, sementara AI hanya dipakai untuk menyusun penjelasan dari hasil yang sudah dihitung. Dengan sistem ini, mahasiswa diharapkan dapat memahami niat kariernya dan kecocokannya berdasarkan data. 

## **1.2. Rumusan Masalah** {#1.2.-rumusan-masalah}

Berdasarkan latar belakang di atas, masalah utama dalam proyek ini adalah mahasiswa Teknik Informatika belum memiliki alat yang dapat mengukur niat karier (*career intention*) berdasarkan *soft skill* yang dimiliki. 

## **1.3 Tujuan** {#1.3-tujuan}

### **1.3.1 Tujuan Umum** {#1.3.1-tujuan-umum}

Merancang dan membangun aplikasi web *YourWay* yang mengukur niat karier mahasiswa Teknik Informatika berdasarkan *soft skill*, mencocokkannya dengan kebutuhan okupasi pilihan, dan memberikan rekomendasi pengembangan *soft skill*. 

### **1.3.2 Tujuan Khusus** {#1.3.2-tujuan-khusus}

1. Menyusun instrumen kuesioner berskala Likert untuk Career Intention (Y), Intrapersonal Soft Skill (X1), dan Interpersonal Soft Skill (X2).  
2. Mengimplementasikan perhitungan skor Y, X1, X2, dan Soft Skill Fit Score (SFS) dengan pembobotan skor (weighted scoring), serta aturan rekomendasi (rule-based system).  
3. Menyajikan hasil dan rekomendasi pengembangan *soft skill* menuju okupasi  
4. Mengembangkan sistem dengan pendekatan Agile yang dikerjakan iteratif per sprint.  
5. Menguji sistem melalui black-box testing, User *Acceptance Test* (UAT), dan *System Usability Scale* (SUS) dengan skor minimal 70\.

## **1.4 Output** {#1.4-output}

Output yang dihasilkan dari proyek ini adalah:

1. Aplikasi web YourWay untuk dua jenis pengguna, yaitu Mahasiswa dan Operator Admin. Mahasiswa dapat mengisi kuesioner, melihat skor dan profil karier yang sesuai dan melihat rekomendasi. Operator Admin dapat mengelola butir kuesioner, bobot, aturan, profil kareir, dan akun.  
2. Instrumen kuesioner berskala Likert untuk niat karier terhadap 16 karier, X1, dan X2.  
3. Dokumen analisis dan perancangan: spesifikasi kebutuhan, diagram UML, ERD, dan prototipe UI/UX.  
4. Laporan pengujian: black-box testing, UAT, dan SUS.  
5. Dokumentasi pendukung, berupa panduan pengguna (user manual) dan dokumentasi teknis.

# 

# **BAB II** **TINJAUAN PUSTAKA** {#bab-ii-tinjauan-pustaka}

## **2.1 Siklus Pengembangan Sistem**  {#2.1-siklus-pengembangan-sistem}

### **2.1.1 Software Development Life Cycle (SDLC)** {#2.1.1-software-development-life-cycle-(sdlc)}

SDLC adalah rangkaian tahapan yang dilalui sebuah sistem dari gagasan hingga digunakan, yaitu perencanaan, analisis kebutuhan, desain, implementasi, pengujian, dan pemeliharaan. Model yang umum dibahas antara lain *Waterfall*, *V-Model*, *Spiral*, *Iterative-Incremental*, serta model *agile* seperti *Scrum*, *Kanban*, dan *Extreme Programming*. Gagana dan Devaki (2023) mengulas berbagai model SDLC, yaitu *Agile*, *Waterfall*, *V-shaped*, *Spiral*, hingga *DevOps*, lalu membandingkannya berdasarkan batasan proyek, termasuk arah integrasinya dengan *machine learning*. Perbandingan singkat yang relevan untuk proyek ini disajikan pada Tabel 2.1. 

**Tabel 2.1 Perbandingan model SDLC untuk *YourWay***

| Model | Karakter | Kecocokan untuk *YourWay* |
| :---: | :---: | :---: |
| *Waterfall* | Berurutan, setiap tahap selesai dahulu baru lanjut | Kurang cocok, karena butir kuesioner dan bobot penilaian kemungkinan berubah setelah diuji |
| *Spiral* | Iteratif dengan analisis risiko di setiap putaran | Bisa, tetapi terlalu berat untuk tim mahasiswa |
| *Agile* (*Scrum*) | Iterasi pendek dengan umpan balik rutin | Paling cocok untuk tim kecil dengan waktu terbatas |

### **2.1.2 *Agile* dan *Scrum***  {#2.1.2-agile-dan-scrum}

*Agile* adalah pendekatan pengembangan yang menekankan iterasi pendek, kolaborasi, dan kesiapan menerima perubahan. *Scrum* adalah kerangka kerja *Agile* yang paling sering dipakai: pekerjaan dibagi ke dalam *sprint*, kebutuhan dikelola dalam *product backlog*, dan hasil setiap *sprint* dievaluasi. Nova dkk. (2022) meninjau penerapan *Agile* pada pengembangan sistem informasi berbasis situs web melalui *systematic literature review*, dengan hasil bahwa *Scrum* paling banyak dipakai. *Agile*/*Scrum* relevan untuk *YourWay* karena tiga alasan.

1. Sistem berbentuk web, dan penelitian pengembangan web banyak memakai *Scrum* (Nova dkk., 2022).  
2. Komponen inti seperti kuesioner, aturan skor, dan rekomendasi hampir pasti direvisi setelah diuji ke pengguna.  
3. Pekerjaan dapat dibagi per *sprint*, misalnya *Sprint* 1 untuk autentikasi dan kuesioner, *Sprint* 2 untuk mesin penilaian, *Sprint* 3 untuk rekomendasi dan *dashboard*, serta *Sprint* 4 untuk pengujian.

## **2.2 Niat Karier (*Career Intention*)** {#2.2-niat-karier-(career-intention)}

### **2.2.1 Definisi Niat karier (*Career Intention*)** {#2.2.1-definisi-niat-karier-(career-intention)}

Niat karier dipahami sebagai kecenderungan dan komitmen seseorang untuk menempuh suatu karier atau jalur karier tertentu di masa depan. Niat belum sama dengan perilaku, tetapi menjadi penanda terdekat arah tindakan seseorang. Pada mahasiswa, niat karier tampak dari minat terhadap suatu karier, rencana yang disusun, usaha persiapan yang dilakukan, dan kemantapan pilihan. Sondakh dan Tulung (2024) menelaah niat mahasiswa akuntansi tingkat akhir di tiga perguruan tinggi Indonesia untuk menempuh karier akuntan dengan memadukan *Social Cognitive Career Theory* dan *Theory of Reasoned Action*. Mereka menemukan bahwa *self-efficacy* memengaruhi niat berperilaku menempuh karier tersebut, baik secara langsung maupun melalui ekspektasi hasil, norma subjektif, dan sikap. Konsep self-efficacy dan relevansinya terhadap niat karier dibahas lebih lanjut pada Subbab 2.2.3. Temuan ini menunjukkan bahwa niat karier lazim diperlakukan sebagai konstruk yang dapat diukur dan dijelaskan oleh faktor individu.

### **2.2.2 Alasan Niat dijadikan variabel pusat** {#2.2.2-alasan-niat-dijadikan-variabel-pusat}

Niat karier dipilih sebagai variabel pusat (Y) karena tiga alasan. Pertama, pada TAM dan UTAUT niat berperilaku (*behavioral intention*) merupakan konstruk yang mendahului perilaku nyata (Davis, 1989; Venkatesh dkk., 2003), sehingga niat dapat diukur sebelum mahasiswa lulus dan memilih pekerjaan. Kedua, mahasiswa Teknik Informatika menghadapi banyak pilihan karier, sedangkan penelitian pada mahasiswa program studi TI di Australia menunjukkan bahwa aspirasi karier mereka umumnya luas dan sulit dijabarkan, termasuk apa yang sebenarnya dikerjakan dalam karier tersebut (McKenzie & Bennett, 2022). Ketiga, niat memungkinkan sistem menanyakan hal yang paling dekat dengan pengambilan keputusan mahasiswa, yaitu karier apa yang ingin ditempuh dan seberapa kuat dorongannya, lalu membandingkannya dengan profil *soft skill* yang dimiliki.

### **2.2.3 *Self-Efficacy* dalam Pengambilan Keputusan Karier** {#2.2.3-self-efficacy-dalam-pengambilan-keputusan-karier}

Self-efficacy atau efikasi diri adalah keyakinan seseorang terhadap kemampuannya untuk mengorganisasi dan melaksanakan tindakan yang diperlukan guna mencapai tujuan tertentu (Bandura, 1997). Efikasi diri perlu dibedakan dari kemampuan objektif dan soft skill. Soft skill merujuk pada kompetensi atau keterampilan yang digunakan seseorang, sedangkan self-efficacy merujuk pada keyakinan seseorang bahwa ia mampu menggunakan kemampuan tersebut dalam situasi tertentu. Oleh karena itu, mahasiswa dapat memiliki keterampilan tertentu tetapi belum yakin mampu menerapkannya dalam tugas atau lingkungan kerja; sebaliknya, keyakinan diri yang tinggi tidak otomatis membuktikan bahwa keterampilan yang diperlukan sudah memadai.

Dalam konteks karier, Social Cognitive Career Theory (SCCT) menempatkan self-efficacy bersama ekspektasi hasil (outcome expectations) dan tujuan personal sebagai mekanisme penting yang berkaitan dengan pembentukan minat, pilihan, serta ketekunan dalam jalur pendidikan dan pekerjaan (Lent, Brown, & Hackett, 1994). Temuan Sondakh dan Tulung (2024) juga menunjukkan bahwa self-efficacy berkaitan dengan niat mahasiswa untuk menempuh karier akuntansi, baik secara langsung maupun melalui ekspektasi hasil, norma subjektif, dan sikap. Sementara itu, Rahmadani dan Mardalis (2022) menguji self-efficacy bersama soft skill, motivasi, dan aktivitas organisasi dalam kaitannya dengan kesiapan kerja. Penelitian Rahmadani dan Mardalis menjadi pembanding karena luaran yang mereka teliti adalah kesiapan kerja, bukan niat memilih okupasi TIK.

Dalam penelitian YourWay, *self-efficacy* digunakan sebagai konsep teoretis pendukung untuk menjelaskan mengapa keyakinan individu dapat berkaitan dengan niat karier, bukan sebagai variabel yang diukur atau diuji secara terpisah. Model empiris tetap berfokus pada Intrapersonal Soft Skill (X1) dan Interpersonal Soft Skill (X2) sebagai variabel yang diuji hubungannya dengan Career Intention (Y). Karena itu, instrumen, perhitungan skor, dan hipotesis penelitian ini tidak menambahkan skor atau hipotesis *self-efficacy*. Batasan ini menjaga konsistensi antara landasan teori dan model penelitian yang telah ditetapkan.

## **2.3 *Technology Acceptance Model* (TAM) dan *Unified Theory of Acceptance and Use of Technology* (UTAUT)** {#2.3-technology-acceptance-model-(tam)-dan-unified-theory-of-acceptance-and-use-of-technology-(utaut)}

### **2.3.1 TAM, UTAUT, dan Konstruk *Behavorial Intention*** {#2.3.1-tam,-utaut,-dan-konstruk-behavorial-intention}

TAM (Davis, 1989\) menjelaskan bahwa penerimaan teknologi ditentukan oleh persepsi manfaat (*perceived usefulness*) dan persepsi kemudahan penggunaan (*perceived ease of use*) yang membentuk niat berperilaku (*behavioral intention*), lalu mengarah ke penggunaan nyata. Model ini memberi ruang bagi variabel eksternal untuk memengaruhi kedua persepsi tersebut. UTAUT (Venkatesh dkk., 2003\) menyatukan delapan model penerimaan teknologi sebelumnya dan menyatakan bahwa niat berperilaku dipengaruhi oleh *performance expectancy*, *effort expectancy*, dan *social influence*, sedangkan perilaku penggunaan dipengaruhi oleh niat dan *facilitating conditions*. Usia, jenis kelamin, pengalaman, dan kesukarelaan berperan sebagai moderator. Pada kedua teori, *behavioral intention* diperlakukan sebagai penanda terdekat perilaku nyata sehingga menjadi konstruk pusat yang diukur.

### **2.3.2 Perluasan dengan Faktor Individu** {#2.3.2-perluasan-dengan-faktor-individu}

TAM dan UTAUT lazim diperluas dengan variabel yang sesuai konteks. Zhou dkk. (2022) memperluas TAM dengan variabel eksternal tambahan untuk menjelaskan niat mahasiswa di sebuah universitas di Tiongkok memakai platform pendidikan daring. Bisaso dan Fava (2026) memperluas UTAUT dengan konstruk faktor individu, yaitu *digital confidence*, pada 957 mahasiswa komputasi dari 13 universitas di Uganda. Hasilnya, *performance expectancy* dan *effort expectancy* menjadi prediktor terkuat niat berperilaku, sedangkan *facilitating conditions* berperan penting pada perilaku penggunaan. Kedua penelitian menunjukkan bahwa kerangka niat berperilaku dapat diperluas dengan faktor individu tanpa kehilangan struktur dasarnya.

### **2.3.3 Adaptasi pada Penelitian** {#2.3.3-adaptasi-pada-penelitian}

TAM/UTAUT pada dasarnya menjelaskan niat menggunakan teknologi, bukan niat memilih karier. Karena itu penelitian ini mengadaptasinya dengan dua langkah. Pertama, objek niat diganti dari “teknologi” menjadi “okupasi TIK”, sehingga *behavioral intention* menjadi *career intention* (Y). Kedua, faktor yang membentuk niat adalah faktor individu berupa *soft skill*, yang diperlakukan seperti variabel eksternal dalam TAM, yaitu *Intrapersonal Soft Skill* (X1) dan *Interpersonal Soft Skill* (X2). Self-efficacy juga diakui dalam literatur pengembangan karier, tetapi dalam penelitian ini dibahas sebagai landasan teoretis pendukung dan tidak dijadikan variabel terukur (Subbab 2.2.4 dan 2.3.5). Adaptasi konstruk yang diuji diringkas pada Tabel 2.2.

**Tabel 2.2 Adaptasi konstruk TAM/UTAUT pada *YourWay***

| Konstruk pada TAM/UTAUT | Peran pada Teori Asal | Peran pada Penelitian  |
| :---: | :---: | :---: |
| *Behavioral Intention* | Niat menggunakan teknologi | Diadaptasi menjadi *Career Intention* (Y), yaitu niat menempuh okupasi TIK |
| Variabel eksternal (TAM) | Memengaruhi persepsi manfaat dan kemudahan | *Soft skill* intrapersonal (X1) dan interpersonal (X2) |
| *Performance expectancy*, *effort expectancy*, *social influence* | Penentu niat pada UTAUT | Tidak dijadikan variabel |
| *Facilitating conditions*, *use behavior* | Penentu dan hasil perilaku penggunaan | Tidak dijadikan variabel |

Catatan: self-efficacy tidak ditambahkan sebagai konstruk dalam adaptasi TAM/UTAUT yang diuji pada penelitian ini; konsep tersebut dibahas sebagai landasan pendukung pada Subbab 2.2.4.

### **2.3.4 Penelitian TAM/UTAUT dan Niat Karier** {#2.3.4-penelitian-tam/utaut-dan-niat-karier}

Tiga penelitian dijadikan rujukan untuk adaptasi TAM/UTAUT. Pertama, Bisaso dan Fava (2026) menerapkan UTAUT pada penerimaan platform bimbingan karier berbasis AI oleh mahasiswa komputasi, sehingga relevan sebagai preseden penggunaan UTAUT pada konteks karier mahasiswa TI, meskipun objek niatnya adalah platform, bukan okupasi. Kedua, Sondakh dan Tulung (2024) meneliti niat menempuh karier akuntansi dan menemukan hubungan self-efficacy dengan niat tersebut; penelitian ini mendukung relevansi faktor individu dalam penjelasan niat karier, meskipun objek kariernya bukan bidang TIK. Ketiga, McKenzie dan Bennett (2022) meneliti pilihan jurusan dan aspirasi karier mahasiswa TI dengan Social Cognitive Career Theory, yang menegaskan pentingnya faktor individu dalam membentuk minat dan pilihan karier. SCCT juga menempatkan *self-efficacy*, ekspektasi hasil, dan tujuan personal sebagai mekanisme penting dalam perkembangan karier (Lent, Brown, & Hackett, 1994). Dengan demikian, *self-efficacy* memperkaya dasar teoretis penelitian ini, tetapi tidak menjadi variabel yang diuji. Dari pustaka yang ditinjau, belum ditemukan penelitian yang memakai UTAUT untuk menjelaskan niat memilih okupasi TIK dengan model soft skill intrapersonal dan interpersonal seperti yang diusulkan YourWay. Klaim ini dibatasi pada pustaka yang ditinjau.

### **2.3.5 Batasan Penggunaan** {#2.3.5-batasan-penggunaan}

Empat konstruk inti UTAUT tidak dijadikan variabel karena penelitian ini sengaja dibatasi pada soft skill. Self-efficacy juga tidak dijadikan variabel terukur, meskipun konsep dan relevansinya terhadap niat karier dibahas dalam Subbab 2.2.4. Dengan demikian, TAM/UTAUT berfungsi sebagai landasan konseptual untuk menempatkan niat sebagai konstruk pusat dan faktor individu yang dipilih, yaitu soft skill intrapersonal dan interpersonal, sebagai faktor yang diuji; penelitian ini bukan pengujian UTAUT secara utuh ataupun pengujian pengaruh self-efficacy. Batasan ini perlu diperhatikan saat menafsirkan hasil: penelitian tidak dapat menyimpulkan pengaruh *self-efficacy* karena variabel tersebut tidak diukur.

## **2.4 *Soft Skill* menurut MSIS 2016 dan ASEC (2016)** {#2.4-soft-skill-menurut-msis-2016-dan-asec-(2016)}

### **2.4.1 MSIS 2016** {#2.4.1-msis-2016}

*Global Competency Model for Graduate Degree Programs in Information Systems* (MSIS 2016\) disusun oleh gugus tugas bersama *Association for Information Systems* (AIS) dan ACM, dan versi finalnya diterbitkan dalam *Communications of the Association for Information Systems* (Topi dkk., 2017). Model ini mengalihkan fokus dari daftar mata kuliah ke kompetensi yang diharapkan dimiliki lulusan. MSIS 2016 membedakan kompetensi sistem informasi (*IS competencies*), kompetensi fondasi individu (*individual foundational competencies*), dan kompetensi domain. Kompetensi fondasi individu mencakup berpikir kritis, kreativitas, kolaborasi dan kerja tim, analisis etika, kompetensi antarbudaya, kepemimpinan, kompetensi matematika dan statistika, negosiasi, komunikasi lisan, pemecahan masalah, dan komunikasi tulis. Penelitian ini memakai sepuluh di antaranya sebagai dasar *soft skill*. Kompetensi matematika dan statistika tidak dipakai karena sifatnya kuantitatif dan teknis, sehingga lebih dekat ke *hard skill*.

### **2.4.2 ASEC (2016)** {#2.4.2-asec-(2016)}

ASEC (2016) dirujuk untuk pengelompokan soft skill ke dalam dua dimensi. Dimensi intrapersonal mencakup kemampuan mengelola diri sendiri, antara lain kejujuran, optimisme, pengembangan diri, fleksibilitas, disiplin, pengendalian diri, empati, dan integritas. Dimensi interpersonal mencakup kemampuan berinteraksi dengan orang lain, yaitu kerja sama, komunikasi verbal, komunikasi tertulis, negosiasi, dan manajemen konflik. Dalam penelitian ini, *soft skill* diperlakukan sebagai kompetensi yang menjadi indikator X1 dan X2, sedangkan self-efficacy adalah keyakinan individu atas kemampuannya untuk melaksanakan tindakan tertentu. Keduanya berkaitan, tetapi bukan konstruk yang sama; self-efficacy tidak ditambahkan sebagai indikator soft skill atau skor baru dalam YourWay (Subbab 2.2.4).

Peran soft skill dalam perjalanan karier mahasiswa juga didukung penelitian terbaru. Ingusci dkk. (2026) menguji 501 mahasiswa perguruan tinggi di Italia dan menemukan bahwa soft skill memprediksi secara signifikan sumber daya psikologis, persepsi employability, perilaku mencari tantangan, dan perilaku aktif mencari kerja, dengan pola yang serupa pada mahasiswa STEM dan non-STEM. Temuan ini menjadi alasan mengapa soft skill layak diposisikan sebagai faktor pembentuk niat, sambil tetap memperhatikan bahwa penelitian tersebut berfokus pada *employability*, bukan niat memilih okupasi.

### **2.4.3 Pemetaan MSIS 2016 dan ASEC ke Variabel Penelitian (*crosswalk*)** {#2.4.3-pemetaan-msis-2016-dan-asec-ke-variabel-penelitian-(crosswalk)}

Kedua kerangka dipadukan agar setiap indikator memiliki dasar sumber. Indikator yang tidak memiliki padanan langsung di MSIS 2016 ditopang oleh kompetensi tambahan (*extended competencies*) yang disarankan dosen. Pengelompokan ke X1 didasarkan pada sifat kemampuan yang berpusat pada pengelolaan pikiran, sikap, dan perilaku diri sendiri, sedangkan pengelompokan ke X2 didasarkan pada kemampuan yang baru bermakna ketika berhadapan dengan orang lain.

**Tabel 2.3 Pemetaan indikator *soft skill* (*crosswalk* MSIS 2016 dan ASEC)**

| Variabel | Indikator | Dasar MSIS 2016 / kompetensi tambahan | Dasar ASEC (2016) |
| :---: | ----- | ----- | ----- |
| X1 | Critical Thinking | MSIS 2016 | – |
| X1 | Problem Solving | MSIS 2016 | – |
| X1 | Creativity | MSIS 2016 | – |
| X1 | Ethical Analysis | MSIS 2016 | Integritas, kejujuran |
| X1 | Self-development | Tambahan: *Lifelong Learning* | Pengembangan diri |
| X1 | Flexibility | Tambahan: *Adaptability* | Fleksibilitas |
| X1 | Discipline | Tambahan: *Self-Management* | Disiplin |
| X2 | Collaboration and Teamwork | MSIS 2016 | Kerja sama |
| X2 | Oral Communication | MSIS 2016 | Komunikasi verbal |
| X2 | Written Communication | MSIS 2016 | Komunikasi tertulis |
| X2 | Negotiation | MSIS 2016 | Negosiasi |
| X2 | Leadership | MSIS 2016 | – |
| X2 | Intercultural Competency | MSIS 2016 | – |
| X2 | Conflict Management | – | Manajemen konflik |

### 

### **2.4.3 Pemetaan MSIS 2016 dan ASEC ke Variabel Penelitian (*crosswalk*)** {#2.4.3-pemetaan-msis-2016-dan-asec-ke-variabel-penelitian-(crosswalk)-1}

Beberapa kompetensi tidak dijadikan indikator terpisah agar variabel tetap ramping dan dapat diukur ringkas lewat kuesioner.

1. Kompetensi matematika dan statistika (MSIS 2016\) tidak dipakai karena bersifat kuantitatif dan teknis, sehingga lebih dekat ke *hard skill*.  
2. *Professionalism* tidak dipisahkan karena sudah terwakili indikator integritas pada *Ethical Analysis*.  
3. *Decision Making* tidak dipisahkan karena tumpang tindih dengan *Problem Solving*.  
4. *Innovation* tidak dipisahkan karena tumpang tindih dengan *Creativity*.  
5. Tiga unsur intrapersonal ASEC, yaitu optimisme, pengendalian diri, dan empati, tidak dimasukkan karena sulit diukur secara ringkas lewat kuesioner dan dapat ditambahkan pada pengembangan lanjutan.

## **2.5 Peta Karier Nasional** {#2.5-peta-karier-nasional}

### **2.5.1 Struktur Peta Karier** {#2.5.1-struktur-peta-karier}

Kementerian Komunikasi dan Informatika \[Kominfo\] (2017) menerbitkan Peta Karier Nasional dalam Kerangka Kualifikasi Nasional Indonesia (KKNI) pada area fungsi TIK. Peta ini menyusun jabatan dalam matriks, dengan sumbu jenjang KKNI 1 sampai 9 (dari operator pratama hingga ahli utama) dan 16 area fungsi TIK: *Data Management System*, *Programming and Software Development*, *Hardware and Digital Peripherals*, *Network and Infrastructure*, *Operation and System Tools*, *Information System and Technology Development*, *IT Governance and Management*, *IT Project Management*, *IT Enterprise Architecture*, *IT Security and Compliance*, *IT Services Management System*, *IT and Computing Facilities Management*, *IT Multimedia*, *IT Mobility and Internet of Things*, *Integration Application System*, dan *IT Consultancy and Advisory*. Rincian unit kompetensi tiap okupasi tercantum dalam Kominfo (2018).

### **2.5.2 Daftar 16 Karier dan Padanannya** {#2.5.2-daftar-16-karier-dan-padanannya}

Penelitian ini memakai 16 okupasi yang diadaptasi dari peta tersebut dan disesuaikan dengan kebutuhan lulusan TIK. Sebagian nama okupasi merupakan generalisasi dari beberapa judul jabatan pada peta, sehingga status kesesuaiannya dicatat pada Tabel 2.4.

**Tabel 2.4 Daftar 16 Karier TIK dan Padanannya pada Peta Karier Kominfo**

| No | Okupasi TIK | Area fungsi terkait | Padanan pada peta | Status |
| ----- | ----- | ----- | ----- | ----- |
| 1 | Programmer / Software Developer | Programming and Software Development | Pemrogram, *Senior Programmer*, *Software Development Expert* | Sesuai |
| 2 | System Analyst | Information System and Technology Development | *System Analyst*, *Senior Systems Analyst* | Sesuai |
| 3 | Software Engineer | Programming and Software Development | *Software Engineer*, *Lead/Senior Software Engineer* | Sesuai |
| 4 | Database Administrator | Data Management System | Database Administrator | Sesuai |
| 5 | Data Analyst / Data Management Specialist | Data Management System | *Data Analyst*; “*Data Management Specialist*” tidak persis | Sebagian |
| 6 | Network Administrator | Network and Infrastructure | *Network Administrator* (junior sampai utama) | Sesuai |
| 7 | Network Engineer | Network and Infrastructure | Network Engineer | Sesuai |
| 8 | System Administrator | Operation and System Tools | System Administrator | Sesuai |
| 9 | IT Support / IT Technician | Hardware and Digital Peripherals | *Technical Support*, *Help Desk Technician*, Teknisi Komputer | Sebagian |
| 10 | IT Project Manager | IT Project Management | Manajer Proyek TIK (*ICT Project Manager*) | Sesuai |
| 11 | IT Governance Specialist | IT Governance and Management | *IT Management Coordinator/Staff*; judul persis tidak ada | Sebagian |
| 12 | IT Security / Cybersecurity Specialist | IT Security and Compliance | Cyber Security Specialist/Analyst/Engineer | Sesuai |
| 13 | IT Service Manager | IT Services Management System | Manajer Pengelola Layanan IT (*ITSM Manager*) | Sesuai |
| 14 | Enterprise Architect | IT Enterprise Architecture | Enterprise Architect | Sesuai |
| 15 | Web / Mobile Developer | *IT Mobility and IoT*, *Programming* | Pengembang Web (*Web Developer*), Pemrogram Mobil, *Mobile Computing* | Sesuai |
| 16 | Multimedia / Digital Content Specialist | IT Multimedia | *Multimedia Specialist*, *Web Content Manager*, *Digital Artist* | Sebagian |

### **2.5.3 Alasan Jenjang *Entry-Level*** {#2.5.3-alasan-jenjang-entry-level}

Karena peta mencakup jenjang 1 sampai 9, penelitian ini membatasi acuan pada jenjang awal bagi lulusan sarjana, yaitu kisaran jenjang KKNI 5 sampai 6 (strata jabatan Teknisi/Analis Muda sampai Madya). Pembatasan ini dilakukan karena responden adalah mahasiswa yang akan memasuki dunia kerja sebagai lulusan baru, dan agar profil kebutuhan *soft skill* antarokupasi dapat dibandingkan secara adil pada jenjang yang setara.

## **2.6 Pemodelan Perilaku (*Behavioral Modeling*)** {#2.6-pemodelan-perilaku-(behavioral-modeling)}

Pemodelan perilaku adalah pendekatan merepresentasikan perilaku seseorang, misalnya kebiasaan, sikap, preferensi, dan niat, ke dalam model yang dapat dihitung dan dianalisis. Dalam rekayasa perangkat lunak, perilaku diubah menjadi atribut yang dapat dikumpulkan melalui kuesioner dan diolah oleh mesin penilaian. Tahapan pemodelannya mengikuti urutan masalah, kebutuhan, analisis perilaku, perancangan, pembangunan, pengujian, peluncuran, dan evaluasi (*Behavioral Modeling Science*, BMS).

Pada YourWay, perilaku yang dimodelkan dan dihitung hanya dua kelompok konstruk, yaitu niat karier (Y) dan *soft skill* mahasiswa yang dikelompokkan menjadi intrapersonal (X1) dan interpersonal (X2). *Self-efficacy* dibahas sebagai konsep teoretis pendukung, tetapi tidak menjadi atribut kuesioner atau skor yang diproses oleh sistem. Pendekatan pemodelan perilaku ini sejalan dengan Saifuddin (2024) yang mengembangkan sistem rekomendasi karier untuk lulusan *Computer Science* dan TI dengan memadukan latar belakang akademik, keterampilan teknis, dan ciri kepribadian, serta melaporkan bahwa atribut psikologis meningkatkan akurasi dan relevansi rekomendasi. Temuan tersebut mendukung alasan memasukkan faktor perilaku ke dalam model, bukan hanya data akademik.

## **2.7 Skor Berbobot dan Sistem Berbasis Aturan (*Rule-Based*)** {#2.7-skor-berbobot-dan-sistem-berbasis-aturan-(rule-based)}

### **2.7.1 Skala Likert dan Normalisasi *min-max*** {#2.7.1-skala-likert-dan-normalisasi-min-max}

Jawaban kuesioner memakai skala Likert 1–5. Skor mentah setiap indikator adalah rata-rata jawaban butirnya, kemudian dinormalisasi ke rentang 0–100 dengan normalisasi *min-max*: x’ \= (x − 1\) / (5 − 1\) × 100\. Normalisasi membuat semua indikator berada pada skala yang sama sehingga dapat dibandingkan dan digabung.

### **2.7.2 Skor X1, X2, dan Y** {#2.7.2-skor-x1,-x2,-dan-y}

Skor variabel adalah rata-rata skor indikator yang telah dinormalisasi. X1 dihitung dari tujuh indikator soft skill intrapersonal, X2 dari tujuh indikator soft skill interpersonal (Tabel 2.3), dan Y dari empat indikator niat karier, yaitu minat, rencana, usaha persiapan, dan kemantapan pilihan. Tidak ada skor self-efficacy yang dihitung karena konstruk tersebut tidak ditetapkan sebagai variabel terukur dalam penelitian ini. Bila indikator memiliki tingkat kepentingan berbeda, skor gabungan dihitung dengan skor berbobot S \= Σ (wᵢ × sᵢ), dengan sᵢ skor ternormalisasi indikator ke-i dan Σ wᵢ \= 1\. Pendekatan pembobotan kriteria seperti ini juga dipakai pada sistem pendukung keputusan pemilihan bidang minat mahasiswa Informatika, dengan bobot kriteria ditetapkan melalui expert judgment dosen (Zakaria dkk., 2025).

### **2.7.3 Kategori Skor** {#2.7.3-kategori-skor}

Kategori skor ditentukan melalui ambang batas awal: rendah (\< 50), sedang (50–74), dan tinggi (≥ 75). Ambang ini bersifat awal dan dapat diubah Operator Admin setelah ditinjau pakar.

### **2.7.4 Profil Kebutuhan *Soft Skill* per Karier dan Konsep *Gap*** {#2.7.4-profil-kebutuhan-soft-skill-per-karier-dan-konsep-gap}

Selisih (*gap*) dihitung sebagai Gap(r, i) \= max(Req(r, i) − S(i), 0), dengan S(i) skor mahasiswa pada indikator tersebut. Selisih positif berarti indikator perlu dikembangkan, dan indikator dengan hasil kali bobot dan selisih terbesar diprioritaskan dalam rekomendasi. Kesesuaian mahasiswa dengan suatu okupasi diringkas dalam *Soft Skill Fit Score* (SFS), yaitu SFS(r) \= 100 − Σ (w(r, i) × Gap(r, i)). Semakin kecil selisih tertimbang, semakin tinggi SFS. SFS merupakan keluaran pendukung, bukan variabel penelitian.

### **2.7.5 Sistem Berbasis Aturan (*Rule-Based*)** {#2.7.5-sistem-berbasis-aturan-(rule-based)}

Sistem berbasis aturan menerjemahkan skor menjadi keputusan melalui aturan “jika–maka”, misalnya kombinasi kategori niat (Y) dan kategori kesesuaian (SFS) menentukan jenis rekomendasi. Pendekatan ini dipilih karena mudah ditelusuri, sehingga pengguna dapat melihat alasan di balik hasilnya, hal yang penting karena sistem menyangkut penilaian diri mahasiswa. Kecerdasan buatan (AI) hanya dipakai untuk menyusun penjelasan naratif dari hasil yang sudah dihitung, bukan untuk menentukan skor, klasifikasi, atau rekomendasi.

## **2.8 Sistem Rekomendasi Karier Berbasis Web** {#2.8-sistem-rekomendasi-karier-berbasis-web}

Sistem rekomendasi karier membantu pengguna menemukan pilihan yang sesuai dengan profilnya. Saifuddin (2024) mengembangkan *recommender* berbasis web untuk lulusan CS dan TI dengan *content-based filtering* dan ambang batas yang dapat diatur, melalui tahap pengumpulan data, pra proses, ekstraksi fitur, pembuatan algoritma, pembuatan rekomendasi, dan perbaikan iteratif berdasarkan umpan balik pengguna. Rancangan bertahap ini sejalan dengan siklus iteratif *Agile* pada Subbab 2.1. Secara arsitektur, sistem web terdiri atas antarmuka pengguna, logika aplikasi (mesin penilaian dan rekomendasi), dan basis data (akun, jawaban kuesioner, hasil skor, dan rekomendasi). Zakaria dkk. (2025) menunjukkan arsitektur serupa pada sistem pendukung keputusan berbasis web dengan basis data MySQL untuk mahasiswa Informatika. Pencocokan profil mahasiswa dengan profil okupasi pada *YourWay* sejalan dengan prinsip *content-based filtering*.

## **2.9 Pengujian Perangkat Lunak** {#2.9-pengujian-perangkat-lunak}

### **2.9.1 *Black-Box Testing*** {#2.9.1-black-box-testing}

*Black-box testing* menguji fungsi sistem dari sisi masukan dan keluaran tanpa melihat kode di dalamnya, dengan teknik umum *equivalence partitioning* dan *boundary value analysis*. Pada *YourWay*, pengujian mencakup registrasi dan *login*, pemilihan okupasi, pengisian kuesioner, perhitungan skor, tampilan hasil dan rekomendasi. Pada penelitian di Indonesia, *black-box testing* sering dipakai bersama SUS, misalnya pada pengujian aplikasi berbasis web yang melaporkan hasil *black-box* sesuai harapan dan skor SUS rata-rata 72 dalam kategori baik (Nanja dkk., 2022).

### **2.9.2 *User Acceptance Testing* (UAT)** {#2.9.2-user-acceptance-testing-(uat)}

UAT dilakukan bersama calon pengguna (mahasiswa Teknik Informatika) untuk memastikan sistem sesuai kebutuhan dan layak dipakai. Hasilnya dicatat sebagai diterima atau perlu perbaikan.

### **2.9.3 *System Usability Scale* (SUS)** {#2.9.3-system-usability-scale-(sus)}

SUS adalah kuesioner 10 butir (skala 1–5) untuk mengukur kemudahan penggunaan. Butir ganjil dinilai (skor − 1), butir genap dinilai (5 − skor), dan jumlahnya dikalikan 2,5 sehingga menghasilkan skor 0–100. Skor rata-rata pada literatur SUS sekitar 68, sehingga skor di atasnya dianggap di atas rata-rata.

## **2.10 Keamanan dan Privasi Data** {#2.10-keamanan-dan-privasi-data}

*YourWay* menyimpan data pribadi dan hasil penilaian diri mahasiswa, sehingga perlu memperhatikan pelindungan data. Rujukan hukumnya adalah Undang-Undang Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi. Prinsip yang diterapkan pada sistem:

1. Meminta persetujuan pengguna sebelum data dikumpulkan.  
2. Mengumpulkan data seperlunya saja (minimisasi data).  
3. Menyimpan kata sandi dalam bentuk *hash*, bukan teks biasa.  
4. Membatasi akses hasil penilaian hanya untuk pemilik akun.  
5. Memberi pengguna kendali atas datanya, termasuk menghapus akun.

## **2.11 Penelitian Terdahulu** {#2.11-penelitian-terdahulu}

**Tabel 2.5 Penelitian terdahulu**

| No | Peneliti | Fokus dan metode | Relevansi / celah |
| ----- | ----- | ----- | ----- |
| 1 | Cynthia & Qoiriah (2024) | Klasifikasi kesiapan kerja 114 mahasiswa dengan C5.0 (siap/tidak siap), 16 atribut | Fokus kesiapan, hasil dua kelas, tidak menunjuk karier |
| 2 | Saifuddin (2024) | *Recommender* web untuk lulusan CS/TI dengan *content-based filtering* dan atribut kepribadian | Mendukung pemodelan atribut perilaku, tetapi berfokus pada pencocokan pekerjaan |
| 3 | Bisaso & Fava (2026) | UTAUT diperluas dengan *digital confidence* untuk penerimaan platform bimbingan karier berbasis AI, 957 mahasiswa komputasi di Uganda (SEM) | Preseden UTAUT pada konteks karier mahasiswa TI; objek niatnya platform, bukan okupasi |
| 4 | Sondakh & Tulung (2024) | *Social Cognitive Career Theory* dan *Theory of Reasoned Action* untuk niat menempuh karier akuntan pada mahasiswa akhir di tiga perguruan tinggi Indonesia | Preseden niat karier berbasis teori niat berperilaku; bukan bidang TIK dan tidak memakai *soft skill* |
| 5 | McKenzie & Bennett (2022) | Studi dua tahun tentang pilihan jurusan dan aspirasi karier mahasiswa TI di Australia (*Social Cognitive Career Theory*) | Menegaskan aspirasi karier TI mahasiswa luas dan belum jelas; tidak menghasilkan sistem |
| 6 | Ingusci dkk. (2026) | *Soft skill* sebagai prediktor sumber daya psikologis, *employability*, dan perilaku mencari kerja pada 501 mahasiswa Italia (SEM) | Mendukung *soft skill* sebagai faktor individu terkait karier; luarannya *employability*, bukan niat okupasi |
| 7 | Rahmadani & Mardalis (2022) | Pengaruh *soft skill*, *self-efficacy*, motivasi, dan aktivitas organisasi terhadap kesiapan kerja | Pembanding pengaruh *soft skill*; luarannya kesiapan, bukan niat |
| 8 | Zakaria dkk. (2025) | Sistem pendukung keputusan web (SAW) untuk pemilihan bidang minat mahasiswa Informatika, bobot kriteria dari *expert judgment* | Preseden skor berbobot pada sistem pilihan jalur mahasiswa TI; tidak memakai niat dan *soft skill* |
| 9 | Nova dkk. (2022) | *Systematic literature review* metode *Agile* pada sistem informasi web | Dasar pemilihan *Scrum* |
| 10 | Gagana & Devaki (2023) | Survei model SDLC | Dasar perbandingan model pengembangan |

## **2.12 Kerangka Pemikiran dan Hipotesis** {#2.12-kerangka-pemikiran-dan-hipotesis}

### **2.12.1. Posisi Penelitian** {#2.12.1.-posisi-penelitian}

Dari tinjauan di atas tampak tiga pola. Pertama, penelitian kesiapan kerja banyak berhenti pada klasifikasi dua kelas (Cynthia & Qoiriah, 2024). Kedua, penelitian faktor perilaku dan soft skill umumnya berupa analisis statistik tanpa produk sistem (Ingusci dkk., 2026; Rahmadani & Mardalis, 2022). Ketiga, sistem rekomendasi dan pendukung keputusan yang ada berfokus pada pencocokan pekerjaan atau pemilihan bidang berdasarkan nilai, minat, dan tes (Saifuddin, 2024; Zakaria dkk., 2025). Literatur SCCT menempatkan self-efficacy sebagai mekanisme penting dalam perkembangan dan pilihan karier (Lent, Brown, & Hackett, 1994), dan Sondakh dan Tulung (2024) menunjukkan relevansinya terhadap niat karier; namun, dalam model YourWay, *self-efficacy* tidak diuji sebagai variabel tersendiri. Celah yang dituju penelitian ini adalah pengembangan sistem yang memusatkan niat karier dan menguji hubungan soft skill intrapersonal serta interpersonal dengan niat terhadap okupasi TIK, dengan 16 okupasi Kominfo sebagai objek pilihan. Klaim ini dibatasi pada penelitian yang ditinjau dan tidak berarti belum ada penelitian lain sama sekali.

### **2.12.2. Kerangka Pemikiran** {#2.12.2.-kerangka-pemikiran}

Input berupa jawaban kuesioner soft skill (X1, X2) dan niat karier (Y). *Self-efficacy* tidak menjadi input atau skor dalam sistem karena tidak ditetapkan sebagai variabel terukur. Proses berupa normalisasi, skor berbobot, pencocokan profil dengan okupasi, dan aturan rekomendasi. Output berupa profil niat dan profil soft skill, okupasi yang paling selaras, serta rekomendasi pengembangan. Evaluasi dilakukan melalui black-box testing, UAT, dan SUS. Hubungan antarvariabel yang diuji digambarkan pada Gambar 2.1.

**Gambar 2.1 Model hubungan variabel penelitian**

Intrapersonal Soft Skill (X1) \----H1----\> 

................................................ Career Intention (Y)

Interpersonal Soft Skill (X2) \----H2----\>

### **2.12.3. Hipotesis** {#2.12.3.-hipotesis}

Hipotesis diturunkan dari adaptasi TAM/UTAUT, yaitu faktor individu membentuk niat berperilaku (Subbab 2.3), dan dari dukungan penelitian yang menempatkan soft skill sebagai sumber daya yang berkaitan dengan perilaku karier mahasiswa (Ingusci dkk., 2026). Walaupun self-efficacy dibahas sebagai faktor teoretis yang relevan dalam literatur karier, hipotesis tersendiri tentang self-efficacy tidak dirumuskan karena konstruk tersebut tidak diukur dalam model penelitian ini.

* H1: Intrapersonal Soft Skill (X1) berpengaruh terhadap Career Intention (Y).  
* H2: Interpersonal Soft Skill (X2) berpengaruh terhadap Career Intention (Y).

Hipotesis diuji sebagai analisis awal. Dengan sampel uji 20 sampai 30 responden, hasilnya bersifat indikatif dan tidak untuk digeneralisasi.

# 

# **BAB III** **METODOLOGI** {#bab-iii-metodologi}

# **3.1.	Metode Pengembangan Perangkat Lunak (*Agile*)** {#3.1.-metode-pengembangan-perangkat-lunak-(agile)}

Pengembangan *YourWay* menggunakan model *Agile* yang disesuaikan dengan tahapan *Behavioral Modeling Science* (BMS). *Agile* dipilih karena kebutuhan pengguna, pemahaman tentang variabel perilaku, dan aturan penilaian berkembang bertahap seiring masukan yang diterima, sehingga sistem dapat diperbaiki per iterasi tanpa menunggu seluruh kebutuhan terdefinisi di awal. Alur pengembangan menggabungkan siklus hidup perangkat lunak dengan tahapan BMS, yaitu Masalah, Kebutuhan, Analisis Perilaku, Perancangan Sistem, Pembangunan, Pengujian, Peluncuran, dan Evaluasi. Pelaksanaannya sebagai berikut.

1. **Identifikasi masalah.** Merumuskan kesenjangan pemahaman mahasiswa terhadap niat karier dan *soft skill*\-nya, menelusuri literatur, dan menetapkan batasan perilaku yang ditangani sistem (*niat dan soft skill*).  
2. **Pengumpulan dan analisis kebutuhan.** Menentukan pihak berkepentingan, menyusun gambaran pengguna (*user persona*), dan merumuskan kebutuhan fungsional, nonfungsional, serta kebutuhan perilaku.  
3. **Analisis dan pemodelan perilaku.** Menetapkan variabel Y, X1, dan X2, menyusun instrumen, menetapkan indikator dan bobot, serta merumuskan skor kesesuaian, aturan klasifikasi, dan aturan rekomendasi.  
4. **Perancangan sistem.** Pemodelan UML, perancangan basis data, dan perancangan UI/UX dari *wireframe* hingga prototipe.  
5. **Pembangunan perangkat lunak.** Dikerjakan dalam *sprint* berdurasi 1–2 minggu, mencakup *frontend*, *backend* API, modul pengolah logika BMS, integrasi layanan penjelasan AI, dan basis data.  
6. **Pengujian.** *Black-box testing*, validasi model skor dan klasifikasi, pengujian keamanan dasar, dan UAT.  
7. **Peluncuran dan evaluasi.** Peluncuran pada lingkungan *cloud*, evaluasi kemudahan penggunaan dengan SUS.

# **3.2.	Model Penelitian dan Definisi Operasional Variabel** {#3.2.-model-penelitian-dan-definisi-operasional-variabel}

Model penelitian terdiri atas tiga variabel. *Career Intention* (Y) adalah variabel dependen. *Intrapersonal Soft Skill* (X1) dan *Interpersonal Soft Skill* (X2) adalah variabel independen. Dasar teori model adalah TAM/UTAUT untuk objek pilihan karier.

**Tabel 3.1 Definisi operasional variabel**

| Kode | Variabel | Definisi operasional | Dasar sumber | Skala |
| :---- | :---- | :---- | :---- | :---- |
| Y | *Career Intention* | Kecenderungan dan komitmen mahasiswa untuk menempuh karir TIK yang dipilih, tercermin dari minat, rencana, usaha persiapan, dan kemantapan pilihan | *Behavioral Intention* pada TAM/UTAUT; objek karier dari Kominfo (2017; 2018\) | Likert 1–5 |
| X1 | *Intrapersonal Soft Skill* | Kemampuan mahasiswa mengelola pikiran, sikap, dan perilaku diri sendiri | ASEC (2016) dimensi intrapersonal; MSIS 2016 (Topi dkk., 2017\) | Likert 1–5 |
| X2 | *Interpersonal Soft Skill* | Kemampuan mahasiswa berinteraksi, berkomunikasi, dan bekerja dengan orang lain | ASEC (2016) dimensi interpersonal; MSIS 2016 (Topi dkk., 2017\) | Likert 1–5 |

**Tabel 3.2 Indikator dan rencana jumlah butir kuesioner**

| Variabel | Indikator | Butir | Contoh butir (skala setuju 1–5) |
| :---- | :---- | :---- | :---- |
| Y | Minat | 2 | “Saya tertarik menempuh karier sebagai karier yang saya pilih.” |
| Y | Rencana | 2 | “Saya sudah memiliki rencana untuk bekerja di karir yang saya pilih setelah lulus.” |
| Y | Usaha persiapan | 2 | “Saya secara aktif mencari tahu hal yang dibutuhkan untuk karier yang saya pilih.” |
| Y | Kemantapan pilihan | 2 | “Saya yakin pilihan karier saya tidak akan berubah dalam waktu dekat.” |
| X1 | *Critical Thinking* | 2 | “Saya membandingkan beberapa sumber sebelum menarik kesimpulan.” |
| X1 | *Problem Solving* | 2 | “Saya menguraikan masalah menjadi bagian kecil sebelum mencari solusi.” |
| X1 | *Creativity* | 2 | “Saya mencari cara baru ketika cara lama tidak berhasil.” |
| X1 | *Ethical Analysis* | 2 | “Saya mempertimbangkan dampak etis sebelum mengambil keputusan.” |
| X1 | *Self-development* | 2 | “Saya secara rutin mempelajari hal baru di luar tugas kuliah.” |
| X1 | *Flexibility* | 2 | “Saya dapat menyesuaikan diri ketika rencana atau teknologi berubah.” |
| X1 | *Discipline* | 2 | “Saya menyelesaikan tugas sesuai tenggat tanpa diingatkan.” |
| X2 | *Collaboration and Teamwork* | 2 | “Saya membagi tugas secara adil dan menyelesaikan bagian saya dalam kerja tim.” |
| X2 | *Oral Communication* | 2 | “Saya dapat menjelaskan gagasan secara lisan dengan jelas.” |
| X2 | *Written Communication* | 2 | “Saya dapat menulis laporan atau pesan kerja yang mudah dipahami.” |
| X2 | *Negotiation* | 2 | “Saya dapat mencapai kesepakatan ketika pendapat berbeda.” |
| X2 | *Leadership* | 2 | “Saya dapat mengarahkan dan memotivasi anggota kelompok.” |
| X2 | *Intercultural Competency* | 2 | “Saya dapat bekerja dengan orang dari latar budaya yang berbeda.” |
| X2 | *Conflict Management* | 2 | “Saya dapat menengahi perbedaan pendapat dalam kelompok.” |

Rancangan awal berjumlah 36 butir (Y: 8; X1: 14; X2: 14). Butir lengkap disusun pada tahap perancangan instrumen. Contoh butir di atas bersifat ilustrasi dan dapat disempurnakan.

# **3.3.	Dasar Pertanyaan**

Skala semua butir: 1 \= Sangat tidak setuju sampai 5 \= Sangat setuju. Pada butir Y, \[okupasi\] otomatis diisi sistem dengan okupasi yang dipilih mahasiswa.

**Y: *Career Intention* (8 butir)**

| No | Indikator | Butir | Dasar |
| ----- | :---: | :---: | ----- |
| 1 | Minat | Saya tertarik untuk bekerja sebagai \[okupasi\]. | *Tech Career Scale* |
| 2 | Minat | Saya senang membayangkan diri saya menjalani pekerjaan sebagai \[okupasi\]. | *Tech Career Scale* |
| 3 | Rencana | Saya berniat bekerja sebagai \[okupasi\] setelah lulus. | UTAUT (*Behavioral Intention*) |
| 4 | Rencana | Saya memperkirakan akan melamar pekerjaan sebagai \[okupasi\] dalam waktu dekat. | UTAUT (*Behavioral Intention*) |
| 5 | Usaha persiapan | Saya aktif mencari informasi tentang \[okupasi\] (misalnya tugas, syarat, dan lowongan). | *Tech Career Scale* |
| 6 | Usaha persiapan | Saya sudah melakukan kegiatan untuk mempersiapkan diri menjadi \[okupasi\] (misalnya kursus, proyek, atau magang). | *Tech Career Scale* |
| 7 | Kemantapan | Saya yakin \[okupasi\] adalah pilihan karier saya, bukan sekadar coba-coba. | Harred dkk. (2023) |
| 8 | Kemantapan | Saya tetap akan memilih \[okupasi\] meskipun ada pilihan karier TIK lain. | Harred dkk. (2023) |

**X1: *Intrapersonal Soft Skill* (14 butir)**

| No | Indikator | Butir | Dasar |
| ----- | ----- | ----- | ----- |
| 9 | *Critical Thinking* | Saya membandingkan beberapa sumber informasi sebelum menarik kesimpulan. | Sosu (2013) |
| 10 | *Critical Thinking* | Saya mempertanyakan asumsi di balik suatu pendapat sebelum menerimanya. | Sosu (2013) |
| 11 | *Problem Solving* | Saat menghadapi masalah, saya menguraikannya menjadi bagian kecil sebelum mencari solusi. | Heppner & Petersen (1982) |
| 12 | *Problem Solving* | Saya mengevaluasi solusi yang saya pilih dan memperbaikinya bila hasilnya belum baik. | Heppner & Petersen (1982) |
| 13 | *Creativity* | Saya percaya diri dapat menghasilkan ide baru untuk menyelesaikan tugas. | Tierney & Farmer (2002) |
| 14 | *Creativity* | Saya mencoba cara yang berbeda ketika cara lama tidak berhasil. | Tierney & Farmer (2002) |
| 15 | *Ethical Analysis* | Saya mempertimbangkan apakah suatu keputusan adil bagi pihak yang terdampak. | Reidenbach & Robin (1990) |
| 16 | *Ethical Analysis* | Saya menolak tindakan tidak jujur, misalnya menyontek atau menjiplak, meskipun menguntungkan saya. | ASEC (*Integrity*) |
| 17 | *Self-development* | Saya rutin mempelajari hal baru di luar tugas kuliah. | Fisher dkk. (2001); ASEC |
| 18 | *Self-development* | Saya menetapkan target belajar dan memantau kemajuannya. | Fisher dkk. (2001); ASEC |
| 19 | *Flexibility* | Saya dapat menyesuaikan rencana ketika situasi atau teknologi berubah. | Dennis & Vander Wal (2010) |
| 20 | *Flexibility* | Saya mampu melihat satu masalah dari beberapa sudut pandang. | Dennis & Vander Wal (2010) |
| 21 | *Discipline* | Saya menyelesaikan tugas sesuai tenggat tanpa harus diingatkan. | Tangney dkk. (2004); ASEC |
| 22 | *Discipline* | Saya dapat menahan diri dari hal yang mengganggu saat harus mengerjakan hal penting. | Tangney dkk. (2004); ASEC |

**X2: *Interpersonal Soft Skill* (14 butir)**

| No | Indikator | Butir | Dasar |
| ----- | ----- | ----- | ----- |
| 23 | *Teamwork* | Dalam kerja kelompok, saya menyelesaikan bagian saya tepat waktu. | Ponmalar dkk. (2018); ASEC (*Cooperation*) |
| 24 | *Teamwork* | Saya membantu anggota tim yang mengalami kesulitan. | Ponmalar dkk. (2018); ASEC (*Cooperation*) |
| 25 | *Oral Communication* | Saya dapat menjelaskan gagasan secara lisan dengan jelas dan runtut. | Rubin & Martin (1994) |
| 26 | *Oral Communication* | Saya mendengarkan lawan bicara dan menanggapi sesuai maksudnya. | Rubin & Martin (1994) |
| 27 | *Written Communication* | Saya dapat menulis laporan atau pesan kerja yang mudah dipahami pembaca. | Ponmalar dkk. (2018) |
| 28 | *Written Communication* | Saya menyesuaikan gaya tulisan dengan pembacanya (dosen, rekan, atau klien). | Ponmalar dkk. (2018) |
| 29 | *Negotiation* | Saya dapat menyampaikan keinginan sambil tetap memperhatikan kepentingan pihak lain. | Sullivan dkk. (2006) |
| 30 | *Negotiation* | Saat pendapat berbeda, saya mencari kesepakatan yang dapat diterima kedua pihak. | Sullivan dkk. (2006) |
| 31 | *Leadership* | Saya dapat mengarahkan anggota kelompok agar fokus pada tujuan bersama. | Posner (2004) |
| 32 | *Leadership* | Saya memotivasi anggota kelompok yang semangatnya menurun. | Posner (2004) |
| 33 | *Intercultural Competency* | Saya nyaman bekerja dengan orang yang berbeda suku, agama, atau budaya dari saya. | Ang dkk. (2007) |
| 34 | *Intercultural Competency* | Saya menyesuaikan cara berkomunikasi ketika berhadapan dengan orang dari latar budaya berbeda. | Ang dkk. (2007) |
| 35 | *Conflict Management* | Saya dapat menengahi perbedaan pendapat dalam kelompok tanpa memihak. | Rahim (1983); ASEC |
| 36 | *Conflict Management* | Saat terjadi konflik, saya tetap tenang dan fokus pada masalah, bukan pada orangnya. | Rahim (1983); ASE |

# **3.4.	Metode Pengumpulan Data** {#3.4.-metode-pengumpulan-data}

1. **Studi pustaka.** Mengkaji TAM/UTAUT, MSIS 2016, ASEC (2016), serta Peta Okupasi dan Daftar Unit Kompetensi Kominfo (2017; 2018). Hasilnya menjadi dasar teori, pemilihan variabel, dan 16 karier.  
2.  **Penyusunan profil kebutuhan *soft skill* per karier.** Untuk setiap dari 16 karier, dikumpulkan deskripsi lowongan kerja jenjang awal tahun 2026 dari portal pekerjaan. Pernyataan *soft skill* pada lowongan dipetakan ke 14 indikator pada Tabel 2.2, lalu dihitung frekuensi kemunculannya f(r, i) untuk karier r dan indikator i. Bobot kepentingan dihitung w(r, i) \= f(r, i) / Σ f(r, i), sehingga Σ w \= 1\. Level kebutuhan Req(r, i) pada skala 0–100 ditetapkan melalui pita frekuensi yang diusulkan awal, yaitu 80 untuk indikator yang muncul pada ≥ 60% lowongan, 65 untuk 30–59%, 50 untuk 10–29%, dan 35 untuk \< 10%. Seluruh profil dituangkan dalam matriks karier × indikator *soft skill*. Level dan bobot disusun pada jenjang awal agar skor antarkarier dapat dibandingkan secara adil.

# **3.5.	Metode Analisis dan Pemodelan** {#3.5.-metode-analisis-dan-pemodelan}

Pemodelan menggunakan *weighted scoring* dan *rule-based system*. *Machine learning* tidak dipakai karena sistem berbasis aturan dan hasilnya harus dapat dijelaskan.

## **3.5.1.	Perhitungan Skor Variabel** {#3.5.1.-perhitungan-skor-variabel}

Skor mentah indikator adalah rata-rata jawaban butirnya (1–5), dinormalisasi min-max ke 0–100 dengan x’ \= (x − 1\) / 4 × 100\. Skor X1, X2, dan Y adalah rata-rata skor indikator ternormalisasi pada masing-masing variabel. 

## **3.5.2.	Profil Kesesuaian *Soft Skill* terhadap karier** {#3.5.2.-profil-kesesuaian-soft-skill-terhadap-karier}

Profil kesesuaian merupakan keluaran pendukung, bukan variabel penelitian. Untuk setiap karier r, sistem menghitung selisih Gap(r, i) \= max(Req(r, i) − S(i), 0), dengan S(i) skor mahasiswa pada indikator i. *Soft Skill Fit Score* (SFS) dihitung dengan SFS(r) \= 100 − Σ (w(r, i) × Gap(r, i)), dengan Σ w(r, i) \= 1\. Sistem menampilkan SFS untuk karier pilihan mahasiswa, SFS untuk seluruh 16 karier, dan karier dengan SFS tertinggi. karier tertinggi dibandingkan dengan pilihan mahasiswa untuk menetapkan status “Selaras” atau “Berbeda”. Indikator dengan hasil kali bobot dan selisih terbesar menjadi prioritas pengembangan.

## **3.5.3.	Aturan Rekomendasi (*Rule-Based*)** {#3.5.3.-aturan-rekomendasi-(rule-based)}

Rekomendasi ditentukan oleh kombinasi skor niat (Y) dan SFS karier pilihan, seperti pada Tabel 3.3. Aturan tambahan: bila X1 \< 50, sistem menambahkan rekomendasi pengembangan intrapersonal (misalnya pengelolaan waktu, refleksi, dan belajar mandiri); bila X2 \< 50, sistem menambahkan rekomendasi pengembangan interpersonal (misalnya kerja kelompok, organisasi, dan latihan presentasi); bila SFS karier tertinggi melebihi SFS karier pilihan sebesar 10 poin atau lebih, sistem menampilkan karier tersebut sebagai alternatif untuk dieksplorasi.

**Tabel 3.3 Aturan rekomendasi berdasarkan niat dan kesesuaian**

| Aturan | Kondisi | Interpretasi | Jenis rekomendasi |
| :---- | :---- | :---- | :---- |
| R1 | Y ≥ 75 dan SFS ≥ 75 | Niat mantap dan selaras | Pengayaan dan tantangan lanjutan |
| R2 | Y ≥ 75 dan SFS \< 75 | Niat kuat, *soft skill* perlu dikembangkan | Prioritas 3 indikator dengan selisih terbesar |
| R3 | Y \< 75 dan SFS ≥ 75 | Potensi selaras, niat belum mantap | Eksplorasi karier dan informasi karier |
| R4 | Y \< 75 dan SFS \< 75 | Perlu eksplorasi dan penguatan dasar | Karier alternatif dan pengembangan dasar |

AI hanya digunakan untuk menyusun penjelasan dalam bentuk narasi dari hasil yang sudah dihitung dan dari aturan yang terpicu, bukan untuk menentukan skor, klasifikasi, atau rekomendasi.

## **3.5.4.	Analisis Hubungan Variabel** {#3.5.4.-analisis-hubungan-variabel}

Hubungan X1 dan X2 terhadap Y diuji sebagai analisis awal dengan korelasi (Pearson atau Spearman sesuai sebaran data) dan regresi linear berganda sederhana dengan Y sebagai variabel dependen. Hasil bersifat indikatif karena sampel kecil dan dipakai untuk menguji kelayakan model, bukan untuk menarik kesimpulan populasi.

# **3.6.	Analisis Kebutuhan Sistem** {#3.6.-analisis-kebutuhan-sistem}

## **3.6.1.	*Stakeholder*** {#3.6.1.-stakeholder}

Sistem memiliki dua jenis pengguna. **Mahasiswa** adalah mahasiswa aktif jurusan Teknik Informatika  sebagai pengguna utama, dengan kebutuhan kemudahan mengisi kuesioner, kejelasan profil kebutuhan setiap karier dan *soft skill*, serta kemudahan memahami rekomendasi. **Operator Admin** adalah pengelola sistem yang mengelola instrumen, profil karier, aturan penilaian, dan akun pengguna, serta memantau data hasil secara agregat dan anonim.

## **3.6.2.	Kebutuhan Fungsional** {#3.6.2.-kebutuhan-fungsional}

**Tabel 3.4 Kebutuhan fungsional**

| ID | Kebutuhan |
| :---- | :---- |
| FR-01 | Sistem dapat mengelola *login* dan hak akses pengguna (Mahasiswa dan Operator Admin) sesuai perannya (*Role-Based Access Control*). |
| FR-02 | Mahasiswa dapat memilih satu karier yang  diinginkan dari 16 karier sebagai karier pilihan.  |
| FR-03 | Sistem menyediakan kuesioner berskala Likert untuk niat karier (Y), *Intrapersonal Soft Skill* (X1), dan *Interpersonal Soft Skill* (X2). |
| FR-04 | Sistem menghitung skor indikator serta skor variabel Y, X1, dan X2 pada skala 0-100.  |
| FR-05 | Sistem menghitung selisih (*gap*) per indikator dan *Soft Skill Fit Score* (SFS) terhadap karier pilihan, serta menentukan indikator prioritas pengembangan berdasarkan bobot dan selisih terbesar.  |
| FR-06 | Sistem menghitung SFS untuk seluruh 16 karier dan menentukan karier dengan SFS tertinggi sebagai karier yang paling selaras.  |
| FR-07 | Sistem menampilkan hasil kuisioner karier yang paling selaras berupa skor kesesuaian (persen) dan ringkasan kemampuan soft skill berupa diagram spider |
| FR-08 | Sistem menyusun penjelasan berbasis AI dalam bentuk narasi dari hasil perhitungan dan aturan rekomendasi yang sudah ditentukan. |
| FR-07 | Operator Admin dapat mengelola instrumen dan model penilaian, yaitu butir kuesioner, indikator, bobot, aturan rekomendasi, dan profil kebutuhan *soft skill* per karier (tambah, ubah, hapus). |
| FR-07 | Operator Admin dapat mengelola akun pengguna dan memantau data hasil secara agregat dan anonim. |

## **3.6.3.	Kebutuhan Nonfungsional** {#3.6.3.-kebutuhan-nonfungsional}

**Tabel 3.5 Kebutuhan nonfungsional**

| ID | Deskripsi |
| :---- | :---- |
| NFR-Usability | Tampilan mudah digunakan dan responsif pada komputer dan ponsel. |
| NFR-Security | Data sensitif diamankan dengan HTTPS/TLS, dan kata sandi dilindungi dengan fungsi *hash* Bcrypt. |
| NFR-Performance | Perhitungan skor dan SFS selesai kurang dari 2 detik per permintaan. Penjelasan AI ditampilkan terpisah setelah hasil skor muncul. |
| NFR-Privacy | Data pribadi dan hasil hanya dapat diakses mahasiswa yang bersangkutan. Pengumpulan data disertai persetujuan (*consent*) dan dibatasi pada data yang diperlukan. Data yang dikirim ke layanan AI tidak memuat identitas mahasiswa. |
| NFR-Reliability | Bila layanan AI tidak tersedia, sistem tetap menampilkan skor, diagram, dan rekomendasi dengan penjelasan standar berbasis templat. |

# **3.7.	Pemodelan Sistem (UML)** {#3.7.-pemodelan-sistem-(uml)}

## **3.7.1.	*Use Case Diagram*** {#3.7.1.-use-case-diagram}

*Use case diagram* menggambarkan interaksi pengguna dengan sistem dan disusun dari FR-01 sampai FR-07. Mahasiswa dapat mengelola profil, mengisi kuesioner, melihat hasil dan profil kesesuaian dan melihat rekomendasi. Operator Admin dapat mengelola butir dan instrumen, bobot dan aturan, profil karier, serta akun, dan memantau hasil agregat. Semua fungsi diawali *Login*, sehingga *use case* tersebut dihubungkan ke kedua aktor. Dua fungsi dijalankan otomatis oleh sistem dan dihubungkan dengan relasi *include*, yaitu **Hitung Skor** (setiap kuesioner atau tes ulang diselesaikan) dan **Penjelasan AI** (saat hasil ditampilkan). 

![][image1]

Gambar 3.1 *Use Case Diagram YourWay*

**Tabel 3.6 Ringkasan *use case***

| Kode | *Use case* | Aktor | Keterangan |
| :---- | :---- | :---- | :---- |
| UC-01 | Login | Mahasiswa, Operator Admin | Autentikasi dan hak akses |
| UC-02 | Pilih Karier | Mahasiswa | Memilih satu dari 16 karier  |
| UC-03 | Isi kuesioner | Mahasiswa | Mengisi butir Y, X1, dan X2 |
| UC-04 | Lihat hasil dan profil kesesuaian | Mahasiswa | Skor Y, X1, X2, SFS, dan karier paling selaras |
| UC-05 | Lihat rekomendasi | Mahasiswa | Rekomendasi berdasarkan aturan dan selisih |
| UC-06 | Kelola instrumen kuisioner | Operator Admin | Butir, bobot, ambang, aturan, dan profil karier |
| UC-07 | Kelola aturan rekomendasi | Operator Admin | Akun pengguna dan data agregat anonim |
| UC-08 | Kelola Bobot Profil Karier (indikator per karier)  | Operator Admin | Level kebutuhan dan bobot indikator per karier  |
| UC-09 | Kelola akun pengguna  | Operator Admin | Tambah, ubah, nonaktifkan, dan hapus akun  |
| UC-10 | Pantau hasil agregat  | Operator Admin | Data hasil asesmen yang anonim  |
| UC-11 | Hitung skor | Sistem | *Include* pada UC-02 |
| UC-12 | Penjelasan AI | Sistem | *Include* pada UC-03 |

## **3.7.2.	*Activity Diagram*** {#3.7.2.-activity-diagram}

Alur utama mahasiswa dimulai dari *login*, memilih karier, mengisi kuesioner, mengirim jawaban, perhitungan skor oleh sistem, penampilan hasil dan penjelasan AI, lalu penampilan rekomendasi. Alur Operator Admin dimulai dari *login*, memilih modul pengelolaan (instrumen, profil karier, akun, atau pemantauan), melakukan perubahan, dan menyimpan. 

![][image2]

Gambar 3.2 *Activity Diagram* Dashboard

![][image3]

Gambar 3.3 *Activity Diagram* Mahasiswa

![][image4]

Gambar 3.4 *Activity Diagram* Admin

## **3.7.3.	*Sequence Diagram*** {#3.7.3.-sequence-diagram}

Urutan interaksi pada proses utama adalah sebagai berikut. (1) Mahasiswa menekan tombol mulai, antarmuka meminta *controller* mengambil butir kuesioner dari basis data. (2) Mahasiswa mengirim jawaban, dan *controller* menyimpannya. (3) *Controller* menghitung skor Y, X1, X2, dan SFS melalui mesin BMS, lalu menyimpan hasil. (4) *Controller* mengirim permintaan ke layanan AI untuk menyusun penjelasan dari skor dan aturan yang terpicu, menyimpan respons, lalu mengirim hasil dan rekomendasi ke antarmuka.

### 

![][image5]

![][image6]

![][image7]

![][image8]![][image9]

### 

## **3.7.4.	*Entity Relationship Diagram* (ERD)** {#3.7.4.-entity-relationship-diagram-(erd)}

Entitas utama basis data ditunjukkan pada Tabel 3.7. 

![][image10]

**Tabel 3.7 Entitas basis data**

| Entitas | Isi utama |
| :---- | :---- |
| PENGGUNA | Akun, peran (Mahasiswa atau Operator Admin), kata sandi ter-*hash* |
| KARIER | 16 karier TIK, area fungsi, dan padanan pada peta Kominfo |
| INDIKATOR | Indikator Y, X1, dan X2 beserta variabelnya |
| BUTIR | Butir kuesioner dan indikator terkait |
| PROFIL\_KARIER | Req(r, i) dan bobot w(r, i) untuk setiap karier dan indikator |
| ASESMEN | Satu sesi pengisian (tes awal atau tes ulang), tanggal, dan karier pilihan |
| JAWABAN | Jawaban Likert per butir pada suatu asesmen |
| HASIL\_SKOR | Skor indikator, Y, X1, X2, SFS per karier, dan kategori |
| ATURAN\_REKOMENDASI | Ambang dan aturan R1–R4 beserta teks rekomendasi |
| PENJELASAN\_AI | Narasi penjelasan hasil |

# **3.8.	Perancangan Antarmuka dan Arsitektur** {#3.8.-perancangan-antarmuka-dan-arsitektur}

## **3.8.1.	Userflow** {#3.8.1.-userflow}

Alur dibagi menjadi alur autentikasi, alur Mahasiswa, dan alur Operator Admin. Halaman utama Mahasiswa menampilkan Skor Y, X1, X2, dan SFS karier pilihan, status kesesuaian, dan karier paling selaras. Halaman kuesioner dirancang minimalis dengan indikator kemajuan. Halaman profil kesesuaian menampilkan diagram radar skor indikator terhadap level kebutuhan karier. Halaman rekomendasi menampilkan aturan yang terpicu, prioritas pengembangan, dan penjelasan AI. Halaman Operator Admin berisi pengelolaan butir, profil karier, aturan, dan akun dengan tata letak dua kolom. Rancangan dibuat dari *wireframe* hingga prototipe, dan hasilnya dilampirkan.

![][image11]

## **3.8.2 Prototype** {#3.8.2-prototype}

	Berdasarkan Activity Diagram dan User Flow yang telah dirancang, berikut adalah implementasi prototipe antarmuka sistem YourWay: Career & Competency Navigator. 

1. **Dashboard Utama Mahasiswa** 

	Dashboard ini dirancang untuk menampilkan hasil analisis perilaku dan kompetensi secara komprehensif. Pada bagian atas (Hero Section), terdapat persentase *Intention Fit Score* yang divisualisasikan menggunakan *circular progress bar*, disandingkan dengan label kecocokan karier (Career Match). Di bagian bawah, terdapat *Radar Chart* yang memetakan lima variabel pemodelan perilaku (Learning Behavior, Self-Efficacy, Technical Competency, Soft Skill, dan Project Experience), serta panel Analisis Karier AI yang memberikan penjelasan kualitatif dan tombol Call-To-Action (CTA) menuju peta jalan (roadmap) karier. 

![][image12]

2. **Halaman Pengerjaan Asesmen** 

	Halaman ini merupakan instrumen utama dalam pengambilan data. Tampilan dirancang minimalis (*distraction-free*) agar mahasiswa dapat fokus menjawab. Terdapat *progress bar* di bagian atas untuk menginformasikan sisa soal. Antarmuka ini menggabungkan dua tipe pertanyaan dalam satu layar yang berkesinambungan: soal pilihan ganda teknis dengan empat opsi *radio button*, dan soal perilaku berbasis skala Likert (Sangat Tidak Setuju hingga Sangat Setuju). 

![][image13]

3. **Dashboard Operator Admin** 

	Antarmuka ini dikhususkan bagi Operator Admin untuk mengelola bank soal. Menggunakan tata letak dua kolom (sidebar menu navigasi di kiri dan konten utama di kanan), halaman ini memuat tabel daftar soal yang menampilkan ID Soal, Aspek Kompetensi, Teks Pertanyaan, dan Aksi (*edit/delete*). Di sudut kanan atas, terdapat tombol utama "+ Tambah Soal Baru" yang akan memicu munculnya form *pop-up* saat diklik. 

![][image14]

# **3.9 Arsitektur Sistem** {#3.9-arsitektur-sistem}

## **3.9.1 Arsitektur Sistem** {#3.9.1-arsitektur-sistem}

Sistem YourWay dirancang dengan arsitektur berlapis (*layered architecture*) agar setiap bagian memiliki tanggung jawab yang jelas, mudah dikembangkan, dan mudah diuji. Arsitektur terbagi menjadi tiga lapisan sebagai berikut.

1. Lapisan Tampilan (*Presentation Layer*). Antarmuka berbasis web yang responsif bagi Mahasiswa dan Operator Admin. Lapisan ini menampilkan halaman login, pemilihan karier, tes dan kuesioner, hasil beserta diagram, *roadmap*, riwayat hasil, dan dasbor admin. Lapisan ini berkomunikasi dengan lapisan di bawahnya melalui REST API.  
2. Lapisan Logika Aplikasi (*Business Logic Layer*). Layanan inti yang mengelola aturan bisnis dan autentikasi. Lapisan ini memuat mesin penghitung perilaku (*BMS Engine*) untuk menghitung skor, *Intention Fit Score*, klasifikasi karier, dan proyeksi skor. Lapisan ini juga menghubungkan sistem ke layanan AI untuk menyusun penjelasan hasil. Apabila layanan AI tidak tersedia, sistem tetap menampilkan hasil dengan penjelasan standar berbasis templat.  
3. Lapisan Data (*Data Layer*). Basis data relasional yang menyimpan profil pengguna, riwayat hasil tes, parameter model (bobot, level kebutuhan, dan aturan), serta data *roadmap* per peran secara terstruktur.

## **3.9.2 Lingkungan Pengembangan** {#3.9.2-lingkungan-pengembangan}

Pengembangan sistem YourWay didukung oleh perangkat lunak dan teknologi berikut.

1. Bahasa pemrograman: JavaScript / TypeScript, *Frontend*: React.js  
2. *Ba*ckend: Node.js dan Express.js.  
3. Basis data: PostgreSQL,   
4. AI LLM: Groq/Gemini/Qwen  
5. Pengelolaan versi: Git dan GitHub  
6. Pemodelan UML dan basis data: Draw.io / PlantUML, Miro.com  
7. Perancangan UI/UX: Figma

# 

# **3.10.	Rencana Pengujian dan Evaluasi** {#3.10.-rencana-pengujian-dan-evaluasi}

**Tabel 3.8 Rencana pengujian**

| Pengujian | Tujuan | Metode | Kriteria keberhasilan |
| :---- | :---- | :---- | :---- |
| *Black-box testing* | Memastikan fungsi sesuai kebutuhan FR-01 sampai FR-07 | *Equivalence partitioning* dan *boundary value analysis* | Seluruh kasus uji sesuai hasil yang diharapkan |
| Validasi mesin skor | Memastikan rumus skor, SFS, dan aturan benar | Uji dengan data simulasi dan perhitungan manual | Hasil sistem sama dengan perhitungan manual |
| Pengujian keamanan dasar | Memastikan akses dan data terlindungi | Uji hak akses dan penyimpanan kata sandi | Tidak ada akses lintas pengguna |
| *User Acceptance Testing* | Memastikan sistem diterima pengguna | Skenario uji oleh mahasiswa | Skenario diterima |
| *System Usability Scale* | Mengukur kemudahan penggunaan | Kuesioner SUz 10 butir | Skor rata-rata ≥ 70 |

## 

## 

# **DAFTAR PUSTAKA** {#daftar-pustaka}

ASEAN Secretariat \[ASEC\]. (2016). *ASEAN guiding principles for quality assurance and recognition of competency certification systems*. ASEAN Secretariat.

Bandura, A. (1997). Self-efficacy: The exercise of control. W. H. Freeman.

Bisaso, S., & Fava, S. (2026). Assessment of user acceptance of an AI-driven career guidance model: A UTAUT-based quantitative study. *Journal of Artificial Intelligence and Technological Development, 2*(2), 94–108. [https\://doi.org/10.59324/jaitd.2026.2(2).07](https://doi.org/10.59324/jaitd.2026.2\(2\).07)

Cynthia, & Qoiriah, A. (2024). *Klasifikasi tingkat kesiapan kerja mahasiswa Universitas Negeri Surabaya menggunakan algoritma C5.0*. Universitas Negeri Surabaya. [https\://ejournal.unesa.ac.id/index.php/jinacs/article/download/61331/46932](https://ejournal.unesa.ac.id/index.php/jinacs/article/download/61331/46932)

Davis, F. D. (1989). Perceived usefulness, perceived ease of use, and user acceptance of information technology. *MIS Quarterly, 13*(3), 319–340. [https\://doi.org/10.2307/249008](https://doi.org/10.2307/249008)

Gagana, H., & Devaki, P. (2023). A survey on various software development life cycle models along with machine learning scope. *Grenze International Journal of Engineering & Technology, 9*(1).

Idemudia, E. C., Dasuki, S. I., & Ogedebe, P. (2016). Factors that influence students’ programming skills: A case study from a Nigerian university. *International Journal of Quantitative Research in Education, 3*(4), 277–291.

Ingusci, E., De Carlo, E., Catalano, A. A., Semeraro, C. G., & Signore, F. (2026). Are university students ready to work? The role of soft skills and psychological capital in building sustainable employability. *Education Sciences, 16*(2), Article 181\. [https\://doi.org/10.3390/educsci16020181](https://doi.org/10.3390/educsci16020181)

Kementerian Komunikasi dan Informatika \[Kominfo\]. (2017). *Peta okupasi nasional dalam Kerangka Kualifikasi Nasional Indonesia pada area fungsi teknologi informasi dan komunikasi* (Lampiran 1, Surat Pengesahan 172/KOMINFO/BLSDM/KS.01.07/7/2017). Kementerian Komunikasi dan Informatika.

Kementerian Komunikasi dan Informatika \[Kominfo\]. (2018). *Daftar unit kompetensi okupasi dalam Kerangka Kualifikasi Nasional Indonesia bidang teknologi informasi dan komunikasi*. Kementerian Komunikasi dan Informatika. [https\://proserti.kominfo.go.id/4f0rm1n/files/pubreg/filedok\_5.pdf](https://proserti.kominfo.go.id/4f0rm1n/files/pubreg/filedok_5.pdf)

Lent, R. W., Brown, S. D., & Hackett, G. (1994). Toward a unifying social cognitive theory of career and academic interest, choice, and performance. Journal of Vocational Behavior, 45(1), 79–122. https\://doi.org/10.1006/jvbe.1994.1027

McKenzie, S., & Bennett, D. (2022). Understanding the career interests of Information Technology (IT) students: A focus on choice of major and career aspirations. *Education and Information Technologies, 27*(9), 12839–12853. [https\://doi.org/10.1007/s10639-022-11141-1](https://doi.org/10.1007/s10639-022-11141-1)

Nanja, M., Lasena, Y., & Dalai, H. (2022). Perancangan sistem uji kebergunaan aplikasi berbasis web menggunakan System Usability Scale. *Jurnal JTIK (Jurnal Teknologi Informasi dan Komunikasi), 6*(4). [https\://doi.org/10.35870/jtik.v6i4.617](https://doi.org/10.35870/jtik.v6i4.617)

Nova, S. H., Widodo, A. P., & Warsito, B. (2022). Analisis metode Agile pada pengembangan sistem informasi berbasis website: Systematic literature review. *Techno.Com, 21*(1), 139–148. [https\://doi.org/10.33633/tc.v21i1.5659](https://doi.org/10.33633/tc.v21i1.5659)

Rahmadani, D., & Mardalis, A. (2022). Improving student’s working readiness by increasing soft skills, self-efficacy, motivation, and organizational activities. *Proceedings of the International Conference on Economics and Business Studies (ICOEBS 2022\)*. Atlantis Press. [https\://www\.atlantis-press.com/proceedings/icoebs-22/125975189](https://www.atlantis-press.com/proceedings/icoebs-22/125975189)

Saifuddin, N. W. (2024). *Career Navigator: Empowering graduates through data insights* \[Final year project, Universiti Malaysia Sarawak\]. [https\://scholarhub.unimas.my/handle/123456789/367](https://scholarhub.unimas.my/handle/123456789/367)

Sondakh, J. J., & Tulung, J. E. (2024). Understanding student’s intention to pursue a career: Implications for the accounting profession. *Journal of Education and e-Learning Research, 11*(3), 632–645. [https\://ideas.repec.org/a/aoj/jeelre/v11y2024i3p632-645id5973.html](https://ideas.repec.org/a/aoj/jeelre/v11y2024i3p632-645id5973.html)

Topi, H., Karsten, H., Brown, S. A., Carvalho, J. A., Donnellan, B., Shen, J., Tan, B. C. Y., & Thouin, M. F. (2017). MSIS 2016 global competency model for graduate degree programs in information systems. *Communications of the Association for Information Systems, 40*, Article 18\.

Ula, \[inisial\], & Faisal, \[inisial\]. (2025). \[LENGKAPI: judul, nama jurnal/penerbit, volume(nomor), halaman, DOI/URL\].

Undang-Undang Republik Indonesia Nomor 27 Tahun 2022 tentang Pelindungan Data Pribadi.

Venkatesh, V., Morris, M. G., Davis, G. B., & Davis, F. D. (2003). User acceptance of information technology: Toward a unified view. *MIS Quarterly, 27*(3), 425–478. [https\://doi.org/10.2307/30036540](https://doi.org/10.2307/30036540)

Wibowo. (2020). \[LENGKAPI: judul, nama jurnal/penerbit, volume(nomor), halaman, DOI/URL\].

Zakaria, I., Marthasari, G. I., & Nuryasin, I. (2025). Penerapan metode Simple Additive Weighting (SAW) pada sistem pendukung keputusan pemilihan bidang minat oleh mahasiswa (Studi kasus: Prodi Informatika UMM). *JATI (Jurnal Mahasiswa Teknik Informatika), 9*(3). [https\://ejournal.itn.ac.id/jati/article/view/13737](https://ejournal.itn.ac.id/jati/article/view/13737)

Zhou, L., Xue, S., & Li, R. (2022). Extending the Technology Acceptance Model to explore students’ intention to use an online education platform at a university in China. *SAGE Open, 12*(1). [https\://doi.org/10.1177/21582440221085259](https://doi.org/10.1177/21582440221085259)
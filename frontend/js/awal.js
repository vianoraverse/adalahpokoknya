// Dijalankan paling awal di setiap halaman (dipasang di <head>, bukan module), supaya tema gelap/terang
// dan bahasa sudah terpasang sebelum halaman tampil. Tanpa ini, halaman sempat "berkedip" putih.
(function () {
  var akar = document.documentElement;
  var simpan = function (k) {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  };

  // Tema: pilihan pengguna (kalau pernah menekan tombol), kalau belum ikut setting perangkat.
  var gelapPerangkat = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)');
  var pasangTema = function () {
    var pilihan = simpan('yourway.tema');
    akar.dataset.tema = pilihan || (gelapPerangkat && gelapPerangkat.matches ? 'gelap' : 'terang');
  };
  pasangTema();
  if (gelapPerangkat && gelapPerangkat.addEventListener) gelapPerangkat.addEventListener('change', pasangTema);

  // Bahasa: halaman admin selalu bahasa Indonesia.
  var admin = location.pathname.indexOf('/admin') === 0;
  akar.lang = !admin && simpan('yourway.bahasa') === 'en' ? 'en' : 'id';
})();

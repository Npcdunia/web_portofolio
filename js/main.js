'use strict';

/* ===== Konfigurasi ===== */
const API_URL = 'http://localhost:8000/api/pesan'; // ganti dengan alamat backend setelah di-deploy
const EMAIL = 'syaifulazril89@gmail.com';

/* ===== Data proyek: ubah isi di sini, halaman ikut berubah ===== */
const proyek = [
  { tag: 'Web App', warna: { bg: '#FFF1D6', fg: '#8A5A00' }, judul: 'Platform Portofolio',
    deskripsi: 'Aplikasi web untuk membuat portofolio profesional.',
    tombol: 'b-oranye', latar: '', gambar: 'img/proyek-1.png', link: '#' },
  { tag: 'Mobile app', warna: { bg: '#E1E5FF', fg: '#1B2BA8' }, judul: 'Aplikasi Pencari Kos',
    deskripsi: 'Konsep aplikasi pencarian kos yang membantu pengguna menemukan pilihan tempat tinggal melalui tampilan peta dan informasi kriteria kos.',
    tombol: 'b-biru', latar: 't2', gambar: 'img/proyek-2.png', link: '#' },
  { tag: 'IOT', warna: { bg: '#D5F5EC', fg: '#0B6B58' }, judul: 'Sistem Sensor menggunakan ESP32',
    deskripsi: 'Proyek perangkat cerdas yang mengintegrasikan ESP32 dengan komponen sensor lain untuk mempelajari pembacaan data sensor serta respons perangkat.',
    tombol: 'b-teal', latar: 't3', gambar: 'img/proyek-3.png', link: '#' }
]; // gambar: simpan file di folder img dengan nama sesuai path di atas

const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function renderProyek() {
  const wadah = document.getElementById('daftar-proyek');
  wadah.innerHTML = proyek.map((p, i) => `
    <article class="baris${i % 2 === 1 ? ' balik' : ''}">
      <div>
        <span class="tag" style="background:${p.warna.bg};color:${p.warna.fg}">${esc(p.tag)}</span>
        <h3>${esc(p.judul)}</h3>
        <p>${esc(p.deskripsi)}</p>
        <a href="${esc(p.link)}" class="btn ${p.tombol}">Lihat proyek &rsaquo;</a>
      </div>
      <div class="thumb ${p.latar}">${p.gambar ? `<img src="${esc(p.gambar)}" alt="Tampilan ${esc(p.judul)}" loading="lazy" onerror="this.remove()">` : ''}</div>
    </article>`).join('');
}

/* ===== Menu di layar kecil ===== */
function menuMobile() {
  const tombol = document.getElementById('tombol-menu');
  const menu = document.getElementById('menu');
  const tutup = () => { menu.classList.remove('buka'); tombol.setAttribute('aria-expanded', 'false'); };
  tombol.addEventListener('click', () => {
    const buka = menu.classList.toggle('buka');
    tombol.setAttribute('aria-expanded', String(buka));
  });
  menu.addEventListener('click', e => { if (e.target.tagName === 'A') tutup(); });
}

/* ===== Tandai menu sesuai bagian yang sedang dilihat ===== */
function menuAktif() {
  const tautan = [...document.querySelectorAll('.menu a')];
  const peta = new Map(tautan.map(a => [a.getAttribute('href').slice(1), a]));
  const pengamat = new IntersectionObserver(daftar => {
    daftar.forEach(e => {
      if (!e.isIntersecting) return;
      tautan.forEach(a => a.classList.remove('aktif'));
      const a = peta.get(e.target.id);
      if (a) a.classList.add('aktif');
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  peta.forEach((_, id) => { const bagian = document.getElementById(id); if (bagian) pengamat.observe(bagian); });
}

/* ===== Form kontak: validasi lalu kirim ke backend Python ===== */
function formKontak() {
  const form = document.getElementById('form-kontak');
  const status = document.getElementById('status');
  const aturan = {
    nama: v => v.trim().length >= 2 || 'Nama minimal 2 karakter.',
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Format email belum benar.',
    pesan: v => v.trim().length >= 10 || 'Pesan minimal 10 karakter.'
  };
  const cek = nama => {
    const input = form.elements[nama];
    const hasil = aturan[nama](input.value);
    document.getElementById('err-' + nama).textContent = hasil === true ? '' : hasil;
    input.setAttribute('aria-invalid', String(hasil !== true));
    return hasil === true;
  };
  Object.keys(aturan).forEach(n => form.elements[n].addEventListener('blur', () => cek(n)));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    status.className = 'status'; status.textContent = '';
    if (!Object.keys(aturan).map(cek).every(Boolean)) {
      status.textContent = 'Periksa kembali isian yang ditandai.'; status.classList.add('gagal'); return;
    }
    const tombol = form.querySelector('button');
    tombol.disabled = true; tombol.textContent = 'Mengirim...';
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nama: form.elements.nama.value.trim(), email: form.elements.email.value.trim(), pesan: form.elements.pesan.value.trim() })
      });
      if (!res.ok) throw new Error('Status ' + res.status);
      form.reset();
      status.textContent = 'Pesan terkirim. Terima kasih, saya akan membalas lewat email.';
      status.classList.add('sukses');
    } catch (err) {
      status.innerHTML = `Pesan belum terkirim. Kirim langsung ke <a href="mailto:${EMAIL}">${EMAIL}</a>.`;
      status.classList.add('gagal');
    } finally {
      tombol.disabled = false; tombol.innerHTML = 'Kirim pesan &rsaquo;';
    }
  });
}

renderProyek();
menuMobile();
menuAktif();
formKontak();

# Portofolio Moch Syaiful Azril

Website portofolio web developer freelance. Dibuat untuk Tugas Mandiri 2.

## Teknologi
- HTML5 (struktur semantik), CSS3 (variabel, grid, flexbox, responsif)
- JavaScript (render proyek dari data, menu aktif saat scroll, validasi form, fetch ke API)
- Python + FastAPI (backend form kontak)

## Struktur
```
index.html          halaman utama
css/style.css       seluruh gaya
js/main.js          interaksi dan data proyek
img/                foto dan gambar proyek
backend/main.py     API kontak (FastAPI)
backend/requirements.txt
```

## Menjalankan
Frontend (dari folder proyek):
```
python -m http.server 5500
```
Buka http://localhost:5500

Backend (terminal lain):
```
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Pesan dari form tersimpan di `backend/pesan.json` (tidak ikut di-commit).

## Deploy
Frontend: GitHub Pages (Settings > Pages > branch `main`, folder root).
Backend belum di-deploy; tanpa backend, form menampilkan tautan email sebagai cadangan.

## Alur pengembangan
Dikerjakan bertahap dengan commit kecil, misalnya: `feat: tambah form kontak`, `style: rapikan tata letak mobile`, `fix: perbaiki validasi email`.

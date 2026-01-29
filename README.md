# WebGIS Persebaran Pembangkit EBT Kalimantan Timur

WebGIS ini adalah aplikasi pemetaan interaktif untuk memvisualisasikan persebaran Pembangkit Listrik (EBT dan Non-EBT) di wilayah Kalimantan Timur. Aplikasi ini dirancang untuk memudahkan analisis spasial, pemantauan kondisi cuaca real-time di lokasi pembangkit, serta penyediaan statistik energi.

---

## Fitur Utama

1. **Peta Interaktif**
   Visualisasi titik lokasi pembangkit dengan simbologi warna berbeda untuk setiap jenis pembangkit (PLTS, PLTD, PLTU, dll).

2. **Pencarian & Filter Canggih**
   - Cari pembangkit berdasarkan Nama atau Wilayah (Region).
   - Filter data berdasarkan Jenis Pembangkit (Dropdown).

3. **Detail Informasi & Cuaca Real-time**
   Integrasi dengan API Open-Meteo untuk menampilkan kondisi cuaca terkini (Suhu, Kecepatan Angin, Kondisi Langit) langsung di lokasi pembangkit.

4. **Navigasi Rute**
   Tombol integrasi ke Google Maps untuk mendapatkan rute perjalanan langsung ke titik lokasi.

5. **Dashboard Statistik**
   Grafik Pie Chart interaktif untuk melihat persentase bauran energi di Kalimantan Timur.

6. **Export Data**
   Fitur untuk mengunduh data hasil filter ke dalam format CSV/Excel.

7. **Basemap Switcher**
   Pilihan mode tampilan peta: Dark Mode (Gelap), Satellite (Satelit), dan OSM (Terang).

---

## Teknologi yang Digunakan (Tech Stack)

### Frontend (Client-Side)
- **React + Vite:** Framework UI utama.
- **Tailwind CSS:** Styling antarmuka.
- **Leaflet & React-Leaflet:** Library peta interaktif.
- **Chart.js:** Visualisasi grafik statistik.
- **Axios:** Fetching data API.

### Backend (Server-Side)
- **Python:** Bahasa pemrograman utama.
- **FastAPI:** Framework API backend.
- **Pandas:** Pemrosesan data CSV.
- **Uvicorn:** Server ASGI.

---

## Sumber Data

1. **Data Pembangkit:**
   File `pembangkit_esdm_with_latlon.csv` yang berisi data lokasi, jenis, kapasitas, dan tahun operasi pembangkit.

2. **Data Cuaca:**
   API Publik dari **Open-Meteo** (Free Weather API).

3. **Peta Dasar:**
   OpenStreetMap, Esri World Imagery, dan CartoDB.

---

## Cara Menjalankan Aplikasi

Pastikan Node.js dan Python sudah terinstall.

### 1. Menjalankan Backend (Python)
Buka terminal, masuk ke folder backend:
cd backend

Install dependencies:
pip install fastapi uvicorn pandas

Jalankan server:
python -m uvicorn main:app --reload

(Server akan berjalan di: http://127.0.0.1:8000)

### 2. Menjalankan Frontend (React)
Buka terminal baru, masuk ke folder frontend:
cd frontend

Install dependencies:
npm install

Jalankan aplikasi:
npm run dev

(Akses web di: http://localhost:5173)

---

## Struktur Folder

webgis-kaltim/
├── backend/                  # API Server (Python FastAPI)
│   ├── main.py               # Kode Utama Backend
│   └── pembangkit_esdm...csv # Data Sumber
│
├── frontend/                 # Client Side (React Vite)
│   ├── src/
│   │   ├── App.jsx           # Logika Utama Aplikasi
│   │   └── ...
│   └── package.json
│
└── README.md                 # Dokumentasi ini

---

## Author
Dikembangkan sebagai Tugas Besar WebGIS / Informatika Universitas Mulawarman.

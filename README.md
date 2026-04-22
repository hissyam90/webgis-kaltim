# WebGIS Persebaran Pembangkit Energi Kalimantan

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Frontend](https://img.shields.io/badge/Frontend-React%20(Vite)-61DAFB)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)

Aplikasi WebGIS berbasis web untuk memvisualisasikan persebaran pembangkit listrik di Kalimantan, lengkap dengan mode analisis wilayah untuk kabupaten/kota di Kalimantan Timur. Frontend dibangun dengan React + Vite, sedangkan backend menyediakan API FastAPI yang membaca data dari PostgreSQL.

## Fitur

### Peta Interaktif
- Visualisasi titik fasilitas pembangkit dengan Leaflet / React-Leaflet.
- Marker berwarna berdasarkan jenis pembangkit.
- Basemap switcher: Dark, OpenStreetMap, dan Satellite (Esri).
- Highlight wilayah provinsi saat filter Kalimantan aktif.

### Mode Data
- `Fasilitas`: menampilkan titik pembangkit aktif.
- `Potensi`: menampilkan dataset potensi energi, termasuk layer tambahan hidro GeoESDM.
- `Wilayah`: menampilkan analisis kabupaten/kota Kalimantan Timur dalam bentuk choropleth.

### Analisis Wilayah Kaltim
- Boundary kabupaten/kota dimuat dari folder `frontend/public/geo/raw`.
- Polygon wilayah diwarnai berdasarkan metrik terpilih.
- Metrik analisis yang tersedia:
  - total fasilitas
  - renewable facilities
  - non-renewable facilities
  - renewable share
  - dominant energy type
- Sidebar menampilkan ringkasan wilayah terpilih dan daftar wilayah yang sudah diurutkan berdasarkan metrik aktif.
- Legend berubah dinamis mengikuti mode titik atau mode wilayah.

### Pencarian dan Filter
- Search real-time berdasarkan nama, lokasi, wilayah, atau kabupaten/kota.
- Filter jenis pembangkit / jenis potensi.
- Filter wilayah berbasis preset provinsi Kalimantan.

### Statistik dan Detail
- Modal statistik menggunakan Chart.js.
- Popup detail fasilitas untuk melihat informasi ringkas pembangkit.
- Cuaca real-time saat membuka detail fasilitas.

### Export
- Export hasil filter fasilitas ke CSV langsung dari frontend.

## Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Leaflet + React-Leaflet
- Chart.js
- Axios
- Turf.js

### Backend
- Python 3.10+
- FastAPI
- Uvicorn
- SQLAlchemy
- Pandas / GeoPandas
- python-dotenv

### Database
- PostgreSQL
- PostGIS (opsional untuk pengembangan spasial lanjutan)

## API Endpoint

### `GET /api/pembangkit`
Mengambil data pembangkit dan bisa dikombinasikan dengan beberapa filter.

Query params:
- `jenis` (opsional)
- `region` (opsional)
- `minLat`, `maxLat`, `minLon`, `maxLon` (bbox, harus lengkap 4 nilai)

Contoh:
```txt
http://127.0.0.1:8000/api/pembangkit?jenis=PLTU&region=Kalimantan
```

Contoh bbox:
```txt
http://127.0.0.1:8000/api/pembangkit?minLat=-2&maxLat=2&minLon=115&maxLon=120
```

FastAPI docs:
```txt
http://127.0.0.1:8000/docs
```

## Cara Menjalankan

> Pastikan PostgreSQL sudah terinstal dan berjalan.

### 1. Clone repository
```bash
git clone https://github.com/hissyam90/webgis-kaltim.git
cd webgis-kaltim
```

## Backend Setup

### 2. Buat virtual environment dan install dependency

Windows PowerShell:
```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\activate
py -m pip install -U pip
py -m pip install -r .\dependencies.txt
```

Jika `geopandas` sulit di-install lewat pip di Windows, alternatif stabil:
```powershell
mamba install -c conda-forge pandas geopandas sqlalchemy python-dotenv fastapi uvicorn
```

### 3. Buat file `.env`
Buat `backend/.env`:
```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=webgis_kaltim
```

### 4. Siapkan database
```sql
CREATE DATABASE webgis_kaltim;
```

### 5. Import data CSV ke PostgreSQL
Script import akan membuat atau mengganti tabel `pembangkit_listrik`.

Jalankan:
```powershell
py .\import_data.py
```

### 6. Jalankan backend
```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Backend berjalan di:
```txt
http://127.0.0.1:8000
```

## Frontend Setup

### 7. Install dependency dan jalankan frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend biasanya berjalan di:
```txt
http://localhost:5173
```

## Konfigurasi Penting

### URL backend di frontend
Frontend saat ini memanggil API lokal:
```txt
http://127.0.0.1:8000/api/pembangkit
```

Kalau backend berjalan di host atau port lain, sesuaikan URL tersebut atau pindahkan ke environment variable seperti `VITE_API_BASE_URL`.

## Struktur Folder

```txt
webgis-kaltim/
|-- backend/
|   |-- main.py
|   |-- import_data.py
|   |-- dependencies.txt
|   `-- .env
`-- frontend/
    |-- public/
    |   `-- geo/
    |       |-- kalimantan_timur.geojson
    |       `-- raw/
    |-- src/
    |   |-- components/
    |   |-- hooks/
    |   |-- utils/
    |   `-- App.jsx
    `-- package.json
```

## Sumber Data

- GeoESDM
  Digunakan untuk data potensi energi, termasuk layer tambahan potensi hidro.
- `https://github.com/mahendrayudha/indonesia-geojson`
  Digunakan untuk boundary peta provinsi dan kabupaten/kota.

## .gitignore yang Disarankan

```txt
# Python
backend/.venv/
backend/__pycache__/
backend/.env

# Node
frontend/node_modules/
frontend/dist/
```

## Lisensi

MIT License

## Author

Dikembangkan oleh **Kelompok Green Hosa**  
Study Club Pub & AI Informatika - Universitas Mulawarman

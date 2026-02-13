# 🗺️ WebGIS Persebaran Pembangkit EBT Kalimantan

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Frontend](https://img.shields.io/badge/Frontend-React%20(Vite)-61DAFB)
![Backend](https://img.shields.io/badge/Backend-FastAPI-009688)
![Database](https://img.shields.io/badge/Database-PostgreSQL-336791)

Aplikasi WebGIS berbasis web untuk memvisualisasikan persebaran **pembangkit listrik (EBT & Non-EBT)** di wilayah Kalimantan.  
Frontend menampilkan peta, statistik, cuaca real-time, dan export data; backend menyediakan API berbasis **FastAPI** yang membaca data dari **PostgreSQL**.

---

## ✨ Fitur

### 🗺️ Peta Interaktif
- Visualisasi titik lokasi pembangkit menggunakan **Leaflet / React-Leaflet**
- Marker berwarna berdasarkan jenis pembangkit (mis: PLTS, PLTD, PLTU, PLTA)
- **Basemap switcher**: Dark, OpenStreetMap, Satellite (Esri)

### 🔍 Pencarian & Filter
- Search real-time berdasarkan **nama** atau **wilayah**
- Filter berdasarkan **jenis pembangkit**
- Filter wilayah berbasis **Bounding Box** (preset provinsi Kalimantan)

### 🌤️ Cuaca Real-time (Open-Meteo)
- Menampilkan cuaca terkini saat membuka detail pembangkit:
  suhu, kecepatan angin, dan kondisi langit

### 📊 Statistik Energi
- Pie chart (Chart.js) untuk ringkasan jumlah unit per jenis pembangkit

### ⬇️ Export Data
- Export hasil filter ke **CSV** (langsung dari frontend)

### 🧭 Navigasi
- Tombol navigasi ke **Google Maps** untuk rute menuju lokasi pembangkit

---

## 🧰 Tech Stack

### Frontend
- React (Vite)
- Tailwind CSS
- Leaflet + React-Leaflet
- Chart.js
- Axios

### Backend
- Python 3.10+
- FastAPI
- Uvicorn
- SQLAlchemy
- Pandas / GeoPandas
- python-dotenv

### Database
- PostgreSQL  
- PostGIS (opsional, jika ingin fitur spasial lanjutan)

---

## 📌 API Endpoint

### `GET /api/pembangkit`
Mengambil data pembangkit, bisa dikombinasikan dengan filter:

**Query params**
- `jenis` (opsional)
- `region` (opsional)
- `minLat`, `maxLat`, `minLon`, `maxLon` (bbox — harus lengkap 4 nilai)

**Contoh**
```txt
http://127.0.0.1:8000/api/pembangkit?jenis=PLTU&region=Kalimantan
```

**Contoh bbox**
```txt
http://127.0.0.1:8000/api/pembangkit?minLat=-2&maxLat=2&minLon=115&maxLon=120
```

Docs otomatis FastAPI:
```txt
http://127.0.0.1:8000/docs
```

---

## 🚀 Cara Menjalankan (Local Development)

> Pastikan PostgreSQL sudah terinstal dan berjalan.

### 1) Clone Repo
```bash
git clone https://github.com/hissyam90/webgis-kaltim.git
cd webgis-kaltim
```

---

# 🔧 Backend Setup (FastAPI)

### 2) Buat virtual environment & install dependencies

**Windows (PowerShell)**
```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\activate
py -m pip install -U pip
py -m pip install -r .\dependencies.txt
```

> ⚠️ Catatan: `geopandas` kadang sulit di Windows via pip. Kalau error, opsi stabil:
```powershell
mamba install -c conda-forge pandas geopandas sqlalchemy python-dotenv fastapi uvicorn
```

### 3) Buat file `.env`
Buat `backend/.env`:
```env
DB_USER=postgres
DB_PASSWORD=your_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=webgis_kaltim
```

> Jangan commit `.env`. Tambahkan ke `.gitignore`.

### 4) Siapkan database
Buat database:
```sql
CREATE DATABASE webgis_kaltim;
```

### 5) Import data CSV ke PostgreSQL
Script import akan membuat/mengganti tabel:
- **table:** `pembangkit_listrik`
- mode: `replace` (import ulang akan overwrite tabel)

Pastikan file CSV ada di path yang sesuai dengan script:
```py
csv_file = "../pembangkit_esdm_with_latlon.csv"
```

Jalankan:
```powershell
py .\import_data.py
```

### 6) Jalankan backend server
Kalau file FastAPI kamu bernama `main.py` dan objek FastAPI bernama `app`:
```powershell
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Backend akan berjalan di:
```txt
http://127.0.0.1:8000
```

---

# 🎨 Frontend Setup (React)

### 7) Install & run frontend
Buka terminal baru:
```bash
cd frontend
npm install
npm run dev
```

Frontend akan berjalan di (umumnya):
```txt
http://localhost:5173
```

---

## ⚙️ Konfigurasi Penting

### URL Backend di Frontend
Di `App.jsx`, frontend memanggil:
```js
axios.get("http://127.0.0.1:8000/api/pembangkit", { params: bbox })
```

Kalau backend kamu jalan di host/port lain, ubah URL tersebut (atau idealnya pakai `.env` frontend seperti `VITE_API_BASE_URL`).

---

## 🧩 Struktur Folder (contoh)
```txt
webgis-kaltim/
├── backend/
│   ├── main.py
│   ├── import_data.py
│   ├── dependencies.txt
│   └── .env (jangan di-commit)
└── frontend/
    ├── src/
    │   └── App.jsx
    └── package.json
```

---

## ✅ .gitignore (disarankan)
Tambahkan minimal ini:
```txt
# python
backend/.venv/
backend/__pycache__/
backend/.env

# node
frontend/node_modules/
frontend/dist/
```

---

## 🛡️ Lisensi
MIT License

---

## 👨‍💻 Author
Dikembangkan oleh **Kelompok Green Hosa**  
Study Club Pub & AI Informatika — Universitas Mulawarman

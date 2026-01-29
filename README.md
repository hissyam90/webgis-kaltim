# 🗺️ WebGIS Persebaran Pembangkit EBT Kalimantan Timur

![License](https://img.shields.io/badge/license-MIT-blue.svg) ![React](https://img.shields.io/badge/Frontend-React-61DAFB) ![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688) ![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791)

WebGIS ini adalah aplikasi pemetaan interaktif berbasis web untuk memvisualisasikan persebaran Pembangkit Listrik (EBT dan Non-EBT) di wilayah Kalimantan Timur. Aplikasi ini mengintegrasikan data spasial, informasi cuaca real-time, dan statistik energi dalam satu dashboard terpadu.

---

## ✨ Fitur Unggulan

### 1. 🌍 Peta Interaktif & Simbologi
* Visualisasi titik lokasi pembangkit menggunakan library **Leaflet**.
* **Simbologi Warna:** Pembedaan marker berdasarkan jenis pembangkit (misal: 🟡 PLTS, 🔴 PLTD, 🔵 PLT Air) untuk memudahkan identifikasi visual.
* **Basemap Switcher:** Pilihan mode peta:
  * 🌑 **Dark Mode:** Untuk tampilan elegan dan kontras tinggi.
  * 🛰️ **Satellite:** Citra satelit Esri untuk melihat kondisi lapangan.
  * 🗺️ **OpenStreetMap:** Peta jalan standar.

### 2. 🔍 Pencarian & Filter Cerdas
* **Search Bar:** Pencarian *real-time* berdasarkan nama pembangkit atau wilayah (region).
* **Smart Filter:** Dropdown untuk menyaring data berdasarkan jenis energi (EBT vs Non-EBT).

### 3. 🌤️ Integrasi Data Cuaca (Real-time)
* Terhubung dengan **Open-Meteo API**.
* Saat user mengklik detail pembangkit, sistem otomatis menampilkan kondisi cuaca terkini di lokasi tersebut (Suhu, Kecepatan Angin, dan Kondisi Langit).

### 4. 📊 Dashboard Statistik & Analisis
* **Chart.js Integration:** Menampilkan grafik Pie Chart interaktif untuk menganalisis persentase bauran energi di Kalimantan Timur.
* **Export Data:** Fitur unduh data hasil filter ke format **CSV/Excel** untuk kebutuhan laporan.

### 5. 🗺️ Navigasi Rute
* Tombol **"Get Directions"** yang terintegrasi langsung dengan Google Maps untuk memandu pengguna menuju lokasi pembangkit.

---

## 🛠️ Teknologi (Tech Stack)

### **Frontend (Client-Side)**
* **Framework:** React.js (Vite)
* **Styling:** Tailwind CSS
* **Map Engine:** Leaflet & React-Leaflet
* **Visualization:** Chart.js
* **HTTP Client:** Axios

### **Backend (Server-Side)**
* **Language:** Python 3.10+
* **Framework:** FastAPI
* **Server:** Uvicorn (ASGI)
* **Data Processing:** Pandas

### **🗄️ Database Management**
* **Database:** **PostgreSQL** (Relational Database)
* **Extension:** **PostGIS** (Opsional, untuk fitur spasial tingkat lanjut)
* **Role:** Menyimpan data master pembangkit, log aktivitas user, dan konfigurasi wilayah yang lebih aman dan terstruktur dibandingkan file CSV biasa.

---

## 📂 Struktur Database (PostgreSQL)

Aplikasi ini menggunakan tabel utama `pembangkit` dengan skema sebagai berikut:

| Kolom | Tipe Data | Deskripsi |
| :--- | :--- | :--- |
| `id` | SERIAL (PK) | ID Unik Pembangkit |
| `nama` | VARCHAR | Nama Pembangkit |
| `jenis` | VARCHAR | Jenis (PLTS, PLTD, dll) |
| `region` | VARCHAR | Lokasi/Kabupaten |
| `kapasitas` | FLOAT | Kapasitas Daya (MW) |
| `latitude` | FLOAT | Koordinat Lintang |
| `longitude` | FLOAT | Koordinat Bujur |
| `tahun_ops` | INTEGER | Tahun Operasi |

---

## 🚀 Panduan Instalasi (Cara Menjalankan)

Ikuti langkah-langkah ini untuk menjalankan proyek di komputer lokal.

### 1. Clone Repository
```bash
git clone [https://github.com/hissyam90/webgis-kaltim.git](https://github.com/hissyam90/webgis-kaltim.git)
cd webgis-kaltim

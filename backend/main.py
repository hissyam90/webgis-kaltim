from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

# 1. Konfigurasi Database
load_dotenv()
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)

# 2. Inisialisasi Aplikasi FastAPI
app = FastAPI()

# 3. Setting CORS (Agar React boleh akses data ini)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Di production nanti diganti url website asli
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 4. Route (Endpoint) untuk Cek Server
@app.get("/")
def read_root():
    return {"status": "Server Berjalan!", "message": "WebGIS Kaltim API Ready"}

# 5. Route UTAMA: Ambil Data Pembangkit
@app.get("/api/pembangkit")
def get_all_pembangkit():
    try:
        # Kita ambil kolom penting saja: Nama, Jenis, Tahun, Koordinat
        query = text("""
            SELECT 
                objectid_1 as id, 
                namobj as nama, 
                jnspls as jenis, 
                thnopr as tahun_operasi, 
                regpln as region,
                latitude, 
                longitude 
            FROM pembangkit_listrik
        """)
        
        with engine.connect() as connection:
            result = connection.execute(query)
            # Ubah hasil database jadi bentuk JSON (List of Dictionaries)
            data_pembangkit = [row._asdict() for row in result]
            
        return {
            "total_data": len(data_pembangkit),
            "data": data_pembangkit
        }
    
    except Exception as e:
        return {"error": str(e)}

# 6. Route Filter: Ambil Data Berdasarkan Jenis (Misal: PLTS saja)
@app.get("/api/pembangkit/{jenis}")
def get_pembangkit_by_jenis(jenis: str):
    try:
        # Cari yang namanya mirip (case insensitive)
        query = text(f"""
            SELECT * FROM pembangkit_listrik 
            WHERE jnspls ILIKE :jenis
        """)
        
        with engine.connect() as connection:
            result = connection.execute(query, {"jenis": f"%{jenis}%"})
            data = [row._asdict() for row in result]
            
        return {"kategori": jenis, "total": len(data), "data": data}
        
    except Exception as e:
        return {"error": str(e)}
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text
import os
from dotenv import load_dotenv

load_dotenv()
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)

app = FastAPI()

# NOTE:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Server Berjalan!", "message": "WebGIS Kaltim API Ready"}


@app.get("/api/pembangkit")
def get_all_pembangkit(
    jenis: str | None = Query(default=None, description="Filter jenis pembangkit (ILIKE)"),
    region: str | None = Query(default=None, description="Filter region/pulau (ILIKE)"),
    minLat: float | None = Query(default=None),
    maxLat: float | None = Query(default=None),
    minLon: float | None = Query(default=None),
    maxLon: float | None = Query(default=None),
):
    """
    Endpoint tunggal:
    - Bisa ambil semua data
    - Bisa filter jenis/region
    - Bisa filter bounding box (minLat,maxLat,minLon,maxLon)
    - Bisa dikombinasikan
    """
    try:
        base_sql = """
            SELECT
                objectid_1 as id,
                namobj as nama,
                jnspls as jenis,
                thnopr as tahun_operasi,
                regpln as region,
                latitude,
                longitude
            FROM pembangkit_listrik
        """

        conditions = []
        params = {}

        if jenis and jenis.lower() != "semua":
            conditions.append("jnspls ILIKE :jenis")
            params["jenis"] = f"%{jenis}%"

        if region and region.lower() != "semua":
            conditions.append("regpln ILIKE :region")
            params["region"] = f"%{region}%"

        bbox_values = [minLat, maxLat, minLon, maxLon]
        if any(v is not None for v in bbox_values):
            if not all(v is not None for v in bbox_values):
                raise HTTPException(
                    status_code=400,
                    detail="bbox harus lengkap: minLat, maxLat, minLon, maxLon"
                )

            if minLat > maxLat:
                raise HTTPException(status_code=400, detail="minLat tidak boleh > maxLat")
            if minLon > maxLon:
                raise HTTPException(status_code=400, detail="minLon tidak boleh > maxLon")

            conditions.append("latitude BETWEEN :minLat AND :maxLat")
            conditions.append("longitude BETWEEN :minLon AND :maxLon")
            params.update({
                "minLat": minLat, "maxLat": maxLat,
                "minLon": minLon, "maxLon": maxLon,
            })

        if conditions:
            base_sql += " WHERE " + " AND ".join(conditions)

        query = text(base_sql)

        with engine.connect() as connection:
            result = connection.execute(query, params)
            data_pembangkit = [row._asdict() for row in result]

        return {"total_data": len(data_pembangkit), "data": data_pembangkit}

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/pembangkit/by-jenis/{jenis}")
def get_pembangkit_by_jenis(jenis: str):
    try:
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
            WHERE jnspls ILIKE :jenis
        """)

        with engine.connect() as connection:
            result = connection.execute(query, {"jenis": f"%{jenis}%"})
            data = [row._asdict() for row in result]

        return {"kategori": jenis, "total": len(data), "data": data}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

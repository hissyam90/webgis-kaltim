import pandas as pd
import geopandas as gpd
from sqlalchemy import create_engine, text
import os
import io
from dotenv import load_dotenv

# --- KONFIGURASI DATABASE ---
load_dotenv()
DB_USER = os.getenv("DB_USER")
DB_PASS = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST", "localhost")
DB_PORT = os.getenv("DB_PORT", "5432")
DB_NAME = os.getenv("DB_NAME")

DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASS}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
engine = create_engine(DATABASE_URL)

def clean_and_import():
    csv_file = "../data/pembangkit_esdm_with_latlon.csv"
    
    print(f" 1. Membaca file: {csv_file} ...")
    
    try:
        print(" Mengaktifkan fitur PostGIS di database...")
        with engine.connect() as connection:
            connection.commit()
        print("    PostGIS berhasil diaktifkan!")

        with open(csv_file, 'r', encoding='utf-8') as f:
            lines = f.readlines()
            
        cleaned_lines = []
        for line in lines:
            line = line.strip()
            if line.startswith('"') and line.endswith('"'):
                line = line[1:-1]
            line = line.replace('""', '"')
            cleaned_lines.append(line)
            
        clean_content = "\n".join(cleaned_lines)
        
        df = pd.read_csv(io.StringIO(clean_content))
        df.columns = df.columns.str.lower().str.replace('"', '').str.replace("'", "").str.strip()
        
        print(" 2. Memfilter data...")
        df = df[df['regpln'] != '4326']
        
        if 'regpln' in df.columns:
            df_kalimantan = df[df['regpln'].str.contains('Kalimantan', case=False, na=False)].copy()
        else:
            df_kalimantan = df.copy()

        if 'thnopr' in df.columns:
            df_kalimantan['thnopr'] = pd.to_numeric(df_kalimantan['thnopr'], errors='coerce')

        print(f"    Data siap diupload: {len(df_kalimantan)} baris.")

        print(" 3. Mengubah koordinat jadi Peta...")
        gdf = gpd.GeoDataFrame(
            df_kalimantan, 
            geometry=gpd.points_from_xy(df_kalimantan['longitude'], df_kalimantan['latitude']),
            crs="EPSG:4326"
        )

        print(" 4. Mengupload ke Database...")
        df = gdf.drop(columns=["geometry"], errors="ignore")
        df.to_sql("pembangkit_listrik", engine, if_exists="replace", index=False)
        print(" Upload berhasil (tanpa PostGIS)!")
        
    except Exception as e:
        print(f"\n TERJADI ERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    clean_and_import()
from __future__ import annotations

import json
from pathlib import Path

import pandas as pd


BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
RAW_PEMBANGKIT_PATH = BASE_DIR / "data" / "pembangkit_listrik_kalimantan.csv"
PROVINCE_GEOJSON_PATH = PROJECT_ROOT / "frontend" / "public" / "geo" / "provinsi_indonesia.geojson"
OUTPUT_DIR = BASE_DIR / "processed"
OUTPUT_PEMBANGKIT_PATH = OUTPUT_DIR / "pembangkit_kaltim_cleaned.csv"
OUTPUT_SUMMARY_PATH = OUTPUT_DIR / "kabupaten_energy_summary.csv"

KALTIM_PROVINCE_NAME = "KALIMANTAN TIMUR"
VALID_LON_RANGE = (95.0, 141.0)
VALID_LAT_RANGE = (-11.0, 6.5)


ENERGY_TYPE_MAP = {
    "PLTA": "PLTA",
    "PLTM": "PLTM",
    "PLTMH": "PLTMH",
    "PLTS": "PLTS",
    "PLTB": "PLTB",
    "PLTBM": "PLTBM",
    "PLTBG": "PLTBG",
    "PLTP": "PLTP",
    "PLTD": "PLTD",
    "PLTU": "PLTU",
    "PLTG": "PLTG",
    "PLTMG": "PLTMG",
    "PLTGU": "PLTGU",
    "STEAM": "STEAM",
}

RENEWABLE_TYPES = {"PLTA", "PLTM", "PLTMH", "PLTS", "PLTB", "PLTBM", "PLTBG", "PLTP"}
NON_RENEWABLE_TYPES = {"PLTD", "PLTU", "PLTG", "PLTMG", "PLTGU", "STEAM"}


def load_kaltim_geometry() -> dict:
    geojson = json.loads(PROVINCE_GEOJSON_PATH.read_text(encoding="utf-8"))

    for feature in geojson.get("features", []):
        properties = feature.get("properties", {})
        if str(properties.get("Propinsi", "")).upper() == KALTIM_PROVINCE_NAME:
            return feature.get("geometry", {})

    raise ValueError(f"Province boundary '{KALTIM_PROVINCE_NAME}' was not found in {PROVINCE_GEOJSON_PATH}.")


def point_in_ring(lon: float, lat: float, ring: list[list[float]]) -> bool:
    inside = False
    if not ring:
        return False

    j = len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i]
        xj, yj = ring[j]

        intersects = ((yi > lat) != (yj > lat)) and (
            lon < (xj - xi) * (lat - yi) / ((yj - yi) or 1e-12) + xi
        )
        if intersects:
            inside = not inside
        j = i

    return inside


def point_in_polygon(lon: float, lat: float, polygon_coords: list[list[list[float]]]) -> bool:
    if not polygon_coords:
        return False

    outer_ring = polygon_coords[0]
    if not point_in_ring(lon, lat, outer_ring):
        return False

    holes = polygon_coords[1:]
    return not any(point_in_ring(lon, lat, hole) for hole in holes)


def point_in_geometry(lon: float, lat: float, geometry: dict) -> bool:
    geometry_type = geometry.get("type")
    coordinates = geometry.get("coordinates", [])

    if geometry_type == "Polygon":
        return point_in_polygon(lon, lat, coordinates)
    if geometry_type == "MultiPolygon":
        return any(point_in_polygon(lon, lat, polygon) for polygon in coordinates)

    raise ValueError(f"Unsupported geometry type: {geometry_type}")


def normalize_energy_type(value: object) -> str:
    raw = str(value or "").strip().upper().replace(" ", "")
    return ENERGY_TYPE_MAP.get(raw, raw or "UNKNOWN")


def classify_energy_group(jenis_std: str) -> str:
    if jenis_std in RENEWABLE_TYPES:
        return "renewable"
    if jenis_std in NON_RENEWABLE_TYPES:
        return "non_renewable"
    return "other"


def clean_main_dataset() -> pd.DataFrame:
    df = pd.read_csv(RAW_PEMBANGKIT_PATH)

    df["longitude"] = pd.to_numeric(df["longitude"], errors="coerce")
    df["latitude"] = pd.to_numeric(df["latitude"], errors="coerce")
    df["thnopr"] = pd.to_numeric(df["thnopr"], errors="coerce")
    df["namobj"] = df["namobj"].fillna("").astype(str).str.strip()
    df["jnspls"] = df["jnspls"].fillna("").astype(str).str.strip()

    df = df.dropna(subset=["longitude", "latitude"])
    df = df[df["longitude"].between(*VALID_LON_RANGE) & df["latitude"].between(*VALID_LAT_RANGE)].copy()
    kaltim_geometry = load_kaltim_geometry()
    within_kaltim = df.apply(
        lambda row: point_in_geometry(row["longitude"], row["latitude"], kaltim_geometry),
        axis=1,
    )
    df = df.loc[within_kaltim].copy()

    df["jenis_std"] = df["jnspls"].apply(normalize_energy_type)
    df["energy_group"] = df["jenis_std"].apply(classify_energy_group)
    df["provinsi"] = "Kalimantan Timur"
    df["nama_normalized"] = df["namobj"].str.upper().str.replace(r"\s+", " ", regex=True)
    df = df.drop_duplicates(subset=["nama_normalized", "longitude", "latitude", "jenis_std"]).copy()

    cleaned = df.rename(
        columns={
            "objectid_1": "facility_id",
            "namobj": "nama",
            "jnspls": "jenis_raw",
            "thnopr": "tahun_operasi",
        }
    )

    cleaned["tahun_operasi"] = cleaned["tahun_operasi"].where(cleaned["tahun_operasi"].notna(), pd.NA)

    cleaned = cleaned[
        [
            "facility_id",
            "nama",
            "jenis_raw",
            "jenis_std",
            "energy_group",
            "tahun_operasi",
            "regpln",
            "provinsi",
            "longitude",
            "latitude",
        ]
    ].sort_values(["energy_group", "jenis_std", "nama", "facility_id"], na_position="last")

    return cleaned.reset_index(drop=True)


def create_summary(cleaned: pd.DataFrame) -> pd.DataFrame:
    # Until a kabupaten/kota boundary layer is added, keep a simple province-level
    # summary in the requested output file so the pipeline stays reproducible.
    summary = pd.DataFrame(
        [
            {
                "kabupaten_kota": "Kalimantan Timur",
                "total_facilities": int(len(cleaned)),
                "renewable_facilities": int((cleaned["energy_group"] == "renewable").sum()),
                "non_renewable_facilities": int((cleaned["energy_group"] == "non_renewable").sum()),
                "other_facilities": int((cleaned["energy_group"] == "other").sum()),
            }
        ]
    )

    type_counts = cleaned["jenis_std"].value_counts().sort_index()
    for jenis_std, count in type_counts.items():
        summary[f"{jenis_std.lower()}_count"] = int(count)

    return summary


def print_audit(cleaned: pd.DataFrame) -> None:
    print("\nRAW TYPE FREQUENCY")
    print(cleaned["jenis_raw"].value_counts().sort_index().to_string())

    print("\nSTANDARDIZED TYPE FREQUENCY")
    print(cleaned["jenis_std"].value_counts().sort_index().to_string())

    print("\nENERGY_GROUP FREQUENCY")
    print(cleaned["energy_group"].value_counts().sort_index().to_string())

    print("\nRAW TO STANDARDIZED CROSSWALK")
    crosswalk = (
        cleaned[["jenis_raw", "jenis_std", "energy_group"]]
        .drop_duplicates()
        .sort_values(["jenis_raw", "jenis_std"])
    )
    print(crosswalk.to_string(index=False))


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    cleaned = clean_main_dataset()
    summary = create_summary(cleaned)

    cleaned.to_csv(OUTPUT_PEMBANGKIT_PATH, index=False)
    summary.to_csv(OUTPUT_SUMMARY_PATH, index=False)

    print_audit(cleaned)

    print(f"Saved {len(cleaned)} cleaned records to {OUTPUT_PEMBANGKIT_PATH}")
    print(f"Saved summary to {OUTPUT_SUMMARY_PATH}")


if __name__ == "__main__":
    main()

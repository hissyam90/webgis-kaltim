import { useEffect, useState } from "react";

export function useProvGeojson() {
  const [geo, setGeo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}geo/provinsi_indonesia.geojson`;

    fetch("/geo/provinsi_indonesia.geojson")
      .then(async (r) => {
        const text = await r.text(); // read as text first
        if (!r.ok) throw new Error(`HTTP ${r.status}: ${text.slice(0, 120)}`);

        // debug: if it starts with "<", you're still getting HTML
        if (text.trim().startsWith("<")) {
          throw new Error(`Not JSON (got HTML). First chars: ${text.slice(0, 60)}`);
        }

        return JSON.parse(text);
      })
      .then((data) => {
        setGeo(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load province GeoJSON:", err);
        setLoading(false);
      });
  }, []);

  return { geo, loading };
}

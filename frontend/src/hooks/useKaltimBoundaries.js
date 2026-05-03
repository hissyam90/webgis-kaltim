import { useEffect, useState } from "react";

const KALTIM_BOUNDARY_FILES = [
  "Balikpapan.geojson",
  "Berau.geojson",
  "Bontang.geojson",
  "Kutai Barat.geojson",
  "Kutai Kartanegara.geojson",
  "Kutai Timur.geojson",
  "Paser.geojson",
  "Penajam Paser Utara.geojson",
  "Samarinda.geojson",
];

function normalizeFeature(feature) {
  const properties = feature?.properties || {};
  const areaName = properties.NAME_2 || "Tidak Diketahui";
  const areaType = properties.TYPE_2 || "Wilayah";

  return {
    ...feature,
    properties: {
      ...properties,
      areaId: properties.CC_2 || areaName,
      areaName,
      areaType,
      areaLabel: `${areaType} ${areaName}`,
    },
  };
}

export function useKaltimBoundaries() {
  const [geojson, setGeojson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);

        const responses = await Promise.all(
          KALTIM_BOUNDARY_FILES.map((file) => fetch(`/geo/raw/${encodeURIComponent(file)}`))
        );

        const collections = await Promise.all(
          responses.map(async (response) => {
            if (!response.ok) {
              throw new Error(`Gagal memuat boundary ${response.url}`);
            }

            return response.json();
          })
        );

        const features = collections.flatMap((item) => {
          if (item?.type === "FeatureCollection") {
            return item.features.map(normalizeFeature);
          }

          if (item?.type === "Feature") {
            return [normalizeFeature(item)];
          }

          return [];
        });

        if (!cancelled) {
          setGeojson({
            type: "FeatureCollection",
            features,
          });
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setGeojson(null);
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  return { geojson, loading, error };
}

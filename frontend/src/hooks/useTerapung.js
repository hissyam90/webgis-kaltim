import { useEffect, useState } from "react";
import Papa from "papaparse";

export function useTerapung() {
  const [danau, setDanau] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);

        // Put danau.csv in /public/danau.csv
        const res = await fetch("/danau.csv");
        const text = await res.text();

        const parsed = Papa.parse(text, { header: true, skipEmptyLines: true });
        const rows = (parsed.data || []).map((r) => ({
          ...r,
          pot_mw: Number(String(r.pot_mw ?? "").replace(",", ".")) || 0,
          luas_ha_: Number(String(r.luas_ha_ ?? "").replace(",", ".")) || 0,
        }));

        if (alive) setDanau(rows);
      } catch (e) {
        console.error(e);
        if (alive) setDanau([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  return { danau, loading };
}
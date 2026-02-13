import { useEffect, useState } from "react";
import axios from "axios";

export function usePembangkit(API_BASE, bbox) {
  const [pembangkit, setPembangkit] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!API_BASE) {
      setError(new Error("VITE_API_BASE_URL belum diset"));
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    axios
      .get(`${API_BASE}/api/pembangkit`, { params: bbox }) 
      .then((res) => {
        if (cancelled) return;
        setPembangkit(res.data?.data || []);
        setLoading(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Gagal ambil data:", err);
        setPembangkit([]);
        setError(err);
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [API_BASE, bbox]);

  return { pembangkit, loading, error };
}

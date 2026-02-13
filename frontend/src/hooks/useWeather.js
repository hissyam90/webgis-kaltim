import { useEffect, useState } from "react";
import axios from "axios";

export function useWeather(selectedDetail) {
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(false);

  useEffect(() => {
    if (!selectedDetail) return;

    const lat = Number(selectedDetail.latitude);
    const lon = Number(selectedDetail.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lon)) return;

    let cancelled = false;
    setLoadingWeather(true);
    setWeatherData(null);

    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&timezone=auto`;

    axios
      .get(url)
      .then((res) => {
        if (cancelled) return;
        setWeatherData(res.data?.current_weather ?? null);
        setLoadingWeather(false);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Gagal ambil cuaca:", err);
        setLoadingWeather(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedDetail]);

  return { weatherData, loadingWeather };
}

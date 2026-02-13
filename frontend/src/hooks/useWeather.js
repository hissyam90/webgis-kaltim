import { useState, useEffect } from 'react';
import axios from 'axios';

export function useWeather(latitude, longitude) {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Cek apakah koordinat valid (tidak null/undefined/0)
        if (!latitude || !longitude) {
            setWeather(null);
            return;
        }

        const fetchWeather = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch data dari Open-Meteo
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&timezone=auto`;
                const res = await axios.get(url);
                
                console.log("Data Cuaca:", res.data.current_weather);
                setWeather(res.data.current_weather);
            } catch (err) {
                console.error("Gagal ambil cuaca:", err);
                setError(err);
                setWeather(null);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();

    }, [latitude, longitude]); 

    return { weather, loading, error };
}
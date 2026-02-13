import { useState, useEffect } from 'react';
import axios from 'axios';

export default function usePembangkit() {
    const [pembangkit, setPembangkit] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await axios.get('http://127.0.0.1:8000/api/pembangkit');
                
                console.log("DATA DARI BACKEND:", response.data);

                if (Array.isArray(response.data)) {
                    console.log("Format Array terdeteksi.");
                    setPembangkit(response.data);
                } 
                else if (response.data.data && Array.isArray(response.data.data)) {
                    console.log("Format Object terdeteksi.");
                    setPembangkit(response.data.data);
                } 
                else {
                    console.warn("Format data tidak dikenali, set ke kosong.");
                    setPembangkit([]);
                }

            } catch (err) {
                console.error("Gagal mengambil data:", err);
                setError(err);
                setPembangkit([]); 
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return { pembangkit, loading, error };
}
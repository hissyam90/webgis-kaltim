// Fungsi untuk mendapatkan icon cuaca berdasarkan WMO Weather Code
export function getWeatherIcon(code) {
    if (code === 0) return "☀️"; // Cerah
    if (code >= 1 && code <= 3) return "⛅"; // Berawan
    if (code >= 45 && code <= 48) return "🌫️"; // Kabut
    if (code >= 51 && code <= 55) return "🌦️"; // Gerimis
    if (code >= 61 && code <= 65) return "🌧️"; // Hujan Ringan-Sedang
    if (code >= 71 && code <= 77) return "❄️"; // Salju
    if (code >= 80 && code <= 82) return "⛈️"; // Hujan Deras
    if (code >= 95 && code <= 99) return "🌩️"; // Badai Petir
    return "❓"; // Kode tidak dikenal
}

// Fungsi helper untuk deskripsi teks (opsional, jika diperlukan nanti)
export function getWeatherDesc(code) {
    if (code === 0) return "Cerah";
    if (code >= 1 && code <= 3) return "Berawan";
    if (code >= 45 && code <= 48) return "Berkabut";
    if (code >= 51 && code <= 55) return "Gerimis";
    if (code >= 61 && code <= 65) return "Hujan";
    if (code >= 80 && code <= 82) return "Hujan Deras";
    if (code >= 95 && code <= 99) return "Badai Petir";
    return "Tidak Diketahui";
}
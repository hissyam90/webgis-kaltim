export function getWeatherInfo(code) {
  if (code === 0) return { label: "Cerah / Langit Bersih", icon: "☀️" };
  if (code >= 1 && code <= 3) return { label: "Berawan / Mendung", icon: "☁️" };
  if (code >= 45 && code <= 48) return { label: "Kabut", icon: "🌫️" };
  if (code >= 51 && code <= 67) return { label: "Gerimis / Hujan Ringan", icon: "🌦️" };
  if (code >= 80 && code <= 99) return { label: "Hujan Lebat / Badai", icon: "⛈️" };
  return { label: "Tidak Diketahui", icon: "❓" };
}

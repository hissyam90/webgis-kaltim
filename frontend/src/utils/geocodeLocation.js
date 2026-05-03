const REGION_COORDS = {
  "Samarinda": { latitude: -0.5022, longitude: 117.1537 },
  "Balikpapan": { latitude: -1.2379, longitude: 116.8529 },
  "Bontang": { latitude: 0.1333, longitude: 117.5000 },
  "Kutai Timur": { latitude: 0.5147, longitude: 117.4954 },
  "Kutai Kartanegara": { latitude: -0.4167, longitude: 116.8500 },
  "Berau": { latitude: 2.1554, longitude: 117.4854 },
  "Paser": { latitude: -1.7177, longitude: 116.1230 },
  "Penajam Paser Utara": { latitude: -1.2917, longitude: 116.6970 },
};

export function getApproxCoords(locationName) {
  if (!locationName) return null;

  const found = Object.entries(REGION_COORDS).find(([key]) =>
    locationName.toLowerCase().includes(key.toLowerCase())
  );

  return found ? found[1] : null;
}
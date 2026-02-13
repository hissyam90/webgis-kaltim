export function openGoogleMaps(lat, lon) {
  window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, "_blank");
}

import { useEffect } from "react";
import { useMap } from "react-leaflet";

export default function FlyToLocation({ target }) {
  const map = useMap();

  useEffect(() => {
    if (target) {
      map.flyTo([target.latitude, target.longitude], 14, { duration: 1.5 });
    }
  }, [target, map]);

  return null;
}

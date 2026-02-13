import { MapContainer, TileLayer, CircleMarker, Popup, Marker } from "react-leaflet";
import FlyToLocation from "./FlyToLocation";
import { getColor } from "../../utils/getColor";
import { GeoJSON } from "react-leaflet";

export default function MapView({
  tile,
  filteredData,
  userLocation,
  focusLocation,
  onOpenDetail,
  selectedProvFeature,
}) {
  return (
    <div className="flex-1 h-full relative z-0">
      <MapContainer
        center={[0.5386586, 116.419389]}
        zoom={6}
        className="h-full w-full bg-slate-800"
        zoomControl={false}
      >
        <TileLayer attribution={tile.attr} url={tile.url} />
        <FlyToLocation target={focusLocation} />

        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]}>
            <Popup>Lokasi Saya</Popup>
          </Marker>
        )}

        {filteredData.map((item, idx) => (
          <CircleMarker
            key={idx}
            center={[Number(item.latitude), Number(item.longitude)]}
            radius={6}
            pathOptions={{
              color: getColor(item.jenis),
              fillColor: getColor(item.jenis),
              fillOpacity: 0.8,
              weight: 1,
            }}
          >
            <Popup>
              <div className="min-w-[150px] font-sans text-slate-800">
                <h3 className="font-bold text-sm border-b pb-1 mb-2">{item.nama}</h3>
                <p className="text-xs mb-1">
                  Jenis: <b>{item.jenis}</b>
                </p>
                <p className="text-xs mb-3">Region: {item.region}</p>

                <button
                  onClick={() => onOpenDetail(item)}
                  className="w-full bg-emerald-600 text-white text-xs py-1 rounded hover:bg-emerald-700 transition"
                >
                  Lihat Detail
                </button>
              </div>
            </Popup>
          </CircleMarker>
        ))}


        {selectedProvFeature && (
        <GeoJSON
            data={selectedProvFeature}
            style={{
            weight: 2,
            fillOpacity: 0.05,
            }}
        />
        )}

      </MapContainer>
    </div>
  );
}

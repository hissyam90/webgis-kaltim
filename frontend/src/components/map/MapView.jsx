import { MapContainer, TileLayer, CircleMarker, Popup, Marker, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import FlyToLocation from './FlyToLocation';
import { getColor } from '../../utils/getColor';
import '../../lib/leafletIconFix';

export default function MapView({ 
  filteredData = [], 
  focusLocation, 
  userLocation, 
  tile,
  onOpenDetail,
  selectedProvFeature,
  dataMode
}) {
  // FILTER invalid coordinates first
  const validData = filteredData.filter((item) => {
    const lat = Number(item.latitude);
    const lng = Number(item.longitude);

    return (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  });

  return (
    <MapContainer 
      center={[-0.5, 116.5]} 
      zoom={7} 
      className="h-full w-full bg-slate-800" 
      zoomControl={false}
    >
      <TileLayer attribution={tile?.attr} url={tile?.url} />
      {tile?.labelUrl && (
        <TileLayer attribution={tile?.labelAttr || tile?.attr} url={tile.labelUrl} pane="overlayPane" />
      )}
      <FlyToLocation target={focusLocation} />

      {selectedProvFeature && (
        <GeoJSON 
          key={selectedProvFeature.properties.Propinsi} 
          data={selectedProvFeature}
          interactive={false} 
          style={{
            color: "#0ea5e9", 
            weight: 2,
            fillColor: "#0ea5e9",
            fillOpacity: 0.1
          }}
        />
      )}

      {userLocation && (
        <Marker position={[Number(userLocation.latitude), Number(userLocation.longitude)]}>
          <Popup>Lokasi Saya</Popup>
        </Marker>
      )}

      {validData.map((item, idx) => {
        const lat = Number(item.latitude);
        const lng = Number(item.longitude);

        return (
          <CircleMarker 
            key={item.id || idx} 
            center={[lat, lng]}
            radius={dataMode === "potensi" ? 10 : 8}
            pathOptions={{ 
              color: getColor(item.jenis), 
              fillColor: getColor(item.jenis), 
              fillOpacity: 0.8, 
              weight: 1
            }}
          >
            <Popup>
              <div className="min-w-[180px] font-sans text-slate-800 p-1">
                <h3 className="font-bold text-sm border-b border-slate-200 pb-2 mb-2 text-slate-900 leading-tight">
                  {item.nama}
                </h3>

                <div className="text-xs space-y-1 text-slate-600 mb-3">
                  <p>Jenis: <span className="font-semibold text-slate-800">{item.jenis}</span></p>
                  <p>Region: <span className="font-semibold text-slate-800">{item.region}</span></p>

                  {dataMode === "potensi" && (
                    <p>
                      Prediksi: <span className="font-semibold text-cyan-700">{item.prediksi_mw} MW</span>
                    </p>
                  )}
                </div>
                
                <button 
                  onClick={() => onOpenDetail && onOpenDetail(item)}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-1.5 px-3 rounded shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-1"
                >
                  <span>Lihat Detail</span>
                </button>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}

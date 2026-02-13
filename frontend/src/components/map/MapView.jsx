import { MapContainer, TileLayer, CircleMarker, Popup, Marker, GeoJSON } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import FlyToLocation from './FlyToLocation'
import { getColor } from '../../utils/getColor'
import '../../lib/leafletIconFix'

export default function MapView({ 
    filteredData = [], 
    focusLocation, 
    userLocation, 
    tile,                
    onOpenDetail,        
    selectedProvFeature  
}) {
  return (
    <MapContainer 
        center={[0.5386586, 116.419389]} 
        zoom={6} 
        className="h-full w-full bg-slate-800" 
        zoomControl={false}
    >
        {/* Layer Peta Dasar (Ambil dari props) */}
        <TileLayer attribution={tile?.attr} url={tile?.url} />
        
        {/* Efek Terbang ke Lokasi */}
        <FlyToLocation target={focusLocation} />

        {/* Fitur Garis Batas Wilayah*/}
        {selectedProvFeature && (
            <GeoJSON 
                key={selectedProvFeature.properties.Propinsi} 
                data={selectedProvFeature}
                style={{
                    color: "#0ea5e9", 
                    weight: 2,
                    fillColor: "#0ea5e9",
                    fillOpacity: 0.1
                }}
            />
        )}

        {/* Marker Lokasi Saya (GPS) */}
        {userLocation && (
            <Marker position={[userLocation.latitude, userLocation.longitude]}>
                <Popup>Lokasi Saya</Popup>
            </Marker>
        )}

        {/* Loop Data Pembangkit */}
        {filteredData.map((item, idx) => (
            <CircleMarker 
                key={idx} 
                center={[item.latitude, item.longitude]}
                pathOptions={{ 
                    color: getColor(item.jenis), 
                    fillColor: getColor(item.jenis), 
                    fillOpacity: 0.8, 
                    weight: 1, 
                    radius: 8 
                }}
                eventHandlers={{
                    click: () => {
                        // Perbaiki pemanggilan event handler
                        if (onOpenDetail) onOpenDetail(item);
                    }
                }}
            >
                <Popup>
                    <div className="min-w-[150px] font-sans text-slate-800">
                        <h3 className="font-bold text-sm border-b pb-1 mb-2">{item.nama}</h3>
                        <p className="text-xs mb-1">Jenis: <b>{item.jenis}</b></p>
                        <p className="text-xs mb-3">Region: {item.region}</p>
                        <button 
                            // Perbaiki onClick di sini juga
                            onClick={() => onOpenDetail && onOpenDetail(item)}
                            className="w-full bg-emerald-600 text-white text-xs py-1 rounded hover:bg-emerald-700 transition"
                        >
                            Lihat Detail
                        </button>
                    </div>
                </Popup>
            </CircleMarker>
        ))}
    </MapContainer>
  )
}
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
        <TileLayer attribution={tile?.attr} url={tile?.url} />
        <FlyToLocation target={focusLocation} />

        {/* Layer Batas Wilayah */}
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

        {/* Marker Lokasi Saya */}
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
            >
                <Popup>
                    <div className="min-w-[160px] font-sans text-slate-800 p-1">
                        <h3 className="font-bold text-sm border-b border-slate-200 pb-2 mb-2 text-slate-900 leading-tight">
                            {item.nama}
                        </h3>
                        <div className="text-xs space-y-1 text-slate-600 mb-3">
                            <p>Jenis: <span className="font-semibold text-slate-800">{item.jenis}</span></p>
                            <p>Region: <span className="font-semibold text-slate-800">{item.region}</span></p>
                        </div>
                        
                        {/* Tombol bertugas membuka Modal */}
                        <button 
                            onClick={() => onOpenDetail && onOpenDetail(item)}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-1.5 px-3 rounded shadow-sm transition-all duration-200 active:scale-95 flex items-center justify-center gap-1"
                        >
                            <span>Lihat Detail</span>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                                <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </Popup>
            </CircleMarker>
        ))}
    </MapContainer>
  )
}
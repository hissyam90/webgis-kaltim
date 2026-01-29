import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import axios from 'axios'
import L from 'leaflet'

// --- FIX ICON MARKER YANG HILANG ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
// -----------------------------------

function App() {
  const [pembangkit, setPembangkit] = useState([])

  // Ambil data saat web dibuka
  useEffect(() => {
    // Pastikan URL ini sama dengan Backend kamu
    axios.get('http://127.0.0.1:8000/api/pembangkit')
      .then(res => {
        setPembangkit(res.data.data) 
      })
      .catch(err => console.error("Gagal ambil data:", err))
  }, [])

  return (
    <div className="flex h-screen w-screen bg-gray-900">
      
      {/* SIDEBAR KIRI */}
      <div className="w-1/4 h-full bg-slate-900 text-white p-5 shadow-2xl z-[1000] overflow-y-auto border-r border-slate-700">
        <h1 className="text-2xl font-bold text-emerald-400 mb-1">WebGIS Kaltim</h1>
        <p className="text-xs text-slate-400 mb-6">Peta Persebaran Pembangkit Listrik</p>

        {/* Kotak Statistik */}
        <div className="bg-slate-800 p-4 rounded-lg border border-slate-700 mb-4">
          <p className="text-xs text-slate-400 uppercase tracking-wider">Total Unit</p>
          <p className="text-3xl font-bold text-white mt-1">{pembangkit.length}</p>
        </div>

        {/* List Data (Opsional) */}
        <div className="space-y-2">
            <p className="text-xs font-semibold text-slate-500 uppercase">Data Terbaru:</p>
            {pembangkit.slice(0, 5).map((item, idx) => (
                <div key={idx} className="bg-slate-800/50 p-2 rounded text-sm border-l-2 border-emerald-500">
                    <div className="font-bold">{item.nama}</div>
                    <div className="text-xs text-slate-400">{item.jenis} - {item.region}</div>
                </div>
            ))}
        </div>
      </div>

      {/* AREA PETA */}
      <div className="w-3/4 h-full relative z-0">
        <MapContainer 
            center={[0.5386586, 116.419389]} // Tengah Kaltim
            zoom={6} 
            className="h-full w-full"
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render Marker dari Database */}
            {pembangkit.map((item, idx) => (
                <Marker 
                    key={idx} 
                    position={[item.latitude, item.longitude]}
                >
                    <Popup>
                        <div className="min-w-[150px]">
                            <b className="text-sm block mb-1 uppercase text-slate-800">{item.nama}</b>
                            <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full">
                                {item.jenis}
                            </span>
                            <div className="mt-2 text-xs text-slate-600 space-y-1">
                                <p>📅 Operasi: <b>{item.tahun_operasi || "-"}</b></p>
                                <p>📍 Region: {item.region}</p>
                            </div>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  )
}

export default App
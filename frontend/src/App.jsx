import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'

// --- 1. KOMPONEN FLY-TO (Agar peta bergerak halus) ---
function FlyToLocation({ target }) {
  const map = useMap()
  useEffect(() => {
    if (target) {
      map.flyTo([target.latitude, target.longitude], 12, {
        duration: 1.5 
      })
    }
  }, [target, map])
  return null
}

function App() {
  const [pembangkit, setPembangkit] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedKategori, setSelectedKategori] = useState("Semua")
  const [focusLocation, setFocusLocation] = useState(null)

  // Ambil data dari Backend
  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/pembangkit')
      .then(res => {
        setPembangkit(res.data.data)
        setLoading(false) // State loading diubah jadi false
      })
      .catch(err => {
        console.error("Gagal ambil data:", err)
        setLoading(false)
      })
  }, [])

  // --- 2. LOGIKA FILTER (PERBAIKAN UTAMA) ---
  // Kita pakai useMemo agar tidak perlu simpan di state (menghindari error cascading render)
  const filteredData = useMemo(() => {
    if (selectedKategori === "Semua") return pembangkit
    return pembangkit.filter(item => item.jenis === selectedKategori)
  }, [selectedKategori, pembangkit])

  // Ambil list unik untuk dropdown
  const listKategori = ["Semua", ...new Set(pembangkit.map(item => item.jenis))]

  // --- 3. LOGIKA WARNA ---
  const getColor = (jenis) => {
    if (!jenis) return "#3388ff"
    const j = jenis.toLowerCase()
    if (j.includes("plts")) return "#facc15" // Kuning
    if (j.includes("pltd")) return "#ef4444" // Merah
    if (j.includes("pltu")) return "#374151" // Abu Gelap
    if (j.includes("pltmh") || j.includes("pltair")) return "#3b82f6" // Biru
    if (j.includes("pltb")) return "#10b981" // Hijau
    return "#8b5cf6" // Ungu
  }

  // --- TAMPILAN LOADING (Agar variabel loading terpakai) ---
  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p>Memuat Data Peta...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen bg-gray-900 font-sans">
      
      {/* SIDEBAR */}
      <div className="w-1/3 md:w-1/4 h-full bg-slate-900 text-white flex flex-col shadow-2xl z-[1000] border-r border-slate-700">
        
        {/* Header Sidebar */}
        <div className="p-5 border-b border-slate-800">
          <h1 className="text-2xl font-bold text-emerald-400">WebGIS Kaltim</h1>
          <p className="text-xs text-slate-400">Peta Sebaran Pembangkit Listrik</p>
          
          {/* Dropdown Filter */}
          <div className="mt-4">
            <label className="text-xs text-slate-500 mb-1 block">Filter Jenis:</label>
            <select 
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded p-2 focus:outline-none focus:border-emerald-500"
            >
              {listKategori.map((kat, idx) => (
                <option key={idx} value={kat}>{kat}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-between items-center mt-4 text-xs text-slate-400">
            <span>Total Data:</span>
            <span className="font-bold text-white">{filteredData.length} Unit</span>
          </div>
        </div>

        {/* List Data */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredData.map((item, idx) => (
                <div 
                  key={idx} 
                  onClick={() => setFocusLocation(item)} 
                  className="bg-slate-800/50 p-3 rounded cursor-pointer hover:bg-slate-700 hover:border-l-4 hover:border-emerald-500 transition-all border border-transparent"
                >
                    <div className="font-bold text-sm text-slate-200">{item.nama}</div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded text-black font-semibold" 
                            style={{backgroundColor: getColor(item.jenis)}}>
                        {item.jenis}
                      </span>
                      <span className="text-xs text-slate-500">{item.region}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* PETA */}
      <div className="flex-1 h-full relative z-0">
        <MapContainer 
            center={[0.5386586, 116.419389]} 
            zoom={6} 
            className="h-full w-full bg-slate-800"
        >
            <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <FlyToLocation target={focusLocation} />

            {filteredData.map((item, idx) => (
                <CircleMarker 
                    key={idx} 
                    center={[item.latitude, item.longitude]}
                    pathOptions={{ 
                      color: getColor(item.jenis), 
                      fillColor: getColor(item.jenis), 
                      fillOpacity: 0.7,
                      weight: 1, 
                      radius: 6 
                    }}
                >
                    <Popup>
                        <div className="min-w-[150px]">
                            <b className="text-sm block mb-1 uppercase text-slate-800">{item.nama}</b>
                            <div className="w-full h-[2px] mb-2" style={{backgroundColor: getColor(item.jenis)}}></div>
                            <div className="text-xs text-slate-600 space-y-1">
                                <p>⚡ Jenis: <b>{item.jenis}</b></p>
                                <p>📅 Operasi: {item.tahun_operasi || "-"}</p>
                                <p>📍 Region: {item.region}</p>
                            </div>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
        
        {/* LEGENDA */}
        <div className="absolute bottom-5 right-5 bg-white p-3 rounded shadow-lg z-[1000] text-xs">
          <h4 className="font-bold mb-2 text-slate-800">Legenda</h4>
          <div className="space-y-1">
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span> PLTS (Surya)</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> PLTD (Diesel)</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-gray-700 mr-2"></span> PLTU (Uap)</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span> PLT Air/MH</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></span> EBT Lainnya</div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default App
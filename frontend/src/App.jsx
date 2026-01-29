import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'

// Komponen Fly-To
function FlyToLocation({ target }) {
  const map = useMap()
  useEffect(() => {
    if (target) {
      map.flyTo([target.latitude, target.longitude], 13, {
        duration: 2 // Sedikit diperlambat biar smooth
      })
    }
  }, [target, map])
  return null
}

function App() {
  const [pembangkit, setPembangkit] = useState([])
  const [loading, setLoading] = useState(true)
  
  // State untuk Filter & Search
  const [selectedKategori, setSelectedKategori] = useState("Semua")
  const [searchText, setSearchText] = useState("") // <--- STATE BARU UNTUK SEARCH
  const [focusLocation, setFocusLocation] = useState(null)

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/pembangkit')
      .then(res => {
        setPembangkit(res.data.data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Gagal ambil data:", err)
        setLoading(false)
      })
  }, [])

  // --- LOGIKA FILTER GABUNGAN (SEARCH + DROPDOWN) ---
  const filteredData = useMemo(() => {
    return pembangkit.filter(item => {
      // 1. Cek Kategori
      const matchKategori = selectedKategori === "Semua" || item.jenis === selectedKategori
      
      // 2. Cek Text Search (Nama atau Region)
      const query = searchText.toLowerCase()
      const matchSearch = item.nama.toLowerCase().includes(query) || 
                          item.region.toLowerCase().includes(query)

      // Hanya lolos jika KEDUANYA benar
      return matchKategori && matchSearch
    })
  }, [selectedKategori, searchText, pembangkit])

  const listKategori = ["Semua", ...new Set(pembangkit.map(item => item.jenis))]

  const getColor = (jenis) => {
    if (!jenis) return "#3388ff"
    const j = jenis.toLowerCase()
    if (j.includes("plts")) return "#facc15" 
    if (j.includes("pltd")) return "#ef4444" 
    if (j.includes("pltu")) return "#374151" 
    if (j.includes("pltmh") || j.includes("pltair")) return "#3b82f6" 
    if (j.includes("pltb")) return "#10b981" 
    return "#8b5cf6" 
  }

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p>Sedang memuat data geospasial...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-screen bg-gray-900 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-1/3 md:w-1/4 h-full bg-slate-900 text-white flex flex-col shadow-2xl z-[1000] border-r border-slate-700">
        
        {/* Header & Controls */}
        <div className="p-5 border-b border-slate-800 bg-slate-900">
          <h1 className="text-2xl font-bold text-emerald-400">WebGIS Kaltim</h1>
          <p className="text-xs text-slate-400 mb-4">Peta Sebaran Energi Baru Terbarukan</p>
          
          <div className="space-y-3">
            {/* 1. INPUT PENCARIAN BARU */}
            <div>
              <label className="text-xs text-slate-500 block mb-1">Cari Lokasi/Nama:</label>
              <input 
                type="text"
                placeholder="Ketik nama pembangkit..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded p-2 focus:outline-none focus:border-emerald-500 placeholder-slate-500"
              />
            </div>

            {/* 2. DROPDOWN FILTER */}
            <div>
              <label className="text-xs text-slate-500 block mb-1">Filter Jenis Pembangkit:</label>
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
          </div>

          <div className="flex justify-between items-center mt-4 text-xs text-slate-400 border-t border-slate-800 pt-3">
            <span>Ditemukan:</span>
            <span className="font-bold text-white bg-emerald-600 px-2 rounded-full">{filteredData.length} Unit</span>
          </div>
        </div>

        {/* List Data */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-700">
            {filteredData.length === 0 ? (
              <div className="text-center text-slate-500 text-sm mt-10">
                Tidak ada data yang cocok.
              </div>
            ) : (
              filteredData.map((item, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => setFocusLocation(item)} 
                    className="bg-slate-800/40 p-3 rounded cursor-pointer hover:bg-slate-700 hover:border-l-4 hover:border-emerald-500 transition-all border border-transparent group"
                  >
                      <div className="font-bold text-sm text-slate-300 group-hover:text-white">{item.nama}</div>
                      <div className="flex justify-between mt-2 items-center">
                        <span className="text-[10px] px-2 py-0.5 rounded text-black font-bold uppercase tracking-wide" 
                              style={{backgroundColor: getColor(item.jenis), opacity: 0.9}}>
                          {item.jenis}
                        </span>
                        <span className="text-xs text-slate-500">{item.region}</span>
                      </div>
                  </div>
              ))
            )}
        </div>
      </div>

      {/* PETA */}
      <div className="flex-1 h-full relative z-0">
        <MapContainer 
            center={[0.5386586, 116.419389]} 
            zoom={6} 
            className="h-full w-full bg-slate-800"
            zoomControl={false} // Kita pindah zoom control biar rapi nanti
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
                      fillOpacity: 0.8,
                      weight: 1, 
                      radius: 6 
                    }}
                >
                    <Popup>
                        <div className="min-w-[180px] font-sans">
                            <h3 className="font-bold text-sm mb-2 text-slate-900 border-b pb-1">{item.nama}</h3>
                            <div className="space-y-1 text-xs text-slate-600">
                                <div className="flex justify-between">
                                  <span>Jenis:</span>
                                  <span className="font-bold" style={{color: getColor(item.jenis)}}>{item.jenis}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Tahun Ops:</span>
                                  <span className="font-mono text-slate-800">{item.tahun_operasi || "N/A"}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Wilayah:</span>
                                  <span>{item.region}</span>
                                </div>
                            </div>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
        
        {/* Legend */}
        <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-xl z-[1000] text-xs border border-slate-200">
          <h4 className="font-bold mb-3 text-slate-800 uppercase tracking-wider text-[10px]">Legenda Peta</h4>
          <div className="space-y-2">
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-400 mr-2 shadow-sm"></span> PLTS (Surya)</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2 shadow-sm"></span> PLTD (Diesel)</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-gray-700 mr-2 shadow-sm"></span> PLTU (Uap)</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-2 shadow-sm"></span> PLT Air/MH</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-emerald-500 mr-2 shadow-sm"></span> EBT Lainnya</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
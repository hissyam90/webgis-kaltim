import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Marker } from 'react-leaflet'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Icon Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- KOMPONEN FLY-TO ---
function FlyToLocation({ target }) {
  const map = useMap()
  useEffect(() => {
    if (target) {
      map.flyTo([target.latitude, target.longitude], 14, { duration: 1.5 })
    }
  }, [target, map])
  return null
}

function App() {
  const [pembangkit, setPembangkit] = useState([])
  const [loading, setLoading] = useState(true)
  
  // State Utama
  const [selectedKategori, setSelectedKategori] = useState("Semua")
  const [searchText, setSearchText] = useState("")
  const [focusLocation, setFocusLocation] = useState(null)
  const [basemap, setBasemap] = useState("dark")
  const [userLocation, setUserLocation] = useState(null)

  // --- STATE BARU UNTUK MODAL DETAIL ---
  const [selectedDetail, setSelectedDetail] = useState(null) 

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

  const filteredData = useMemo(() => {
    return pembangkit.filter(item => {
      const matchKategori = selectedKategori === "Semua" || item.jenis === selectedKategori
      const query = searchText.toLowerCase()
      const matchSearch = item.nama.toLowerCase().includes(query) || 
                          item.region.toLowerCase().includes(query)
      return matchKategori && matchSearch
    })
  }, [selectedKategori, searchText, pembangkit])

  const listKategori = ["Semua", ...new Set(pembangkit.map(item => item.jenis))]

  const getColor = (jenis) => {
    if (!jenis) return "#3388ff"
    const j = jenis.toLowerCase()
    if (j.includes("plts")) return "#facc15" 
    if (j.includes("pltd")) return "#ef4444" 
    if (j.includes("pltu")) return "#9ca3af" 
    if (j.includes("pltmh") || j.includes("pltair")) return "#3b82f6" 
    if (j.includes("pltb")) return "#10b981" 
    return "#d946ef" 
  }

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        const myLoc = { latitude, longitude }
        setUserLocation(myLoc)
        setFocusLocation(myLoc)
      }, (error) => alert("Gagal mendeteksi lokasi: " + error.message))
    } else {
      alert("Browser tidak support GPS")
    }
  }

  const getTileLayer = () => {
    switch(basemap) {
      case "satellite": return { url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", attr: "Tiles &copy; Esri" }
      case "osm": return { url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", attr: "&copy; OpenStreetMap" }
      case "dark": default: return { url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", attr: "&copy; CartoDB Dark Matter" }
    }
  }

  // --- FUNGSI BUKA GOOGLE MAPS ---
  const openGoogleMaps = (lat, lon) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`, '_blank');
  }

  if (loading) return <div className="bg-gray-900 h-screen flex items-center justify-center text-white">Loading...</div>

  return (
    <div className="flex h-screen w-screen bg-gray-900 font-sans overflow-hidden relative">
      
      {/* SIDEBAR */}
      <div className="w-1/3 md:w-1/4 h-full bg-slate-900 text-white flex flex-col shadow-2xl z-[1000] border-r border-slate-700">
        <div className="p-5 border-b border-slate-800 bg-slate-900">
          <h1 className="text-2xl font-bold text-emerald-400">WebGIS Kaltim</h1>
          <p className="text-xs text-slate-400 mb-5">Peta Sebaran Energi Baru Terbarukan</p>
          
          <div className="space-y-4">
            <input 
              type="text" placeholder="Cari lokasi..." value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded p-2 focus:border-emerald-500"
            />
            <select 
              value={selectedKategori} onChange={(e) => setSelectedKategori(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded p-2"
            >
              {listKategori.map((kat, idx) => <option key={idx} value={kat}>{kat}</option>)}
            </select>
          </div>
          <div className="mt-4 text-xs text-slate-400">Total: <span className="text-emerald-400 font-bold">{filteredData.length}</span></div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-700">
            {filteredData.map((item, idx) => (
                <div key={idx} onClick={() => setFocusLocation(item)} 
                  className="bg-slate-800/40 p-3 rounded cursor-pointer hover:bg-slate-700 hover:border-l-4 hover:border-emerald-500 transition-all border border-transparent">
                    <div className="font-bold text-sm text-slate-300">{item.nama}</div>
                    <div className="flex justify-between mt-2 items-center">
                      <span className="text-[10px] px-2 py-0.5 rounded text-black font-bold" style={{backgroundColor: getColor(item.jenis)}}>{item.jenis}</span>
                      <span className="text-xs text-slate-500">{item.region}</span>
                    </div>
                </div>
            ))}
        </div>
      </div>

      {/* PETA */}
      <div className="flex-1 h-full relative z-0">
        <MapContainer center={[0.5386586, 116.419389]} zoom={6} className="h-full w-full bg-slate-800" zoomControl={false}>
            <TileLayer attribution={getTileLayer().attr} url={getTileLayer().url} />
            <FlyToLocation target={focusLocation} />
            {userLocation && <Marker position={[userLocation.latitude, userLocation.longitude]}><Popup>Lokasi Saya</Popup></Marker>}

            {filteredData.map((item, idx) => (
                <CircleMarker 
                    key={idx} center={[item.latitude, item.longitude]}
                    pathOptions={{ color: getColor(item.jenis), fillColor: getColor(item.jenis), fillOpacity: 0.8, weight: 1, radius: 6 }}
                >
                    <Popup>
                        <div className="min-w-[150px] font-sans text-slate-800">
                            <h3 className="font-bold text-sm border-b pb-1 mb-2">{item.nama}</h3>
                            <p className="text-xs mb-1">Jenis: <b>{item.jenis}</b></p>
                            <p className="text-xs mb-3">Region: {item.region}</p>
                            <button 
                                onClick={() => setSelectedDetail(item)}
                                className="w-full bg-emerald-600 text-white text-xs py-1 rounded hover:bg-emerald-700 transition"
                            >
                                Lihat Detail Lengkap
                            </button>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
        
        {/* Kontrol Kanan Atas */}
        <div className="absolute top-5 right-5 z-[1000] flex flex-col gap-2">
          <div className="bg-white rounded shadow-lg p-1 flex flex-col gap-1">
             <button onClick={() => setBasemap('dark')} className={`p-2 rounded hover:bg-gray-100 ${basemap==='dark' ? 'bg-slate-200':''}`} title="Dark">🌑</button>
             <button onClick={() => setBasemap('osm')} className={`p-2 rounded hover:bg-gray-100 ${basemap==='osm' ? 'bg-slate-200':''}`} title="Light">🗺️</button>
             <button onClick={() => setBasemap('satellite')} className={`p-2 rounded hover:bg-gray-100 ${basemap==='satellite' ? 'bg-slate-200':''}`} title="Satellite">🛰️</button>
          </div>
          <button onClick={handleLocateMe} className="bg-white p-3 rounded shadow-lg hover:bg-emerald-50 text-emerald-600 font-bold" title="Lokasi Saya">📍</button>
        </div>

        {/* Legenda */}
        <div className="absolute bottom-6 right-6 bg-slate-900/90 backdrop-blur p-4 rounded-lg shadow-xl z-[1000] text-xs border border-slate-700 text-slate-300">
          <h4 className="font-bold mb-3 text-white uppercase">Legenda</h4>
          <div className="space-y-2">
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></span> PLTS</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-2"></span> PLTD</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-gray-400 mr-2"></span> PLTU</div>
            <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-blue-500 mr-2"></span> PLT Air</div>
          </div>
        </div>
      </div>

      {/* --- MODAL DETAIL POPUP (YANG BARU) --- */}
      {selectedDetail && (
        <div className="absolute inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
                
                {/* Header Modal */}
                <div className="bg-emerald-600 p-4 flex justify-between items-center">
                    <h2 className="text-white font-bold text-lg truncate pr-4">{selectedDetail.nama}</h2>
                    <button onClick={() => setSelectedDetail(null)} className="text-white hover:text-emerald-200 text-xl font-bold">&times;</button>
                </div>

                {/* Isi Modal */}
                <div className="p-6">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4 shadow-lg" 
                             style={{backgroundColor: getColor(selectedDetail.jenis)}}>
                            ⚡
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Jenis Pembangkit</p>
                            <p className="font-bold text-gray-800 text-lg">{selectedDetail.jenis}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50 p-3 rounded border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase">Tahun Operasi</p>
                            <p className="font-semibold text-gray-800">{selectedDetail.tahun_operasi || "-"}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded border border-gray-100">
                            <p className="text-xs text-gray-500 uppercase">Wilayah</p>
                            <p className="font-semibold text-gray-800">{selectedDetail.region}</p>
                        </div>
                         <div className="bg-gray-50 p-3 rounded border border-gray-100 col-span-2">
                            <p className="text-xs text-gray-500 uppercase">Koordinat</p>
                            <p className="font-mono text-xs text-gray-600 mt-1">
                                {selectedDetail.latitude}, {selectedDetail.longitude}
                            </p>
                        </div>
                    </div>

                    {/* Tombol Aksi */}
                    <button 
                        onClick={() => openGoogleMaps(selectedDetail.latitude, selectedDetail.longitude)}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                        🗺️ Rute via Google Maps
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  )
}

export default App
import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, Marker } from 'react-leaflet'
import axios from 'axios'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Icon Default Leaflet
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
      map.flyTo([target.latitude, target.longitude], 14, { duration: 2 })
    }
  }, [target, map])
  return null
}

function App() {
  const [pembangkit, setPembangkit] = useState([])
  const [loading, setLoading] = useState(true)
  
  // State UI
  const [selectedKategori, setSelectedKategori] = useState("Semua")
  const [searchText, setSearchText] = useState("")
  const [focusLocation, setFocusLocation] = useState(null)
  
  // State Baru: Basemap & GPS
  const [basemap, setBasemap] = useState("dark") // default: dark, osm, satellite
  const [userLocation, setUserLocation] = useState(null)

  // Ambil data backend
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

  // Logika Filter
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
    if (j.includes("pltu")) return "#9ca3af" // Abu terang biar keliatan di map gelap
    if (j.includes("pltmh") || j.includes("pltair")) return "#3b82f6" 
    if (j.includes("pltb")) return "#10b981" 
    return "#d946ef" 
  }

  // --- FITUR BARU: Handle GPS ---
  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords
        const myLoc = { latitude, longitude }
        setUserLocation(myLoc)
        setFocusLocation(myLoc) // Terbang ke lokasi user
      }, (error) => {
        alert("Gagal mendeteksi lokasi: " + error.message)
      })
    } else {
      alert("Browser tidak support GPS")
    }
  }

  // --- PILIHAN BASEMAP ---
  const getTileLayer = () => {
    switch(basemap) {
      case "satellite":
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attr: "Tiles &copy; Esri"
        }
      case "osm":
        return {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attr: "&copy; OpenStreetMap"
        }
      case "dark":
      default:
        return {
          url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          attr: "&copy; CartoDB Dark Matter"
        }
    }
  }

  if (loading) return <div className="bg-gray-900 h-screen flex items-center justify-center text-white">Loading...</div>

  return (
    <div className="flex h-screen w-screen bg-gray-900 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <div className="w-1/3 md:w-1/4 h-full bg-slate-900 text-white flex flex-col shadow-2xl z-[1000] border-r border-slate-700">
        <div className="p-5 border-b border-slate-800 bg-slate-900">
          <h1 className="text-2xl font-bold text-emerald-400">WebGIS Kaltim</h1>
          <p className="text-xs text-slate-400 mb-5">Peta Sebaran Energi Baru Terbarukan</p>
          
          <div className="space-y-4">
            <input 
              type="text"
              placeholder="Cari lokasi..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded p-2 focus:border-emerald-500"
            />
            <select 
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded p-2"
            >
              {listKategori.map((kat, idx) => <option key={idx} value={kat}>{kat}</option>)}
            </select>
          </div>
          
          <div className="mt-4 text-xs text-slate-400">
            Total Data: <span className="text-emerald-400 font-bold">{filteredData.length}</span>
          </div>
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
        <MapContainer 
            center={[0.5386586, 116.419389]} zoom={6} 
            className="h-full w-full bg-slate-800" zoomControl={false}
        >
            {/* Dynamic Tile Layer */}
            <TileLayer attribution={getTileLayer().attr} url={getTileLayer().url} />
            
            <FlyToLocation target={focusLocation} />

            {/* Marker Lokasi User (Jika ada) */}
            {userLocation && (
              <Marker position={[userLocation.latitude, userLocation.longitude]}>
                 <Popup>Lokasi Saya</Popup>
              </Marker>
            )}

            {filteredData.map((item, idx) => (
                <CircleMarker 
                    key={idx} center={[item.latitude, item.longitude]}
                    pathOptions={{ color: getColor(item.jenis), fillColor: getColor(item.jenis), fillOpacity: 0.8, weight: 1, radius: 6 }}
                >
                    <Popup>
                        <div className="min-w-[150px] font-sans text-slate-800">
                            <h3 className="font-bold text-sm border-b pb-1">{item.nama}</h3>
                            <p className="text-xs mt-2">Jenis: {item.jenis}</p>
                            <p className="text-xs">Region: {item.region}</p>
                        </div>
                    </Popup>
                </CircleMarker>
            ))}
        </MapContainer>
        
        {/* --- KONTROL PETA (FLOATING UI) --- */}
        <div className="absolute top-5 right-5 z-[1000] flex flex-col gap-2">
          {/* Tombol Basemap */}
          <div className="bg-white rounded shadow-lg p-1 flex flex-col gap-1">
             <button onClick={() => setBasemap('dark')} title="Mode Gelap"
                className={`p-2 rounded hover:bg-gray-100 ${basemap==='dark' ? 'bg-slate-200':''}`}>
                🌑
             </button>
             <button onClick={() => setBasemap('osm')} title="Mode Terang"
                className={`p-2 rounded hover:bg-gray-100 ${basemap==='osm' ? 'bg-slate-200':''}`}>
                🗺️
             </button>
             <button onClick={() => setBasemap('satellite')} title="Mode Satelit"
                className={`p-2 rounded hover:bg-gray-100 ${basemap==='satellite' ? 'bg-slate-200':''}`}>
                🛰️
             </button>
          </div>

          {/* Tombol GPS */}
          <button onClick={handleLocateMe} title="Lokasi Saya"
             className="bg-white p-3 rounded shadow-lg hover:bg-emerald-50 text-emerald-600 font-bold">
             📍
          </button>
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
    </div>
  )
}

export default App
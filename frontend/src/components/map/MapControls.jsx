export default function MapControls({ basemap, setBasemap, onLocateMe }) {
  return (
    <div className="absolute top-5 right-5 z-[1000] flex flex-col gap-2">
      <div className="bg-white rounded shadow-lg p-1 flex flex-col gap-1">
        <button
          onClick={() => setBasemap("dark")}
          className={`p-2 rounded hover:bg-gray-100 ${basemap === "dark" ? "bg-slate-200" : ""}`}
          title="Dark"
        >
          🌑
        </button>
        <button
          onClick={() => setBasemap("osm")}
          className={`p-2 rounded hover:bg-gray-100 ${basemap === "osm" ? "bg-slate-200" : ""}`}
          title="Light"
        >
          🗺️
        </button>
        <button
          onClick={() => setBasemap("satellite")}
          className={`p-2 rounded hover:bg-gray-100 ${basemap === "satellite" ? "bg-slate-200" : ""}`}
          title="Satellite"
        >
          🛰️
        </button>
      </div>

      <button
        onClick={onLocateMe}
        className="bg-white p-3 rounded shadow-lg hover:bg-emerald-50 text-emerald-600 font-bold"
        title="Lokasi Saya"
      >
        📍
      </button>
    </div>
  );
}

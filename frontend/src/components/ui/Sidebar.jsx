import { getColor } from "../../utils/getColor";

export default function Sidebar({
  KALIMANTAN_PROV_BBOX,
  selectedProv,
  onSelectProv,
  selectedKategori,
  setSelectedKategori,
  listKategori,
  searchText,
  setSearchText,
  filteredData,
  onFocus,
  onShowStats,
  onExport,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  return (
    <div
      className={`${
        isSidebarOpen ? "w-1/3 md:w-1/4" : "w-0"
      } h-full bg-slate-900 text-white flex flex-col shadow-2xl z-[1000] border-r border-slate-700 transition-all duration-300 ease-in-out relative`}
    >
      <div className={`flex flex-col h-full ${!isSidebarOpen && "hidden"}`}>
        <div className="p-5 border-b border-slate-800 bg-slate-900">
          <h1 className="text-2xl font-bold text-emerald-400">WebGIS</h1>
          <p className="text-xs text-slate-400 mb-5">Peta Sebaran Energi Kalimantan</p>

          <div className="mb-4">
            <p className="text-[10px] text-slate-400 mb-2 font-bold uppercase tracking-wider">Filter Provinsi (BBox)</p>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(KALIMANTAN_PROV_BBOX).map((prov) => (
                <button
                  key={prov}
                  onClick={() => onSelectProv(prov)}
                  className={`text-[10px] font-bold py-2 rounded border transition-all duration-200 active:scale-95 ${
                    selectedProv === prov
                      ? "bg-emerald-600 text-white border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]"
                      : "bg-slate-700 hover:bg-slate-600 text-slate-300 border-slate-600"
                  }`}
                >
                  {prov}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <input
              type="text"
              placeholder="Cari lokasi..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded p-2 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />

            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded p-2 outline-none focus:border-emerald-500 transition-all"
            >
              {listKategori.map((kat, idx) => (
                <option key={idx} value={kat}>
                  {kat}
                </option>
              ))}
            </select>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onShowStats}
                className="bg-slate-700 hover:bg-slate-600 text-emerald-400 text-[10px] font-bold py-2 rounded border border-slate-600 flex items-center justify-center gap-1 transition-all active:scale-95"
              >
                📊 Grafik
              </button>
              <button
                onClick={onExport}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-2 rounded border border-emerald-500 flex items-center justify-center gap-1 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
                title="Download CSV"
              >
                ⬇️ Export
              </button>
            </div>
          </div>

          <div className="mt-4 text-[10px] text-slate-500 uppercase font-bold tracking-tight">
            Menampilkan: <span className="text-emerald-400">{filteredData.length} Pembangkit</span>
          </div>
        </div>

        {/* List Section dengan Animasi */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {filteredData.length > 0 ? (
            filteredData.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onFocus(item)}
                className="bg-slate-800/40 p-3 rounded-lg cursor-pointer hover:bg-slate-700/60 hover:border-l-4 hover:border-emerald-500 transition-all duration-200 border border-slate-800 group animate-slideIn"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="font-bold text-sm text-slate-300 group-hover:text-white transition-colors">{item.nama}</div>
                <div className="flex justify-between mt-2 items-center">
                  <span
                    className="text-[9px] px-2 py-0.5 rounded text-black font-extrabold uppercase"
                    style={{ backgroundColor: getColor(item.jenis) }}
                  >
                    {item.jenis}
                  </span>
                  <span className="text-[10px] text-slate-500 group-hover:text-slate-400">{item.region}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500 py-10">
               <span className="text-4xl mb-2">🔍</span>
               <p className="text-xs italic">Data tidak ditemukan</p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-slate-800 text-emerald-400 w-6 h-12 rounded-r-lg flex items-center justify-center border-y border-r border-slate-600 shadow-xl cursor-pointer hover:bg-slate-700 z-[1500] transition-colors"
        title={isSidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
      >
        <span className={`transition-transform duration-300 ${isSidebarOpen ? "" : "rotate-180"}`}>◀</span>
      </button>
    </div>
  );
}
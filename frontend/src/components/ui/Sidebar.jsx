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
        {/* Header Section */}
        <div className="p-5 border-b border-slate-800 bg-slate-900">
          <h1 className="text-2xl font-bold text-emerald-400 tracking-tight">WebGIS</h1>
          <p className="text-xs text-slate-400 mb-5">Peta Sebaran Energi Kalimantan</p>

          {/* Filter Provinsi Section */}
          <div className="mb-4">
            <p className="text-[10px] text-slate-500 mb-2 font-bold uppercase tracking-widest">
              Filter Wilayah
            </p>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(KALIMANTAN_PROV_BBOX).map((prov) => (
                <button
                  key={prov}
                  onClick={() => onSelectProv(prov)}
                  className={`text-[10px] font-bold py-2 rounded border transition-all duration-200 active:scale-95 ${
                    selectedProv === prov
                      ? "bg-emerald-600 text-white border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700"
                  }`}
                >
                  {/* Menampilkan label Kaltara secara otomatis jika key-nya Kaltara */}
                  {prov}
                </button>
              ))}
            </div>
          </div>

          {/* Search & Category Section */}
          <div className="space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari lokasi pembangkit..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg p-2.5 pl-3 focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all placeholder:text-slate-600"
              />
            </div>

            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 text-white text-sm rounded-lg p-2.5 outline-none focus:border-emerald-500 transition-all cursor-pointer appearance-none"
            >
              {listKategori.map((kat, idx) => (
                <option key={idx} value={kat}>
                  {kat}
                </option>
              ))}
            </select>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onShowStats}
                className="bg-slate-800 hover:bg-slate-700 text-emerald-400 text-[10px] font-bold py-2.5 rounded-lg border border-slate-700 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                📊 Statistik
              </button>
              <button
                onClick={onExport}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-2.5 rounded-lg border border-emerald-500 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                ⬇️ Export CSV
              </button>
            </div>
          </div>

          <div className="mt-4 flex justify-between items-center">
             <span className="text-[10px] text-slate-500 uppercase font-bold">Status Data</span>
             <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20">
               {filteredData.length} Ditemukan
             </span>
          </div>
        </div>

        {/* List Section dengan Animasi Slide-In */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-hide hover:scrollbar-default">
          {filteredData.length > 0 ? (
            filteredData.map((item, idx) => (
              <div
                key={idx}
                onClick={() => onFocus(item)}
                className="group bg-slate-800/30 p-4 rounded-xl cursor-pointer hover:bg-slate-700/50 border border-slate-800/50 hover:border-emerald-500/50 transition-all duration-300 animate-slideIn"
                style={{ animationDelay: `${idx * 40}ms` }}
              >
                <div className="font-bold text-sm text-slate-300 group-hover:text-white transition-colors">
                  {item.nama}
                </div>
                <div className="flex justify-between mt-3 items-center">
                  <span
                    className="text-[9px] px-2.5 py-1 rounded-md text-black font-black uppercase tracking-tighter"
                    style={{ backgroundColor: getColor(item.jenis) }}
                  >
                    {item.jenis}
                  </span>
                  <div className="flex items-center gap-1 text-slate-500 group-hover:text-slate-400">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-[10px] font-medium">{item.region}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 py-20 animate-pulse">
               <div className="text-5xl mb-4 text-slate-700">🔍</div>
               <p className="text-xs font-medium italic">Data tidak ditemukan</p>
               <p className="text-[10px] mt-1 text-slate-700 text-center px-4">Coba ubah filter wilayah atau kata kunci pencarian</p>
            </div>
          )}
        </div>
      </div>

      {/* Toggle Button Container */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-slate-800 text-emerald-400 w-6 h-12 rounded-r-xl flex items-center justify-center border-y border-r border-slate-700 shadow-2xl cursor-pointer hover:bg-slate-700 hover:text-emerald-300 z-[1500] transition-all"
        title={isSidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
      >
        <span className={`text-[10px] transition-transform duration-500 ${isSidebarOpen ? "" : "rotate-180"}`}>
          ◀
        </span>
      </button>
    </div>
  );
}
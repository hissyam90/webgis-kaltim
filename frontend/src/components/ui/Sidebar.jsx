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
            <p className="text-[10px] text-slate-400 mb-2 font-bold uppercase">Filter Provinsi (BBox)</p>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(KALIMANTAN_PROV_BBOX).map((prov) => (
                <button
                  key={prov}
                  onClick={() => onSelectProv(prov)}
                  className={`text-[10px] font-bold py-2 rounded border transition ${
                    selectedProv === prov
                      ? "bg-emerald-600 text-white border-emerald-500"
                      : "bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
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
              className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded p-2 focus:border-emerald-500"
            />

            <select
              value={selectedKategori}
              onChange={(e) => setSelectedKategori(e.target.value)}
              className="w-full bg-slate-800 border border-slate-600 text-white text-sm rounded p-2"
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
                className="bg-slate-700 hover:bg-slate-600 text-emerald-400 text-[10px] font-bold py-2 rounded border border-slate-600 flex items-center justify-center gap-1 transition"
              >
                📊 Grafik
              </button>
              <button
                onClick={onExport}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold py-2 rounded border border-emerald-500 flex items-center justify-center gap-1 transition"
                title="Download CSV"
              >
                ⬇️ Export
              </button>
            </div>
          </div>

          <div className="mt-4 text-xs text-slate-400">
            Total Data: <span className="text-emerald-400 font-bold">{filteredData.length}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-thin scrollbar-thumb-slate-700">
          {filteredData.map((item, idx) => (
            <div
              key={idx}
              onClick={() => onFocus(item)}
              className="bg-slate-800/40 p-3 rounded cursor-pointer hover:bg-slate-700 hover:border-l-4 hover:border-emerald-500 transition-all border border-transparent"
            >
              <div className="font-bold text-sm text-slate-300">{item.nama}</div>
              <div className="flex justify-between mt-2 items-center">
                <span
                  className="text-[10px] px-2 py-0.5 rounded text-black font-bold"
                  style={{ backgroundColor: getColor(item.jenis) }}
                >
                  {item.jenis}
                </span>
                <span className="text-xs text-slate-500">{item.region}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-1/2 -right-6 transform -translate-y-1/2 bg-slate-800 text-emerald-400 w-6 h-12 rounded-r-lg flex items-center justify-center border-y border-r border-slate-600 shadow-xl cursor-pointer hover:bg-slate-700 z-[1500]"
        title={isSidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
      >
        {isSidebarOpen ? "◀" : "▶"}
      </button>
    </div>
  );
}

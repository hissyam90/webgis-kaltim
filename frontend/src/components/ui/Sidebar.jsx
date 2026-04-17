import { getColor } from "../../utils/getColor";
import { formatKategoriOption, getKategoriInfo } from "../../utils/kategoriLabel";

export default function Sidebar({
  dataMode,
  setDataMode,
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
      } relative z-[1000] flex h-full flex-col border-r border-slate-700 bg-slate-900 text-white shadow-[18px_0_40px_rgba(15,23,42,0.28)] transition-all duration-300 ease-in-out`}
    >
      <div className={`flex h-full flex-col ${!isSidebarOpen && "hidden"}`}>
        <div className="border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-900/95 p-5 shadow-[inset_0_-1px_0_rgba(51,65,85,0.35)]">
          <h1 className="text-2xl font-bold tracking-tight text-emerald-400">WebGIS</h1>
          <p className="mb-6 text-xs text-slate-400">Peta Sebaran Energi Kalimantan</p>

          <div className="mb-5 rounded-2xl border border-slate-800/80 bg-slate-800/35 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.14)]">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Filter Wilayah
            </p>
            <div className="grid grid-cols-3 gap-2">
              {Object.keys(KALIMANTAN_PROV_BBOX).map((prov) => (
                <button
                  key={prov}
                  onClick={() => onSelectProv(prov)}
                  className={`rounded border py-2 text-[10px] font-bold transition-all duration-200 active:scale-95 ${
                    selectedProv === prov
                      ? "border-emerald-500 bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                      : "border-slate-700 bg-slate-800 text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  {prov}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-5 rounded-2xl border border-slate-800/80 bg-slate-800/35 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.14)]">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Jenis Data
            </p>
            <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-700 bg-slate-800 p-1">
              <button
                onClick={() => setDataMode("generator")}
                className={`rounded-lg py-2 text-[11px] font-bold transition-all ${
                  dataMode === "generator"
                    ? "bg-emerald-600 text-white shadow"
                    : "text-slate-400 hover:bg-slate-700"
                }`}
              >
                Generator
              </button>
              <button
                onClick={() => setDataMode("potensi")}
                className={`rounded-lg py-2 text-[11px] font-bold transition-all ${
                  dataMode === "potensi"
                    ? "bg-cyan-600 text-white shadow"
                    : "text-slate-400 hover:bg-slate-700"
                }`}
              >
                Potensi
              </button>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-800/35 p-4 shadow-[0_10px_24px_rgba(15,23,42,0.14)]">
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                🔍
              </span>
              <input
                type="text"
                placeholder={
                  dataMode === "potensi"
                    ? "Cari lokasi / studi potensi..."
                    : "Cari lokasi pembangkit..."
                }
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 pl-10 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                {dataMode === "potensi" ? "Jenis Potensi" : "Jenis Pembangkit"}
              </p>
              <select
                value={selectedKategori}
                onChange={(e) => setSelectedKategori(e.target.value)}
                className="w-full cursor-pointer appearance-none rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-sm text-white outline-none transition-all focus:border-emerald-500"
              >
                {listKategori.map((kat) => (
                  <option key={kat} value={kat}>
                    {formatKategoriOption(kat, dataMode)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={onShowStats}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 py-2.5 text-[10px] font-bold text-emerald-400 transition-all active:scale-95 hover:bg-slate-700"
              >
                Statistik
              </button>
              <button
                onClick={onExport}
                className="flex items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-800 py-2.5 text-[10px] font-bold text-slate-200 transition-all active:scale-95 hover:border-slate-500 hover:bg-slate-700"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase text-slate-500">Status Data</span>
            <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
              {filteredData.length} Ditemukan
            </span>
          </div>
        </div>

        <div className="scrollbar-hide hover:scrollbar-default flex-1 space-y-2 overflow-y-auto p-3">
          {filteredData.length > 0 ? (
            filteredData.map((item, idx) => {
              const kategori = getKategoriInfo(item.jenis, dataMode);

              return (
                <div
                  key={idx}
                  onClick={() => onFocus(item)}
                  className="group animate-slideIn cursor-pointer rounded-xl border border-slate-800/50 bg-slate-800/30 p-4 transition-all duration-300 hover:border-emerald-500/50 hover:bg-slate-700/50"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className="text-sm font-bold text-slate-300 transition-colors group-hover:text-white">
                    {item.nama}
                  </div>

                  <div className="mt-3 flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-2">
                      <span
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border border-white/50"
                        style={{ backgroundColor: getColor(item.jenis) }}
                      />
                      <div className="min-w-0">
                        <p className="truncate text-[11px] font-bold uppercase tracking-[0.18em] text-slate-200">
                          {kategori.shortLabel}
                        </p>
                        <p className="text-[10px] leading-relaxed text-slate-500">
                          {kategori.label}
                        </p>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 text-slate-500 group-hover:text-slate-400">
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-[10px] font-medium">{item.region}</span>
                    </div>
                  </div>

                  {dataMode === "potensi" ? (
                    <div className="mt-3 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2">
                      <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-200">
                        Estimasi Potensi
                      </p>
                      <p className="mt-1 text-xs font-semibold text-cyan-50">
                        {item.prediksi_mw} MW
                      </p>
                    </div>
                  ) : null}
                </div>
              );
            })
          ) : (
            <div className="flex h-full flex-col items-center justify-center py-20 text-slate-600">
              <div className="mb-4 text-5xl text-slate-700">?</div>
              <p className="text-xs font-medium italic">Data tidak ditemukan</p>
              <p className="mt-1 px-4 text-center text-[10px] text-slate-700">
                Coba ubah filter wilayah atau kata kunci pencarian
              </p>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="absolute top-1/2 -right-6 flex h-12 w-6 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-r-xl border-y border-r border-slate-700 bg-slate-800 text-emerald-400 shadow-2xl transition-all hover:bg-slate-700 hover:text-emerald-300 z-[1500]"
        title={isSidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
      >
        <span
          className={`text-[10px] transition-transform duration-500 ${isSidebarOpen ? "" : "rotate-180"}`}
        >
          {"<"}
        </span>
      </button>
    </div>
  );
}

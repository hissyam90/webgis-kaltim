import { useState } from "react";
import { getColor } from "../../utils/getColor";
import { formatMetricValue } from "../../utils/analysisHelpers";
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
  analysisMetric,
  setAnalysisMetric,
  analysisMetricOptions,
  analysisAreas,
  selectedAnalysisArea,
  onSelectAnalysisArea,
  wilayahInsights,
}) {
  const [isRegionOpen, setIsRegionOpen] = useState(true);
  const modeLabel =
    dataMode === "potensi"
      ? "Potensi"
      : dataMode === "wilayah"
        ? "Statistik Wilayah"
        : "Fasilitas";

  return (
    <>
      <div
        className={`${
          isSidebarOpen ? "w-1/3 md:w-[27rem]" : "w-0"
        } relative z-[1000] flex h-full flex-col border-r border-slate-700 bg-slate-900 text-white shadow-[18px_0_40px_rgba(15,23,42,0.28)] transition-all duration-300 ease-in-out`}
      >
        <div className={`flex h-full min-h-0 flex-col ${!isSidebarOpen && "hidden"}`}>
          <div className="shrink-0 border-b border-slate-800 bg-gradient-to-b from-slate-900 to-slate-900/95 p-4 shadow-[inset_0_-1px_0_rgba(51,65,85,0.35)]">
            <h1 className="text-2xl font-bold tracking-tight text-emerald-400">WebGIS</h1>
            <p className="mb-4 text-xs text-slate-400">Peta Sebaran Energi Kalimantan</p>

            {dataMode !== "wilayah" ? (
              <div className="mb-3 rounded-2xl border border-slate-800/80 bg-slate-800/35 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.14)]">
                <button
                  type="button"
                  onClick={() => setIsRegionOpen((prev) => !prev)}
                  className="flex w-full items-center justify-between gap-3 text-left"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      Filter Wilayah
                    </p>
                    <p className="mt-1 text-[11px] font-medium text-slate-400">
                      Aktif: <span className="text-slate-200">{selectedProv}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      {selectedProv}
                    </span>
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 20 20"
                      className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                        isRegionOpen ? "rotate-180" : "rotate-0"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 7.5 10 12.5 15 7.5" />
                    </svg>
                  </div>
                </button>

                <div
                  className={`grid transition-all duration-200 ease-out ${
                    isRegionOpen ? "mt-3 grid-rows-[1fr] opacity-100" : "mt-0 grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="grid grid-cols-3 gap-2">
                      {Object.keys(KALIMANTAN_PROV_BBOX).map((prov) => (
                        <button
                          key={prov}
                          onClick={() => onSelectProv(prov)}
                          className={`rounded-lg border py-2 text-[10px] font-bold transition-all duration-200 active:scale-95 ${
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
                </div>
              </div>
            ) : null}

            <div className="mb-3 rounded-2xl border border-slate-800/80 bg-slate-800/35 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.14)]">
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Mode Tampilan
                </p>
                <span className="text-[10px] font-medium text-slate-500">{modeLabel}</span>
              </div>

              <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-700 bg-slate-800 p-1">
                <button
                  onClick={() => setDataMode("generator")}
                  className={`rounded-lg py-2 text-[11px] font-bold transition-all ${
                    dataMode === "generator"
                      ? "bg-emerald-600 text-white shadow"
                      : "text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  Fasilitas
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
                <button
                  onClick={() => setDataMode("wilayah")}
                  className={`rounded-lg py-2 text-[11px] font-bold transition-all ${
                    dataMode === "wilayah"
                      ? "bg-violet-600 text-white shadow"
                      : "text-slate-400 hover:bg-slate-700"
                  }`}
                >
                  Wilayah
                </button>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-slate-800/80 bg-slate-800/35 p-3 shadow-[0_10px_24px_rgba(15,23,42,0.14)]">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-600">
                  Cari
                </span>
                <input
                  type="text"
                  placeholder={
                    dataMode === "potensi"
                      ? "lokasi / studi potensi"
                      : dataMode === "wilayah"
                        ? "kabupaten / kota"
                        : "lokasi pembangkit"
                  }
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 pl-16 text-sm text-white outline-none transition-all placeholder:text-slate-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              {dataMode === "wilayah" ? (
                <div>
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Metrik Analisis
                  </p>
                  <div className="space-y-2">
                    {analysisMetricOptions.map((option) => {
                      const isActive = analysisMetric === option.value;

                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => setAnalysisMetric(option.value)}
                          className={`w-full rounded-xl border px-3 py-2.5 text-left transition-all ${
                            isActive
                              ? "border-violet-400/60 bg-violet-500/12 text-white shadow-[0_0_18px_rgba(139,92,246,0.12)]"
                              : "border-slate-700 bg-slate-800/70 text-slate-300 hover:border-slate-500 hover:bg-slate-700"
                          }`}
                        >
                          <p className="text-[12px] font-semibold">{option.label}</p>
                          <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                            {option.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <button
                      onClick={onShowStats}
                      className="flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-slate-800 py-2.5 text-[10px] font-bold text-violet-300 transition-all active:scale-95 hover:bg-slate-700"
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
              ) : (
                <>
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
                </>
              )}
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase text-slate-500">
                {dataMode === "wilayah" ? "Cakupan Data" : "Status Data"}
              </span>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] text-emerald-400">
                {dataMode === "wilayah" ? `${analysisAreas.length} Wilayah` : `${filteredData.length} Ditemukan`}
              </span>
            </div>
          </div>

          <div className="sidebar-scroll min-h-0 flex-1 space-y-2 overflow-y-auto p-2.5">
            {dataMode === "wilayah" ? (
              <>
                {wilayahInsights ? (
                  <div className="rounded-2xl border border-slate-700/80 bg-slate-800/40 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
                        Insight Summary
                      </p>
                      <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2 py-1 text-[10px] font-semibold text-violet-200">
                        {wilayahInsights.totalAreas} wilayah
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-slate-900/55 p-2.5">
                        <p className="text-slate-400">Fasilitas terbanyak</p>
                        <p className="mt-1 font-semibold text-white">
                          {wilayahInsights.topFacilityArea
                            ? `${wilayahInsights.topFacilityArea.name} (${wilayahInsights.topFacilityArea.totalFacilities})`
                            : "-"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-900/55 p-2.5">
                        <p className="text-slate-400">Share renewable tertinggi</p>
                        <p className="mt-1 font-semibold text-emerald-300">
                          {wilayahInsights.topRenewableShareArea
                            ? `${wilayahInsights.topRenewableShareArea.name} (${wilayahInsights.topRenewableShareArea.renewableShare.toFixed(1)}%)`
                            : "-"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-900/55 p-2.5">
                        <p className="text-slate-400">Wilayah tanpa data</p>
                        <p className="mt-1 font-semibold text-amber-300">
                          {wilayahInsights.noDataCount}
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-900/55 p-2.5">
                        <p className="text-slate-400">Pola dominan</p>
                        <p className="mt-1 font-semibold text-white">
                          {wilayahInsights.dominantCoverage}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {selectedAnalysisArea ? (
                  <div className="rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200">
                      Wilayah Terpilih
                    </p>
                    <h3 className="mt-2 text-lg font-bold text-white">{selectedAnalysisArea.name}</h3>
                    <p className="text-[11px] text-slate-300">{selectedAnalysisArea.type}</p>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-slate-900/55 p-2.5">
                        <p className="text-slate-400">Total</p>
                        <p className="mt-1 font-semibold text-white">{selectedAnalysisArea.totalFacilities}</p>
                      </div>
                      <div className="rounded-lg bg-slate-900/55 p-2.5">
                        <p className="text-slate-400">Renewable</p>
                        <p className="mt-1 font-semibold text-emerald-300">
                          {selectedAnalysisArea.renewableFacilities}
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-900/55 p-2.5">
                        <p className="text-slate-400">Non-renewable</p>
                        <p className="mt-1 font-semibold text-rose-300">
                          {selectedAnalysisArea.nonRenewableFacilities}
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-900/55 p-2.5">
                        <p className="text-slate-400">Dominan</p>
                        <p className="mt-1 font-semibold text-white">
                          {selectedAnalysisArea.hasData ? selectedAnalysisArea.dominantTypeLabel || "-" : "No Data"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                {analysisAreas.length > 0 ? (
                  analysisAreas.map((area) => {
                    const isActive = selectedAnalysisArea?.id === area.id;

                    return (
                      <button
                        key={area.id}
                        type="button"
                        onClick={() => onSelectAnalysisArea(area)}
                        className={`w-full rounded-xl border p-3.5 text-left transition-all duration-300 ${
                          isActive
                            ? "border-violet-400/60 bg-violet-500/12 shadow-[0_0_20px_rgba(139,92,246,0.1)]"
                            : "border-slate-800/50 bg-slate-800/30 hover:border-violet-500/40 hover:bg-slate-700/50"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-bold text-slate-100">{area.name}</p>
                            <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                              {area.type}
                            </p>
                          </div>
                          <span className="rounded-full border border-violet-400/20 bg-violet-400/10 px-2 py-1 text-[10px] font-semibold text-violet-200">
                            {formatMetricValue(area, analysisMetric)}
                          </span>
                        </div>

                        <div className="mt-3 grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                          <div>Total: {area.totalFacilities}</div>
                          <div>Renewable: {area.renewableFacilities}</div>
                          <div>Non-renewable: {area.nonRenewableFacilities}</div>
                          <div>Dominan: {area.hasData ? area.dominantTypeLabel || "-" : "No Data"}</div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="flex h-full flex-col items-center justify-center py-20 text-slate-600">
                    <div className="mb-4 text-5xl text-slate-700">?</div>
                    <p className="text-xs font-medium italic">Wilayah tidak ditemukan</p>
                    <p className="mt-1 px-4 text-center text-[10px] text-slate-700">
                      Coba ubah kata kunci pencarian untuk kabupaten/kota.
                    </p>
                  </div>
                )}
              </>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, idx) => {
                const kategori = getKategoriInfo(item.jenis, dataMode);
                const potensiText =
                  Number.isFinite(Number(item.prediksi_mw)) ? `${Number(item.prediksi_mw)} MW` : "-";

                return (
                  <div
                    key={idx}
                    onClick={() => onFocus(item)}
                    className="group animate-slideIn cursor-pointer rounded-xl border border-slate-800/50 bg-slate-800/30 p-3.5 transition-all duration-300 hover:border-emerald-500/50 hover:bg-slate-700/50"
                    style={{ animationDelay: `${idx * 40}ms` }}
                  >
                    <div className="text-[13px] font-bold text-slate-300 transition-colors group-hover:text-white">
                      {item.nama}
                    </div>

                    <div className="mt-2.5 flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-2">
                        <span
                          className="mt-0.5 h-3 w-3 shrink-0 rounded-full border border-white/50"
                          style={{ backgroundColor: getColor(item.jenis) }}
                        />
                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-slate-200">
                            {kategori.shortLabel}
                          </p>
                          <p className="text-[10px] leading-relaxed text-slate-500">{kategori.label}</p>
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
                      <div className="mt-2.5 rounded-lg border border-cyan-500/20 bg-cyan-500/10 px-3 py-2">
                        <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-cyan-200">
                          Estimasi Potensi
                        </p>
                        <p className="mt-1 text-xs font-semibold text-cyan-50">{potensiText}</p>
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
          className="absolute top-1/2 -right-6 z-[1500] flex h-12 w-6 -translate-y-1/2 transform cursor-pointer items-center justify-center rounded-r-xl border-y border-r border-slate-700 bg-slate-800 text-emerald-400 shadow-2xl transition-all hover:bg-slate-700 hover:text-emerald-300"
          title={isSidebarOpen ? "Tutup Sidebar" : "Buka Sidebar"}
        >
          <span
            className={`text-[10px] transition-transform duration-500 ${
              isSidebarOpen ? "" : "rotate-180"
            }`}
          >
            {"<"}
          </span>
        </button>
      </div>

      <style>{`
        .sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(100, 116, 139, 0.55) transparent;
        }

        .sidebar-scroll::-webkit-scrollbar {
          width: 8px;
        }

        .sidebar-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(
            180deg,
            rgba(71, 85, 105, 0.9),
            rgba(51, 65, 85, 0.9)
          );
          border-radius: 9999px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }

        .sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(
            180deg,
            rgba(100, 116, 139, 0.95),
            rgba(71, 85, 105, 0.95)
          );
          border-radius: 9999px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
      `}</style>
    </>
  );
}

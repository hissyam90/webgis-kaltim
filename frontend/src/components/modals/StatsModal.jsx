import { Pie } from "react-chartjs-2";
import { getKategoriInfo } from "../../utils/kategoriLabel";

export default function StatsModal({ showStats, onClose, chartData, dataMode = "generator" }) {
  if (!showStats) return null;

  const title =
    dataMode === "potensi"
      ? "Statistik Potensi Energi"
      : dataMode === "wilayah"
        ? "Statistik Wilayah"
        : "Statistik Pembangkit";

  return (
    <div className="absolute inset-0 z-[2000] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-700 p-4">
          <h2 className="text-lg font-bold text-emerald-400">{title}</h2>
          <button onClick={onClose} className="text-2xl font-bold text-slate-400 hover:text-white">
            x
          </button>
        </div>

        <div className="flex flex-col items-center p-6">
          <div className="h-64 w-64">
            <Pie data={chartData} />
          </div>

          <div className="mt-6 w-full">
            <h4 className="mb-2 border-b border-slate-700 pb-2 text-sm font-bold uppercase text-slate-300">
              Ringkasan Data
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {chartData.labels.map((label, idx) => {
                const kategori = getKategoriInfo(label, dataMode);

                return (
                  <div key={label} className="rounded bg-slate-800 p-2">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-white">{kategori.shortLabel}</span>
                      <span className="font-bold text-white">{chartData.datasets[0].data[idx]} Unit</span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-400">{kategori.label}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

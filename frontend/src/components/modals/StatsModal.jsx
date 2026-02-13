import { Pie } from "react-chartjs-2";

export default function StatsModal({ showStats, onClose, chartData }) {
  if (!showStats) return null;

  return (
    <div className="absolute inset-0 z-[2000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-700">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-emerald-400 font-bold text-lg">📊 Statistik Energi</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl font-bold">
            ×
          </button>
        </div>

        <div className="p-6 flex flex-col items-center">
          <div className="w-64 h-64">
            <Pie data={chartData} />
          </div>

          <div className="mt-6 w-full">
            <h4 className="text-slate-300 text-sm font-bold mb-2 uppercase border-b border-slate-700 pb-2">
              Ringkasan Data
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {chartData.labels.map((label, idx) => (
                <div key={idx} className="flex justify-between p-2 bg-slate-800 rounded">
                  <span className="text-slate-400">{label}</span>
                  <span className="text-white font-bold">{chartData.datasets[0].data[idx]} Unit</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

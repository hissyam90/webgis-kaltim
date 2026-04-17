import { getColor } from "../../utils/getColor";
import { formatKategoriOption } from "../../utils/kategoriLabel";

function getShortKategoriLabel(kategori) {
  const label = formatKategoriOption(kategori);
  const separatorIndex = label.search(/\s[-—]\s/);

  if (separatorIndex === -1) return label;
  return label.slice(separatorIndex + 3);
}

export default function Legend({
  listKategori = [],
  selectedKategori = "Semua",
  onSelectKategori,
  countsByKategori = {},
}) {
  const kategoriAktif = listKategori.filter((kategori) => kategori && kategori !== "Semua");

  return (
    <div className="absolute bottom-4 right-4 left-4 md:left-auto md:bottom-6 md:right-6 bg-slate-900/92 backdrop-blur-md p-4 rounded-2xl shadow-2xl z-[1000] text-xs border border-slate-700 text-slate-300">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
            Legenda Pembangkit
          </h4>
          <p className="mt-1 text-[11px] text-slate-400">
            Klik tombol bulat untuk filter marker di peta.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onSelectKategori?.("Semua")}
          className={`shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-semibold transition-all ${
            selectedKategori === "Semua"
              ? "border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.16)]"
              : "border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-500 hover:bg-slate-700"
          }`}
        >
          Semua
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {kategoriAktif.map((kategori) => {
          const isActive = selectedKategori === kategori;
          const color = getColor(kategori);

          return (
            <button
              key={kategori}
              type="button"
              onClick={() => onSelectKategori?.(isActive ? "Semua" : kategori)}
              className={`group min-w-[84px] rounded-2xl border px-3 py-2 text-left transition-all ${
                isActive
                  ? "border-white/20 bg-slate-800 shadow-[0_12px_28px_rgba(15,23,42,0.45)]"
                  : "border-slate-700 bg-slate-900/70 hover:border-slate-500 hover:bg-slate-800/90"
              }`}
              title={`Filter ${kategori}`}
            >
              <div className="flex items-center gap-2">
                <span
                  className={`h-4 w-4 rounded-full border-2 border-white/70 transition-transform ${
                    isActive ? "scale-110" : "group-hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: color,
                    boxShadow: isActive ? `0 0 0 4px ${color}22, 0 0 18px ${color}` : "none",
                  }}
                />
                <span className="font-semibold text-white">{kategori}</span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-[10px] leading-tight text-slate-400">
                  {getShortKategoriLabel(kategori)}
                </span>
                <span className="rounded-full bg-slate-700/80 px-2 py-0.5 text-[10px] font-semibold text-slate-200">
                  {countsByKategori[kategori] ?? 0}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

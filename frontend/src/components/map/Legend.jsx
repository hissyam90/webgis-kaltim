import { getColor } from "../../utils/getColor";
import { formatKategoriOption, getKategoriInfo } from "../../utils/kategoriLabel";

export default function Legend({
  listKategori = [],
  selectedKategori = "Semua",
  onSelectKategori,
  countsByKategori = {},
  dataMode = "generator",
}) {
  const kategoriAktif = listKategori.filter((kategori) => kategori && kategori !== "Semua");
  const title = dataMode === "potensi" ? "Legenda Potensi" : "Legenda Pembangkit";
  const hint =
    dataMode === "potensi"
      ? "Pilih kategori potensi untuk menyaring studi pada peta."
      : "Pilih jenis pembangkit untuk menyaring marker pada peta.";

  return (
    <div className="absolute bottom-4 left-4 right-4 z-[1000] rounded-xl border border-slate-700/90 bg-slate-900/88 p-3 text-xs text-slate-300 shadow-2xl backdrop-blur-md md:bottom-6 md:left-auto md:right-6 md:max-w-[420px]">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h4 className="text-[9px] font-bold uppercase tracking-[0.24em] text-white">{title}</h4>
          <p className="mt-1 hidden text-[10px] leading-relaxed text-slate-400 md:block">{hint}</p>
        </div>

        <button
          type="button"
          onClick={() => onSelectKategori?.("Semua")}
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-semibold transition-all ${
            selectedKategori === "Semua"
              ? "border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.16)]"
              : "border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-500 hover:bg-slate-700"
          }`}
        >
          Semua
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {kategoriAktif.map((kategori) => {
          const isActive = selectedKategori === kategori;
          const color = getColor(kategori);
          const info = getKategoriInfo(kategori, dataMode);

          return (
            <button
              key={kategori}
              type="button"
              onClick={() => onSelectKategori?.(isActive ? "Semua" : kategori)}
              className={`group flex items-center gap-2 rounded-full border px-2.5 py-1.5 text-left transition-all ${
                isActive
                  ? "border-white/20 bg-slate-800 shadow-[0_10px_24px_rgba(15,23,42,0.35)]"
                  : "border-slate-700 bg-slate-900/70 hover:border-slate-500 hover:bg-slate-800/90"
              }`}
              title={`Filter ${formatKategoriOption(kategori, dataMode)}`}
            >
              <span
                className={`h-3 w-3 shrink-0 rounded-full border border-white/70 transition-transform ${
                  isActive ? "scale-110" : "group-hover:scale-105"
                }`}
                style={{
                  backgroundColor: color,
                  boxShadow: isActive ? `0 0 0 3px ${color}22, 0 0 12px ${color}` : "none",
                }}
              />
              <span className="max-w-[90px] truncate text-[10px] font-semibold text-white">
                {info.shortLabel}
              </span>
              <span className="rounded-full bg-slate-700/80 px-1.5 py-0.5 text-[9px] font-semibold text-slate-200">
                {countsByKategori[kategori] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

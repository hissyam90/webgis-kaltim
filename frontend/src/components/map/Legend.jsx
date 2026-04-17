import { useState } from "react";
import { getColor } from "../../utils/getColor";
import { getKategoriInfo } from "../../utils/kategoriLabel";

export default function Legend({
  listKategori = [],
  selectedKategori = [],
  onSelectKategori,
  onResetKategori,
  countsByKategori = {},
  dataMode = "generator",
}) {
  const kategoriAktif = listKategori.filter((kategori) => kategori && kategori !== "Semua");
  const title = "Legenda";
  const isAllSelected = selectedKategori.length === 0;
  const [isCollapsed, setIsCollapsed] = useState(false);

  if (isCollapsed) {
    return (
      <div className="absolute bottom-4 left-4 z-[1000] md:bottom-6 md:left-auto md:right-6">
        <button
          type="button"
          onClick={() => setIsCollapsed(false)}
          className="inline-flex items-center gap-2 rounded-full border border-slate-700/90 bg-slate-900/92 px-3 py-2 text-white shadow-2xl backdrop-blur-md transition-all hover:border-slate-500 hover:bg-slate-800"
          aria-label="Expand legenda"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.18em]">Legenda</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="h-3.5 w-3.5 text-slate-400"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 7.5 10 12.5 15 7.5" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 z-[1000] w-[224px] max-w-[calc(100vw-2rem)] rounded-xl border border-slate-700/90 bg-slate-900/88 p-3 text-xs text-slate-300 shadow-2xl backdrop-blur-md md:bottom-6 md:left-auto md:right-6 md:w-[224px]">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white">{title}</h4>
        </div>

        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={() => onResetKategori?.()}
            className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold transition-all ${
              isAllSelected
                ? "border-emerald-400 bg-emerald-500/15 text-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.16)]"
                : "border-slate-600 bg-slate-800 text-slate-300 hover:border-slate-500 hover:bg-slate-700"
            }`}
          >
            Semua
          </button>
          <button
            type="button"
            onClick={() => setIsCollapsed(true)}
            className="rounded-full border border-slate-600 bg-slate-800 px-2.5 py-1 text-[9px] font-semibold text-slate-300 transition-all hover:border-slate-500 hover:bg-slate-700"
            aria-label="Collapse legenda"
          >
            Tutup
          </button>
        </div>
      </div>

      <div className="flex max-h-[52vh] flex-col gap-1.5 overflow-y-auto pr-1">
        {kategoriAktif.map((kategori) => {
          const color = getColor(kategori);
          const info = getKategoriInfo(kategori, dataMode);
          const isActive = selectedKategori.includes(kategori);

          return (
            <button
              key={kategori}
              type="button"
              onClick={() => onSelectKategori?.(kategori)}
              className={`group flex w-full items-center justify-between gap-3 rounded-[10px] border px-3 py-2 text-left transition-all ${
                isActive
                  ? "text-white"
                  : "border-slate-700/80 bg-slate-900/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800/85"
              }`}
              style={
                isActive
                  ? {
                      backgroundColor: `${color}16`,
                      borderColor: `${color}75`,
                      boxShadow: `inset 2px 0 0 ${color}`,
                    }
                  : undefined
              }
              title={`Tampilkan ${info.label}`}
            >
              <div className="flex min-w-0 flex-1 items-center gap-2.5">
                <span
                  className="h-4 w-4 shrink-0 rounded-full border border-white/70"
                  style={{
                    backgroundColor: color,
                    boxShadow: isActive ? `0 0 0 2px ${color}28` : "none",
                  }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[12px] font-semibold text-white">{info.shortLabel}</p>
                  <p className="truncate text-[10px] leading-tight text-slate-400">{info.secondaryLabel}</p>
                </div>
              </div>
              <span className="shrink-0 text-[11px] font-semibold text-slate-200">
                {countsByKategori[kategori] ?? 0}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

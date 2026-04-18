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

  return (
    <div className="absolute bottom-4 left-4 z-[1000] md:bottom-6 md:left-auto md:right-6">
      <div
        className={`origin-bottom-left overflow-hidden rounded-xl border border-slate-700/90 bg-slate-900/88 text-xs text-slate-300 shadow-2xl backdrop-blur-md transition-all duration-200 ease-out md:origin-bottom-right ${
          isCollapsed
            ? "w-[136px] max-w-[calc(100vw-2rem)] scale-95 opacity-95"
            : "w-[214px] max-w-[calc(100vw-2rem)] scale-100 opacity-100"
        }`}
      >
        <div className="p-2.5">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.18em] text-white">
                {title}
              </h4>
            </div>

            <div className="flex shrink-0 items-center gap-1.5">
              {!isCollapsed && (
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
              )}

              <button
                type="button"
                onClick={() => setIsCollapsed((prev) => !prev)}
                className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-600 bg-slate-800 text-slate-300 transition-all hover:border-slate-500 hover:bg-slate-700"
                aria-label={isCollapsed ? "Expand legenda" : "Collapse legenda"}
              >
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  className={`h-4 w-4 transition-transform duration-200 ease-out ${
                    isCollapsed ? "rotate-0" : "rotate-180"
                  }`}
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
          </div>

          <div
            className={`grid transition-all duration-200 ease-out ${
              isCollapsed ? "mt-0 grid-rows-[0fr] opacity-0" : "mt-2 grid-rows-[1fr] opacity-100"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="legend-scroll flex max-h-[50vh] flex-col gap-1.5 overflow-y-auto pr-1">
                {kategoriAktif.map((kategori) => {
                  const color = getColor(kategori);
                  const info = getKategoriInfo(kategori, dataMode);
                  const isActive = selectedKategori.includes(kategori);

                  return (
                    <button
                      key={kategori}
                      type="button"
                      onClick={() => onSelectKategori?.(kategori)}
                      className={`group flex w-full items-center justify-between gap-2 rounded-[10px] border px-2.5 py-2 text-left transition-all ${
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
                      <div className="flex min-w-0 flex-1 items-center gap-2">
                        <span
                          className="h-3.5 w-3.5 shrink-0 rounded-full border border-white/70"
                          style={{
                            backgroundColor: color,
                            boxShadow: isActive ? `0 0 0 2px ${color}28` : "none",
                          }}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[11px] font-semibold leading-tight text-white">
                            {info.shortLabel}
                          </p>
                          <p className="truncate text-[9px] leading-tight text-slate-400">
                            {info.secondaryLabel}
                          </p>
                        </div>
                      </div>
                      <span className="shrink-0 text-[10px] font-semibold text-slate-200">
                        {countsByKategori[kategori] ?? 0}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .legend-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.45) transparent;
        }

        .legend-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .legend-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .legend-scroll::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.4);
          border-radius: 9999px;
        }

        .legend-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.6);
        }
      `}</style>
    </div>
  );
}
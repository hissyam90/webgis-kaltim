import { useMemo, useState } from "react";

export default function LayerControl({
  dataMode,
  selectedPotensiLayer,
  onSelectPotensiLayer,
  potensiLayers = [],
}) {
  const [isOpen, setIsOpen] = useState(false);

  const geoEsdmLayers = useMemo(
    () => potensiLayers.filter((layer) => layer.group === "geoesdm"),
    [potensiLayers]
  );

  const standardLayers = useMemo(
    () => potensiLayers.filter((layer) => layer.group !== "geoesdm"),
    [potensiLayers]
  );

  if (dataMode !== "potensi") {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`inline-flex h-11 items-center gap-2 rounded-xl border px-3 text-xs font-semibold uppercase tracking-[0.16em] shadow-2xl backdrop-blur-md transition-all ${
          isOpen
            ? "border-cyan-400/70 bg-cyan-500/15 text-cyan-100"
            : "border-slate-700/90 bg-slate-900/88 text-slate-200 hover:border-slate-500 hover:bg-slate-800/92"
        }`}
        aria-expanded={isOpen}
        aria-label="Toggle layers panel"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 20 20"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M10 3 3 6.5 10 10l7-3.5L10 3Z" />
          <path d="M3 10.5 10 14l7-3.5" />
          <path d="M3 14.5 10 18l7-3.5" />
        </svg>
        Layers
      </button>

      {isOpen ? (
        <div className="absolute right-0 top-[calc(100%+0.6rem)] z-[1100] w-[300px] max-w-[calc(100vw-2rem)] rounded-2xl border border-slate-700/90 bg-slate-900/92 p-3 text-slate-200 shadow-2xl backdrop-blur-md">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                Layers
              </p>
              <p className="mt-1 text-xs text-slate-400">Pilih satu sumber data potensi yang aktif.</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 transition-all hover:border-slate-500 hover:bg-slate-700"
              aria-label="Close layers panel"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6 14 14" />
                <path d="m14 6-8 8" />
              </svg>
            </button>
          </div>

          <div className="space-y-2">
            {standardLayers.map((layer) => {
              const isSelected = selectedPotensiLayer === layer.id;

              return (
                <button
                  key={layer.id}
                  type="button"
                  onClick={() => onSelectPotensiLayer?.(layer.id)}
                  className={`flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-all ${
                    isSelected
                      ? "border-cyan-400/60 bg-cyan-500/12 text-white shadow-[0_0_20px_rgba(6,182,212,0.12)]"
                      : "border-slate-700/80 bg-slate-900/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800/85"
                  }`}
                >
                  <span
                    className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-cyan-300 bg-cyan-400/20"
                        : "border-slate-500 bg-slate-800"
                    }`}
                  >
                    {isSelected ? <span className="h-2 w-2 rounded-full bg-cyan-300" /> : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-white">{layer.label}</span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-slate-400">
                      {layer.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {geoEsdmLayers.length > 0 ? (
            <div className="mt-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-amber-200">
                Potensi Hidro (GeoESDM)
              </p>
              <p className="mt-2 text-[11px] leading-relaxed text-amber-100/90">
                Data GeoESDM, belum memiliki sumber/artikel pendukung yang jelas.
              </p>

              <div className="mt-3 space-y-2">
                {geoEsdmLayers.map((layer) => {
                  const isSelected = selectedPotensiLayer === layer.id;

                  return (
                    <button
                      key={layer.id}
                      type="button"
                      onClick={() => onSelectPotensiLayer?.(layer.id)}
                      className={`flex w-full items-start gap-3 rounded-xl border px-3 py-3 text-left transition-all ${
                        isSelected
                          ? "border-amber-300/70 bg-amber-400/12 text-white shadow-[0_0_20px_rgba(251,191,36,0.08)]"
                          : "border-slate-700/80 bg-slate-900/50 text-slate-300 hover:border-slate-500 hover:bg-slate-800/85"
                      }`}
                    >
                      <span
                        className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-amber-200 bg-amber-300/20"
                            : "border-slate-500 bg-slate-800"
                        }`}
                      >
                        {isSelected ? <span className="h-2 w-2 rounded-full bg-amber-200" /> : null}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold text-white">{layer.label}</span>
                        <span className="mt-1 block text-[11px] leading-relaxed text-slate-400">
                          {layer.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

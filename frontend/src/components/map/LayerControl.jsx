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
    <div
      className={`origin-top-right overflow-hidden border shadow-2xl backdrop-blur-md transition-all duration-200 ease-out ${
        isOpen
          ? "w-[300px] rounded-2xl border-cyan-400/40 bg-slate-900/95"
          : "h-12 w-12 rounded-xl border-slate-700/90 bg-slate-900/88 hover:border-slate-500 hover:bg-slate-800/92"
      }`}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex transition-all duration-200 ease-out ${
          isOpen
            ? "h-12 w-full items-center justify-between px-3"
            : "h-12 w-12 items-center justify-center"
        }`}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Collapse layers panel" : "Expand layers panel"}
        title={isOpen ? "Tutup layer" : "Buka layer"}
      >
        <span className="inline-flex items-center gap-2 overflow-hidden">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={`h-5 w-5 shrink-0 transition-all duration-200 ease-out ${
              isOpen ? "text-cyan-200" : "text-slate-100"
            }`}
            fill="currentColor"
            stroke="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2.75 3 7.25 12 11.75 21 7.25 12 2.75Z" opacity="0.95" />
            <path d="M5.1 11.1 12 14.55l6.9-3.45v3L12 17.55l-6.9-3.45v-3Z" opacity="0.78" />
            <path d="M5.1 17 12 20.45 18.9 17v2.2L12 22.65 5.1 19.2V17Z" opacity="0.58" />
          </svg>

          {isOpen ? (
            <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-100">
              Layers
            </span>
          ) : null}
        </span>

        {isOpen ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="h-4 w-4 shrink-0 text-cyan-200 transition-all duration-200 ease-out"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M6 6 14 14" />
            <path d="m14 6-8 8" />
          </svg>
        ) : null}
      </button>

      <div
        className={`grid transition-all duration-200 ease-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            className={`border-t border-slate-800/90 px-3 pb-3 pt-2 transition-all duration-200 ease-out ${
              isOpen ? "translate-y-0" : "-translate-y-2"
            }`}
          >
            <div className="mb-3 rounded-xl border border-slate-800 bg-slate-950/55 px-3 py-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                Layer Potensi
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                Pilih satu sumber data potensi yang aktif.
              </p>
            </div>

            <div className="space-y-2">
              {standardLayers.map((layer) => {
                const isSelected = selectedPotensiLayer === layer.id;

                return (
                  <button
                    key={layer.id}
                    type="button"
                    onClick={() => onSelectPotensiLayer?.(layer.id)}
                    className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
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
                      <span className="block text-[12px] font-semibold leading-tight text-white">
                        {layer.label}
                      </span>
                      <span className="mt-1 block text-[10px] leading-relaxed text-slate-400">
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
                <p className="mt-2 text-[10px] leading-relaxed text-amber-100/90">
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
                        className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left transition-all ${
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
                          <span className="block text-[12px] font-semibold leading-tight text-white">
                            {layer.label}
                          </span>
                          <span className="mt-1 block text-[10px] leading-relaxed text-slate-400">
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
        </div>
      </div>
    </div>
  );
}

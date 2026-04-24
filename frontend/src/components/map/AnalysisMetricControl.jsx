import { useState } from "react";

export default function AnalysisMetricControl({
  dataMode,
  analysisMetric,
  onSelectAnalysisMetric,
  analysisMetricOptions = [],
  analysisAreaCount = 0,
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (dataMode !== "wilayah") {
    return null;
  }

  const activeMetric =
    analysisMetricOptions.find((option) => option.value === analysisMetric) || analysisMetricOptions[0];

  return (
    <div
      className={`origin-top-right overflow-hidden border shadow-2xl backdrop-blur-md transition-all duration-200 ease-out ${
        isOpen
          ? "w-[320px] rounded-2xl border-violet-400/40 bg-slate-900/95"
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
        aria-label={isOpen ? "Collapse analysis metric panel" : "Expand analysis metric panel"}
        title={isOpen ? "Tutup metrik analisis" : "Buka metrik analisis"}
      >
        <span className="inline-flex items-center gap-2 overflow-hidden">
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className={`h-5 w-5 shrink-0 transition-all duration-200 ease-out ${
              isOpen ? "text-violet-200" : "text-slate-100"
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4.5 19.25h15" />
            <path d="M7.5 16.25V10.5" />
            <path d="M12 16.25V6.75" />
            <path d="M16.5 16.25v-3.5" />
          </svg>

          {isOpen ? (
            <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.16em] text-violet-100">
              Analisis Wilayah
            </span>
          ) : null}
        </span>

        {isOpen ? (
          <svg
            aria-hidden="true"
            viewBox="0 0 20 20"
            className="h-4 w-4 shrink-0 text-violet-200 transition-all duration-200 ease-out"
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
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-300">
                    Metrik Analisis
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-slate-400">
                    Pilih indikator pewarnaan wilayah agar cakupan data lebih mudah dibaca.
                  </p>
                </div>
                <span className="rounded-full border border-violet-400/20 bg-violet-500/10 px-2 py-1 text-[10px] font-semibold text-violet-100">
                  {analysisAreaCount} wilayah
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {analysisMetricOptions.map((option) => {
                const isSelected = analysisMetric === option.value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => onSelectAnalysisMetric?.(option.value)}
                    className={`w-full rounded-xl border px-3 py-2.5 text-left transition-all ${
                      isSelected
                        ? "border-violet-400/60 bg-violet-500/12 text-white shadow-[0_0_20px_rgba(139,92,246,0.12)]"
                        : "border-slate-700/80 bg-slate-900/60 text-slate-300 hover:border-slate-500 hover:bg-slate-800/85"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-[12px] font-semibold leading-tight text-white">{option.label}</p>
                        <p className="mt-1 text-[10px] leading-relaxed text-slate-400">
                          {option.description}
                        </p>
                      </div>
                      <span
                        className={`mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          isSelected
                            ? "border-violet-300 bg-violet-400/20"
                            : "border-slate-500 bg-slate-800"
                        }`}
                      >
                        {isSelected ? <span className="h-2 w-2 rounded-full bg-violet-300" /> : null}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {activeMetric ? (
              <div className="mt-3 rounded-xl border border-violet-400/20 bg-violet-500/10 px-3 py-2">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-violet-200">
                  Metrik Aktif
                </p>
                <p className="mt-1 text-[12px] font-semibold text-white">{activeMetric.label}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

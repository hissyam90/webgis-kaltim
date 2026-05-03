import { useMemo, useRef, useCallback } from "react";
import { CalendarDays, RotateCcw } from "lucide-react";

/**
 * Dual-handle year range slider, zero external deps.
 * Props:
 *   data         — array of facility objects (harus ada field tahun_operasi)
 *   yearRange    — [minYear, maxYear] state dari parent  (null = nonaktif)
 *   onYearRange  — setter untuk yearRange
 */
export default function YearRangeFilter({ data, yearRange, onYearRange }) {
  const trackRef = useRef(null);

  // Derive absolute bounds dari data nyata
  const { absMin, absMax } = useMemo(() => {
    const years = data
      .map((d) => Number(d.tahun_operasi))
      .filter((y) => Number.isFinite(y) && y > 1900 && y <= new Date().getFullYear() + 5);

    if (!years.length) return { absMin: 2000, absMax: new Date().getFullYear() };
    return { absMin: Math.min(...years), absMax: Math.max(...years) };
  }, [data]);

  const [selMin, selMax] = yearRange ?? [absMin, absMax];

  const toPercent = useCallback(
    (val) => ((val - absMin) / (absMax - absMin)) * 100,
    [absMin, absMax]
  );

  const activeCount = useMemo(() => {
    if (!yearRange) return data.length;
    return data.filter((d) => {
      const y = Number(d.tahun_operasi);
      return Number.isFinite(y) && y >= selMin && y <= selMax;
    }).length;
  }, [data, yearRange, selMin, selMax]);

  const noDataCount = useMemo(
    () => data.filter((d) => !Number.isFinite(Number(d.tahun_operasi))).length,
    [data]
  );

  const isActive = yearRange !== null;

  // ── Histogram bars ──────────────────────────────────────────────
  const histogram = useMemo(() => {
    const span = absMax - absMin;
    if (span <= 0) return [];

    const BINS = Math.min(span + 1, 20);
    const step = span / BINS;
    const counts = Array(BINS).fill(0);

    data.forEach((d) => {
      const y = Number(d.tahun_operasi);
      if (!Number.isFinite(y) || y < absMin || y > absMax) return;
      const bin = Math.min(Math.floor((y - absMin) / step), BINS - 1);
      counts[bin]++;
    });

    const maxCount = Math.max(...counts, 1);
    return counts.map((count, i) => {
      const binStart = Math.round(absMin + i * step);
      const binEnd = Math.round(absMin + (i + 1) * step);
      const isInRange = isActive ? binStart >= selMin && binEnd <= selMax + 1 : true;
      return { count, height: (count / maxCount) * 100, binStart, binEnd, isInRange };
    });
  }, [data, absMin, absMax, selMin, selMax, isActive]);

  // ── Drag logic ───────────────────────────────────────────────────
  const handleMinChange = (e) => {
    const val = Math.min(Number(e.target.value), selMax - 1);
    onYearRange([val, selMax]);
  };

  const handleMaxChange = (e) => {
    const val = Math.max(Number(e.target.value), selMin + 1);
    onYearRange([selMin, val]);
  };

  const handleToggle = () => {
    onYearRange(isActive ? null : [absMin, absMax]);
  };

  const handleReset = () => onYearRange([absMin, absMax]);

  const leftPct = toPercent(selMin);
  const rightPct = toPercent(selMax);

  if (absMin === absMax) return null; // data homogen, filter tidak berguna

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-800/50 p-3 space-y-3">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays size={14} className="text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold text-slate-200 tracking-wide">
            Filter Tahun Operasi
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isActive && selMin !== absMin || selMax !== absMax ? (
            <button
              onClick={handleReset}
              className="flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-slate-400 hover:text-emerald-400 hover:bg-slate-700 transition-colors"
            >
              <RotateCcw size={10} />
              Reset
            </button>
          ) : null}
          <button
            onClick={handleToggle}
            className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors duration-200 focus:outline-none ${
              isActive ? "bg-emerald-500" : "bg-slate-600"
            }`}
            aria-label="Toggle year filter"
          >
            <span
              className={`inline-block h-3 w-3 transform rounded-full bg-white shadow transition-transform duration-200 ${
                isActive ? "translate-x-3.5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* ── Histogram ── */}
      <div
        className={`flex items-end gap-px h-10 transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-40"
        }`}
      >
        {histogram.map((bar, i) => (
          <div
            key={i}
            className="flex-1 flex items-end"
            title={`${bar.binStart}–${bar.binEnd}: ${bar.count} unit`}
          >
            <div
              style={{ height: `${Math.max(bar.height, bar.count > 0 ? 8 : 0)}%` }}
              className={`w-full rounded-sm transition-colors duration-200 ${
                bar.count === 0
                  ? "bg-slate-700/30"
                  : bar.isInRange
                  ? "bg-emerald-500/80"
                  : "bg-slate-600/50"
              }`}
            />
          </div>
        ))}
      </div>

      {/* ── Dual Slider ── */}
      <div
        className={`relative transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-40 pointer-events-none"
        }`}
      >
        {/* Track background */}
        <div ref={trackRef} className="relative h-1.5 rounded-full bg-slate-700">
          {/* Active range fill */}
          <div
            className="absolute h-full rounded-full bg-emerald-500 transition-all"
            style={{ left: `${leftPct}%`, right: `${100 - rightPct}%` }}
          />
        </div>

        {/* Min input */}
        <input
          type="range"
          min={absMin}
          max={absMax}
          value={selMin}
          onChange={handleMinChange}
          className="
            absolute top-0 left-0 w-full h-1.5 appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-900
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:hover:bg-emerald-300
            [&::-webkit-slider-thumb]:transition-colors
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-400
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-900
          "
          style={{ zIndex: selMin > absMax - (absMax - absMin) / 10 ? 5 : 3 }}
        />

        {/* Max input */}
        <input
          type="range"
          min={absMin}
          max={absMax}
          value={selMax}
          onChange={handleMaxChange}
          className="
            absolute top-0 left-0 w-full h-1.5 appearance-none bg-transparent cursor-pointer
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-400
            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-slate-900
            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-grab
            [&::-webkit-slider-thumb]:active:cursor-grabbing
            [&::-webkit-slider-thumb]:hover:bg-emerald-300
            [&::-webkit-slider-thumb]:transition-colors
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4
            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-400
            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-slate-900
          "
          style={{ zIndex: 4 }}
        />
      </div>

      {/* ── Labels ── */}
      <div
        className={`flex items-center justify-between transition-opacity duration-300 ${
          isActive ? "opacity-100" : "opacity-40"
        }`}
      >
        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-500 leading-none">Dari</span>
          <span className="text-sm font-bold text-emerald-400 tabular-nums">{selMin}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-400 leading-none">
            {activeCount.toLocaleString("id-ID")} unit ditampilkan
          </span>
          {noDataCount > 0 && (
            <span className="text-[9px] text-slate-600 leading-none mt-0.5">
              ({noDataCount} tanpa data tahun)
            </span>
          )}
        </div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] text-slate-500 leading-none">Sampai</span>
          <span className="text-sm font-bold text-emerald-400 tabular-nums">{selMax}</span>
        </div>
      </div>
    </div>
  );
}
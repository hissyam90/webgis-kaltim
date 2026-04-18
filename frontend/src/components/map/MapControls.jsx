import LayerControl from "./LayerControl";

function BasemapButton({ active, label, icon, onClick, title }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border text-lg shadow-2xl backdrop-blur-md transition-all ${
        active
          ? "border-emerald-400/70 bg-emerald-500/15 text-emerald-100"
          : "border-slate-700/90 bg-slate-900/88 text-slate-200 hover:border-slate-500 hover:bg-slate-800/92"
      }`}
      title={title || label}
      aria-label={label}
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  );
}

export default function MapControls({
  basemap,
  setBasemap,
  onLocateMe,
  dataMode,
  selectedPotensiLayer,
  onSelectPotensiLayer,
  potensiLayers,
}) {
  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col items-end gap-2 md:right-6 md:top-6">
      <div className="flex items-start gap-2">
        <LayerControl
          dataMode={dataMode}
          selectedPotensiLayer={selectedPotensiLayer}
          onSelectPotensiLayer={onSelectPotensiLayer}
          potensiLayers={potensiLayers}
        />

        <div className="flex flex-col gap-2 rounded-2xl border border-slate-700/90 bg-slate-950/70 p-2 shadow-2xl backdrop-blur-md">
          <BasemapButton
            active={basemap === "dark"}
            label="Dark basemap"
            icon="🌑"
            onClick={() => setBasemap("dark")}
            title="Dark"
          />
          <BasemapButton
            active={basemap === "osm"}
            label="Light basemap"
            icon="🗺️"
            onClick={() => setBasemap("osm")}
            title="Light"
          />
          <BasemapButton
            active={basemap === "satellite"}
            label="Satellite basemap"
            icon="🛰️"
            onClick={() => setBasemap("satellite")}
            title="Satellite"
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onLocateMe}
        className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-700/90 bg-slate-900/88 text-lg text-emerald-300 shadow-2xl backdrop-blur-md transition-all hover:border-emerald-400/60 hover:bg-emerald-500/12 hover:text-emerald-100"
        title="Lokasi Saya"
        aria-label="Lokasi Saya"
      >
        <span aria-hidden="true">📍</span>
      </button>
    </div>
  );
}

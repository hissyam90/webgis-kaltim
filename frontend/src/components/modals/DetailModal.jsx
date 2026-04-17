import { getColor } from "../../utils/getColor";
import { getWeatherIcon } from "../../utils/weatherInfo";
import { openGoogleMaps } from "../../utils/openGoogleMaps";
import { getKategoriInfo } from "../../utils/kategoriLabel";

export default function DetailModal({
  selectedDetail,
  onClose,
  weatherData,
  loadingWeather,
  weatherError,
  dataMode,
}) {
  if (!selectedDetail) return null;

  const isPotensi = dataMode === "potensi";
  const kategori = getKategoriInfo(selectedDetail.jenis, dataMode);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-2xl bg-white text-slate-900 shadow-2xl animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-6 text-white" style={{ backgroundColor: getColor(selectedDetail.jenis) }}>
          <button
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full bg-white/20 p-1.5 text-white transition-colors hover:bg-white/40"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-white/80">
            {isPotensi ? "Studi Potensi" : "Detail Pembangkit"}
          </p>
          <h2 className="pr-8 text-2xl font-bold leading-tight">{selectedDetail.nama}</h2>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              {kategori.shortLabel}
            </span>
            <span className="text-xs text-white/85">{kategori.label}</span>
          </div>
        </div>

        <div className="space-y-6 overflow-y-auto p-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase text-slate-500">Region</p>
              <p className="font-medium text-slate-800">{selectedDetail.region}</p>
            </div>

            <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase text-slate-500">
                {isPotensi ? "Estimasi Potensi" : "Kapasitas"}
              </p>
              <p className="font-medium text-slate-800">
                {isPotensi
                  ? `${selectedDetail.prediksi_mw || "-"} MW`
                  : `${selectedDetail.kapasitas_mw || "-"} MW`}
              </p>
            </div>

            {isPotensi ? (
              <>
                <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase text-slate-500">Jenis Potensi</p>
                  <p className="font-medium text-slate-800">{kategori.label}</p>
                  {kategori.secondaryLabel !== kategori.label ? (
                    <p className="mt-1 text-sm text-slate-500">{kategori.secondaryLabel}</p>
                  ) : null}
                </div>

                <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase text-slate-500">Lokasi Studi</p>
                  <p className="font-medium text-slate-800">{selectedDetail.lokasi || "-"}</p>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase text-slate-500">Tahun</p>
                  <p className="font-medium text-slate-800">{selectedDetail.tahun || "-"}</p>
                </div>

                <div className="rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-semibold uppercase text-slate-500">Sumber</p>
                  <a
                    href={selectedDetail.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-sm font-medium text-blue-600 hover:underline"
                  >
                    Buka Sumber
                  </a>
                </div>
              </>
            ) : null}

            <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase text-slate-500">Koordinat</p>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <code className="rounded bg-slate-200 px-2 py-0.5 font-mono text-xs text-slate-700">
                  {selectedDetail.latitude}
                </code>
                <code className="rounded bg-slate-200 px-2 py-0.5 font-mono text-xs text-slate-700">
                  {selectedDetail.longitude}
                </code>
              </div>
            </div>

            {isPotensi && selectedDetail.potensi_energi_raw ? (
              <div className="col-span-2 rounded-lg border border-cyan-100 bg-cyan-50 p-3">
                <p className="text-xs font-semibold uppercase text-cyan-700">Ringkasan Potensi</p>
                <p className="text-sm font-medium text-slate-700">{selectedDetail.potensi_energi_raw}</p>
              </div>
            ) : null}

            {isPotensi && selectedDetail.deskripsi_lokasi ? (
              <div className="col-span-2 rounded-lg border border-slate-100 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">Deskripsi</p>
                <p className="text-sm font-medium text-slate-700">{selectedDetail.deskripsi_lokasi}</p>
              </div>
            ) : null}
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-slate-800">
              <span>Cuaca di Lokasi</span>
              {loadingWeather ? (
                <span className="animate-pulse text-xs font-normal text-slate-400">(Memuat...)</span>
              ) : null}
            </h3>

            <div className="rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
              {loadingWeather ? (
                <div className="flex animate-pulse items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-1/3 rounded bg-blue-200" />
                    <div className="h-3 w-1/2 rounded bg-blue-200" />
                  </div>
                </div>
              ) : weatherError ? (
                <div className="text-sm text-red-500">Gagal memuat data cuaca.</div>
              ) : weatherData ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl drop-shadow-sm">
                      {getWeatherIcon(weatherData.weathercode)}
                    </span>
                    <div>
                      <p className="text-3xl font-bold text-slate-800">
                        {weatherData.temperature}
                        <span className="align-top text-lg"> C</span>
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        Angin: {weatherData.windspeed} km/h
                      </p>
                    </div>
                  </div>
                  <div className="hidden text-right sm:block">
                    <p className="rounded bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-600">
                      Live Data
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm italic text-slate-400">Data cuaca tidak tersedia.</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 border-t border-slate-200 bg-slate-50 p-4">
          <button
            onClick={() => openGoogleMaps(selectedDetail.latitude, selectedDetail.longitude)}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white py-2.5 text-sm font-medium text-slate-700 transition-all active:scale-95 hover:bg-slate-50"
          >
            Google Maps
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-slate-800 py-2.5 text-sm font-medium text-white transition-all active:scale-95 hover:bg-slate-900"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

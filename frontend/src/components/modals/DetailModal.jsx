import { getColor } from '../../utils/getColor';
import { getWeatherIcon } from '../../utils/weatherInfo'; 
import { openGoogleMaps } from '../../utils/openGoogleMaps';

export default function DetailModal({ selectedDetail, onClose, weatherData, loadingWeather, weatherError, dataMode }) {
  if (!selectedDetail) return null;

  const isPotensi = dataMode === "potensi";

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeIn">
      <div 
        className="bg-white text-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh] animate-scaleIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div 
          className="p-6 relative text-white"
          style={{ backgroundColor: getColor(selectedDetail.jenis) }}
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 p-1.5 rounded-full transition-colors text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
          
          <h2 className="text-2xl font-bold leading-tight pr-8">{selectedDetail.nama}</h2>
          <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-md">
            {selectedDetail.jenis}
          </span>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500 uppercase font-semibold">Region</p>
              <p className="font-medium text-slate-800">{selectedDetail.region}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <p className="text-xs text-slate-500 uppercase font-semibold">
                {isPotensi ? "Prediksi" : "Kapasitas"}
              </p>
              <p className="font-medium text-slate-800">
                {isPotensi
                  ? `${selectedDetail.prediksi_mw || "-"} MW`
                  : `${selectedDetail.kapasitas_mw || "-"} MW`}
              </p>
            </div>

            {isPotensi && (
              <>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 col-span-2">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Lokasi Studi</p>
                  <p className="font-medium text-slate-800">{selectedDetail.lokasi || "-"}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Tahun</p>
                  <p className="font-medium text-slate-800">{selectedDetail.tahun || "-"}</p>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs text-slate-500 uppercase font-semibold">Sumber</p>
                  <a
                    href={selectedDetail.source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:underline break-all text-sm"
                  >
                    Buka Sumber
                  </a>
                </div>
              </>
            )}

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 col-span-2">
              <p className="text-xs text-slate-500 uppercase font-semibold">Koordinat</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <code className="bg-slate-200 px-2 py-0.5 rounded text-xs font-mono text-slate-700">
                  {selectedDetail.latitude}
                </code>
                <code className="bg-slate-200 px-2 py-0.5 rounded text-xs font-mono text-slate-700">
                  {selectedDetail.longitude}
                </code>
              </div>
            </div>

            {isPotensi && selectedDetail.deskripsi_lokasi && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 col-span-2">
                <p className="text-xs text-slate-500 uppercase font-semibold">Deskripsi</p>
                <p className="font-medium text-slate-700 text-sm">{selectedDetail.deskripsi_lokasi}</p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100 pt-5">
            <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
              <span>🌤️ Cuaca di Lokasi</span>
              {loadingWeather && <span className="text-xs text-slate-400 font-normal animate-pulse">(Memuat...)</span>}
            </h3>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              {loadingWeather ? (
                <div className="flex items-center gap-3 animate-pulse">
                  <div className="w-12 h-12 bg-blue-200 rounded-full"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-blue-200 rounded w-1/3"></div>
                    <div className="h-3 bg-blue-200 rounded w-1/2"></div>
                  </div>
                </div>
              ) : weatherError ? (
                <div className="text-red-500 text-sm">Gagal memuat data cuaca.</div>
              ) : weatherData ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-4xl filter drop-shadow-sm">
                      {getWeatherIcon(weatherData.weathercode)}
                    </span>
                    <div>
                      <p className="text-3xl font-bold text-slate-800">
                        {weatherData.temperature}<span className="text-lg align-top">°C</span>
                      </p>
                      <p className="text-xs text-slate-500 font-medium">
                        Angin: {weatherData.windspeed} km/h
                      </p>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block">
                    <p className="text-xs text-blue-600 font-semibold bg-blue-100 px-2 py-1 rounded">Live Data</p>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">Data cuaca tidak tersedia.</p>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex gap-3">
          <button 
            onClick={() => openGoogleMaps(selectedDetail.latitude, selectedDetail.longitude)}
            className="flex-1 flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 py-2.5 rounded-lg font-medium transition-all active:scale-95 text-sm"
          >
            Google Maps
          </button>
          <button 
            onClick={onClose}
            className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-2.5 rounded-lg font-medium transition-all active:scale-95 text-sm"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
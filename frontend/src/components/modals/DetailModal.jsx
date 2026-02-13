import { getColor } from "../../utils/getColor";
import { getWeatherInfo } from "../../utils/weatherInfo";
import { openGoogleMaps } from "../../utils/openGoogleMaps";

export default function DetailModal({ selectedDetail, onClose, weatherData, loadingWeather }) {
  if (!selectedDetail) return null;

  return (
    <div className="absolute inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-fade-in-up">
        <div className="bg-emerald-600 p-4 flex justify-between items-center">
          <h2 className="text-white font-bold text-lg truncate pr-4">{selectedDetail.nama}</h2>
          <button onClick={onClose} className="text-white hover:text-emerald-200 text-xl font-bold">
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center mb-6">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4 shadow-lg"
              style={{ backgroundColor: getColor(selectedDetail.jenis) }}
            >
              ⚡
            </div>
            <div>
              <p className="text-sm text-gray-500">Jenis Pembangkit</p>
              <p className="font-bold text-gray-800 text-lg">{selectedDetail.jenis}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 p-3 rounded border border-gray-100">
              <p className="text-xs text-gray-500 uppercase">Tahun Ops</p>
              <p className="font-semibold text-gray-800">{selectedDetail.tahun_operasi || "-"}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border border-gray-100">
              <p className="text-xs text-gray-500 uppercase">Wilayah</p>
              <p className="font-semibold text-gray-800">{selectedDetail.region}</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-400 p-4 rounded-lg text-white mb-6 shadow-md relative overflow-hidden">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-80 mb-1">
              Kondisi Cuaca Saat Ini (Live)
            </p>

            {loadingWeather ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="animate-spin">⏳</span> Mengambil data cuaca...
              </div>
            ) : weatherData ? (
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-3xl font-bold">{weatherData.temperature}°C</div>
                  <div className="text-sm font-medium flex items-center gap-1">
                    {getWeatherInfo(weatherData.weathercode).icon} {getWeatherInfo(weatherData.weathercode).label}
                  </div>
                </div>
                <div className="text-right text-xs opacity-90">
                  <p>💨 Angin: {weatherData.windspeed} km/h</p>
                  <p>📍 Lokasi Site</p>
                </div>
              </div>
            ) : (
              <div className="text-sm">Gagal memuat cuaca.</div>
            )}

            <div className="absolute -right-4 -bottom-4 text-8xl opacity-20">🌤️</div>
          </div>

          <button
            onClick={() => openGoogleMaps(selectedDetail.latitude, selectedDetail.longitude)}
            className="w-full bg-slate-800 text-white py-3 rounded-lg font-bold hover:bg-slate-900 transition flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            🗺️ Navigasi Google Maps
          </button>
        </div>
      </div>
    </div>
  );
}

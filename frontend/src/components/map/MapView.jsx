import { useEffect, useMemo, useState } from "react";
import {
  CircleMarker,
  GeoJSON,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import FlyToLocation from "./FlyToLocation";
import { getColor } from "../../utils/getColor";
import { getKategoriInfo } from "../../utils/kategoriLabel";
import "../../lib/leafletIconFix";

function MapResizeHandler() {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();

    const refreshMapSize = () => {
      window.requestAnimationFrame(() => {
        map.invalidateSize(false);
      });
    };

    refreshMapSize();

    const resizeObserver = new ResizeObserver(() => {
      refreshMapSize();
    });

    resizeObserver.observe(container);
    window.addEventListener("resize", refreshMapSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", refreshMapSize);
    };
  }, [map]);

  return null;
}

function getMarkerRadius(zoom, dataMode) {
  const isPotensi = dataMode === "potensi";

  if (zoom <= 5) return isPotensi ? 3 : 2.5;
  if (zoom <= 6) return isPotensi ? 4 : 3.5;
  if (zoom <= 7) return isPotensi ? 5.5 : 4.5;
  if (zoom <= 9) return isPotensi ? 7 : 6;
  if (zoom <= 11) return isPotensi ? 8.5 : 7.5;
  return isPotensi ? 10 : 9;
}

function MarkerLayer({ validData, dataMode, onOpenDetail }) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());

  useMapEvents({
    zoomend: () => {
      setZoom(map.getZoom());
    },
  });

  const markerRadius = useMemo(() => getMarkerRadius(zoom, dataMode), [zoom, dataMode]);

  return validData.map((item, idx) => {
    const lat = Number(item.latitude);
    const lng = Number(item.longitude);
    const kategori = getKategoriInfo(item.jenis, dataMode);

    return (
      <CircleMarker
        key={item.id || idx}
        center={[lat, lng]}
        radius={markerRadius}
        pathOptions={{
          color: getColor(item.jenis),
          fillColor: getColor(item.jenis),
          fillOpacity: zoom <= 6 ? 0.72 : 0.82,
          weight: zoom <= 6 ? 1 : 1.2,
        }}
      >
        <Popup>
          <div className="min-w-[180px] p-1 font-sans text-slate-800">
            <h3 className="mb-2 border-b border-slate-200 pb-2 text-sm font-bold leading-tight text-slate-900">
              {item.nama}
            </h3>

            <div className="mb-3 space-y-1 text-xs text-slate-600">
              <p>
                Jenis: <span className="font-semibold text-slate-800">{kategori.shortLabel}</span>
              </p>
              <p className="text-[11px] text-slate-500">{kategori.label}</p>
              <p>
                Region: <span className="font-semibold text-slate-800">{item.region}</span>
              </p>

              {dataMode === "potensi" ? (
                <p>
                  Estimasi: <span className="font-semibold text-cyan-700">{item.prediksi_mw} MW</span>
                </p>
              ) : null}
            </div>

            <button
              onClick={() => onOpenDetail && onOpenDetail(item)}
              className="flex w-full items-center justify-center gap-1 rounded bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all duration-200 active:scale-95 hover:bg-emerald-700"
            >
              <span>Lihat Detail</span>
            </button>
          </div>
        </Popup>
      </CircleMarker>
    );
  });
}

export default function MapView({
  filteredData = [],
  focusLocation,
  userLocation,
  tile,
  onOpenDetail,
  selectedProvFeature,
  dataMode,
}) {
  const validData = filteredData.filter((item) => {
    const lat = Number(item.latitude);
    const lng = Number(item.longitude);

    return (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  });

  return (
    <MapContainer
      center={[-0.5, 116.5]}
      zoom={7}
      className="h-full w-full min-w-0 bg-slate-800"
      zoomControl={false}
    >
      <MapResizeHandler />
      <TileLayer attribution={tile?.attr} url={tile?.url} />
      {tile?.labelUrl ? (
        <TileLayer attribution={tile?.labelAttr || tile?.attr} url={tile.labelUrl} pane="overlayPane" />
      ) : null}
      <FlyToLocation target={focusLocation} />

      {selectedProvFeature ? (
        <GeoJSON
          key={selectedProvFeature.properties.Propinsi}
          data={selectedProvFeature}
          interactive={false}
          style={{
            color: "#0ea5e9",
            weight: 2,
            fillColor: "#0ea5e9",
            fillOpacity: 0.1,
          }}
        />
      ) : null}

      {userLocation ? (
        <Marker position={[Number(userLocation.latitude), Number(userLocation.longitude)]}>
          <Popup>Lokasi Saya</Popup>
        </Marker>
      ) : null}

      <MarkerLayer validData={validData} dataMode={dataMode} onOpenDetail={onOpenDetail} />
    </MapContainer>
  );
}

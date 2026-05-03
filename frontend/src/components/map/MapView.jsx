import { useEffect, useMemo, useState } from "react";
import L from "leaflet";
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
import { formatMetricValue, getAreaFillColor, getMetricCaption } from "../../utils/analysisHelpers";
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

function SelectedAreaViewport({ selectedAnalysisArea, defaultMapView, analysisResetCounter }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedAnalysisArea?.feature) return;

    const bounds = L.geoJSON(selectedAnalysisArea.feature).getBounds();
    if (!bounds.isValid()) return;

    map.flyToBounds(bounds, {
      paddingTopLeft: [36, 36],
      paddingBottomRight: [36, 36],
      maxZoom: 8.6,
      duration: 1.1,
    });
  }, [map, selectedAnalysisArea]);

  useEffect(() => {
    if (!analysisResetCounter) return;

    map.flyTo(defaultMapView.center, defaultMapView.zoom, { duration: 1.1 });
  }, [analysisResetCounter, defaultMapView, map]);

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

function MarkerLayer({ validData, dataMode, onOpenDetail, potensiOpacity }) {
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
    const potensiText =
      Number.isFinite(Number(item.prediksi_mw)) ? `${Number(item.prediksi_mw)} MW` : "-";

    const isPotensi = dataMode === "potensi";
    const currentOpacity = isPotensi ? potensiOpacity : (zoom <= 6 ? 0.72 : 0.82);

    return (
      <CircleMarker
        key={item.id || idx}
        center={[lat, lng]}
        radius={markerRadius}
        pathOptions={{
          color: getColor(item.jenis),
          fillColor: getColor(item.jenis),
          fillOpacity: currentOpacity,
          opacity: isPotensi ? Math.min(1, currentOpacity + 0.2) : 1,
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

              {isPotensi ? (
                <p>
                  Estimasi: <span className="font-semibold text-cyan-700">{potensiText}</span>
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

function AreaLayer({
  analysisGeoJson,
  analysisMetric,
  analysisMetricRange,
  selectedAnalysisArea,
  onSelectAnalysisArea,
}) {
  const selectedId = selectedAnalysisArea?.id;

  if (!analysisGeoJson) return null;

  return (
    <GeoJSON
      key={`${analysisMetric}-${selectedId || "all"}`}
      data={analysisGeoJson}
      style={(feature) => {
        const area = feature?.properties?.analysis;
        const isSelected = selectedId && area?.id === selectedId;
        const isMuted = Boolean(selectedId) && !isSelected;

        return {
          className: isSelected
            ? "analysis-area-selected"
            : isMuted
              ? "analysis-area-muted"
              : "analysis-area-default",
          color: isSelected ? "#f8fafc" : isMuted ? "#64748b" : "#94a3b8",
          weight: isSelected ? 3.4 : isMuted ? 1 : 1.2,
          opacity: isSelected ? 1 : isMuted ? 0.45 : 0.75,
          fillColor: getAreaFillColor(area, analysisMetric, analysisMetricRange),
          fillOpacity: area?.hasData ? (isSelected ? 0.9 : isMuted ? 0.18 : 0.72) : isMuted ? 0.1 : 0.35,
          dashArray: area?.hasData ? null : "5 7",
        };
      }}
      onEachFeature={(feature, layer) => {
        const area = feature?.properties?.analysis;
        if (!area) return;

        layer.bindPopup(
          `<div class="min-w-[160px]"><strong>${area.name}</strong><br/>Total: ${area.totalFacilities}<br/>Renewable: ${area.renewableFacilities}<br/>Dominan: ${
            area.hasData ? area.dominantTypeLabel || "-" : "No Data"
          }</div>`,
          {
            autoClose: true,
            closeButton: false,
            className: "analysis-area-popup",
          }
        );

        layer.bindTooltip(
          `<div><strong>${area.label}</strong><br/>${getMetricCaption(analysisMetric)}: ${formatMetricValue(
            area,
            analysisMetric
          )}<br/>Status: ${area.hasData ? "Ada data" : "No data"}</div>`,
          {
            sticky: true,
            direction: "top",
            opacity: 0.95,
          }
        );

        if (selectedId === area.id) {
          window.requestAnimationFrame(() => {
            layer.openPopup();
          });
        }

        layer.on({
          click: () => {
            onSelectAnalysisArea?.(area);
            layer.openPopup();
          },
          mouseover: () =>
            layer.setStyle({
              weight: selectedId === area.id ? 3.4 : 2,
              fillOpacity: selectedId && selectedId !== area.id ? 0.24 : 0.82,
            }),
          mouseout: () =>
            layer.setStyle({
              weight: selectedId === area.id ? 3.4 : selectedId ? 1 : 1.2,
              fillOpacity: area?.hasData
                ? selectedId === area.id
                  ? 0.9
                  : selectedId
                    ? 0.18
                    : 0.72
                : selectedId && selectedId !== area.id
                  ? 0.1
                  : 0.35,
            }),
        });
      }}
    />
  );
}

export default function MapView({
  filteredData = [],
  focusLocation,
  userLocation,
  tile,
  onOpenDetail,
  selectedProvFeature,
  dataMode,
  analysisGeoJson,
  analysisMetric,
  analysisMetricRange,
  selectedAnalysisArea,
  onSelectAnalysisArea,
  defaultMapView,
  analysisResetCounter,
  potensiOpacity,
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
      center={defaultMapView?.center || [-0.5, 116.5]}
      zoom={defaultMapView?.zoom || 7}
      className="h-full w-full min-w-0 bg-slate-800"
      zoomControl={false}
    >
      <MapResizeHandler />
      <SelectedAreaViewport
        selectedAnalysisArea={selectedAnalysisArea}
        defaultMapView={defaultMapView || { center: [-0.5, 116.5], zoom: 7 }}
        analysisResetCounter={analysisResetCounter}
      />
      <TileLayer attribution={tile?.attr} url={tile?.url} />
      {tile?.labelUrl ? (
        <TileLayer attribution={tile?.labelAttr || tile?.attr} url={tile.labelUrl} pane="overlayPane" />
      ) : null}
      
      <FlyToLocation target={focusLocation} />

      {selectedProvFeature && dataMode !== "wilayah" ? (
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

      {dataMode === "wilayah" ? (
        <AreaLayer
          analysisGeoJson={analysisGeoJson}
          analysisMetric={analysisMetric}
          analysisMetricRange={analysisMetricRange}
          selectedAnalysisArea={selectedAnalysisArea}
          onSelectAnalysisArea={onSelectAnalysisArea}
        />
      ) : (
        <MarkerLayer 
          validData={validData} 
          dataMode={dataMode} 
          onOpenDetail={onOpenDetail} 
          potensiOpacity={potensiOpacity} 
        />
      )}

      <style>{`
        .analysis-area-selected {
          filter: drop-shadow(0 0 8px rgba(248, 250, 252, 0.45))
            drop-shadow(0 0 16px rgba(139, 92, 246, 0.22));
        }

        .analysis-area-muted {
          transition: opacity 180ms ease;
        }

        .analysis-area-popup .leaflet-popup-content-wrapper {
          background: rgba(15, 23, 42, 0.96);
          color: #f8fafc;
          border: 1px solid rgba(167, 139, 250, 0.28);
          box-shadow: 0 18px 40px rgba(15, 23, 42, 0.35);
        }

        .analysis-area-popup .leaflet-popup-tip {
          background: rgba(15, 23, 42, 0.96);
        }

        .analysis-area-popup .leaflet-popup-content {
          margin: 12px 14px;
          font-size: 12px;
          line-height: 1.55;
        }
      `}</style>
    </MapContainer>
  );
}
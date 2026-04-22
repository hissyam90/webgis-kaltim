import { useMemo, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

import Sidebar from "./components/ui/Sidebar";
import MapView from "./components/map/MapView";
import MapControls from "./components/map/MapControls";
import LegendBox from "./components/map/Legend";
import DetailModal from "./components/modals/DetailModal";
import StatsModal from "./components/modals/StatsModal";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";
import { point } from "@turf/helpers";
import { useProvGeojson } from "./hooks/useProvGeojson";
import { useKaltimBoundaries } from "./hooks/useKaltimBoundaries";
import { KALIMANTAN_BBOX } from "./config/kalimantanBbox";
import { PROV_GEO_NAME } from "./config/provGeoName";
import { getColor } from "./utils/getColor";
import { exportPembangkitCsv, exportWilayahAnalysisCsv } from "./utils/exportCsv";
import { formatKategoriOption, getKategoriInfo } from "./utils/kategoriLabel";
import { parseCsv } from "./utils/parseCsv";
import {
  ANALYSIS_METRIC_OPTIONS,
  buildMetricLegend,
  classifyEnergyGroup,
  formatMetricValue,
  normalizeEnergyType,
} from "./utils/analysisHelpers";
import usePembangkit from "./hooks/usePembangkit";
import { useWeather } from "./hooks/useWeather";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import potensiData from "./data/potensi.json";
import potensiHidroLayerCsv from "./data/potensi_hidro_layer.csv?raw";

const POTENSI_LAYER_OPTIONS = [
  {
    id: "potensi-default",
    label: "Potensi Utama",
    description: "Dataset potensi utama yang sudah dipakai saat ini.",
    group: "default",
  },
  {
    id: "potensi-hidro-geoesdm",
    label: "Potensi Hidro (GeoESDM)",
    description: "Layer tambahan hidro dari GeoESDM untuk ditampilkan satu per satu.",
    group: "geoesdm",
  },
];

function getNormalizedKategori(item, mode) {
  const rawKategori = String(item?.jenis ?? "").trim();
  if (!rawKategori) return "Tidak Diketahui";

  return getKategoriInfo(rawKategori, mode).value || "Tidak Diketahui";
}

function getAreaFocusTarget(area) {
  const facility = area?.facilities?.[0];
  if (!facility) return null;

  const latitude = Number(facility.latitude);
  const longitude = Number(facility.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return { latitude, longitude };
}

export default function App() {
  const [dataMode, setDataMode] = useState("generator");
  const [analysisMetric, setAnalysisMetric] = useState("totalFacilities");
  const [selectedProv, setSelectedProv] = useState("Semua");
  const [selectedKategoriList, setSelectedKategoriList] = useState([]);
  const [selectedPotensiLayer, setSelectedPotensiLayer] = useState("potensi-default");
  const [searchText, setSearchText] = useState("");
  const [focusLocation, setFocusLocation] = useState(null);
  const [basemap, setBasemap] = useState("dark");
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [selectedAnalysisAreaId, setSelectedAnalysisAreaId] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const debouncedSearch = useDebouncedValue(searchText, 250);

  const { pembangkit, loading } = usePembangkit();
  const { geojson: kaltimBoundaryGeojson, loading: loadingBoundaries } = useKaltimBoundaries();

  const { weather: weatherData, loading: loadingWeather, error: weatherError } = useWeather(
    selectedDetail?.latitude,
    selectedDetail?.longitude
  );

  const { geo: provGeo } = useProvGeojson();

  const potensiHidroLayerData = useMemo(() => {
    return parseCsv(potensiHidroLayerCsv).map((row, index) => {
      const prediksiMw = Number(row.pot_mw);

      return {
        id: row.dataset_id || row.objectid || `hidro-layer-${index + 1}`,
        nama: row.nama || row.nama_asli || `Potensi Hidro ${index + 1}`,
        jenis: row.jenis || "Hidro",
        region: row.region || row.provinsi || "-",
        lokasi: row.lokasi || row.kecamatan || row.region || "-",
        latitude: Number(row.latitude),
        longitude: Number(row.longitude),
        prediksi_mw: Number.isFinite(prediksiMw) ? prediksiMw : null,
        tahun: null,
        source: "",
        deskripsi_lokasi: row.coord_note
          ? `${row.coord_note}.`
          : "Data GeoESDM tanpa artikel/sumber pendukung yang jelas.",
        potensi_energi_raw: Number.isFinite(prediksiMw)
          ? `Potensi hidro terpetakan sebesar ${row.pot_mw} MW.`
          : "",
        dataset_label: "Potensi Hidro (GeoESDM)",
        dataset_group: "geoesdm",
        kecamatan: row.kecamatan || "",
        klasifikas: row.klasifikas || "",
        tipe: row.tipe || "",
        luas_ha: row.luas_ha || "",
        nama_asli: row.nama_asli || "",
        kode2: row.kode2 || "",
      };
    });
  }, []);

  const activePotensiData = useMemo(() => {
    if (selectedPotensiLayer === "potensi-hidro-geoesdm") {
      return potensiHidroLayerData;
    }

    return potensiData;
  }, [potensiHidroLayerData, selectedPotensiLayer]);

  const selectedProvFeature = useMemo(() => {
    if (!provGeo || selectedProv === "Semua") return null;
    const target = PROV_GEO_NAME[selectedProv];
    if (!target) return null;
    return provGeo.features.find(
      (feature) => String(feature?.properties?.Propinsi || "").toUpperCase() === target
    );
  }, [provGeo, selectedProv]);

  const activeData = useMemo(() => {
    if (dataMode === "potensi") return activePotensiData;
    return pembangkit;
  }, [activePotensiData, dataMode, pembangkit]);

  const listKategori = useMemo(() => {
    if (dataMode === "wilayah") return ["Semua"];

    const values = [...new Set(activeData.map((item) => getNormalizedKategori(item, dataMode)))];
    values.sort((a, b) =>
      formatKategoriOption(a, dataMode).localeCompare(formatKategoriOption(b, dataMode), "id")
    );
    return ["Semua", ...values];
  }, [activeData, dataMode]);

  const validSelectedKategori = useMemo(() => {
    return selectedKategoriList.filter((kategori) => listKategori.includes(kategori));
  }, [listKategori, selectedKategoriList]);

  const filteredData = useMemo(() => {
    if (dataMode === "wilayah") return [];

    const query = debouncedSearch.trim().toLowerCase();
    const needProvFilter = selectedProv !== "Semua" && selectedProvFeature;

    return activeData.filter((item) => {
      const normalizedKategori = getNormalizedKategori(item, dataMode);
      const matchKategori =
        validSelectedKategori.length === 0 || validSelectedKategori.includes(normalizedKategori);

      const name = (item.nama || "").toLowerCase();
      const region = (item.region || "").toLowerCase();
      const lokasi = (item.lokasi || "").toLowerCase();
      const matchSearch =
        !query || name.includes(query) || region.includes(query) || lokasi.includes(query);

      if (!needProvFilter) return matchKategori && matchSearch;

      const lon = Number(item.longitude);
      const lat = Number(item.latitude);
      if (!Number.isFinite(lon) || !Number.isFinite(lat)) return false;

      const inside = booleanPointInPolygon(point([lon, lat]), selectedProvFeature);
      return matchKategori && matchSearch && inside;
    });
  }, [activeData, dataMode, validSelectedKategori, debouncedSearch, selectedProv, selectedProvFeature]);

  const generatorAnalysisAreas = useMemo(() => {
    if (!kaltimBoundaryGeojson?.features?.length) return [];

    const validFacilities = pembangkit.filter((item) => {
      const lon = Number(item.longitude);
      const lat = Number(item.latitude);

      return (
        Number.isFinite(lon) &&
        Number.isFinite(lat) &&
        lat >= -90 &&
        lat <= 90 &&
        lon >= -180 &&
        lon <= 180
      );
    });

    return kaltimBoundaryGeojson.features.map((feature) => {
      const facilities = validFacilities.filter((item) =>
        booleanPointInPolygon(point([Number(item.longitude), Number(item.latitude)]), feature)
      );

      const typeCounts = facilities.reduce((acc, item) => {
        const key = normalizeEnergyType(item.jenis) || "Tidak Diketahui";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const dominantTypeEntry =
        Object.entries(typeCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "id"))[0] ||
        null;

      const renewableFacilities = facilities.filter(
        (item) => classifyEnergyGroup(item.jenis) === "renewable"
      ).length;
      const nonRenewableFacilities = facilities.filter(
        (item) => classifyEnergyGroup(item.jenis) === "non_renewable"
      ).length;
      const totalFacilities = facilities.length;

      return {
        id: feature.properties.areaId,
        name: feature.properties.areaName,
        type: feature.properties.areaType,
        label: feature.properties.areaLabel,
        feature,
        facilities,
        totalFacilities,
        renewableFacilities,
        nonRenewableFacilities,
        renewableShare: totalFacilities ? (renewableFacilities / totalFacilities) * 100 : 0,
        hasData: totalFacilities > 0,
        dominantType: dominantTypeEntry?.[0] || "",
        dominantTypeCount: dominantTypeEntry?.[1] || 0,
        dominantTypeLabel: dominantTypeEntry?.[0] || "Tidak ada data",
      };
    });
  }, [kaltimBoundaryGeojson, pembangkit]);

  const filteredAnalysisAreas = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();

    return [...generatorAnalysisAreas]
      .filter((area) => {
        if (!query) return true;

        return (
          area.name.toLowerCase().includes(query) ||
          area.type.toLowerCase().includes(query) ||
          area.dominantTypeLabel.toLowerCase().includes(query)
        );
      })
      .sort((a, b) => {
        if (analysisMetric === "dominantType") {
          return b.dominantTypeCount - a.dominantTypeCount || a.name.localeCompare(b.name, "id");
        }

        return (b[analysisMetric] || 0) - (a[analysisMetric] || 0) || a.name.localeCompare(b.name, "id");
      });
  }, [generatorAnalysisAreas, debouncedSearch, analysisMetric]);

  const selectedAnalysisArea = useMemo(() => {
    if (!filteredAnalysisAreas.length) return null;

    if (selectedAnalysisAreaId) {
      return (
        filteredAnalysisAreas.find((area) => area.id === selectedAnalysisAreaId) ||
        generatorAnalysisAreas.find((area) => area.id === selectedAnalysisAreaId) ||
        null
      );
    }

    return filteredAnalysisAreas[0];
  }, [filteredAnalysisAreas, generatorAnalysisAreas, selectedAnalysisAreaId]);

  const analysisGeoJson = useMemo(() => {
    if (!kaltimBoundaryGeojson?.features?.length) return null;

    const areaMap = new Map(generatorAnalysisAreas.map((area) => [area.id, area]));

    return {
      type: "FeatureCollection",
      features: kaltimBoundaryGeojson.features.map((feature) => ({
        ...feature,
        properties: {
          ...feature.properties,
          analysis: areaMap.get(feature.properties.areaId) || null,
        },
      })),
    };
  }, [generatorAnalysisAreas, kaltimBoundaryGeojson]);

  const analysisMetricRange = useMemo(() => {
    const values = filteredAnalysisAreas.map((area) =>
      analysisMetric === "dominantType" ? area.dominantTypeCount : Number(area[analysisMetric]) || 0
    );

    if (!values.length) {
      return { min: 0, max: 0 };
    }

    return {
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }, [filteredAnalysisAreas, analysisMetric]);

  const analysisLegend = useMemo(
    () => buildMetricLegend(filteredAnalysisAreas, analysisMetric),
    [filteredAnalysisAreas, analysisMetric]
  );

  const wilayahInsights = useMemo(() => {
    if (!generatorAnalysisAreas.length) {
      return null;
    }

    const withData = generatorAnalysisAreas.filter((area) => area.hasData);
    const noDataCount = generatorAnalysisAreas.length - withData.length;

    if (!withData.length) {
      return {
        totalAreas: generatorAnalysisAreas.length,
        noDataCount,
        topFacilityArea: null,
        topRenewableShareArea: null,
        dominantCoverage: "Belum ada fasilitas terdeteksi",
      };
    }

    const topFacilityArea = [...withData].sort(
      (a, b) => b.totalFacilities - a.totalFacilities || a.name.localeCompare(b.name, "id")
    )[0];

    const topRenewableShareArea = [...withData].sort(
      (a, b) => b.renewableShare - a.renewableShare || b.renewableFacilities - a.renewableFacilities
    )[0];

    const dominantCounts = withData.reduce((acc, area) => {
      const key = area.dominantTypeLabel || "Tidak ada data";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const dominantCoverage = Object.entries(dominantCounts).sort((a, b) => b[1] - a[1])[0];

    return {
      totalAreas: generatorAnalysisAreas.length,
      noDataCount,
      topFacilityArea,
      topRenewableShareArea,
      dominantCoverage: dominantCoverage
        ? `${dominantCoverage[0]} mendominasi ${dominantCoverage[1]} wilayah`
        : "Belum ada pola dominan",
    };
  }, [generatorAnalysisAreas]);

  const selectedKategoriValue =
    validSelectedKategori.length === 1 ? validSelectedKategori[0] : "Semua";

  const handleSelectKategori = (kategori) => {
    if (kategori === "Semua") {
      setSelectedKategoriList([]);
      return;
    }

    if (!listKategori.includes(kategori)) {
      setSelectedKategoriList([]);
      return;
    }

    setSelectedKategoriList([kategori]);
  };

  const handleToggleKategori = (kategori) => {
    if (!kategori || kategori === "Semua") {
      setSelectedKategoriList([]);
      return;
    }

    setSelectedKategoriList((prev) =>
      prev.includes(kategori)
        ? prev.filter((item) => item !== kategori)
        : [...prev, kategori]
    );
  };

  const countsByKategori = useMemo(() => {
    if (dataMode === "wilayah") return {};

    return activeData.reduce((acc, item) => {
      const key = getNormalizedKategori(item, dataMode);
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [activeData, dataMode]);

  const chartData = useMemo(() => {
    if (dataMode === "wilayah") {
      const stats = generatorAnalysisAreas.reduce((acc, area) => {
        const key = area.dominantType || "Tidak Diketahui";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      return {
        labels: Object.keys(stats),
        datasets: [
          {
            label: "Jumlah Wilayah",
            data: Object.values(stats),
            backgroundColor: Object.keys(stats).map((key) =>
              key === "Tidak Diketahui" ? "#64748b" : getColor(key)
            ),
            borderColor: "#1e293b",
            borderWidth: 2,
          },
        ],
      };
    }

    const stats = {};
    activeData.forEach((item) => {
      const key = getNormalizedKategori(item, dataMode);
      stats[key] = (stats[key] || 0) + 1;
    });

    return {
      labels: Object.keys(stats),
      datasets: [
        {
          label: "Jumlah Unit",
          data: Object.values(stats),
          backgroundColor: Object.keys(stats).map((key) => getColor(key)),
          borderColor: "#1e293b",
          borderWidth: 2,
        },
      ],
    };
  }, [activeData, dataMode, generatorAnalysisAreas]);

  const tile = useMemo(() => {
    switch (basemap) {
      case "satellite":
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          labelUrl:
            "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
          attr: "Tiles © Esri",
          labelAttr: "Labels © Esri",
        };
      case "osm":
        return {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attr: "© OpenStreetMap",
        };
      case "dark":
      default:
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
          labelUrl:
            "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}",
          attr: "Basemap © Esri, HERE, Garmin, FAO, NOAA, USGS",
          labelAttr: "Labels © Esri",
        };
    }
  }, [basemap]);

  const handleSelectDataMode = (mode) => {
    setDataMode(mode);
    setSearchText("");
    setFocusLocation(null);
    setSelectedDetail(null);

    if (mode !== "wilayah") {
      setSelectedAnalysisAreaId(null);
    }
  };

  const handleSelectAnalysisArea = (area) => {
    setSelectedAnalysisAreaId(area.id);
    setFocusLocation(getAreaFocusTarget(area));
  };

  const handleOpenDetail = (item) => {
    setSelectedDetail(item);
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) return alert("Browser tidak support GPS");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const myLoc = { latitude, longitude };
        setUserLocation(myLoc);
        setFocusLocation(myLoc);
      },
      (error) => alert("Gagal mendeteksi lokasi: " + error.message)
    );
  };

  const handleExport = () => {
    if (dataMode === "wilayah") {
      const activeMetric =
        ANALYSIS_METRIC_OPTIONS.find((option) => option.value === analysisMetric)?.label || analysisMetric;

      exportWilayahAnalysisCsv({
        analysisAreas: filteredAnalysisAreas,
        metricLabel: activeMetric,
      });
      return;
    }

    const kategoriLabel =
      selectedKategoriList.length === 0 ? "Semua" : selectedKategoriList.join("-");

    exportPembangkitCsv({
      filteredData,
      selectedKategori: kategoriLabel,
      selectedProv,
    });
  };

  if (loading && dataMode !== "potensi") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        <p className="animate-pulse text-sm font-medium">Memuat Data Generator...</p>
      </div>
    );
  }

  if (loadingBoundaries && dataMode === "wilayah") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent" />
        <p className="animate-pulse text-sm font-medium">Memuat Boundary Kabupaten/Kota Kaltim...</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-gray-900 font-sans">
      <Sidebar
        dataMode={dataMode}
        setDataMode={handleSelectDataMode}
        KALIMANTAN_PROV_BBOX={KALIMANTAN_BBOX}
        selectedProv={selectedProv}
        onSelectProv={setSelectedProv}
        selectedKategori={selectedKategoriValue}
        setSelectedKategori={handleSelectKategori}
        listKategori={listKategori}
        searchText={searchText}
        setSearchText={setSearchText}
        filteredData={filteredData}
        onFocus={(item) => setFocusLocation(item)}
        onShowStats={() => setShowStats(true)}
        onExport={handleExport}
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        analysisMetric={analysisMetric}
        setAnalysisMetric={setAnalysisMetric}
        analysisMetricOptions={ANALYSIS_METRIC_OPTIONS}
        analysisAreas={filteredAnalysisAreas}
        selectedAnalysisArea={selectedAnalysisArea}
        onSelectAnalysisArea={handleSelectAnalysisArea}
        wilayahInsights={wilayahInsights}
        metricLabel={formatMetricValue(selectedAnalysisArea, analysisMetric)}
      />

      <div className="relative z-0 h-full min-w-0 flex-1 transition-all duration-300">
        <MapView
          tile={tile}
          filteredData={filteredData}
          userLocation={userLocation}
          focusLocation={focusLocation}
          onOpenDetail={handleOpenDetail}
          selectedProvFeature={selectedProvFeature}
          dataMode={dataMode}
          analysisGeoJson={analysisGeoJson}
          analysisMetric={analysisMetric}
          analysisMetricRange={analysisMetricRange}
          selectedAnalysisArea={selectedAnalysisArea}
          onSelectAnalysisArea={handleSelectAnalysisArea}
        />

        <MapControls
          basemap={basemap}
          setBasemap={setBasemap}
          onLocateMe={handleLocateMe}
          dataMode={dataMode}
          selectedPotensiLayer={selectedPotensiLayer}
          onSelectPotensiLayer={setSelectedPotensiLayer}
          potensiLayers={POTENSI_LAYER_OPTIONS}
        />

        <LegendBox
          listKategori={listKategori}
          selectedKategori={validSelectedKategori}
          onSelectKategori={handleToggleKategori}
          onResetKategori={() => setSelectedKategoriList([])}
          countsByKategori={countsByKategori}
          dataMode={dataMode}
          analysisLegend={analysisLegend}
        />
      </div>

      <DetailModal
        selectedDetail={selectedDetail}
        onClose={() => setSelectedDetail(null)}
        weatherData={weatherData}
        loadingWeather={loadingWeather}
        weatherError={weatherError}
        dataMode={dataMode}
      />

      <StatsModal
        showStats={showStats}
        onClose={() => setShowStats(false)}
        chartData={chartData}
        dataMode={dataMode}
      />
    </div>
  );
}

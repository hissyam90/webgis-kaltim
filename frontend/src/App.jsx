import { useEffect, useMemo, useState } from "react";
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
import { KALIMANTAN_BBOX, bboxToParams } from "./config/kalimantanBbox";
import { PROV_GEO_NAME } from "./config/provGeoName";
import { getColor } from "./utils/getColor";
import { exportPembangkitCsv } from "./utils/exportCsv";
import { formatKategoriOption } from "./utils/kategoriLabel";
import usePembangkit from "./hooks/usePembangkit";
import { useWeather } from "./hooks/useWeather";
import { useDebouncedValue } from "./hooks/useDebouncedValue";
import potensiData from "./data/potensi.json";

export default function App() {
  const [dataMode, setDataMode] = useState("generator");
  const [selectedProv, setSelectedProv] = useState("Semua");
  const [bbox, setBbox] = useState(bboxToParams(KALIMANTAN_BBOX.Semua));
  const [selectedKategoriList, setSelectedKategoriList] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [focusLocation, setFocusLocation] = useState(null);
  const [basemap, setBasemap] = useState("dark");
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const debouncedSearch = useDebouncedValue(searchText, 250);

  const { pembangkit, loading } = usePembangkit();

  const { weather: weatherData, loading: loadingWeather, error: weatherError } = useWeather(
    selectedDetail?.latitude,
    selectedDetail?.longitude
  );

  const { geo: provGeo } = useProvGeojson();

  const selectedProvFeature = useMemo(() => {
    if (!provGeo || selectedProv === "Semua") return null;
    const target = PROV_GEO_NAME[selectedProv];
    if (!target) return null;
    return provGeo.features.find(
      (feature) => String(feature?.properties?.Propinsi || "").toUpperCase() === target
    );
  }, [provGeo, selectedProv]);

  const activeData = useMemo(() => {
    return dataMode === "potensi" ? potensiData : pembangkit;
  }, [dataMode, pembangkit]);

  const filteredData = useMemo(() => {
    const query = debouncedSearch.trim().toLowerCase();
    const needProvFilter = selectedProv !== "Semua" && selectedProvFeature;

    return activeData.filter((item) => {
      const matchKategori =
        selectedKategoriList.length === 0 || selectedKategoriList.includes(item.jenis);

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
  }, [activeData, selectedKategoriList, debouncedSearch, selectedProv, selectedProvFeature]);

  const listKategori = useMemo(() => {
    const values = [...new Set(activeData.map((item) => item.jenis).filter(Boolean))];
    values.sort((a, b) =>
      formatKategoriOption(a, dataMode).localeCompare(formatKategoriOption(b, dataMode), "id")
    );
    return ["Semua", ...values];
  }, [activeData, dataMode]);

  useEffect(() => {
    setSelectedKategoriList((prev) =>
      prev.filter((kategori) => listKategori.includes(kategori))
    );
  }, [listKategori]);

  const selectedKategoriValue = selectedKategoriList.length === 1 ? selectedKategoriList[0] : "Semua";

  const handleSelectKategori = (kategori) => {
    if (kategori === "Semua") {
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
    return activeData.reduce((acc, item) => {
      const key = item.jenis;
      if (!key) return acc;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
  }, [activeData]);

  const chartData = useMemo(() => {
    const stats = {};
    activeData.forEach((item) => {
      const key = item.jenis || "Tidak Diketahui";
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
  }, [activeData]);

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

  const onSelectProv = (prov) => {
    setSelectedProv(prov);
    setBbox(bboxToParams(KALIMANTAN_BBOX[prov]));
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
    const kategoriLabel =
      selectedKategoriList.length === 0 ? "Semua" : selectedKategoriList.join("-");

    exportPembangkitCsv({
      filteredData,
      selectedKategori: kategoriLabel,
      selectedProv,
    });
  };

  if (loading && dataMode === "generator") {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-slate-900 text-white">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
        <p className="animate-pulse text-sm font-medium">Memuat Data Generator...</p>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen w-screen overflow-hidden bg-gray-900 font-sans">
      <Sidebar
        dataMode={dataMode}
        setDataMode={setDataMode}
        KALIMANTAN_PROV_BBOX={KALIMANTAN_BBOX}
        selectedProv={selectedProv}
        onSelectProv={onSelectProv}
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
        />

        <MapControls basemap={basemap} setBasemap={setBasemap} onLocateMe={handleLocateMe} />
        <LegendBox
          listKategori={listKategori}
          selectedKategori={selectedKategoriList}
          onSelectKategori={handleToggleKategori}
          onResetKategori={() => setSelectedKategoriList([])}
          countsByKategori={countsByKategori}
          dataMode={dataMode}
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

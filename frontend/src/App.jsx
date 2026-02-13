import { useMemo, useState } from "react";

// Chart Library (register once here)
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

import usePembangkit from './hooks/usePembangkit';
import { useWeather } from "./hooks/useWeather";

export default function App() {
  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  const [selectedProv, setSelectedProv] = useState("Semua");
  const [bbox, setBbox] = useState(bboxToParams(KALIMANTAN_BBOX.Semua));

  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [searchText, setSearchText] = useState("");
  const [focusLocation, setFocusLocation] = useState(null);
  const [basemap, setBasemap] = useState("dark");
  const [userLocation, setUserLocation] = useState(null);

  const [selectedDetail, setSelectedDetail] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { pembangkit, loading } = usePembangkit(API_BASE, bbox);
  const { weatherData, loadingWeather } = useWeather(selectedDetail);

  const { geo: provGeo } = useProvGeojson();

  const selectedProvFeature = useMemo(() => {
    if (!provGeo || selectedProv === "Semua") return null;

    const target = PROV_GEO_NAME[selectedProv];
    if (!target) return null;

    return provGeo.features.find(
      (f) => String(f?.properties?.Propinsi || "").toUpperCase() === target
    );
  }, [provGeo, selectedProv]);

 const filteredData = useMemo(() => {
  return pembangkit.filter((item) => {
    const matchKategori = selectedKategori === "Semua" || item.jenis === selectedKategori;

    const query = searchText.toLowerCase();
    const matchSearch =
      (item.nama || "").toLowerCase().includes(query) ||
      (item.region || "").toLowerCase().includes(query);

    const matchProv =
      selectedProv === "Semua" ||
      (selectedProvFeature &&
        booleanPointInPolygon(
          point([Number(item.longitude), Number(item.latitude)]),
          selectedProvFeature
        ));

    return matchKategori && matchSearch && matchProv;
  });
}, [pembangkit, selectedKategori, searchText, selectedProv, selectedProvFeature]);


  const listKategori = useMemo(() => {
    const setJenis = new Set(pembangkit.map((item) => item.jenis).filter(Boolean));
    return ["Semua", ...setJenis];
  }, [pembangkit]);

  const chartData = useMemo(() => {
    const stats = {};
    pembangkit.forEach((item) => {
      const key = item.jenis || "Tidak Diketahui";
      stats[key] = (stats[key] || 0) + 1;
    });
    return {
      labels: Object.keys(stats),
      datasets: [
        {
          label: "Jumlah Unit",
          data: Object.values(stats),
          backgroundColor: Object.keys(stats).map((k) => getColor(k)),
          borderColor: "#1e293b",
          borderWidth: 2,
        },
      ],
    };
  }, [pembangkit]);

  const tile = useMemo(() => {
    switch (basemap) {
      case "satellite":
        return {
          url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          attr: "Tiles © Esri",
        };
      case "osm":
        return {
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          attr: "© OpenStreetMap",
        };
      case "dark":
      default:
        return {
          url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
          attr: "© CartoDB Dark Matter",
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
    exportPembangkitCsv({ filteredData, selectedKategori });
  };

  if (loading) {
    return (
      <div className="bg-gray-900 h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-gray-900 font-sans overflow-hidden relative">
      <Sidebar
        KALIMANTAN_PROV_BBOX={KALIMANTAN_BBOX}
        selectedProv={selectedProv}
        onSelectProv={onSelectProv}
        selectedKategori={selectedKategori}
        setSelectedKategori={setSelectedKategori}
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

      <div className="flex-1 h-full relative z-0">
        <MapView
          tile={tile}
          filteredData={filteredData}
          userLocation={userLocation}
          focusLocation={focusLocation}
          onOpenDetail={handleOpenDetail}
          selectedProvFeature={selectedProvFeature}
        />

        <MapControls basemap={basemap} setBasemap={setBasemap} onLocateMe={handleLocateMe} />
        <LegendBox />
      </div>

      <DetailModal
        selectedDetail={selectedDetail}
        onClose={() => setSelectedDetail(null)}
        weatherData={weatherData}
        loadingWeather={loadingWeather}
      />

      <StatsModal showStats={showStats} onClose={() => setShowStats(false)} chartData={chartData} />
    </div>
  );
}

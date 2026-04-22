import { getColor } from "./getColor";
import { getKategoriInfo } from "./kategoriLabel";

export const ANALYSIS_METRIC_OPTIONS = [
  {
    value: "totalFacilities",
    label: "Total Fasilitas",
    description: "Jumlah seluruh fasilitas pembangkit per kabupaten/kota.",
  },
  {
    value: "renewableFacilities",
    label: "Renewable",
    description: "Jumlah fasilitas energi terbarukan per wilayah.",
  },
  {
    value: "nonRenewableFacilities",
    label: "Non-Renewable",
    description: "Jumlah fasilitas non-terbarukan per wilayah.",
  },
  {
    value: "renewableShare",
    label: "Renewable Share",
    description: "Persentase fasilitas renewable dibanding total fasilitas.",
  },
  {
    value: "dominantType",
    label: "Jenis Dominan",
    description: "Jenis pembangkit dengan jumlah fasilitas terbanyak di wilayah.",
  },
];

const RENEWABLE_TYPES = new Set(["PLTS", "PLTA", "PLTMH", "PLTBg", "PLTBm"]);
const NON_RENEWABLE_TYPES = new Set(["PLTD", "PLTU", "PLTG", "PLTMG", "PLTGU", "STEAM"]);

export function normalizeEnergyType(jenis = "") {
  const cleaned = String(jenis).trim().toUpperCase();

  if (!cleaned) return "";
  if (cleaned.includes("PLTMH")) return "PLTMH";
  if (cleaned.includes("PLTMG")) return "PLTMG";
  if (cleaned.includes("PLTGU")) return "PLTGU";
  if (cleaned.includes("PLTBG")) return "PLTBg";
  if (cleaned.includes("PLTBM")) return "PLTBm";
  if (cleaned.includes("PLTS")) return "PLTS";
  if (cleaned.includes("PLTA")) return "PLTA";
  if (cleaned.includes("PLTD")) return "PLTD";
  if (cleaned.includes("PLTU")) return "PLTU";
  if (cleaned.includes("PLTG")) return "PLTG";
  if (cleaned.includes("STEAM")) return "STEAM";

  return cleaned;
}

export function classifyEnergyGroup(jenis = "") {
  const normalized = normalizeEnergyType(jenis);

  if (RENEWABLE_TYPES.has(normalized)) return "renewable";
  if (NON_RENEWABLE_TYPES.has(normalized)) return "non_renewable";
  return "other";
}

export function getMetricCaption(metric) {
  switch (metric) {
    case "renewableFacilities":
      return "Fasilitas renewable";
    case "nonRenewableFacilities":
      return "Fasilitas non-renewable";
    case "renewableShare":
      return "Share renewable";
    case "dominantType":
      return "Jenis dominan";
    case "totalFacilities":
    default:
      return "Total fasilitas";
  }
}

export function formatMetricValue(area, metric) {
  if (!area) return "-";

  if (metric === "renewableShare") {
    return `${area.renewableShare.toFixed(1)}%`;
  }

  if (metric === "dominantType") {
    return area.dominantTypeLabel || "Tidak ada data";
  }

  return `${area[metric] ?? 0}`;
}

function hexToRgb(hex) {
  const cleaned = hex.replace("#", "");
  return cleaned.match(/\w\w/g)?.map((value) => parseInt(value, 16)) || [15, 23, 42];
}

function interpolateColor(from, to, ratio) {
  const start = hexToRgb(from);
  const end = hexToRgb(to);
  const safeRatio = Math.max(0, Math.min(1, ratio));

  const mixed = start.map((channel, index) =>
    Math.round(channel + (end[index] - channel) * safeRatio)
  );

  return `#${mixed.map((value) => value.toString(16).padStart(2, "0")).join("")}`;
}

export function getAreaFillColor(area, metric, range) {
  if (!area) return "#334155";

  if (metric === "dominantType") {
    return area.dominantType ? getColor(area.dominantType) : "#475569";
  }

  const min = range?.min ?? 0;
  const max = range?.max ?? 0;
  const value = Number(area[metric]) || 0;
  const ratio = max === min ? (value > 0 ? 1 : 0) : (value - min) / (max - min);

  if (metric === "renewableShare") {
    return interpolateColor("#0f172a", "#22c55e", ratio);
  }

  return interpolateColor("#0f172a", "#14b8a6", ratio);
}

export function buildMetricLegend(areas, metric) {
  if (!areas?.length) {
    return { title: "Legenda Wilayah", items: [] };
  }

  if (metric === "dominantType") {
    const counts = areas.reduce((acc, area) => {
      const key = area.dominantType || "Tidak Diketahui";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return {
      title: "Jenis Dominan",
      items: Object.entries(counts).map(([key, count]) => ({
        label: getKategoriInfo(key).shortLabel,
        color: key === "Tidak Diketahui" ? "#64748b" : getColor(key),
        value: `${count} wilayah`,
      })),
    };
  }

  const values = areas.map((area) => Number(area[metric]) || 0);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const stepCount = 4;

  return {
    title: getMetricCaption(metric),
    items: Array.from({ length: stepCount }, (_, index) => {
      const ratio = stepCount === 1 ? 1 : index / (stepCount - 1);
      const value = min + (max - min) * ratio;

      return {
        label: metric === "renewableShare" ? `${value.toFixed(0)}%` : `${Math.round(value)}`,
        color: getAreaFillColor({ [metric]: value }, metric, { min, max }),
        value: index === 0 ? "rendah" : index === stepCount - 1 ? "tinggi" : "",
      };
    }),
  };
}

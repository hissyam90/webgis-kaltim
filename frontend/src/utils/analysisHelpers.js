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
    if (!area.hasData) return "Tidak ada data";
    if (!area.dominantType) return `${area.dominantTypeLabel || "Belum ada dominasi"} (${area.dominantTypeCount || 0})`;
    return `${area.dominantTypeLabel} (${area.dominantTypeCount || 0})`;
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
  if (!area.hasData) return "#1f2937";

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

  const noDataCount = areas.filter((area) => !area.hasData).length;

  if (metric === "dominantType") {
    const counts = areas.filter((area) => area.hasData).reduce((acc, area) => {
      const key = area.dominantType || "Belum ada dominasi";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return {
      title: "Jenis Dominan",
      items: [
        ...Object.entries(counts).map(([key, count]) => ({
          label: key === "Belum ada dominasi" ? key : getKategoriInfo(key).shortLabel,
          color: key === "Belum ada dominasi" ? "#475569" : getColor(key),
          value: `${count} wilayah`,
        })),
        ...(noDataCount > 0
          ? [
              {
                label: "No Data",
                color: "#1f2937",
                value: `${noDataCount} wilayah`,
              },
            ]
          : []),
      ],
    };
  }

  const areasWithData = areas.filter((area) => area.hasData);
  const values = areasWithData.map((area) => Number(area[metric]) || 0);
  const min = values.length ? Math.min(...values) : 0;
  const max = values.length ? Math.max(...values) : 0;
  const stepCount = 4;
  const formatLegendNumber = (value) => {
    if (metric === "renewableShare") {
      return `${value.toFixed(0)}%`;
    }

    if (Math.abs(value) >= 100 || Number.isInteger(value)) {
      return `${Math.round(value)}`;
    }

    return `${value.toFixed(1)}`;
  };

  return {
    title: getMetricCaption(metric),
    items: [
      ...Array.from({ length: stepCount }, (_, index) => {
        const startRatio = stepCount === 1 ? 0 : index / stepCount;
        const endRatio = stepCount === 1 ? 1 : (index + 1) / stepCount;
        const startValue = min + (max - min) * startRatio;
        const endValue = min + (max - min) * endRatio;
        const isFirst = index === 0;
        const isLast = index === stepCount - 1;
        const label =
          max === min
            ? formatLegendNumber(min)
            : `${formatLegendNumber(startValue)}-${formatLegendNumber(endValue)}`;

        return {
          label,
          color: getAreaFillColor(
            { [metric]: (startValue + endValue) / 2, hasData: true },
            metric,
            { min, max }
          ),
          value: isFirst ? "rendah" : isLast ? "tinggi" : "",
        };
      }),
      ...(noDataCount > 0
        ? [
            {
              label: "No Data",
              color: "#1f2937",
              value: `${noDataCount} wilayah`,
            },
          ]
        : []),
    ],
  };
}

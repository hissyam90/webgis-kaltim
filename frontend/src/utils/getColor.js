export function getColor(jenis) {
  if (!jenis) return "#3388ff";
  const j = jenis.toLowerCase();
  if (j.includes("plts")) return "#facc15";
  if (j.includes("pltd")) return "#ef4444";
  if (j.includes("pltu")) return "#9ca3af";
  if (j.includes("pltmh") || j.includes("pltair") || j.includes("plta")) return "#3b82f6";
  if (j.includes("pltb")) return "#10b981";
  return "#d946ef";
}

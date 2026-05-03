export function getColor(jenis) {
  if (!jenis) return "#3388ff";

  const j = jenis.toLowerCase();

  // Existing generator labels
  if (j.includes("plts") || j.includes("surya")) return "#facc15";
  if (j.includes("pltd")) return "#ef4444";
  if (j.includes("pltu")) return "#9ca3af";
  if (
    j.includes("pltmh") ||
    j.includes("pltair") ||
    j.includes("plta") ||
    j.includes("hidro") ||
    j.includes("mikrohidro")
  ) return "#3b82f6";
  if (j.includes("pltb") || j.includes("angin") || j.includes("bayu")) return "#10b981";
  if (j.includes("biomassa")) return "#f97316";
  if (j.includes("waste") || j.includes("sampah")) return "#a855f7";

  return "#d946ef";
}
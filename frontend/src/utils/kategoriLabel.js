export const KATEGORI_INFO = {
  PLTD: { label: "Pembangkit Listrik Tenaga Diesel", energi: "Diesel" },
  PLTU: { label: "Pembangkit Listrik Tenaga Uap", energi: "Uap" },
  PLTS: { label: "Pembangkit Listrik Tenaga Surya", energi: "Surya" },
  PLTA: { label: "Pembangkit Listrik Tenaga Air", energi: "Air" },
  PLTMH: { label: "Pembangkit Listrik Tenaga Mikrohidro", energi: "Mikrohidro" },
  PLTG: { label: "Pembangkit Listrik Tenaga Gas", energi: "Gas" },
  PLTGU: { label: "Pembangkit Listrik Tenaga Gas & Uap", energi: "Gas & Uap" },
  PLTBg: { label: "Pembangkit Listrik Tenaga Biogas", energi: "Biogas" },
  PLTBm: { label: "Pembangkit Listrik Tenaga Biomassa", energi: "Biomassa" },
  PLTMG: { label: "Pembangkit Listrik Tenaga Mesin Gas", energi: "Mesin Gas" },
};

export function formatKategoriOption(kat) {
  if (kat === "Semua") return "Semua";
  const info = KATEGORI_INFO[kat];
  if (!info) return kat; 
  return `${kat} — ${info.energi}`;
}

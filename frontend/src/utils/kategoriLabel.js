export const GENERATOR_KATEGORI_INFO = {
  PLTD: {
    label: "Pembangkit Listrik Tenaga Diesel",
    shortLabel: "Diesel",
    secondaryLabel: "Pembangkit diesel",
  },
  PLTU: {
    label: "Pembangkit Listrik Tenaga Uap",
    shortLabel: "Uap",
    secondaryLabel: "Pembangkit uap",
  },
  PLTS: {
    label: "Pembangkit Listrik Tenaga Surya",
    shortLabel: "Surya",
    secondaryLabel: "Energi surya",
  },
  PLTA: {
    label: "Pembangkit Listrik Tenaga Air",
    shortLabel: "Air",
    secondaryLabel: "Tenaga air",
  },
  PLTMH: {
    label: "Pembangkit Listrik Tenaga Mikrohidro",
    shortLabel: "Mikrohidro",
    secondaryLabel: "Tenaga mikrohidro",
  },
  PLTG: {
    label: "Pembangkit Listrik Tenaga Gas",
    shortLabel: "Gas",
    secondaryLabel: "Pembangkit gas",
  },
  PLTGU: {
    label: "Pembangkit Listrik Tenaga Gas dan Uap",
    shortLabel: "Gas dan Uap",
    secondaryLabel: "Gabungan gas dan uap",
  },
  PLTBg: {
    label: "Pembangkit Listrik Tenaga Biogas",
    shortLabel: "Biogas",
    secondaryLabel: "Energi biogas",
  },
  PLTBm: {
    label: "Pembangkit Listrik Tenaga Biomassa",
    shortLabel: "Biomassa",
    secondaryLabel: "Energi biomassa",
  },
  PLTMG: {
    label: "Pembangkit Listrik Tenaga Mesin Gas",
    shortLabel: "Mesin Gas",
    secondaryLabel: "Mesin gas",
  },
};

export const POTENSI_KATEGORI_INFO = {
  Surya: {
    label: "Potensi Energi Surya",
    shortLabel: "Surya",
    secondaryLabel: "Sinar matahari",
  },
  Angin: {
    label: "Potensi Energi Angin",
    shortLabel: "Angin",
    secondaryLabel: "Energi bayu",
  },
  Biomassa: {
    label: "Potensi Energi Biomassa",
    shortLabel: "Biomassa",
    secondaryLabel: "Bahan organik",
  },
  Hidro: {
    label: "Potensi Energi Air",
    shortLabel: "Hidro",
    secondaryLabel: "Tenaga air",
  },
  Mikrohidro: {
    label: "Potensi Energi Mikrohidro",
    shortLabel: "Mikrohidro",
    secondaryLabel: "Skala aliran kecil",
  },
  "Waste-to-Energy": {
    label: "Potensi Energi dari Sampah",
    shortLabel: "Sampah",
    secondaryLabel: "Waste-to-Energy",
  },
};

export function getKategoriInfo(kategori, dataMode = "generator") {
  if (!kategori) {
    return {
      value: "",
      label: "Tidak Diketahui",
      shortLabel: "Tidak Diketahui",
      secondaryLabel: "Kategori belum tersedia",
    };
  }

  const source =
    dataMode === "potensi" ? POTENSI_KATEGORI_INFO : GENERATOR_KATEGORI_INFO;
  const info = source[kategori];

  if (!info) {
    return {
      value: kategori,
      label: kategori,
      shortLabel: kategori,
      secondaryLabel: kategori,
    };
  }

  return {
    value: kategori,
    ...info,
  };
}

export function formatKategoriOption(kategori, dataMode = "generator") {
  if (kategori === "Semua") {
    return dataMode === "potensi" ? "Semua Jenis Potensi" : "Semua Jenis Pembangkit";
  }

  const info = getKategoriInfo(kategori, dataMode);

  if (dataMode === "potensi") {
    return info.label;
  }

  if (info.value && info.value !== info.label) {
    return `${info.value} - ${info.shortLabel}`;
  }

  return info.label;
}

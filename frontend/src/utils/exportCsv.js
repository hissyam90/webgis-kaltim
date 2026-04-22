export function exportPembangkitCsv({ filteredData, selectedKategori }) {
  const headers = ["Nama Pembangkit,Jenis,Region,Tahun Operasi,Latitude,Longitude"];
  const rows = filteredData.map((item) => {
    const nama = (item.nama ?? "").replaceAll('"', '""');
    const jenis = (item.jenis ?? "").replaceAll('"', '""');
    const region = (item.region ?? "").replaceAll('"', '""');
    const tahun = (item.tahun_operasi ?? "").toString().replaceAll('"', '""');
    const lat = (item.latitude ?? "").toString();
    const lon = (item.longitude ?? "").toString();
    return `"${nama}","${jenis}","${region}","${tahun}","${lat}","${lon}"`;
  });

  const csvContent = [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `data_pembangkit_${selectedKategori}_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function exportWilayahAnalysisCsv({ analysisAreas, metricLabel }) {
  const headers = [
    "Kabupaten/Kota,Tipe Wilayah,Total Fasilitas,Renewable,Non-Renewable,Renewable Share (%),Jenis Dominan,Jumlah Jenis Dominan,Status Data",
  ];

  const rows = analysisAreas.map((area) => {
    const name = (area.name ?? "").replaceAll('"', '""');
    const type = (area.type ?? "").replaceAll('"', '""');
    const dominantType = (area.dominantTypeLabel ?? "").replaceAll('"', '""');
    const total = area.totalFacilities ?? 0;
    const renewable = area.renewableFacilities ?? 0;
    const nonRenewable = area.nonRenewableFacilities ?? 0;
    const renewableShare = Number(area.renewableShare ?? 0).toFixed(1);
    const dominantTypeCount = area.dominantTypeCount ?? 0;
    const status = area.hasData ? "Ada Data" : "No Data";

    return `"${name}","${type}","${total}","${renewable}","${nonRenewable}","${renewableShare}","${dominantType}","${dominantTypeCount}","${status}"`;
  });

  const csvContent = [headers, ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const safeMetric = String(metricLabel ?? "wilayah")
    .toLowerCase()
    .replaceAll(/\s+/g, "_");

  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `analisis_wilayah_${safeMetric}_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

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

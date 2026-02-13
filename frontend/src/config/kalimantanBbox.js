export const KALIMANTAN_BBOX = {
  Semua: [108.5, -4.5, 119.8, 4.5],
  Kalbar: [108.0, -2.5, 113.5, 2.5],
  Kalteng: [111.0, -3.5, 115.5, 1.5],
  Kalsel: [113.0, -4.5, 116.8, -1.5],
  Kaltim: [115.0, -2.8, 119.8, 2.8],
  Kaltara: [4.4, 114.5, 1.1, 118.0],
};

export const bboxToParams = ([minLon, minLat, maxLon, maxLat]) => ({
  minLat,
  maxLat,
  minLon,
  maxLon,
});

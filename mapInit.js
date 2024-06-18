// mapInit.js
mapboxgl.accessToken =
  "pk.eyJ1IjoiaWduYXNpdGVtcG8iLCJhIjoiY2xzdnV3Ym8yMmZrbjJqbnNsbDFtanc1MSJ9.-BZ28ULcuYnHvpsCeHDYrw";

const map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/ignasitempo/clwqlkmgj012i01ny7pqk6fa6",
  projection: "globe",
  center: [0, 0],
  zoom: 2.0,
  minZoom: 1.0,
  maxZoom: 22,
});

map.addControl(new mapboxgl.NavigationControl(), "bottom-left");

function updateZoomLevels() {
  const width = window.innerWidth;
  const height = window.innerHeight;
  let minZoom;

  if (width < 800 || height < 600) {
    minZoom = 1.0;
    map.setMaxZoom(20);
  } else if (width < 1000) {
    minZoom = 1.5;
    map.setMaxZoom(21);
  } else if (width < 1200) {
    minZoom = 2.0;
    map.setMaxZoom(22);
  } else {
    minZoom = 2.2;
    map.setMaxZoom(22);
  }

  map.setMinZoom(minZoom);
  map.setZoom(minZoom);
}

window.addEventListener("resize", updateZoomLevels);
updateZoomLevels();

export { map, updateZoomLevels };

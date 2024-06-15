// dataFetch.js
import { map } from "./mapInit.js";
import { addGeoJSONLayer } from "./layers.js";

let geojsonData;

function fetchGeoJSONData(url) {
  map.on("load", () => {
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        geojsonData = data;
        addGeoJSONLayer(data);
        applyAllFilters(); // Ensure filters are applied after data is loaded
      })
      .catch((error) => {
        console.error("Error loading GeoJSON:", error);
      });
  });
}

export { fetchGeoJSONData, geojsonData };

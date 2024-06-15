import { map } from "./mapInit.js";
import { showTripDetails } from "./tripDetails.js";

function addGeoJSONLayer(data) {
  function getColor(feature) {
    if (feature.properties.political_reason) return "#E5387A";
    if (feature.properties.environmental_reason) return "#31BCBC";
    if (feature.properties.economic_reason) return "#5058EF";
    if (feature.properties.social_reason) return "#F7960B";
    return "#000";
  }

  data.features.forEach((feature) => {
    feature.properties.color = getColor(feature);
  });

  map.addSource("geojson-source", {
    type: "geojson",
    data: data,
  });

  map.addLayer({
    id: "route",
    type: "line",
    source: "geojson-source",
    layout: {
      "line-join": "round",
      "line-cap": "round",
    },
    paint: {
      "line-color": ["get", "color"],
      "line-width": 2,
    },
  });

  map.addLayer({
    id: "origin-circles",
    type: "circle",
    source: "geojson-source",
    filter: ["==", ["get", "role"], "origin"],
    paint: {
      "circle-radius": 8,
      "circle-color": "transparent",
      "circle-stroke-color": ["get", "color"],
      "circle-stroke-width": 2,
    },
  });

  map.addLayer({
    id: "destination-circles",
    type: "circle",
    source: "geojson-source",
    filter: ["==", ["get", "role"], "destination"],
    paint: {
      "circle-radius": 8,
      "circle-color": ["get", "color"],
    },
  });

  // Add click event listeners for trip components
  map.on("click", "origin-circles", function (e) {
    const properties = e.features[0].properties;
    showTripDetails(properties);
    e.stopPropagation(); // Prevents the map click event from firing
  });

  map.on("click", "destination-circles", function (e) {
    const properties = e.features[0].properties;
    showTripDetails(properties);
    e.stopPropagation();
  });

  map.on("click", "route", function (e) {
    const properties = e.features[0].properties;
    showTripDetails(properties);
    e.stopPropagation();
  });

  // Change cursor to pointer on mouse enter
  map.on("mouseenter", "origin-circles", function () {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseenter", "destination-circles", function () {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseenter", "route", function () {
    map.getCanvas().style.cursor = "pointer";
  });

  // Revert cursor on mouse leave
  map.on("mouseleave", "origin-circles", function () {
    map.getCanvas().style.cursor = "";
  });

  map.on("mouseleave", "destination-circles", function () {
    map.getCanvas().style.cursor = "";
  });

  map.on("mouseleave", "route", function () {
    map.getCanvas().style.cursor = "";
  });
}

export { addGeoJSONLayer };

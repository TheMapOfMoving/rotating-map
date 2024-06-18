// autocomplete.js
import { map } from "./mapInit.js";
import { geojsonData } from "./dataFetch.js";
import { applyAllFilters } from "./filters.js";

function initAutocomplete() {
  const originInput = document.getElementById("origin");
  const destinationInput = document.getElementById("destination");

  const originAutocomplete = new google.maps.places.Autocomplete(originInput);
  const destinationAutocomplete = new google.maps.places.Autocomplete(
    destinationInput
  );

  originAutocomplete.addListener("place_changed", () => {
    const place = originAutocomplete.getPlace();
    handlePlaceSelect(place, "origin");
  });

  destinationAutocomplete.addListener("place_changed", () => {
    const place = destinationAutocomplete.getPlace();
    handlePlaceSelect(place, "destination");
  });

  originInput.addEventListener("input", () => {
    if (!originInput.value) {
      applyAllFilters();
    }
  });

  destinationInput.addEventListener("input", () => {
    if (!destinationInput.value) {
      applyAllFilters();
    }
  });

  const observer = new MutationObserver(() => {
    const pacContainers = document.querySelectorAll(".pac-container");
    pacContainers.forEach((container) => {
      container.style.fontFamily = "Inter, sans-serif";
      const icons = container.querySelectorAll(".pac-icon");
      icons.forEach((icon) => {
        icon.style.display = "none";
      });
      const googleLogo = container.querySelector(".pac-footer, .pac-logo");
      if (googleLogo) {
        googleLogo.style.display = "none";
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function handlePlaceSelect(place, type) {
  if (!place.geometry || !place.geometry.viewport) {
    console.error("No geometry or viewport found for place:", place);
    return;
  }
  const bounds = place.geometry.viewport;
  const sw = bounds.getSouthWest();
  const ne = bounds.getNorthEast();
  const bbox = [
    [sw.lng(), sw.lat()],
    [ne.lng(), ne.lat()],
  ];

  console.log(`Filtering ${type} with bounding box:`, bbox); // Debugging log
  filterGeoJSONByBBox(bbox, type);
}

function filterGeoJSONByBBox(bbox, type) {
  if (!geojsonData || !geojsonData.features) {
    console.error("Invalid geojsonData structure", geojsonData);
    return;
  }

  const matchedFeatures = new Set();

  geojsonData.features.forEach((feature) => {
    if (feature.geometry.type === "LineString") {
      const [originCoord, destinationCoord] = feature.geometry.coordinates;
      const originWithinBBox =
        originCoord[0] >= bbox[0][0] &&
        originCoord[0] <= bbox[1][0] &&
        originCoord[1] >= bbox[0][1] &&
        originCoord[1] <= bbox[1][1];
      const destinationWithinBBox =
        destinationCoord[0] >= bbox[0][0] &&
        destinationCoord[0] <= bbox[1][0] &&
        destinationCoord[1] >= bbox[0][1] &&
        destinationCoord[1] <= bbox[1][1];

      if (
        (type === "origin" && originWithinBBox) ||
        (type === "destination" && destinationWithinBBox)
      ) {
        matchedFeatures.add(feature);
      }
    } else if (feature.geometry.type === "Point") {
      const [coord] = feature.geometry.coordinates;
      const withinBBox =
        coord[0] >= bbox[0][0] &&
        coord[0] <= bbox[1][0] &&
        coord[1] >= bbox[0][1] &&
        coord[1] <= bbox[1][1];

      if (withinBBox) {
        matchedFeatures.add(feature);
      }
    }
  });

  console.log(`Matched features for ${type}:`, matchedFeatures); // Debugging log
  const combinedFeatures = new Set();
  matchedFeatures.forEach((feature) => {
    if (feature.geometry.type === "LineString") {
      combinedFeatures.add(feature);
      const originCoord = feature.geometry.coordinates[0];
      const destinationCoord = feature.geometry.coordinates[1];

      geojsonData.features.forEach((f) => {
        if (
          f.geometry.type === "Point" &&
          f.properties.role === "origin" &&
          f.geometry.coordinates[0] === originCoord[0] &&
          f.geometry.coordinates[1] === originCoord[1]
        ) {
          combinedFeatures.add(f);
        }

        if (
          f.geometry.type === "Point" &&
          f.properties.role === "destination" &&
          f.geometry.coordinates[0] === destinationCoord[0] &&
          f.geometry.coordinates[1] === destinationCoord[1]
        ) {
          combinedFeatures.add(f);
        }
      });
    } else if (feature.geometry.type === "Point") {
      combinedFeatures.add(feature);
      geojsonData.features.forEach((f) => {
        if (
          (f.geometry.type === "LineString" &&
            f.geometry.coordinates[0][0] === feature.geometry.coordinates[0] &&
            f.geometry.coordinates[0][1] === feature.geometry.coordinates[1]) ||
          (f.geometry.coordinates[1][0] === feature.geometry.coordinates[0] &&
            f.geometry.coordinates[1][1] === feature.geometry.coordinates[1])
        ) {
          combinedFeatures.add(f);
        }
      });
    }
  });

  updateMapWithFilteredFeatures(Array.from(combinedFeatures));
}

function updateMapWithFilteredFeatures(filteredFeatures) {
  if (map.getSource("geojson-source")) {
    const filteredData = {
      type: "FeatureCollection",
      features: filteredFeatures,
    };

    map.getSource("geojson-source").setData(filteredData);
  } else {
    console.error("GeoJSON source not found on map.");
  }
}

export { initAutocomplete };

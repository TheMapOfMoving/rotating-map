// filters.js
import { geojsonData } from "./dataFetch.js";
import { map } from "./mapInit.js";

function applyAllFilters() {
  if (!geojsonData || !geojsonData.features) {
    console.error("Invalid geojsonData structure", geojsonData);
    return;
  }

  const ageMinInput = document.getElementById("age-min");
  const ageMaxInput = document.getElementById("age-max");
  const genderCheckboxes = document.querySelectorAll('input[name="gender"]');
  const genderOtherText = document.getElementById("gender-other-text");
  const transportCheckboxes = document.querySelectorAll(
    'input[name="transport"]'
  );
  const environmentalCheckboxes = document.querySelectorAll(
    'input[name="environmental"]'
  );
  const politicalCheckboxes = document.querySelectorAll(
    'input[name="political"]'
  );
  const economicCheckboxes = document.querySelectorAll(
    'input[name="economic"]'
  );
  const socialCheckboxes = document.querySelectorAll('input[name="social"]');

  const selectedAges = [
    parseInt(ageMinInput.value),
    parseInt(ageMaxInput.value),
  ];
  const selectedGenders = Array.from(genderCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  if (genderOtherText.value) {
    selectedGenders.push(genderOtherText.value.toLowerCase());
  }

  const selectedTransports = Array.from(transportCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  const selectedEnvironmental = Array.from(environmentalCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  const selectedPolitical = Array.from(politicalCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  const selectedEconomic = Array.from(economicCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  const selectedSocial = Array.from(socialCheckboxes)
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.value);

  const filteredFeatures = geojsonData.features.filter((feature) => {
    const age = parseInt(feature.properties.age);
    const ageMatch =
      !isNaN(age) && age >= selectedAges[0] && age <= selectedAges[1];
    const genderMatch =
      selectedGenders.length === 0 ||
      selectedGenders.includes(feature.properties.gender.toLowerCase());
    const transportMatch =
      selectedTransports.length === 0 ||
      (feature.properties.transport &&
        selectedTransports.includes(
          feature.properties.transport.toLowerCase()
        ));
    const environmentalMatch =
      selectedEnvironmental.length === 0 ||
      selectedEnvironmental.some(
        (reason) =>
          feature.properties.environmental_reason &&
          feature.properties.environmental_reason.toLowerCase().includes(reason)
      );
    const politicalMatch =
      selectedPolitical.length === 0 ||
      selectedPolitical.some(
        (reason) =>
          feature.properties.political_reason &&
          feature.properties.political_reason.toLowerCase().includes(reason)
      );
    const economicMatch =
      selectedEconomic.length === 0 ||
      selectedEconomic.some(
        (reason) =>
          feature.properties.economic_reason &&
          feature.properties.economic_reason.toLowerCase().includes(reason)
      );
    const socialMatch =
      selectedSocial.length === 0 ||
      selectedSocial.some(
        (reason) =>
          feature.properties.social_reason &&
          feature.properties.social_reason.toLowerCase().includes(reason)
      );

    return (
      ageMatch &&
      genderMatch &&
      transportMatch &&
      environmentalMatch &&
      politicalMatch &&
      economicMatch &&
      socialMatch
    );
  });

  const combinedFeatures = new Set();

  filteredFeatures.forEach((feature) => {
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
  const filteredData = {
    type: "FeatureCollection",
    features: filteredFeatures,
  };

  map.getSource("geojson-source").setData(filteredData);
}

export { applyAllFilters };

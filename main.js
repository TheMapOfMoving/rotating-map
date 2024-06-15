// main.js
import { map, updateZoomLevels } from "./mapInit.js";
import { fetchGeoJSONData } from "./dataFetch.js";
import { applyAllFilters } from "./filters.js";
import "./events.js";
import "./globeSpin.js";

document.addEventListener("DOMContentLoaded", function () {
  fetchGeoJSONData(
    "https://raw.githubusercontent.com/TheMapOfMoving/rotating-map/main/geojson.json"
  );

  document
    .querySelectorAll(
      'input[name="gender"], input[name="transport"], input[name="environmental"], input[name="political"], input[name="economic"], input[name="social"], #age-min, #age-max'
    )
    .forEach((input) => {
      input.addEventListener("change", applyAllFilters);
      input.addEventListener("input", applyAllFilters);
    });

  applyAllFilters();
  updateZoomLevels();

  // Add event listener for the share experience box
  document
    .getElementById("share-experience-box")
    .addEventListener("click", () => {
      document.getElementById("map").style.display = "none";
      document.querySelector(".side-menu").style.display = "none";
      document.getElementById("form-container").style.display = "flex";
    });

  // Add event listener for the return to map button
  document.getElementById("return-to-map").addEventListener("click", () => {
    document.getElementById("map").style.display = "block";
    document.querySelector(".side-menu").style.display = "flex";
    document.getElementById("form-container").style.display = "none";
  });
});

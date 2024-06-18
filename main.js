// main.js
import { map, updateZoomLevels } from "./mapInit.js";
import { fetchGeoJSONData } from "./dataFetch.js";
import { applyAllFilters } from "./filters.js";
import { initAutocomplete } from "./autocomplete.js"; // Add this line
import "./events.js";
import "./globeSpin.js";

// Function to set background color of category title
function setCategoryTitleBackgroundColor(categoryId, color) {
  document.querySelector(`#${categoryId}-title`).style.backgroundColor = color;
}

// Function to set background color of category content
function setCategoryContentBackgroundColor(categoryId, color) {
  document.querySelector(`#${categoryId}-content`).style.backgroundColor =
    color;
}

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

  initAutocomplete();

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

  // Add event listener for the map title to toggle additional information
  const mapTitle = document.getElementById("map-title");
  const mapInfo = document.getElementById("map-info");
  const filterCategory = mapTitle.parentElement;

  mapTitle.addEventListener("click", () => {
    console.log("Map title clicked"); // Debugging statement
    filterCategory.classList.toggle("expanded");
    console.log(filterCategory.classList.contains("expanded"));
    console.log(window.getComputedStyle(mapInfo).display);
  });

  // Add event listener for the help button to toggle explanation mode
  const helpButton = document.querySelector(".help-category");
  const sideMenu = document.querySelector(".side-menu");
  const mapElement = document.getElementById("map");

  helpButton.addEventListener("click", function () {
    if (!document.body.classList.contains("explanation-mode")) {
      enterExplanationMode();
    } else {
      exitExplanationMode();
    }
  });

  function enterExplanationMode() {
    document.body.classList.add("explanation-mode");

    mapTitle.innerHTML = "More information about the project.";
    mapTitle.style.backgroundColor = "#d9d9d9";
    mapTitle.style.color = "black";
    mapInfo.style.display = "block"; // Ensure the map info is displayed
    mapElement.innerHTML =
      '<div class="explanation-text">World globe: Navigate the world to discover migratory movements. Click on the one you are interested to access the full story.</div>';
    sideMenu.innerHTML = `
      <div class="filter-row">
        <div class="filter-column">
          <div class="filter-category">
            <div class="explanation-text">
              Filters of information:<br><br>
              With these filters you can search more accurately the experiences that you want, in terms of locations, gender, age, time period and transport.
            </div>
          </div>
        </div>
        <div class="filter-column">
          <div class="filter-category">
            <div class="explanation-text">
              Filters of information:<br><br>
              With these filters you can search more accurately the experiences that you want, in terms of reasons for migrating.
            </div>
          </div>
        </div>
        <div class="filter-category" id="share-experience-box-explain">
        <div class="explanation-text">Button to add an experience.</div>
      </div>
      </div>
      <button class="cross-button" id="back-to-normal">&times;</button>
    `;

    document
      .getElementById("back-to-normal")
      .addEventListener("click", exitExplanationMode);
  }

  function exitExplanationMode() {
    document.body.classList.remove("explanation-mode");
    mapTitle.innerHTML = 'THE MAP OF MOVING <i class="arrow-down"></i>';
    mapTitle.style.backgroundColor = "black";
    mapTitle.style.color = "white";
    mapInfo.style.display = "none";
    location.reload();
  }
});

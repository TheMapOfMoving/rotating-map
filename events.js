// events.js
import { map } from "./mapInit.js";
import { spinGlobe } from "./globeSpin.js";

let userInteracting = false;

map.on("mousedown", () => {
  userInteracting = true;
});

map.on("mouseup", () => {
  userInteracting = false;
  spinGlobe();
});

map.on("dragend", () => {
  userInteracting = false;
  spinGlobe();
});
map.on("pitchend", () => {
  userInteracting = false;
  spinGlobe();
});
map.on("rotateend", () => {
  userInteracting = false;
  spinGlobe();
});

map.on("moveend", () => {
  spinGlobe();
});

// New click listener for map background
map.on("click", function (e) {
  const features = map.queryRenderedFeatures(e.point, {
    layers: ["origin-circles", "destination-circles", "route"],
  });

  if (!features.length) {
    // No trip elements clicked, so hide trip details and show filter menu
    document.querySelector(".trip-details").style.display = "none";
    document.querySelector(".filter-row").style.display = "flex";
    document.querySelector("#share-experience-box").style.display = "block";
  }
});

export { userInteracting };

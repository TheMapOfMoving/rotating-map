function showTripDetails(properties) {
  // Hide the filter categories and the share experience box
  document.querySelector(".filter-row").style.display = "none";
  document.querySelector("#share-experience-box").style.display = "none";

  // Determine the color based on the main reason
  const color = getColor({ properties });

  // Create or update the trip details section
  let detailsSection = document.querySelector(".trip-details");
  if (!detailsSection) {
    detailsSection = document.createElement("div");
    detailsSection.className = "trip-details";
    document.querySelector(".side-menu").appendChild(detailsSection);
  }

  // Populate the trip details section
  detailsSection.innerHTML = `
    ${
      properties.origin
        ? `<div class="trip-detail-origin" style="color:${color}"><span class="trip-detail-circle" style="border-color:${color}"></span>${properties.origin}</div>`
        : ""
    }
    ${
      properties.origin_details
        ? `<div class="trip-detail-item">${properties.origin_details}</div>`
        : ""
    }
    ${
      properties.date_started || properties.age
        ? `<div class="trip-detail-item"><i>${properties.date_started || ""}${
            properties.date_started && properties.age ? ", " : ""
          }${properties.age || ""}</i></div>`
        : ""
    }
    ${
      properties.transport ||
      properties.journey_duration ||
      properties.accompanied
        ? `<div class="trip-detail-item">${properties.transport || ""}${
            properties.transport && properties.journey_duration ? ", " : ""
          }${properties.journey_duration || ""}${
            properties.journey_duration && properties.accompanied
              ? ", Together with "
              : ""
          }${properties.accompanied || ""}</div>`
        : ""
    }
    ${
      properties.journey_details
        ? `<div class="trip-detail-item">"${properties.journey_details}"</div>`
        : ""
    }
    ${
      properties.reason_details
        ? `<div class="trip-detail-item" style="color:${color}">"${properties.reason_details}"</div>`
        : ""
    }
    ${
      properties.destination
        ? `<div class="trip-detail-destination" style="color:${color}"><span class="trip-detail-circle" style="background-color:${color}"></span>${properties.destination}</div>`
        : ""
    }
    ${
      properties.destination_details
        ? `<div class="trip-detail-item">"${properties.destination_details}"</div>`
        : ""
    }
    ${
      properties.identity
        ? `<div class="trip-detail-identity">Identity: "${properties.identity}"</div>`
        : ""
    }
    <div class="trip-detail-line" style="background-color: ${color};"></div>
  `;

  detailsSection.style.display = "block";

  // Calculate and set the height of the line
  const originElement = detailsSection.querySelector(".trip-detail-origin");
  const destinationElement = detailsSection.querySelector(
    ".trip-detail-destination"
  );
  const lineElement = detailsSection.querySelector(".trip-detail-line");

  if (originElement && destinationElement && lineElement) {
    const originRect = originElement.getBoundingClientRect();
    const destinationRect = destinationElement.getBoundingClientRect();

    const originBottom = originRect.bottom;
    const destinationTop = destinationRect.top;

    const lineHeight = destinationTop - originBottom;

    lineElement.style.top = `${
      originElement.offsetTop + originElement.offsetHeight - 1
    }px`; // Adjust to touch the circle
    lineElement.style.height = `${lineHeight + 2}px`; // Adjust to touch the bottom circle
  }
}

function getColor(feature) {
  if (feature.properties.political_reason) return "#E5387A";
  if (feature.properties.environmental_reason) return "#31BCBC";
  if (feature.properties.economic_reason) return "#5058EF";
  if (feature.properties.social_reason) return "#F7960B";
  return "#000";
}

export { showTripDetails };

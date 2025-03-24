const CONFIG = {
  map: {
    mapObj: null,
    customZoom: 5.5,
    center: [22.13, 77.87],
    zoom: 5,
    maxZoom: 20,
    maxNativeZoom: 20,
    tileLayer: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  api: { key: "5b3ce3597851110001cf624843c2f9f917d248719a9597bd3fc02b7e" },
};

async function readBuses() {
  const response = await fetch('http://127.0.0.1:8000/app/buses/');
  const buses = await response.json();
  return buses;
}

async function fetchBusesAndDisplay(from, to) {
  try {
      const data = await readBuses();
      const busSchedules = data.busSchedules;
      
      const matchingBuses = findBuses(busSchedules, from, to);
      displayBuses(matchingBuses, busSchedules);
  } catch (error) {
      console.error("Error fetching bus data:", error);
  }
}

function findBuses(busSchedules, from, to) {
  const matchedBuses = [];

  busSchedules.forEach((bus) => {
      const route = bus.route;
      const fromIndex = route.indexOf(from);
      const toIndex = route.indexOf(to);

      if (fromIndex !== -1 && toIndex !== -1 && fromIndex < toIndex) {
          // Find the schedule for this trip
          const tripSchedule = bus.schedule.find(trip => trip.trip === 1);

          if (tripSchedule) {
              const stations = tripSchedule.stations;
              const fromStation = stations.find(station => station.station === from);
              const toStation = stations.find(station => station.station === to);

              if (fromStation && toStation) {
                  matchedBuses.push({
                      vehicleNumber: bus["Vehicle Number"],
                      from: fromStation.station,
                      fromTime: fromStation.departureTime,
                      to: toStation.station,
                      toTime: toStation.arrivalTime,
                      totalTime: calculateJourneyTime(fromStation.departureTime, toStation.arrivalTime),
                      fare: calculateFare(fromIndex, toIndex) // Example fare calculation
                  });
              }
          }
      }
  });

  return matchedBuses;
}

function displayBuses(buses, busSchedules) {
  const busListDiv = document.getElementById("busList");
  busListDiv.style.display = "block";
  busListDiv.innerHTML = "";

  if (buses.length === 0) {
      busListDiv.innerHTML = "<p>No buses found for the selected route.</p>";
      return;
  }

  buses.forEach(bus => {
      const busItem = document.createElement("div");
      busItem.className = "bus-item";
      busItem.innerHTML = `
          <h3>${bus.vehicleNumber}</h3>
          <p><strong>From:</strong> ${bus.from} at ${bus.fromTime}</p>
          <p><strong>To:</strong> ${bus.to} at ${bus.toTime}</p>
          <p><strong>Total Journey Time:</strong> ${bus.totalTime}</p>
          <p><strong>Fare:</strong> ₹${bus.fare}</p>
      `;

      // Add event listener to show full route when clicked
      busItem.addEventListener("click", function () {
          busListDiv.style.display = "none"; // Hide the bus list
          const selectedBus = busSchedules.find(b => b["Vehicle Number"] === bus.vehicleNumber);
          if (selectedBus) {
              showFullRoute(selectedBus);
          }
      });

      busListDiv.appendChild(busItem);
  });
}

// Function to display the full bus route on the map
async function showFullRoute(bus) {
  if (!CONFIG.map.mapObj) return;
  CONFIG.map.mapObj.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          CONFIG.map.mapObj.removeLayer(layer);
      }
  });

  const routeCoords = [];
  
  for (const stop of bus.route) {
      try {
          const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${stop}, Kerala`
          );
          const data = await response.json();
          if (data.length > 0) {
              const lat = parseFloat(data[0].lat);
              const lon = parseFloat(data[0].lon);
              routeCoords.push([lat, lon]);

              // Add marker for each stop
              L.marker([lat, lon])
                  .addTo(CONFIG.map.mapObj)
                  .bindPopup(`<strong>${stop}</strong>`)
                  .openPopup();
          }
      } catch (error) {
          console.error("Error fetching stop location:", error);
      }
  }

  if (routeCoords.length > 1) {
      // Draw polyline for the entire route
      L.polyline(routeCoords, { color: "blue" }).addTo(CONFIG.map.mapObj);
      CONFIG.map.mapObj.fitBounds(routeCoords);
  }
}


// Function to calculate journey time
function calculateJourneyTime(startTime, endTime) {
  const parseTime = (timeStr) => {
      const [time, modifier] = timeStr.split(" ");
      let [hours, minutes] = time.split(":").map(Number);
      if (modifier === "PM" && hours !== 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;
      return hours * 60 + minutes;
  };

  const startMinutes = parseTime(startTime);
  const endMinutes = parseTime(endTime);
  const duration = endMinutes - startMinutes;
  
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return `${hours}h ${minutes}m`;
}

// Example fare calculation based on distance (adjust as needed)
function calculateFare(fromIndex, toIndex) {
  const baseFare = 10;
  const farePerStop = 5;
  return baseFare + (farePerStop * (toIndex - fromIndex));
}

// Call fetch function when the form is submitted
document.getElementById("searchForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const from = document.getElementById("fromId").value;
  const to = document.getElementById("toId").value;
  fetchBusesAndDisplay(from, to);
});


async function initializeMap() {
  const map = L.map("map", {
    center: CONFIG.map.center,
    zoom: CONFIG.map.zoom,
    maxZoom: CONFIG.map.maxZoom,
    dragging: true,
  });
  CONFIG.map.mapObj = map;
  L.tileLayer(CONFIG.map.tileLayer, {
    maxZoom: CONFIG.map.maxZoom,
    maxNativeZoom: CONFIG.map.maxNativeZoom,
  }).addTo(map);

  document
    .getElementById("searchForm")
    .addEventListener("submit", async function (event) {
      event.preventDefault();
      const from = document.getElementById("fromId").value;
      const to = document.getElementById("toId").value;

      let fromCoords = null; // Store From location coordinates

      try {
        const fromResponse = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${from}, Kerala`
        );
        const fromData = await fromResponse.json();

        if (fromData.length > 0) {
          const latFrom = parseFloat(fromData[0].lat);
          const lonFrom = parseFloat(fromData[0].lon);
          fromCoords = [latFrom, lonFrom];
          CONFIG.map.mapObj.setView(fromCoords, 12);
          L.marker(fromCoords)
            .addTo(CONFIG.map.mapObj)
            .bindPopup(`From: ${from}`)
            .openPopup();
        }

        if (to && fromCoords) {
          const toResponse = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${to}, Kerala`
          );
          const toData = await toResponse.json();

          if (toData.length > 0) {
            const latTo = parseFloat(toData[0].lat);
            const lonTo = parseFloat(toData[0].lon);
            const toCoords = [latTo, lonTo];

            L.marker(toCoords)
              .addTo(CONFIG.map.mapObj)
              .bindPopup(`To: ${to}`)
              .openPopup();

            // Fetch route and distance from OpenRouteService
            const routeResponse = await fetch(
              `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${CONFIG.api.key}&start=${fromCoords[1]},${fromCoords[0]}&end=${lonTo},${latTo}`
            );
            const routeData = await routeResponse.json();
            const routeCoords = routeData.features[0].geometry.coordinates.map(
              (coord) => [coord[1], coord[0]]
            );
            L.polyline(routeCoords, { color: "blue" }).addTo(CONFIG.map.mapObj);

            // Get distance from API response
            const distance =
              routeData.features[0].properties.segments[0].distance; // Distance in meters

            // Fetch and display buses
            // fetchBusesAndDisplay(fromCoords, toCoords, distance);
          }
        }
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    });
}

initializeMap();

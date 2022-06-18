// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console.
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...");

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...
function updateLocation() {
  function callback(helper) {
    let latElem = document.getElementById("Latitude");
    let longElem = document.getElementById("Longitude");
    let latDiscElem = document.getElementById("LatitudeDisc");
    let longDiscElem = document.getElementById("LongitudeDisc");
    let mapElem = document.getElementById("mapView");

    if (!latElem || !longElem || !latDiscElem || !longDiscElem || !mapElem) {
      console.log(
        "elements couldn't be retrieved by their IDs, check your HTML"
      );
      alert("elements couldn't be retrieved by their IDs, check your HTML");
      return;
    }

    latElem.setAttribute("value", helper.latitude);
    longElem.setAttribute("value", helper.longitude);
    latDiscElem.setAttribute("value", helper.latitude);
    longDiscElem.setAttribute("value", helper.longitude);

    let manager = new MapManager("BOGAReBcjWRIADRh7GSjV9WPGeURXJwX");
    if (!manager) {
      console.log("failed to create map manager with user given API key");
      return;
    }

    let taglist_json = mapElem.getAttribute("data-tags");
    let taglist_obj = JSON.parse(taglist_json);

    let maplink = manager.getMapUrl(
      helper.latitude,
      helper.longitude,
      taglist_obj
    );
    if (!maplink) {
      console.log("failed to retrieve location image");
      return;
    }

    mapElem.setAttribute("src", maplink);
  }

  let latitude = document.getElementById("Latitude");
  let longitude = document.getElementById("Longitude");
  const latValue = latitude.getAttribute("value");
  const longValue = longitude.getAttribute("value");
  if (latValue === "" || longValue === "") {
    LocationHelper.findLocation(callback);
  }
}

function updateMap(geotags) {
  let mapManager = new MapManager("BOGAReBcjWRIADRh7GSjV9WPGeURXJwX");
  let lat = parseFloat(
    document.getElementById("Latitude").getAttribute("value")
  );
  let long = parseFloat(
    document.getElementById("Longitude").getAttribute("value")
  );
  let mapUrl = mapManager.getMapUrl(lat, long, JSON.parse(geotags));
  document.getElementById("mapView").setAttribute("src", mapUrl);

  return geotags;
}

function updateList(tags) {
  let taglist = JSON.parse(tags);

  if (taglist !== undefined) {
    let list = document.getElementById("discoveryResults");
    list.innerHTML = "";
    taglist.forEach((tag) => {
      let element = document.createElement("li");
      element.classList.add("customHeader","link");
      element.innerHTML =
        tag.name +
        "\n(" +
        tag.location.latitude +
        "," +
        tag.location.longitude +
        ")\n" +
        tag.hashtag;
      list.appendChild(element);
    });
  }
}

async function postAdd(geotag) {
  let response = await fetch("http://localhost:3000/api/geotags", {
    //Post mit HTTP
    method: "POST",
    headers: { "Content-Type": "application/json" }, //MimeType
    body: JSON.stringify(geotag),
  });
  return await response.json();
}

async function getTagList(searchTerm) {
  let response = await fetch(
    "http://localhost:3000/api/geotags?" + "&searchterm=" + searchTerm
  ); //Get mit HTTP Query Parameter
  return await response.json();
}

//listener auf add tag button
document.getElementById("tag-form").addEventListener(
  "submit",
  (evt) => {
    evt.preventDefault(); //standardabsenden der formulare verhindert

    let geotag = {
      name: document.getElementById("name").value,
      latitude: document.getElementById("Latitude").value,
      longitude: document.getElementById("Longitude").value,
      hashtag: document.getElementById("hashtag").value,
    };

    postAdd(geotag).then(updateMap).then(updateList);
    document.getElementById("name").value = "";
    document.getElementById("hashtag").value = "";
    document.getElementById("search").value = "";
  },
  true
);

document
  .getElementById("discoveryFilterForm")
  .addEventListener("submit", (evt) => {
    evt.preventDefault(); //standardabsenden der formulare verhindert

    let searchTerm = document.getElementById("search").value;
    getTagList(searchTerm)
      .then(updateMap)
      .then(updateList)
      .catch((error) => alert("Search term does not exist"));
  });
// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
  updateLocation();
});

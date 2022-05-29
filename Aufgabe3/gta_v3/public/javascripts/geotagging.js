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
			console.log("elements couldn't be retrieved by their IDs, check your HTML");
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

		let maplink = manager.getMapUrl(helper.latitude, helper.longitude);
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

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
	updateLocation();
});


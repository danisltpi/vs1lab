// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require("express");
const app = require("../app");
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore.
 * It represents geotags.
 *
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require("../models/geotag");

/**
 * The module "geotag-store" exports a class GeoTagStore.
 * It provides an in-memory store for geotag objects.
 *
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require("../models/geotag-store");

const GeoTagExamples = require("../models/geotag-examples");

var globalGeoTagStore = new GeoTagStore();
globalGeoTagStore.addExamples();

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get("/", (req, res) => {
  res.render("index", {
    taglist: [],
    currentLatitude: null,
    currentLongitude: null,
    mapTaglist: JSON.stringify(globalGeoTagStore.geoTags),
  });
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags
 * by radius around a given location.
 */

// TODO: ... your code here ...
router.post("/tagging", (req, res) => {
  let name = req.body.name;
  let hashtag = req.body.hashtag;

  let geoTag = new GeoTag(req.body.latitude, req.body.Longitude, hashtag, name);

  let nearbyGeoTags = globalGeoTagStore.getNearbyGeoTags(geoTag);
  nearbyGeoTags.push(geoTag);
  globalGeoTagStore.addGeoTag(geoTag);

  res.render("index", {
    taglist: nearbyGeoTags,
    currentLatitude: req.body.Latitude,
    currentLongitude: req.body.Longitude,
    mapTaglist: JSON.stringify(globalGeoTagStore.geoTags),
  });
});
/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain
 * the term as a part of their names or hashtags.
 * To this end, "GeoTagStore" provides methods to search geotags
 * by radius and keyword.
 */

// TODO: ... your code here ...
router.post("/discovery", (req, res) => {
  let search = req.body.search;
  console.log(req.body);
  let nearbyGeoTags = globalGeoTagStore.searchNearbyGeoTags(search);

  res.render("index", {
    taglist: nearbyGeoTags,
    currentLatitude: req.body.Latitude,
    currentLongitude: req.body.Longitude,
    mapTaglist: JSON.stringify(globalGeoTagStore.geoTags),
  });
});
// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */
router.get("/api/geotags", (req, res) => {
  let discoveryQuery = req.query.searchterm;
  let latitudeQuery = req.query.latitude;
  let longitudeQuery = req.query.longitude;

  let location = {
    latitude: latitudeQuery,
    longitude: longitudeQuery,
  };
  let filterArray = [];
  let nearbyGeoTags = globalGeoTagStore.geoTags;

  if (!!discoveryQuery && !!latitudeQuery && !!longitudeQuery) {
    nearbyGeoTags = globalGeoTagStore.getNearbyGeoTags(location);

    nearbyGeoTags.forEach((tag) => {
      if (
        tag.name.includes(discoveryQuery) ||
        tag.hashtag.includes(discoveryQuery)
      ) {
        filterArray.push(tag);
      }
    });
    nearbyGeoTags = filterArray;
  } else if (!!discoveryQuery) {
    nearbyGeoTags = globalGeoTagStore.geoTagsByTerm(discoveryQuery);
  } else if (!!latitudeQuery && !!longitudeQuery) {
    nearbyGeoTags = globalGeoTagStore.getNearbyGeoTags(location);
  }
  res.status(200).json(JSON.stringify(nearbyGeoTags));
});

/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post("/api/geotags", (req, res) => {
  let geoTagObject = new GeoTag(
    req.body.latitude,
    req.body.longitude,
    req.body.hashtag,
    req.body.name
  );
  globalGeoTagStore.addGeoTag(geoTagObject);
  res.append("Location", "http://localhost:3000/api/geotags/" + geoTagObject.id);
  res.status(201).json(JSON.stringify(geoTagObject));
});

/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get("/api/geotags/:id", (req, res) => {
  console.log("ROUTE GET /api/geotags/:id");

  let id = req.params.id;
  let foundGeoTag = globalGeoTagStore.geoTagById(id);
  res.status(200).json(JSON.stringify(foundGeoTag));
});

/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response.
 */
router.put("/api/geotags/:id", (req, res) => {
  console.log(req.params)
  let geoTagID = req.params.id;
  console.log(req.body)
  let geoTag = req.body;
  globalGeoTagStore.changeGeoTag(geoTag, geoTagID);
  res.status(202).json(JSON.stringify(geoTag));
});

/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete("/api/geotags/:id", (req, res) => {
  let geoTagID = req.params.id;
  let removedGeoTag = globalGeoTagStore.removeGeoTag(geoTagID);
  res.status(202).json(JSON.stringify(removedGeoTag));
});

module.exports = router;

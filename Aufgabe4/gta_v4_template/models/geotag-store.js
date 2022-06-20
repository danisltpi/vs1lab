// File origin: VS1LAB A3
const GeoTagExamples = require("./geotag-examples");
const GeoTag = require("./geotag");

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 *
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 *
 * Provide a method 'addGeoTag' to add a geotag to the store.
 *
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 *
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 *
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields.
 */
class InMemoryGeoTagStore {
  // TODO: ... your code here ...
  #geoTagArray = [];

  constructor() {
    this.addExamples();
  }

  addGeoTag(geoTag) {
    this.#geoTagArray.push(geoTag);
  }

  get geoTags() {
    return this.#geoTagArray;
  }

  removeGeoTag(id) {
    for (let i = 0; i < this.#geoTagArray.length; i++) {
      if (this.#geoTagArray[i].id == id) {
        this.#geoTagArray.splice(i, 1);
        break;
      }
    }
  }

  geoTagById(id) {
    let ret = null;
    console.log(id)
    this.#geoTagArray.find((tag) => {
      console.log(tag)
      if (tag.id == id) {
        ret = tag;
      }
    });
   
    return ret;
  }

  changeGeoTag(geoTag, id) {
    let found = this.geoTagById(id);
    console.log("found:",found)
    if (!!found) {
      found.latitude=geoTag.latitude
      found.longitude=geoTag.longitude
      found.name=geoTag.name
      found.hashtag=geoTag.hashtag
    }
  }

  getNearbyGeoTags(location) {
    let ret = [];
    this.#geoTagArray.forEach((tag) => {
      let distance = this.distance(tag, location);
      if (distance <= 0.1) ret.push(tag);
    });
    return ret;
  }

  distance(tag, location) {
    let difflong = tag.longitude - location.longitude;
    let difflat = tag.latitude - location.latitude;
    return Math.sqrt(difflong * difflong + difflat * difflat);
  }

  geoTagsByTerm(searchterm) {
    let ret = [];
    for (let i = 0; i < this.#geoTagArray.length; i++) {
      if (
        this.#geoTagArray[i].name.includes(searchterm) ||
        this.#geoTagArray[i].hashtag.includes(searchterm)
      ) {
        ret.push(this.#geoTagArray[i]);
      }
    }
    return ret;
  }
  searchNearbyGeoTags(name) {
    console.log(name);
    let ret = [];
    let location = this.#geoTagArray.find((geoTag) => {
      return geoTag.name == name;
    });
    console.log(location);
    if (!!location) {
      let proximates = this.getNearbyGeoTags(location);
      proximates.forEach((tag) => {
        if (tag.name === location.name || tag.hashtag === location.hashtag) {
          ret.push(tag);
        }
      });
    }
    return ret;
  }

  addExamples() {
    GeoTagExamples.tagList.forEach((tag) => {
      this.addGeoTag(new GeoTag(tag[1], tag[2], tag[3], tag[0]));
    });
  }
}

module.exports = InMemoryGeoTagStore;

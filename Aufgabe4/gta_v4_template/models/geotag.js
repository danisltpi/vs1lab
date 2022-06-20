// File origin: VS1LAB A3

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/** *
 * A class representing geotags.
 * GeoTag objects should contain at least all fields of the tagging form.
 */
class GeoTag {
  name;
  latitude;
  longitude;
  hashtag;

  // TODO: ... your code here ...
  constructor(latitude, longitude, hashtag, name) {
    this.latitude = latitude;
    this.longitude = longitude;
    this.name = name;
    this.hashtag = hashtag;
    this.id = this.generateId();
  }

  generateId() {
    return Math.floor(Math.random() * 100);
  }

  toJSON() {
    return {
      name: this.name,
      location: { latitude: this.latitude, longitude: this.longitude },
      hashtag: this.hashtag,
      id: this.id,
    };
  }
}

module.exports = GeoTag;

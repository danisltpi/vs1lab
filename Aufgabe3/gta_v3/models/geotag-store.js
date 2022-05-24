// File origin: VS1LAB A3

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
        GeoTagStore = new InMemoryGeoTagStore;
        GeoTagStore.push(tagList());  
    }




    addGeoTag(geoTag) {
        this.#geoTagArray.push(geoTag)
    }

    removeGeoTag(name) {
        for (let i = 0; i < this.#geoTagArray.length; i++) {
            if (this.#geoTagArray[i].name === name) {
                this.#geoTagArray.splice(i, 1);
                break
            }
        }
    }

    getNearbyGeoTags(latitude, longitude, radius) {
        let returnArray = [];

        this.#geoTagArray.forEach((geoTag) => {
            if (this.haversineFormulaForDistanceBetweenPoints(latitude.longitude, geoTag.latitude, geoTag.longitude) >= radius) {
                returnArray.push(geoTag)
            }
        })
        return returnArray
    }

    searchNearbyGeoTags(latitude, longitude, radius, name, hashtag) {
        let nearby = this.getNearbyGeoTags(latitude, longitude, radius);
        nearby.filter((geoTag) => {
            return geoTag.name == name || geoTag.hashtag == hashtag;
        })
    }









    haversineFormulaForDistanceBetweenPoints(lat1, long1, lat2, long2) {
        const EarthRadius = 6371;
        let gLat = gradZuBogen(lat2 - lat1);
        let gLong = gradZuBogen(long2 - long1);
        let a =
            Math.sin(gLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
            Math.sin(gLong / 2) * Math.sin(gLong / 2)
            ;
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        let d = R * c; //In Kilometer
        return d;
    }
    gradZuBogen(grad) {
        return grad * (Math.PI / 180)
    }


}

module.exports = InMemoryGeoTagStore

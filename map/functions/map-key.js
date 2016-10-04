import {Meteor} from "meteor/meteor";

_ = lodash;

function mapKey(data, geoData) {

  let sortedDensity = [];
  let sortedDeltas = [];

  for (let i = 0; i < data.length; i++) {
    let area = _.find(geoData, (lsoa) => {
      if (lsoa.properties.LSOA11CD == data[i]._id) return true;
      else return false;
    }).properties.area;
    sortedDensity.push(data[i].year2/area);
    sortedDeltas.push(data[i].year2 - data[i].year1);
  }
  sortedDensity.sort();
  sortedDeltas.sort();

  // Locate the values that correspond to the percentiles we need, percentiles = number of colours on key
  let hop = Math.floor(sortedDensity.length/Meteor.settings.public.heatMapKey.length);
  let densityKey = [];
  for (let i = hop; i < sortedDensity.length; i += hop) densityKey.push(sortedDensity[i]);

  hop = Math.floor(sortedDeltas.length/Meteor.settings.public.heatMapKey.length);
  let deltaKey = [];
  for (let i = hop; i < sortedDeltas.length; i += hop) deltaKey.push(sortedDeltas[i]);
  

  return {
    densityKey: densityKey,
    deltaKey: deltaKey,
    maxDensity: sortedDensity[sortedDensity.length - 1],
    minDensity: sortedDensity[0],
    maxDelta: sortedDeltas[sortedDeltas.length - 1],
    minDelta: sortedDeltas[0]
  };
}

export { mapKey };
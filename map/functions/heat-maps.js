import {Meteor} from "meteor/meteor";

_ = lodash;

function popDensity(feature, props, keyValues) { 

  const population = _.find(props.data, (poplet) => {
    if (poplet._id == feature.properties.LSOA11CD ) return true;
    else return false;
  }).year2;
  
  let d = population/feature.properties.area;
  let i = 0;
  while (d > keyValues[i]) i++;
  if (i > keyValues.length) i = keyValues.length - 1;
  let heat = Meteor.settings.public.heatMapKey[i];
  if (feature.properties.LSOA11CD === props.lsoaId) return {fillColor: heat, color: "#FF0000", weight: 5, fillOpacity: 0.5};
  else return {fillColor: heat, color: "#FF0000", weight: 1, fillOpacity: 0.5};

}

function popDelta(feature, props, keyValues) {

  const population = _.find(props.data, (poplet) => {
    if (poplet._id == feature.properties.LSOA11CD ) return true;
    else return false;
  });

  const delta = population.year2 - population.year1;
  
  let i = 0;
  while (delta > keyValues[i]) i++;
  if (i > keyValues.length) i = keyValues.length - 1;
  let heat = Meteor.settings.public.heatMapKey[i];
  
  if (feature.properties.LSOA11CD === props.lsoaId) return {fillColor: heat, color: "#FF0000", weight: 5, fillOpacity: 0.5};
  else return {fillColor: heat, color: "#FF0000", weight: 1, fillOpacity: 0.5};
}

export { popDensity, popDelta }; 


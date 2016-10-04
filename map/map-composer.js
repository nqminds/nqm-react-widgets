import connectionManager from "../../../connection-manager";
import TDXApi from "nqm-api-tdx/client-api";
import {Meteor} from "meteor/meteor";
_ = lodash;

function loadMapData({popletDatasetId, dataPipeline, geoPipeline}, onData) {
  const config = {
    commandHost: Meteor.settings.public.commandHost,
    queryHost: Meteor.settings.public.queryHost,
    accessToken: connectionManager.authToken
  };
  const api = new TDXApi(config);

  api.getAggregateData(Meteor.settings.public.regionToLsoaId, geoPipeline, {limit: 5000}, (err, response) => {
    if (err) console.log("Failed to map region to lsoas: ", err);
    else {
      const lsoaArray = response.data[0].id_array;
      const geoFilter = {"properties.LSOA11CD":{"$in":lsoaArray}};
      api.getDatasetData(Meteor.settings.public.geojsonId, geoFilter, null, {limit: 5000}, (err, response) => {
        if (err) console.log("Failed to get lsoa geojson: ", err);
        else {
          const geojson = response.data;
          dataPipeline = dataPipeline.replace("#area_ids#", JSON.stringify(lsoaArray));
          api.getAggregateData(popletDatasetId, dataPipeline, {limit: 5000}, (err, response) => {
            if(err) console.log("Failed to get map data: ", err);
            else {

              onData(null, {geojson: geojson, data: response.data});
            }
          });
        }
      });
    }
  });

}

export default loadMapData;
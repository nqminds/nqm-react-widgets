import React from "react";
import { Meteor } from "meteor/meteor";

import DetailContainer from "./detail-container";

class DetailWidget extends React.Component {

  render() {
    const filter = {
      "properties.LSOA11CD": {
        "$eq": this.props.lsoaId
      }
    };

    return (
      <DetailContainer resourceId={Meteor.settings.public.geojsonId} filter={filter} options={{limit: 1}} /> 
    );
  }

}

DetailWidget.propTypes = {
  lsoaId: React.PropTypes.string.isRequired
};

export default DetailWidget;
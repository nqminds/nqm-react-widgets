import React from "react";
import { Meteor } from "meteor/meteor";

import PyramidContainer from "./pyramid-container";

class PyramidWidget extends React.Component {

  render() {
    
    const filter = {
      "area_id": {
        "$eq": this.props.lsoaId
      },
      "year": {
        "$eq": this.props.year
      }
    };
    let age_bands = this.props.age_bands;
    if (age_bands[0] === "All Ages" && age_bands.length === 1) age_bands = Meteor.settings.public.age_bands;

    return(
      <PyramidContainer wgtId={this.props.wgtId} resourceId={this.props.popletDatasetId} filter={filter} options={{limit: 2500}} female={this.props.female} male={this.props.male} age_bands={age_bands} />
    );
  }


}

PyramidWidget.propTypes = {
  age_bands: React.PropTypes.array.isRequired,
  male: React.PropTypes.bool.isRequired,
  female: React.PropTypes.bool.isRequired,
  year: React.PropTypes.string.isRequired,
  lsoaId: React.PropTypes.string.isRequired,
  popletDatasetId: React.PropTypes.string.isRequired,
  wgtId: React.PropTypes.string.isRequired
};

export default PyramidWidget;
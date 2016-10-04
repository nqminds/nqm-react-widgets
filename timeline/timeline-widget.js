import React from "react";

import TimelineContainer from "./timeline-container";

class TimelineWidget extends React.Component {
  
  render() {
    let gender = [];
    if (this.props.male) gender.push("male");
    if (this.props.female) gender.push("female");

    const pipeline = '[{"$match":{"area_id":{"$eq":"' + this.props.lsoaId + '"},"gender":{"$in":' + JSON.stringify(gender) + '},"age_band":{"$in":' + JSON.stringify(this.props.age_bands) + '}}},{"$group":{"_id":"$year","persons":{"$sum":"$persons"}}}]';
    return (
      <TimelineContainer resourceId={this.props.popletDatasetId} pipeline={pipeline} wgtId={this.props.wgtId} />
    );
  }

}

TimelineWidget.propTypes = {
  age_bands: React.PropTypes.array.isRequired,
  male: React.PropTypes.bool.isRequired,
  female: React.PropTypes.bool.isRequired,
  year: React.PropTypes.string.isRequired,
  lsoaId: React.PropTypes.string.isRequired,
  popletDatasetId: React.PropTypes.string.isRequired,
  wgtId: React.PropTypes.string.isRequired
};

export default TimelineWidget;
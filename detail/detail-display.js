import React from "react";

import {Card, CardText} from "material-ui/Card";

class DetailDisplay extends React.Component {

  render() {
    const area = this.props.data[0].properties;
    return (
      <Card className="detail-widget">

        <CardText>
          {area.LSOA11NM + " | " + area.LSOA11CD}
          <br />
          Area: {Math.floor(area.area/1000000)} km<sup>2</sup>
        </CardText>
      </Card>
    );
  }
}

DetailDisplay.propTypes = {
  data: React.PropTypes.array.isRequired
};

export default DetailDisplay;
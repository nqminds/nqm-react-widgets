import React from "react";

import BuildListDisplayContainer from "./build-list-display-container";

class BuildList extends React.Component {

  render() {

    const filter = {
      "schemaDefinition.basedOn": "PlanningPoplet",
      "parents": {"$eq": this.props.currentScenario}
    };

    return (
      <BuildListDisplayContainer filter={filter} options={{limit: 1000}} update={this.props.update} />
    );
  }

}

BuildList.propTypes = {
  data: React.PropTypes.array.isRequired,
  update: React.PropTypes.func.isRequired,
  currentScenario: React.PropTypes.string.isRequired
};

export default BuildList;
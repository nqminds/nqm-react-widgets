import React from "react";

import Settings from 'material-ui/svg-icons/action/settings';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

class BuildListDisplay extends React.Component {

  render() {
    const builds = _.map(this.props.resources, (build, index) => {
      return (
        <ListItem
        key={build.id}
        id={build.id}
        onTouchTap={this.update}
        primaryText={build.name}
        rightIcon={<Settings />}
        />
      );
    });

    return (

      <List>
        <Subheader>Builds</Subheader>
        {builds}
      </List>

    );
  }

}

BuildListDisplay.propTypes = {
  resources: React.PropTypes.array.isRequired,
  update: React.PropTypes.func.isRequired
};

export default BuildListDisplay;
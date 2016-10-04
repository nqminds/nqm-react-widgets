import React from "react";

import Settings from 'material-ui/svg-icons/action/settings';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import {lightBlue500, grey500} from 'material-ui/styles/colors';

class ScenarioList extends React.Component {



  render() {
    const scenarios = _.map(this.props.data, (scenario) => {
      let colour = grey500;
      console.log(scenario);
      if (scenario.scenario_folder === this.props.currentScenario) colour = lightBlue500;
      return (
         <ListItem
          key={scenario.scenario_name}
          id={scenario.scenario_folder}
          onTouchTap={this.props.update}
          primaryText={scenario.scenario_name}
          rightIcon={<Settings color={colour}/>}
          />
      );
    });

    return (

      <List>
        <Subheader>Scenarios</Subheader>
        {scenarios}
      </List>

    );
  }

}

ScenarioList.propTypes = {
  data: React.PropTypes.array.isRequired,
  currentScenario: React.PropTypes.string.isRequired,
  update: React.PropTypes.func.isRequired
};

export default ScenarioList;
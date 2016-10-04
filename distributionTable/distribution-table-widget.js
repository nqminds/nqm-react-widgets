import React from "react";

import { Table, Tr, Thead, Th, Td } from "reactable";
import NumberField from 'react-number-field';
import IconButton from 'material-ui/IconButton';
import Locked from "material-ui/svg-icons/action/lock";
import Unlocked from "material-ui/svg-icons/action/lock-open";

_ = lodash;

class DistributionTableWidget extends React.Component {

  constructor(props) {
    super(props);
    this.toggleLockMale = this.toggleLockMale.bind(this);
    this.toggleLockFemale = this.toggleLockFemale.bind(this);
    this.updateMale = this.updateMale.bind(this);
    this.updateFemale = this.updateFemale.bind(this);
  }

  toggleLockMale(event) {
    let found = false;
    let elem = event.target.parentNode;
    while (!found) {
      if (elem.id != "") found = true;
      else elem = elem.parentNode;
    }
    this.props.toggleLock(true, elem.id);
  }

  toggleLockFemale(event) {
    let found = false;
    let elem = event.target.parentNode;
    while (!found) {
      if (elem.id != "") found = true;
      else elem = elem.parentNode;
    }
    this.props.toggleLock(false, elem.id);
  }

  updateMale(value, event) {
    let val = parseInt(value, 10);
    if (value === "") val = 0;
    this.props.update(true, event.target.id, val/100);
  }
  
  updateFemale(value, event) {
    let val = parseInt(value, 10);
    if (value === "") val = 0;
    this.props.update(false, event.target.id, val/100);
  }

  render() {
    const style = {
      icon: {
        width: 20,
        height: 20
      },
      style: {
        width: 30,
        height: 30,
        padding: 2
      }
    };

    const rows = _.map(this.props.data, (row) =>{
      let maxFemaleValue = 1;
      let maxMaleValue = 1;
      _.each(this.props.data, (item) => {

          if (item.lockedFemale) {
            maxMaleValue -= item.female;
            if (item.age_band != row.age_band) maxFemaleValue -= item.female;
          }

          if (item.lockedMale) {
            maxFemaleValue -= item.male;
            if (item.age_band != row.age_band) maxMaleValue -= item.male;
          }
      });
      return (
        <Tr key={row.range}>
          <Td column="lockedMale"><IconButton id={row.range} iconStyle={style.icon} style={style.style} onClick={this.toggleLockMale}>{row.lockedMale ? <Locked /> : <Unlocked />}</IconButton></Td>
          <Td column="male">
            <NumberField id={row.range} className="percentage" onChange={this.updateMale} minValue={0} maxValue={maxMaleValue*100} allowNegative={false} value={Math.round(row.male*1000)/10} disabled={!row.lockedMale}/>
          </Td>
          <Td column="age_band">{row.range}</Td>
          <Td column="female">
            <NumberField id={row.range} className="percentage" onChange={this.updateFemale} minValue={0} maxValue={maxFemaleValue*100} allowNegative={false} value={Math.round(row.female*1000)/10} disabled={!row.lockedFemale}/>
          </Td>
          <Td column="lockedFemale"><IconButton id={row.range} iconStyle={style.icon} style={style.style} onClick={this.toggleLockFemale}>{row.lockedFemale ? <Locked /> : <Unlocked />}</IconButton></Td>
        </Tr>
      );

    });

    return (
      <div className="table-widget">
        <Table>
          <Thead>
            <Th column="lockedMale">Locked</Th>
            <Th column="male">Male %</Th>
            <Th column="age_band">Age Band</Th>
            <Th column="female">Female %</Th>
            <Th column="lockedFemale">Locked</Th>
          </Thead>
          {rows}
        </Table>
      </div>
    );
  }


}

DistributionTableWidget.propTypes = {
  update: React.PropTypes.func.isRequired,
  toggleLock: React.PropTypes.func.isRequired,
  data: React.PropTypes.array.isRequired
};

export default DistributionTableWidget;
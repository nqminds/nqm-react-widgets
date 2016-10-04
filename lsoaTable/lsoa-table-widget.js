import React from "react";

import { Table, Tr, Thead, Th, Td } from "reactable";
import NumberField from "react-number-field";
import IconButton from "material-ui/IconButton";
import Locked from "material-ui/svg-icons/action/lock";
import Unlocked from "material-ui/svg-icons/action/lock-open";
import Delete from "material-ui/svg-icons/action/delete";

_ = lodash;

class LSOATableWidget extends React.Component {

  constructor(props) {
    super(props);

    this.update = this.update.bind(this);
    this.lock = this.lock.bind(this);
    this.remove = this.remove.bind(this);
  }

  update (value, event) {
    let val = parseInt(value, 10);
    if (value === "") val = 0;
    this.props.update(event.target.id, val/100);
  }

  lock (event) {
    let found = false;
    let elem = event.target.parentNode;
    while (!found) {
      if (elem.id != "") found = true;
      else elem = elem.parentNode;
    }
    this.props.toggleLock(elem.id);
  }

  remove (event) {
    let found = false;
    let elem = event.target.parentNode;
    while (!found) {
      if (elem.id != "") found = true;
      else elem = elem.parentNode;
    }
    this.props.remove(elem.id);
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
      let maxValue = 1;
      _.each(this.props.data, (item) => {
        if (item.locked && (item.area_id != row.area_id)) maxValue -= item.ratio;
      });
      return (
        <Tr key={row.area_id}>
          <Td column="area_id">{row.area_id}</Td>
          <Td column="ratio">
            <NumberField id={row.area_id} className="percentage" onChange={this.update} minValue={0} maxValue={maxValue*100} allowNegative={false} value={Math.round(row.ratio*1000)/10} disabled={!row.locked}/> 
          </Td>
          <Td column="locked"><IconButton id={row.area_id} iconStyle={style.icon} style={style.style} onClick={this.lock}>{row.locked ? <Locked /> : <Unlocked />}</IconButton></Td>
          <Td column="delete"><IconButton id={row.area_id} iconStyle={style.icon} style={style.style} onClick={this.remove}>{<Delete />}</IconButton></Td>
        </Tr>
      );

    });
    return (
      <div className="table-widget">
        <Table>
          <Thead>
            <Th column="area_id">LSOA ID</Th>
            <Th column="ratio">Percentage</Th>
            <Th column="locked">Locked</Th>
            <Th column="delete">Delete</Th>
          </Thead>
          {rows}
        </Table>
        <p>Add LSOAs by clicking on them on the map</p>
      </div>
    );
  }
}

LSOATableWidget.propTypes = {
  update: React.PropTypes.func.isRequired,
  toggleLock: React.PropTypes.func.isRequired,
  remove: React.PropTypes.func.isRequired,
  data: React.PropTypes.array.isRequired
};

export default LSOATableWidget;
import React from "react";
_ = lodash;

import TableContainer from "./table-container";

class TableWidget extends React.Component {

  render() {

    let gender = [];
    if (this.props.male) gender.push("male");
    if (this.props.female) gender.push("female");

    let headers = [{label:"Persons", key: "persons"}, {label:"Year", key: this.props.aggLsoas ? "_id" : "year"}];

    if (!this.props.aggAge) headers.push({label: "Age Band", key:"age_band"});
    if (!this.props.aggGender) headers.push({label: "Gender", key: "gender"});
    if (!this.props.aggLsoas) headers.push({label:"LSOA ID", key: "_id"});
    if (!this.props.aggLsoas) headers.push({label:"LSOA Name", key: "area_name"});  

    let pipeline = '[{"$match":{"area_id":{"$in":' + JSON.stringify(this.props.lsoaIds) + '},"gender":{"$in":' + JSON.stringify(gender) + '},"age_band":{"$in":' + JSON.stringify(this.props.age_bands) + '},"year":{"$in":' + JSON.stringify(this.props.years) + '}}},{"$group":{"_id":';
    pipeline += this.props.aggLsoas ? '{"year":"$year"' : '{"area_id":"$area_id","year":"$year"';
    pipeline += this.props.aggAge ? "" : ',"age_band":"$age_band"';
    pipeline += this.props.aggGender ? "" : ',"gender":"$gender"';
    pipeline += "},";
    pipeline += this.props.aggLsoas ? '"area_id":{"$push":"$area_id"},' : '"year":{"$push":"$year"},';
    pipeline += '"area_name":{"$push":"$area_name"},';
    pipeline += '"gender":{"$push":"$gender"},';
    pipeline += '"age_band":{"$push":"$age_band"},';
    pipeline += '"persons":{"$sum":"$persons"}}}]';

    return (
      <TableContainer resourceId={this.props.popletDatasetId} pipeline={pipeline} headers={headers}/>
    );
  }

}

TableWidget.propTypes = {
  age_bands: React.PropTypes.array.isRequired,
  male: React.PropTypes.bool.isRequired,
  female: React.PropTypes.bool.isRequired,
  years: React.PropTypes.array.isRequired,
  lsoaIds: React.PropTypes.array.isRequired,
  popletDatasetId: React.PropTypes.string.isRequired,
  aggAge: React.PropTypes.bool.isRequired,
  aggGender: React.PropTypes.bool.isRequired,
  aggLsoas: React.PropTypes.bool.isRequired
};

export default TableWidget;
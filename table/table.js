import React from "react";
import _ from "lodash";

import IconButton from "material-ui/IconButton";
import Next from "material-ui/svg-icons/navigation/chevron-right";
import Previous from "material-ui/svg-icons/navigation/chevron-left";
import Descending from "material-ui/svg-icons/navigation/arrow-drop-down";
import Ascending from "material-ui/svg-icons/navigation/arrow-drop-up";

class Table extends React.Component {
  constructor(props) {
    super(props);

    // Set the default table sort
    let sortKey = _.findKey(props.headers, (header) => header.sortable);

    if (!sortKey) { // If their is no sort value, sort on the first column
      sortKey = Object.keys(props.headers)[0];
    }
    this.state = {
      page: 0,
      sortKey,
      sortDesc: false,
    };
  }

  // Formatting functions
  prettifyCamelCase(camelCase) {
    const regularCase = camelCase.replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => {
        return str.toUpperCase();
      });
    return regularCase;
  }

  numberWithCommas(number, decimalPlaces) {
    if (!decimalPlaces) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } else {
      const rounded = Math.round(number * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
      return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
  }

  render() {
    const styles = {
      icon: {
        width: "100%",
        padding: 0,
        height: 15,
      },
    };

    const pageCount = Math.ceil(this.props.data.length / this.props.itemsPerPage);

    const headers = _.map(this.props.headers, (header, key) => {
      const sortControls = header.sortable ? ( // If the header is sortable, show sort controls
        <IconButton
          style={styles.icon}
          onClick={() => {
            this.setState({
              sortKey: key,
              sortDesc: this.state.sortKey === key ? !this.state.sortDesc : this.state.sortDesc,
            });
          }}
        >
          {this.state.sortDesc ? <Descending /> : <Ascending /> }
        </IconButton>
      ) : "";
      return ( // Format headers if requested
        <th>
          {this.props.formatHeaders ? this.prettifyCamelCase(key) : key}
          {sortControls}
        </th>
      );
    });

    // Sort and then slice the data based on current page
    const pageIndex = this.state.page * this.props.itemsPerPage;
    const sortedData = _.sortBy(this.props.data, [this.state.sortKey]);

    if (this.state.sortDesc) {
      sortedData.reverse();
    }
    const pagedData = sortedData.slice(pageIndex, pageIndex + this.props.itemsPerPage);

    const rows = _.map(pagedData, (row) => {
      const columns = [];
      _.each(this.props.headers, (header, key) => {
        let cellContents;
        // Allows styling and formatting cells based on the data type
        switch (typeof row[key]) {
          case "object":
            cellContents = row[key];
            break;
          case "number":
            cellContents = `${header.prefix ? header.prefix : ""}
            ${this.numberWithCommas(row[key], header.decimalPlaces)}
            ${header.suffix ? header.suffix : ""}`;
            break;
          default:
            cellContents = `${header.prefix ? header.prefix : ""}
            ${row[key]}
            ${header.suffix ? header.suffix : ""}`;
        }
        columns.push(
          <td>
            {cellContents}
          </td>
        );
      });
      return <tr>{columns}</tr>;
    });

    return (
      <div>
        <IconButton
          disabled={this.state.page === 0}
          onClick={() => {
            this.setState({
              page: this.state.page - 1,
            });
          }}
        >
          <Previous />
        </IconButton>
        {`${this.state.page + 1} / ${pageCount}`}
        <IconButton
          disabled={this.state.page + 1 === pageCount}
          onClick={() => {
            this.setState({
              page: this.state.page + 1,
            });
          }}
        >
          <Next />
        </IconButton>
        <table>
          <thead>
            <tr>{headers}</tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }

}

Table.propTypes = {
  data: React.PropTypes.array.isRequired,
  formatHeaders: React.PropTypes.bool.isRequired,
  headers: React.PropTypes.object.isRequired,
  itemsPerPage: React.PropTypes.number.isRequired,
  numberPrefix: React.PropTypes.string,
};

export default Table;

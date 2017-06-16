// Created by Ivan June 2017
import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import * as d3 from "d3";

const margins = {
  bottom: 30,
  left: 50,
  right: 80,
  top: 20,
};

class TimeSeries extends React.Component {
  static propTypes = {
    colours: PropTypes.array,
    height: PropTypes.number.isRequired,
    series: PropTypes.array.isRequired,
    yLabel: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    //this.colourScale = d3.scale.ordinal();
    //this.parseDate = d3.time.format("%Y-%m-%d %H:%M:%S").parse;
    this.xScale = d3.time.scale();
    this.yScale = d3.scale.linear();

    this.xAxis = d3.svg.axis()
    .scale(this.xScale)
    .orient("bottom")
    .ticks(4, ".1s");
    this.yAxis = d3.svg.axis()
    .scale(this.yScale)
    .orient("left")
    .ticks(4, ".1s");

    this.line = d3.svg.line()
    .x((d) => this.xScale(new Date(d.timestamp)))
    .y((d) => this.yScale(d.value));

    this.draw = this.draw.bind(this);

    this.paths = null;
  }

  componentDidMount() {
    this.svg = d3.select(`#time-series-${this.props.yLabel}`).append("svg");
    this.chartWrapper = this.svg.append("g");

    this.paths = _.map(this.props.series, (data) => {
      return this.chartWrapper.append("path").datum(data).classed("line", true);
    });

    this.chartWrapper.append("g").classed("x axis", true);
    this.chartWrapper.append("g").classed("y axis", true);
    window.addEventListener("resize", this.draw);

    this.draw();
  }

  componentDidUpdate() {
    this.draw();
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.draw);
  }

  draw() {
    const {series, yLabel} = this.props;

    const height = parseInt(d3.select(`#time-series-${yLabel}`).style("height")) - margins.bottom - margins.top;
    const width = parseInt(d3.select(`#time-series-${yLabel}`).style("width")) - margins.left - margins.right;

    const xDomain = d3.extent(series[0], (d) => new Date(d.timestamp));
    const yDomain = d3.extent(series[0], (d) => d.value);

    for (let i = 1; i < series.length; i++) {
      const newX = d3.extent(series[i], (d) => new Date(d.timestamp));
      const newY = d3.extent(series[i], (d) => d.value);
      if (newX[0] < xDomain[0]) {
        xDomain[0] = newX[0];
      }
      if (newX[1] > xDomain[1]) {
        xDomain[1] = newX[1];
      }
      if (newY[0] < yDomain[0]) {
        yDomain[0] = newY[0];
      }
      if (newY[1] > yDomain[1]) {
        yDomain[1] = newY[1];
      }
    }
    this.xScale.domain(xDomain)
    .range([0, width]);
    this.yScale.domain(yDomain)
    .range([height, 0]);
    this.svg.attr("width", width + margins.left + margins.right)
    .attr("height", height + margins.bottom + margins.top);
    this.chartWrapper.attr("transform", `translate(${margins.left}, ${margins.top})`);

    this.xAxis.scale(this.xScale);
    this.yAxis.scale(this.yScale);

    this.svg.select(".x.axis")
    .attr("transform", `translate(0, ${height})`)
    .call(this.xAxis);

    this.svg.select(".y.axis")
    .call(this.yAxis);

    _.each(this.paths, (path, i) => {
      path.datum(series[i]);
      path.attr("d", this.line);
    });
  }

  render() {
    const {height, yLabel} = this.props;

    return (
      <div
        id={`time-series-${yLabel}`}
        style={{
          height,
          minWidth: margins.left + margins.right + 70,
          position: "absolute",
          width: "100%",
        }}
      />
    );
  }
}

export default TimeSeries;

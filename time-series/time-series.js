// Created by Ivan June 2017
import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import * as d3 from "d3";

const colours = [
  "#1f78b4", "#33a02c", "#b15928",
  "#e31a1c", "#ff7f00", "#6a3d9a",
];

const margins = {
  bottom: 30,
  left: 80,
  right: 100,
  top: 20,
};

d3.selection.prototype.moveToFront = function() {
  return this.each(() => {
    this.parentNode.appendChild(this);
  });
};

class TimeSeries extends React.Component {
  static propTypes = {
    height: PropTypes.number.isRequired,
    series: PropTypes.array.isRequired,
    yLabel: PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    this.xScale = d3.time.scale();
    this.yScale = d3.scale.linear();

    this.xAxis = d3.svg.axis()
    .scale(this.xScale)
    .orient("bottom")
    .ticks(4, ".1s")
    .tickSize(0);
    this.yAxis = d3.svg.axis()
    .scale(this.yScale)
    .orient("left")
    .ticks(4, ".1s")
    .tickSize(0);

    this.line = d3.svg.line()
    .x((d) => this.xScale(new Date(d.timestamp)))
    .y((d) => this.yScale(d.value));

    this.draw = this.draw.bind(this);

    this.paths = {};
  }

  componentDidMount() {
    this.svg = d3.select(`#time-series-${this.props.yLabel}`).append("svg");
    this.chartWrapper = this.svg.append("g");

    this.chartWrapper.append("g").classed("x axis", true);
    this.chartWrapper.append("g").classed("y axis", true);
    window.addEventListener("resize", this.draw);

    this.tooltip = this.chartWrapper.append("text")
    .attr("text-anchor", "middle");

    this.label = this.svg.append("text")
    .attr("text-anchor", "middle");

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

    const xDomain = d3.extent(series[0].points, (d) => new Date(d.timestamp));
    const yDomain = d3.extent(series[0].points, (d) => d.value);

    for (let i = 1; i < series.length; i++) {
      const newX = d3.extent(series[i].points, (d) => new Date(d.timestamp));
      const newY = d3.extent(series[i].points, (d) => d.value);
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

    this.chartWrapper.selectAll("line.horizontalGrid").remove();
    this.chartWrapper.selectAll("line.horizontalGrid")
    .data(this.yScale.ticks(4))
    .enter()
    .append("line")
    .attr({
      class: "horizontalGrid",
      x1: 0,
      x2: width,
      y1: (d) => {
        return this.yScale(d);
      },
      y2: (d) => {
        return this.yScale(d);
      },
    });

    this.chartWrapper.selectAll("line.verticalGrid").remove();
    this.chartWrapper.selectAll("line.verticalGrid")
    .data(this.xScale.ticks(4))
    .enter()
    .append("line")
    .attr({
      class: "verticalGrid",
      x1: (d) => {
        return this.xScale(d);
      },
      x2: (d) => {
        return this.xScale(d);
      },
      y1: 0,
      y2: height,
    });

    this.svg.select(".x.axis")
    .transition()
    .attr("transform", `translate(0, ${height})`)
    .call(this.xAxis);

    this.svg.select(".y.axis")
    .transition()
    .call(this.yAxis);

    _.each(series, (data, i) => {
      if (this.paths[data.name]) {
        this.paths[data.name].datum(data.points)
        .attr("stroke", colours[i]);
      } else {
        this.paths[data.name] = this.chartWrapper.append("path")
        .datum(data.points)
        .classed("line", true)
        .attr("stroke", colours[i]);
      }
    });

    _.each(this.paths, (path, key) => {
      const data = _.find(series, (d) => d.name === key);
      if (typeof data === "undefined") {
        path.remove();
      }
    });

    _.each(this.paths, (path) => {
      path.transition()
      .attr("d", this.line);
    });

    this.label.attr("transform", `translate(${margins.left / 2.5}, ${height / 2})rotate(-90)`)
    .text(yLabel);

    let tooltipText = "";
    _.each(series, (item, i) => {
      tooltipText += `<tspan style="fill: ${colours[i]}" x="0" dy="${i + 1 * 18}">${item.name}</tspan>`;
    });
    this.tooltip.attr("transform", `translate(${width + margins.right / 2.5}, ${margins.top})`)
    .html(tooltipText);
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

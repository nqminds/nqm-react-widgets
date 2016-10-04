import React from "react";

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';

class TimelineDisplay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      width: 260,
      height: 225,
      margin: {
        top: 10,
        right: 40,
        bottom: 20,
        left: 25,
      }
    };
    this.draw = this.draw.bind(this);
  }

  translation(x,y) {
    return 'translate(' + x + ',' + y + ')';
  }

  draw(props) {

    let svg = d3.select("#timeline" + this.props.wgtId);
    props.data.sort(function(a,b) {
     return a._id - b._id;
    });

    let xScale = d3.scale.linear()
      .domain(d3.extent(props.data, function(d) {return d._id}))
      .range([0, this.state.width]);

    let yScale = d3.scale.linear()
      .domain([0, d3.max(props.data, function(d) {return d.persons}) * 1.1])
      .range([this.state.height, 0]);

    let xAxis = d3.svg.axis()
      .scale(xScale)
      .orient("bottom")
      .ticks(7)
      .tickFormat(d3.format("d"));
    
    let yAxis = d3.svg.axis()
      .scale(yScale)
      .orient("left")
      .ticks(6, ",f");
    
    let line = d3.svg.line()
      .x(function(d) { return xScale(d._id); })
      .y(function(d) { return yScale(d.persons); });


    svg.select("#x-axis" + props.wgtId)
      .transition()
      .call(xAxis);

    svg.select("#y-axis" + props.wgtId)
      .transition()
      .call(yAxis);

    svg.select("#line" + props.wgtId)
      .datum(props.data)
      .transition()
      .duration(500).ease("sin-in-out")
      .attr("class", "line")
      .attr("d", line)
      .attr('transform', this.translation(this.state.margin.left, 0));
  }

  componentDidMount() {
    let svg = d3.select("#timeline" + this.props.wgtId)
      .attr('width', this.state.margin.left + this.state.width + this.state.margin.right)
      .attr('height', this.state.margin.top + this.state.height + this.state.margin.bottom)
      .append('g')
      .attr('transform', this.translation(this.state.margin.left, this.state.margin.top));
    svg.append("g")
      .attr('id', 'y-axis' + this.props.wgtId)
      .attr("class", "axis")
      .attr('transform', this.translation(this.state.margin.left, 0));
    svg.append('g')
      .attr('id', 'x-axis' + this.props.wgtId)
      .attr("class", "axis")
      .attr('transform', this.translation(this.state.margin.left, this.state.height));
    svg.append("path")
      .attr("id", "line" + this.props.wgtId);

   this.draw(this.props);

  }
  
  componentWillReceiveProps(nextProps) {
   // if (nextProps.data != this.props.data) 
   console.log("Receiving props twice here");
   this.draw(nextProps);
  }

  render() {

    return (
      <Card className="timeline-widget">
        <svg id={"timeline" + this.props.wgtId}></svg>
      </Card>

    );
  }

}

TimelineDisplay.propTypes = {
  data: React.PropTypes.array.isRequired,
  wgtId: React.PropTypes.string.isRequired
};

export default TimelineDisplay;
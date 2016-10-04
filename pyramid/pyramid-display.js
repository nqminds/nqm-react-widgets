import React from "react";

import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from "material-ui/Card";

class PyramidDisplay extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      width: 280,
      height: 250,
      margin: {
        top: 20,
        right: 20,
        bottom: 24,
        left: 20,
        middle: 28
      },
      regionWidth:  112, // width/2 - margin.middle
      pointA: 112, // regionwidth
      pointB: 168 // width - regionwidth
    };
    this.draw = this.draw.bind(this);
   
  }

  translation(x,y) {
    return 'translate(' + x + ',' + y + ')';
  }

  draw(props) {
    let totalPop = 0;
    let maxValue = 0;
    let males = [];
    let females = [];
    _.forEach(props.data, function(data){
      if (data.age_band == "All Ages") totalPop += data.persons;
      else {
        if (data.persons > maxValue) maxValue = data.persons;
        if (data.gender == "male") males.push(data);
        else females.push(data);
      }
    });

    males.sort(function(a,b) {
      return b.age_band.replace(/(^\d+)(.+$)/i,'$1') - a.age_band.replace(/(^\d+)(.+$)/i,'$1');
    });
    females.sort(function(a,b) {
      return b.age_band.replace(/(^\d+)(.+$)/i,'$1') - a.age_band.replace(/(^\d+)(.+$)/i,'$1');
    });

    // Elements
    let svg = d3.select('#pyramid' + props.wgtId);
    let leftBarGroup = svg.select("#leftBarGroup" + props.wgtId);
    let rightBarGroup = svg.select("#rightBarGroup" + props.wgtId);

    // Scales
    let xScale = d3.scale.linear()
      .domain([0, maxValue])
      .range([this.state.regionWidth, 0])
      .nice();
    
    let xScaleLeft = d3.scale.linear()
      .domain([0, maxValue])
      .range([this.state.regionWidth, 0]);

    let xScaleRight = d3.scale.linear()
      .domain([0, maxValue])
      .range([0, this.state.regionWidth]);

    let yScale = d3.scale.ordinal()
      .domain(males.map(function(d) { return d.age_band; }).reverse())
      .rangeRoundBands([this.state.height,0], 0.1);
   
    // Axis
    let yAxisLeft = d3.svg.axis()
      .scale(yScale)
      .orient('right')
      .tickSize(4,0)
      .tickPadding(this.state.margin.middle-4);

    let yAxisRight = d3.svg.axis()
      .scale(yScale)
      .orient('left')
      .tickSize(4,0)
      .tickFormat('');

    let xAxisRight = d3.svg.axis()
      .scale(xScaleRight)
      .orient('bottom')
      .ticks(5, ",f");

    let xAxisLeft = d3.svg.axis()
      .scale(xScaleLeft)
      .orient('bottom')
      .ticks(5, ",f");
    
    // Drawing
    svg.selectAll(".axis.y.left." + props.wgtId)
      .call(yAxisLeft)
      .selectAll('text')
      .style('text-anchor', 'middle');
    
    svg.selectAll(".axis.y.right." + props.wgtId)
      .call(yAxisRight);

    svg.selectAll(".axis.x.left." + props.wgtId)
      .transition()
      .call(xAxisLeft);
    
    svg.selectAll(".axis.x.right." + props.wgtId)
      .transition()
      .call(xAxisRight);

    let barLeft = leftBarGroup.selectAll(".bar.left." + props.wgtId)
      .data(males);
    let barRight = rightBarGroup.selectAll('.bar.right.' + props.wgtId)
      .data(females);
    
    // Show data
    barLeft.enter().append('rect')
      .attr('class', 'bar left ' + props.wgtId)
      .attr('x', 0)
      .style("fill", "#a6cee3")
      .style("stroke-width", 1)
      .style("stroke", "#1f78b4");

    // Males on left
    barLeft.transition()
      .duration(500).ease("sin-in-out")
      .attr('y', function(d) { return yScale(d.age_band); })
      .style("opacity", function(d) {
        if(props.age_bands.indexOf(d.age_band) != -1 && props.male) return 1.0;
        else return 0.5;
      })
      .attr('width', function(d) { return xScaleRight(d.persons);})
      .attr('height', yScale.rangeBand());

    barRight.enter().append('rect')
      .attr('class', 'bar right ' + props.wgtId)
      .attr('x', 0)
      .style("fill", "#fb9a99")
      .style("stroke-width", 1)
      .style("stroke", "#e31a1c");
    
    // Females on right
    barRight.transition()
      .duration(500).ease("sin-in-out")
      .attr('y', function(d) { return yScale(d.age_band); })
      .style("opacity", function(d) {
        if(props.age_bands.indexOf(d.age_band) != -1 && props.female) return 1.0;
        else return 0.5;
      })
      .attr('width', function(d) { return xScaleRight(d.persons); })
      .attr('height', yScale.rangeBand());
  }

  componentDidMount() {

    let svg = d3.select('#pyramid' + this.props.wgtId)
      .attr('width', this.state.margin.left + this.state.width + this.state.margin.right)
      .attr('height', this.state.margin.top + this.state.height + this.state.margin.bottom)
      .append('g')
      .attr('transform', this.translation(this.state.margin.left, this.state.margin.top));

    svg.append("g")
      .attr('class', 'axis y left ' + this.props.wgtId)
      .attr('transform', this.translation(this.state.pointA, 0));
    svg.append('g')
      .attr('class', 'axis y right ' + this.props.wgtId)
      .attr('transform', this.translation(this.state.pointB, 0));
    svg.append('g')
      .attr('class', 'axis x left ' + this.props.wgtId)
      .attr('transform', this.translation(0, this.state.height));
    svg.append('g')
      .attr('class', 'axis x right  ' + this.props.wgtId)
      .attr('transform', this.translation(this.state.pointB, this.state.height));

    let leftBarGroup = svg.append('g')
      .attr("id", "leftBarGroup" + this.props.wgtId)
      .attr('transform', this.translation(this.state.pointA, 0) + 'scale(-1,1)');
    let rightBarGroup = svg.append('g')
      .attr("id", "rightBarGroup" + this.props.wgtId)
      .attr('transform', this.translation(this.state.pointB, 0));
    
    this.draw(this.props);

  }
  
  componentWillReceiveProps(nextProps) {
    this.draw(nextProps);
    
  
  }

  render() {

    return (
      <Card className="pyramid-widget">
        <svg id={"pyramid" + this.props.wgtId}></svg>
      </Card>
    );
  }

}

PyramidDisplay.propTypes = {
  data: React.PropTypes.array.isRequired,
  wgtId: React.PropTypes.string.isRequired,
  age_bands: React.PropTypes.array.isRequired,
  male: React.PropTypes.bool.isRequired,
  female: React.PropTypes.bool.isRequired
};

export default PyramidDisplay;
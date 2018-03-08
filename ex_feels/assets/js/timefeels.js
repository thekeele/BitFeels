function addAxes (svg, xAxis, yAxis, chartHeight, name) {
  var axes = svg.append('g')
    .attr('clip-path', 'url(#axes-clip)');

  axes.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + chartHeight + ')')
    .call(xAxis)
  .selectAll("text")
    .attr("transform", "rotate(45)")
    .style("text-anchor", "start");

  axes.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
      .attr('transform', 'translate(-10,' + chartHeight/2 + ')rotate(-90)')
      .attr('y', 0)
      .style('text-anchor', 'middle')
      .text(name)
        .style('font-weight', 'bold');
}

function drawPaths (svg, data, x, y) {

  let tol = 0.01
  var upperArea = d3.svg.area()
    .interpolate('basis')
    .x (function (d) { return x(d.time) || 1; })
    .y0(function (d) { return y(d.mean) + y(d.std) + tol; })
    .y1(function (d) { return y(d.mean); });
  
  var meanLine = d3.svg.line()
    .interpolate('basis')
    .x(function (d) { return x(d.time); })
    .y(function (d) { return y(d.mean); });

  var lowerArea = d3.svg.area()
    .interpolate('basis')
    .x (function (d) { return x(d.time) || 1; })
    .y0(function (d) { return y(d.mean); })
    .y1(function (d) { return y(d.mean) - y(d.std) - tol; });

  svg.datum(data);

  svg.append('path')
    .attr('class', 'area upper inner')
    .attr('d', upperArea)
    .attr('clip-path', 'url(#rect-clip)');

  svg.append('path')
    .attr('class', 'area lower inner')
    .attr('d', lowerArea)
    .attr('clip-path', 'url(#rect-clip)');

  svg.append('path')
    .attr('class', 'median-line')
    .attr('d', meanLine)
    .attr('clip-path', 'url(#rect-clip)');
}

function startTransitions (chartWidth, rectClip) {
  rectClip.transition().attr('width', chartWidth);
}

function makeChart (data, name) {

  var svgWidth  = 1024,
      svgHeight = 450,
      margin = { top: 20, right: 20, bottom: 50, left: 50 },
      chartWidth  = svgWidth  - margin.left - margin.right,
      chartHeight = svgHeight - margin.top  - margin.bottom;

  var x = d3.time.scale().range([0, chartWidth])
            .domain(d3.extent(data, function (d) { return d.time; })),
      y = d3.scale.linear().range([chartHeight, 0])
            .domain([-1, 1]);
  var extent = d3.extent(data, function (d) { return d.time; });
  console.log(extent)
  var xAxis = d3.svg.axis().scale(x).orient('bottom')
                .innerTickSize(-chartHeight).outerTickSize(0).tickPadding(10)
                .tickFormat(d3.time.format("%b %d")),
      yAxis = d3.svg.axis().scale(y).orient('left')
                .innerTickSize(-chartWidth).outerTickSize(0).tickPadding(10)
                .tickValues([-1,1])
                .tickFormat(d => ["😭", "🤑"][(d+1)/2]) // [-1,1]->[0,1]

  var svg = d3.select('#timefeels').append('svg')
    .attr('width',  svgWidth)
    .attr('height', svgHeight)
    .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // clipping to start chart hidden and slide it in later
  var rectClip = svg.append('clipPath')
    .attr('id', 'rect-clip')
    .append('rect')
      .attr('width', 0)
      .attr('height', chartHeight);
  addAxes(svg, xAxis, yAxis, chartHeight, name);
  drawPaths(svg, data, x, y);
  startTransitions(chartWidth, rectClip);
}

var parseTime = d3.time.format('%a %b %d %H:%M:%S %Z %Y').parse;

// convert timestamp to javascript native Date
function conversion (d) {
  return {
    time: new Date(d.time*1000), // conversion to milliseconds
    mean: d.mean,
    std: d.std,
    classifier: d.classifier
  };
};

// Hit the bitfeels api for stats, log and make chart
var url = "/bitfeels/api/stats"
var response = d3.json(url, function (json) {
  console.log(json);
  let classifiers = new Set(json.map(d => d.classifier))
  classifiers.forEach(function (classifier) {
    var data = json.filter(d => d.classifier == classifier);
    console.log(data);
    makeChart(data.map(conversion), classifier);
  });
  //makeChart(json.map(conversion));
});

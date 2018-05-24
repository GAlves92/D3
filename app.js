d3.csv("/data/data.csv", function(data) {
    console.log(data[0]);
  });

var margin = {top: 20, right: 20, bottom: 50, left: 70},
  width = 960 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

var svg = d3.select("#body")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var chart = svg.append("g")

d3.csv("/data/data.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(healthcare) {
    healthcare.medianEarnings = +healthcare.medianEarnings;
    healthcare.totalPopulation = +healthcare.totalPopulation;
  // console.log(healthcare);
  });

  var xLinearScale = d3.scaleLinear()
  .range([0, width]);

  var yLinearScale = d3.scaleLinear()
  .range([height, 0]);

  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  xLinearScale.domain([300000, d3.max(data, function(healthcare) {
    return +healthcare.totalPopulation;
  })]);
  yLinearScale.domain([0, d3.max(data, function(healthcare) {
    return +healthcare.medianEarnings;
  })]);

  var tooltip = d3.tip()
  .attr("class", "tooltip")
  .style("opacity", 0)
  .html(function(healthcare) {
    var Population = +healthcare.totalPopulation
    var money = +healthcare.medianEarnings
    var place = healthcare.Location
    return ("State: " + place + "<br> Population: " + Population + "<br> Median Earnings: " + money);
  });

  chart.call(tooltip);

  chart.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", function(healthcare, index) {
      return xLinearScale(healthcare.totalPopulation);
    })
    .attr("cy", function(healthcare, index) {
      return yLinearScale(healthcare.medianEarnings);
    })
    .attr("r", "15")
    .attr("fill", "blue")
    .on("click", function(healthcare) {
      tooltip.show(healthcare);
    })
    .on("mouseout", function(healthcare) {
      tooltip.hide(healthcare);
    });

  chart.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chart.append("g")
    .call(leftAxis);

  chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + .5)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Median Earnings");

  chart.append("text")
  .attr("transform", "translate(" + (width / 2) + " ," + (height + margin.top + 25) + ")")
  .attr("class", "axisText")
  .text("Total Population");
});

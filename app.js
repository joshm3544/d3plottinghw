var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 100,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("data.csv").then(function(data) {

    // Step 1: Parse Data/Cast as numbers
    // ==============================
    data.forEach(function(x) {
      data.poverty = +data.poverty;
      data.healthcare = +data.healthcare;
    });

    // Step 2: Create scale functions
    // ==============================
    var xLinearScale = d3.scaleLinear()
      .domain([8, 22])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([0, 26])
      .range([height, 0]);

    // Step 3: Create axis functions
    // ==============================
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Step 4: Append Axes to the chart
    // ==============================
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // Step 5: Create Circles
    // ==============================
    var circlesGroup = chartGroup.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcare))
    .attr("r", "10")
    .attr("fill", "lightblue")
    .attr("opacity", ".5")
	/*.append("text")
   // We return the abbreviation to .text, which makes the text the abbreviation.
	.text(function(d) {
     return d.abbr;
	})
   // Now place the text using our scale.
	.attr("dx", function(d) {
     return xScale(d[curX]);
	})
	.attr("dy", function(d) {
     // When the size of the text is the radius,
     // adding a third of the radius to the height
     // pushes it into the middle of the circle.
     return yScale(d[curY]) + circRadius / 2.5;
	})
	.attr("font-size", circRadius)
	.attr("class", "stateText")
   // Hover Rules
	.on("mouseover", function(d) {
     // Show the tooltip
     toolTip.show(d);
     // Highlight the state circle's border
     d3.select("." + d.abbr).style("stroke", "#323232");
	})
	.on("mouseout", function(d) {
     // Remove tooltip
     toolTip.hide(d);
     // Remove highlight
     d3.select("." + d.abbr).style("stroke", "#e3e3e3");
	}); */

    // Step 6: Initialize tool tip
    // ==============================
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.abbr}<br>Poverty: ${d.poverty}<br>Healthcare: ${d.healthcare}`);
      });

    // Step 7: Create tooltip in the chart
    // ==============================
    chartGroup.call(toolTip);

    // Step 8: Create event listeners to display and hide the tooltip
    // ==============================
    circlesGroup.on("click", function(x) {
      toolTip.show(x, this);
    })
      // onmouseout event
      .on("mouseout", function(x, index) {
        toolTip.hide(x);
      });

    // Create axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");
	  


    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");
	  
  }).catch(function(error) {
    console.log(error);
  });
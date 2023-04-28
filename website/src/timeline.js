
// Get the width of the Bootstrap container
var containerWidth = d3.select(".container").node().getBoundingClientRect().width;
var height = 400;
const radius = 5;

d3.csv("./src/data/books.csv").then( function(data) {
    
    var parseDate = d3.timeParse("%Y"); 
    data.forEach(function(d) {
        d.date = parseDate(Number(d.year))
    });

// Set up the tooltip
var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("background-color", "white")
    .style("padding", "5px")
    .style("border-radius", "5px")
    .style("box-shadow", "0 2px 5px rgba(0, 0, 0, 0.3)")
    .style("visibility", "hidden");

// Set up the SVG
var svg = d3.select("#viz1")
.attr("width", containerWidth)
.attr("height", height);

// Set up the scales
var xScale = d3.scaleTime()
   .domain([new Date(1440, 0, 1), new Date()])
   .range([50, containerWidth - 50]);

 // Add circles
 var circles = svg.selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function(d) { console.log(d.title);return xScale(d.date);})
    .attr("cy", height / 2)
    .attr("r", radius)
    .on("click", function(e, d) {

        e.stopPropagation(); // Prevent click event from bubbling up to the SVG element
        var circle = d3.select(this);
        var tooltipWidth = 100;
        var tooltipHeight = 50;
        var tooltipX = circle.attr("cx") - tooltipWidth / 2;
        var tooltipY = circle.attr("cy") - tooltipHeight - radius - 5;
        tooltip.style("left", tooltipX + "px")
                .style("top", tooltipY + "px")
                .style("visibility", "visible")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", tooltipWidth)
                .attr("height", tooltipHeight)
                .attr("fill", "white")
                .attr("stroke", "black")
                .attr("rx", 5)
                .attr("ry", 5)
                .on("click", function() {
                    tooltip.style("visibility", "hidden");
                });
        tooltip.append("text")
                .text(d.author + " (" + d.year + ")")
                .attr("x", tooltipWidth / 2)
                .attr("y", tooltipHeight / 2)
                .style("text-anchor", "middle")
                .style("alignment-baseline", "middle");
    })
    .on("mouseover", function(d) {
    d3.select(this).attr("r", radius * 1.5);
    })
    .on("mouseout", function(d) {
    d3.select(this).attr("r", radius);
    tooltip.style("visibility", "hidden");
    });
    
// Add axes and labels
var xAxis = d3.axisBottom(xScale);
svg.append("g")
    .attr("transform", "translate(0, " + height / 2 +" )")
    .call(xAxis);
svg.append("text")
    .attr("x", 400)
    .attr("y", 90)
    .style("text-anchor", "middle")
    .text("Viz 1");


  });


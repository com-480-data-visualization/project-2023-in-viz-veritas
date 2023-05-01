
// Get the width of the Bootstrap container
var containerWidth = d3.select(".scrollable-right").node().getBoundingClientRect().width;
var height = 400;
const radius = 10;
const enlarged = radius * 8;


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

// Add the image pattern definitions
var defs = svg.append("defs");
data.forEach(function(d) {
  defs.append("pattern")
    //.attr("id", d.id) for later
    .attr("id", "testImage-" + d.book_id) // using unique id for each pattern
    .attr("patternContentUnits", "objectBoundingBox")
    .attr("width", 1)
    .attr("height", 1)
    .append("image")

    .attr("xlink:href", "src/img/example.png")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("width", 1)
    .attr("height", 1)
});
 // Add circles
var circles = svg.selectAll("circle")
.data(data)
.enter()
.append("circle")
.attr("fill", "black")
.attr("cx", function(d) {return xScale(d.date);})
.attr("cy", height / 2)
.attr("r", radius)


.on("mouseover", function(d) {
    d3.select(this)
    .attr("r", enlarged)
    .attr("fill", function(d) { return "url(#testImage-" + d.book_id + ")" })
    .attr("z-index", 1)
})
.on("mouseout", function(d) {
    d3.select(this).attr("r", radius)
    .attr("fill", "black")
    .attr("z-index", null)
        
    tooltip.style("visibility", "hidden");
    tooltip.select("text").remove();
})

.on("click", function(e, d) {

    e.stopPropagation(); // Prevent click event from bubbling up to the SVG element
    var circle = d3.select(this);
    var tooltipWidth = 100;
    var tooltipHeight = 50;
    var tooltipX = (containerWidth - tooltipWidth) / 2;
    var tooltipY = height + radius + 5; // position below the timeline
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

    // Remove existing text before adding new text
    tooltip.selectAll("text").remove();
    tooltip.append("text")
            .text(d.author + " (" + d.year + ")")
            .attr("x", tooltipWidth / 2)
            .attr("y", tooltipHeight / 2)
            .style("text-anchor", "middle")
            .style("alignment-baseline", "middle");
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
svg.append("img")
    .attr("background-image", "url(#testImage")


  });


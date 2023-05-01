
// Get the width of the Bootstrap container
var containerWidth = d3.select(".scrollable-right").node().getBoundingClientRect().width;
var height = 400;
const radius = 8;
const enlarged = radius * 5;


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
        
    // tooltip.style("visibility", "hidden");
    // tooltip.select("text").remove();
})

.on("click", function(e, d) {

    e.stopPropagation(); // Prevent click event from bubbling up to the SVG element
    var circle = d3.select(this);
    var tooltipWidth = 300;
    var tooltipHeight = 100;
    var tooltipX = (containerWidth - tooltipWidth) / 2;
    var tooltipY = height + radius + 5; // position below the timeline
    tooltip.style("left", tooltipX + "px")
          .style("top", tooltipY + "px")
          .style("visibility", "visible");
    
    // Remove existing elements before adding new elements
    tooltip.selectAll("*").remove();
    
    // Add SVG element inside tooltip
    var tooltipSvg = tooltip.append("svg")
                            .attr("width", tooltipWidth)
                            .attr("height", tooltipHeight)
                            .style("background-color", "white")
                            .style("border", "1px solid black");

    // Add image to tooltip
    var imageWidth = 120;
    var imageHeight = 120;
    var imageX = 0;
    var imageY = (tooltipHeight - imageHeight) / 2;
    tooltipSvg.append("rect")
                .attr("x", imageX)
                .attr("y", imageY)
                .attr("width", imageWidth)
                .attr("height", imageHeight)
                .attr("fill", "url(#testImage-" + d.book_id + ")" );
    
    // Add text to tooltip
    var textX = imageX + imageWidth + 10;
    var textY = tooltipHeight / 2;
    tooltipSvg.append("text")
                .text(d.author + " (" + d.year + ")")
                .attr("x", textX)
                .attr("y", textY)
                .style("text-anchor", "start")
                .style("alignment-baseline", "middle")
                .style("font-size", "16px");
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



// Get the width of the Bootstrap container
var containerWidth = d3.select(".scrollable-right").node().getBoundingClientRect().width;
var height = 400;

// Size of circles
var radius = 10;
var enlarged = radius * 8;

// Define the radius of the hover effect
var hoverRadius = 20;
// Define the maximum increase in radius when hovered
var hoverIncrease = 10;

var dis_circles = 2; 


d3.csv("./src/data/books.csv").then(function (data) {

    var parseDate = d3.timeParse("%Y");
    data.forEach(function (d) {
        d.date = parseDate(Number(d.year))
    });

    // Set up the tooltip
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
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
        .range([0, containerWidth - 200]);

    // Add the image pattern definitions
    var defs = svg.append("defs");
    data.forEach(function (d) {
        defs.append("pattern")
            .attr("id", d.book_id)
            .attr("patternContentUnits", "objectBoundingBox")
            .attr("width", 1)
            .attr("height", 1)
            .append("image")

            .attr("xlink:href", "src/img/thumbnails/" + d.book_id + ".png")
            .attr("preserveAspectRatio", "xMidYMid meet")
            .attr("width", 1)
            .attr("height", 1)
    });

    // Set up the simulation
    var simulation = d3.forceSimulation(data)
        .force("x", d3.forceX(function (d) { return xScale(d.date); }))
        .force("y", d3.forceY(height /4))
        .force("collide", d3.forceCollide(radius + dis_circles))
        .stop();

    // Manually run simulation
    for (let i = 0; i < data.length; ++i) {
        simulation.tick(10);
    }



    // Add the beeswarm
    var beeswarm = svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("r", radius)
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("fill", function (d) { return "url(#" + d.book_id + ")" })
        .attr("z-index", 0)
        .on("mouseover", function (e, d) {

            // Get the mouse position
            var mouse = d3.pointer(e);


            // Iterate over all circles and calculate the distance between the mouse and each circle
            beeswarm.each(function (d) {
                var circle = d3.select(this);
                var distance = Math.sqrt(Math.pow(circle.attr("cx") - mouse[0], 2) + Math.pow(circle.attr("cy") - mouse[1], 2));

                // If the circle is within the hover radius, increase its size based on distance from mouse
                if (distance <= hoverRadius) {
                    var increase = hoverIncrease * (1 - distance / hoverRadius);
                    circle.attr("r", radius + increase);
                }
            });
        })
        .on("mouseout", function (d) {
            d3.selectAll("circle")
                .attr("r", radius)
                .attr("z-index", null)
                

        })

        .on("click", function (e, d) {

            e.stopPropagation(); // Prevent click event from bubbling up to the SVG element
            var circle = d3.select(this);
            var tooltipWidth = 500;
            var tooltipHeight = 250;
            var tooltipX = e.x;
            var tooltipY = e.y; // position below the timeline
            console.log(tooltipY)
            tooltip.style("left", tooltipX + "px")
                .style("top", tooltipY + "px")
                .style("visibility", "visible");

            // Remove existing elements before adding new elements
            tooltip.selectAll("*").remove();

            // Add SVG element inside tooltip
            var tooltipSvg = tooltip.append("svg")
                .attr("width", tooltipWidth)
                .attr("height", tooltipHeight)

            // Add image to tooltip
            var imageWidth = 300;
            var imageHeight = 300;
            var imageX = 0;
            var imageY = (tooltipHeight - imageHeight) / 2;
            tooltipSvg.append("rect")
                .attr("x", imageX)
                .attr("y", imageY)
                .attr("width", imageWidth)
                .attr("height", imageHeight)
                .attr("fill", "url(#" + d.book_id + ")");

            // Add text to tooltip
            var textX = imageX + imageWidth + 10;
            var textY = tooltipHeight / 2;
            var tooltipText = tooltipSvg.append("foreignObject")
                .attr("x", textX)
                .attr("y", textY)
                .attr("width", tooltipWidth - imageWidth - 20)
                .attr("height", tooltipHeight)
                .append("xhtml:p")
                .attr("class", "text-justify")
                .style("font-size", "10px")
                .text("Title: " + d.title);


        });

    // Add click event listener to document object
    d3.select(document).on("click", function () {
        tooltip.style("visibility", "hidden");
    });

    // Add axes and labels
    var xAxis = d3.axisBottom(xScale);
    svg.append("g")
        .attr("transform", "translate(0, " + (height / 2)+ " )")
        .call(xAxis);

    


});



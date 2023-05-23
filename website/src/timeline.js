
// Get the width of the Bootstrap container
var containerWidth = d3.select(".row").node().getBoundingClientRect().width;
var margin = { top: 20, right: 20, bottom: 30, left: 40 };
var width = containerWidth - margin.left - margin.right;
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

    var svg = d3.select("#viz1")
        .attr("width", width)
        .attr("height", height + margin.top + margin.bottom);

    // actual width and height
    width = d3.select("#viz1").node().getBoundingClientRect().width
    height = d3.select("#viz1").node().getBoundingClientRect().height

    // Set up the scales
    var xScale = d3.scaleTime()
        .domain([new Date(1440, 0, 1), new Date()])
        .range([0, width]);

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
        .force("y", d3.forceY(height / 4))
        .force("collide", d3.forceCollide(radius + dis_circles))
        .stop();

    for (let i = 0; i < data.length; ++i) {
        simulation.tick(10);
    }

    var tooltip = d3.select("body").append("div")
        .attr("class", "timeline-tooltip")
        .style("visibility", "hidden");

    // Add the beeswarm
    var beeswarm = svg
        .selectAll("circle")
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

        .on("click", function (event, d) {

            event.stopPropagation(); // Prevent click event from bubbling up to the SVG element

            tooltip.style("visibility", "visible")
                .style("left", event.pageX + 10 + "px")
                .style("top", event.pageY + 10 + "px");

            tooltip.selectAll("*").remove();

            // Create a container element for the book card
            var bookCardContainer = tooltip.append("div")

            // Call the createBookCards function to populate the book card container with the book card
            createBookCards(bookCardContainer, [d]);

            // Position the book card container relative to the mouse cursor
            bookCardContainer.style("left", event.pageX + 10 + "px")
                .style("top", event.pageY + 10 + "px");




        });

    // Add click event listener to document object
    d3.select(document).on("click", function () {
        tooltip.style("visibility", "hidden");
    });

    // Add axes and labels
    var xAxis = d3.axisBottom(xScale);
    svg.append("g")
        .attr("transform", "translate(0, " + (height / 2) + " )")
        .call(xAxis);




});



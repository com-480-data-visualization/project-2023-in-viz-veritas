function whenDocumentLoaded(action) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", action);
    } else {  // `DOMContentLoaded` already fired
        action();
    }
}
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


whenDocumentLoaded(() => {


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


        var tooltip = d3.select("body").append("div")
            .attr("class", "timeline-tooltip")
            .style("visibility", "hidden");

        function updateBeeswarm(data) {

            var selectedLanguages = div.selectAll(".checkbox:checked").nodes().map(function (checkbox) {
                return checkbox.value;
            });
            console.log(selectedLanguages)
            var newData = data.filter(function (d) {
                return selectedLanguages.includes(d.language);
            });

            // Set up the simulation
            var simulation = d3.forceSimulation(newData)
                .force("x", d3.forceX(function (d) { return xScale(d.date); }).strength(0.1))
                .force("y", d3.forceY(height / 4).strength(0.1))
                .force("collide", d3.forceCollide(radius + dis_circles))
                .stop();

            for (let i = 0; i < newData.length; ++i) {
                simulation.tick(10);
            }

            var circles = svg.selectAll("circle")
                .data(newData, function (d) { return d.book_id; });

            circles.exit().remove();

            circles.enter()
                .append("circle")
                .attr("r", radius)
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })
                .attr("fill", function (d) { return "url(#" + d.book_id + ")"; })
                // .on("mouseover", handleMouseOver) // Use a separate function for mouseover event
                // .on("mouseout", handleMouseOut)
                .merge(circles)
                .on("click", function (event, d) {
                    event.stopPropagation(); // Prevent click event from bubbling up to the SVG element
                    tooltip.style("visibility", "visible")
                        .style("left", event.pageX + 10 + "px")
                        .style("top", event.pageY + 10 + "px");

                    tooltip.selectAll("*").remove();

                    // Create a container element for the book card
                    var bookCardContainer = tooltip.append("div")
                        .on("click", function () {
                            // Open a new page in the browser
                            window.open(d.manifest, "_blank");
                        });

                    // Call the createBookCards function to populate the book card container with the book card
                    createBookCards(bookCardContainer, [d]);

                    // Position the book card container relative to the mouse cursor
                    bookCardContainer.style("left", event.pageX + 10 + "px")
                        .style("top", event.pageY + 10 + "px");

                })
                .transition()
                .duration(500)
                .attr("r", radius)
                .attr("cx", function (d) { return d.x; })
                .attr("cy", function (d) { return d.y; })
                .attr("fill", function (d) { return "url(#" + d.book_id + ")"; });
            // function handleMouseOver(e, d) {
            //     // Get the mouse position
            //     var mouse = d3.pointer(e);
            //     // Iterate over all circles and calculate the distance between the mouse and each circle
            //     circles.each(function (d) {
            //         var circle = d3.select(this);
            //         var distance = Math.sqrt(Math.pow(circle.attr("cx") - mouse[0], 2) + Math.pow(circle.attr("cy") - mouse[1], 2));

            //         // If the circle is within the hover radius, increase its size based on distance from mouse
            //         if (distance <= hoverRadius) {
            //             var increase = hoverIncrease * (1 - distance / hoverRadius);
            //             circle.attr("r", radius + increase);
            //         }
            //     });
            // }
            // function handleMouseOut(e, d) {
            //     d3.selectAll("circle")
            //         .attr("r", radius)
            //         .attr("z-index", null)
            // }


}




        // Get unique language values
        var languages = [... new Set(d3.map(data, function (d) { return d.language; }))]

var div = d3.select("#timeline")

// Append checkboxes for each language
div.selectAll(".checkbox")
    .data(languages)
    .enter()
    .append("label")
    .attr("class", "checkbox-label")
    .text(function (d) { return d; })
    .append("input")
    .attr("type", "checkbox")
    .attr("class", "checkbox")
    .attr("value", function (d) { return d; })
    .on("change", function () {
        updateBeeswarm(data);
    });

// init simulation

var checkboxes = document.getElementsByClassName("checkbox");
for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = true;
}
updateBeeswarm(data);
// var selectedLanguages = div.selectAll(".checkbox:checked").nodes().map(function (checkbox) {
//     return checkbox.value;
// });

// var filteredData = data.filter(function (d) {
//     return selectedLanguages.includes(d.language);
// });
// updateBeeswarm(filteredData);

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

});



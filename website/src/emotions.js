
// Get the width of the Bootstrap container
var containerWidth = d3.select(".scrollable-right").node().getBoundingClientRect().width;
var height = 400;
// const radius = 5;
// const enlarged = radius * 8;



d3.csv("./src/data/page_emotions.csv").then(function (data) {

    var parseDate = d3.timeParse("%Y");
    data.forEach(function (d) {
        d.page_number = Number(d.page_number)
        d.valence = Number(d.valence)
        d.arousal = Number(d.arousal)   
    });

    // // Set up the tooltip
    // var tooltip = d3.select("body")
    //     .append("div")
    //     .style("position", "absolute")
    //     .style("background-color", "white")
    //     .style("padding", "5px")
    //     .style("border-radius", "5px")
    //     .style("box-shadow", "0 2px 5px rgba(0, 0, 0, 0.3)")
    //     .style("visibility", "hidden");

    // Set up the SVG
    var svg = d3.select("#viz2")
        .attr("width", containerWidth)
        .attr("height", height/2);

    var x = d3.scaleLinear()
      .domain(d3.extent(data, function(d) { return +d.page_number; }))
      .range([ 0, containerWidth ]);
    svg.append("g")
      .attr("transform", "translate(0," + height/2 + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
      .domain([-1, 1])
      .range([ height/2, 0 ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    // Add the line
    svg.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#111f00")
      .attr("stroke-width", 2)
      .attr("d", d3.line()
        .x(function(d) { return x(d.page_number) })
        .y(function(d) { return y(d.valence) })
        )

});




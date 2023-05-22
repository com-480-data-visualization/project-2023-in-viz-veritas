const primaryColor = getComputedStyle(
  document.documentElement
).getPropertyValue("--primary-color");
console.log(primaryColor);

var pages; // Declare the variable outside the scope
function createEmotionViz(bookid) {

  // Clear previous charts
  d3.select("#valence-chart").selectAll("*").remove();
  d3.select("#arousal-chart").selectAll("*").remove();

  // Load the selected book's data
  d3.json("./src/data/emotions/" + bookid + ".json")
    .then(function (data) {
      pages = data.pages; // Assign the value to the variable

      // Extract valence and arousal values
      var valenceData = pages.map(function (page) {
        return page.valence;
      });

      var arousalData = pages.map(function (page) {
        return page.arousal;
      });

      // Call the function to create line charts
      createLineChart(valenceData, "Valence", "valence-chart");
      createLineChart(arousalData, "Arousal", "arousal-chart");
      createScatterPlot(pages, "Emotion Scatter Plot", "emotion-scatter");
      console.log("Loaded emotion data correctly");
    })
    .catch(function (error) {
      console.log("Error fetching data:", error);
    });
}

function createScatterPlot(data, title, chartId) {
  // Set up the dimensions and margins of the chart
  var margin = { top: 20, right: 20, bottom: 30, left: 40 },
    width = 600 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // Create the SVG element
  var svg = d3
    .select("#" + chartId)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Set the x-axis scale
  var x = d3.scaleLinear().domain([-1, 1]).nice().range([0, width]);

  // Set the y-axis scale
  var y = d3.scaleLinear().domain([-1, 1]).nice().range([height, 0]);

  // Create the x-axis
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Create the y-axis
  svg.append("g").attr("class", "y-axis").call(d3.axisLeft(y));

  // Create the scatterplot points
  svg
    .selectAll(".dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", (d) => x(d.valence))
    .attr("cy", (d) => y(d.arousal))
    .attr("r", 3)
    .style("fill", primaryColor);

  // Add title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 0 - margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(title);

  // Add tooltip
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "emotion-tooltip")
    .style("visibility", "hidden");

  // Add mouseover event handler to scatterplot points
  svg
    .selectAll(".dot")
    .on("mouseover", function (event, d) {
      tooltip.style("visibility", "visible");

      var page = data.indexOf(d) + 1;
      var valence = d.valence;
      var arousal = d.arousal;
      var emotion = d.emotion;
      var valText = "Valence: " + valence.toFixed(2);
      var arousalText = "Arousal: " + arousal.toFixed(2);

      tooltip
        .html(
          "Page: " +
            page +
            "<br>" +
            valText +
            "<br>" +
            arousalText +
            "<br>" +
            "Emotion: " +
            emotion
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + 10 + "px");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
    });
}

function createLineChart(data, title, chartId) {
  var width = d3
    .select(".row")
    .node()
    .getBoundingClientRect().width;
  var height = 400;
  var margin = { top: 20, right: 20, bottom: 40, left: 40 };
  var chartWidth = width - margin.left - margin.right;
  var chartHeight = height - margin.top - margin.bottom;

  var svg = d3
    .select("#" + chartId)
    .attr("width", width)
    .attr("height", height);

  var chart = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Set the scales for x and y axes
  var xScale = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([0, chartWidth]);
  var yScale = d3.scaleLinear().domain([-1, 1]).range([chartHeight, 0]);

  // Define the line generator
  var line = d3
    .line()
    .x(function (d, i) {
      return xScale(i);
    })
    .y(function (d) {
      return yScale(d);
    });

  // Append the line path to the chart
  chart
    .append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", primaryColor)
    .attr("stroke-width", 1.5)
    .attr("d", line);

  // Add x-axis
  chart
    .append("g")
    .attr("transform", "translate(0," + chartHeight + ")")
    .call(d3.axisBottom(xScale));

  // Add y-axis
  chart.append("g").call(d3.axisLeft(yScale));

  // Add dashed line at y = 0
  chart
    .append("line")
    .attr("x1", 0)
    .attr("x2", chartWidth)
    .attr("y1", yScale(0))
    .attr("y2", yScale(0))
    .attr("stroke", "black")
    .attr("stroke-dasharray", "3 3");

  // Add chart title
  chart
    .append("text")
    .attr("x", chartWidth / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(title);

  // Add tooltip
  //TODO : modularize this
  var tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "emotion-tooltip")
    .style("visibility", "hidden");

  // Add mouseover event handler
  chart
    .on("mouseover", function () {
      tooltip.style("visibility", "visible");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
    })
    .on("mousemove", function (event) {
      var mouseX = d3.pointer(event)[0];
      var mouseY = d3.pointer(event)[1];

      var index = Math.round(xScale.invert(mouseX));
      var val = data[index];
      var page = index + 1;
      var emotion = pages[index].emotion;
      var valText = title + ": " + val.toFixed(2);

      tooltip
        .html(
          "Page: " + page + "<br>" + valText + "<br>" + "Emotion: " + emotion
        )
        .style("left", event.x + 10 + "px")
        .style("top", event.y + 10 + "px");
    });
}

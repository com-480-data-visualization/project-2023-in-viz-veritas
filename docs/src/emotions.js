const primaryColor = getComputedStyle(
  document.documentElement
).getPropertyValue("--primary-color");

let pages; // Declare the variable outside the scope
function createEmotionViz(bookid) {
  // Clear previous charts
  d3.select("#valence-chart").selectAll("*").remove();
  d3.select("#arousal-chart").selectAll("*").remove();
  d3.select("#emotion-scatter").selectAll("*").remove();

  // Load the selected book's data
  d3.json("./src/data/emotions/" + bookid + ".json")
    .then(function (data) {
      pages = data.pages; // Assign the value to the variable

      // Extract valence and arousal values
      const valenceData = pages.map(function (page) {
        return page.valence;
      });

      const arousalData = pages.map(function (page) {
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
  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = 400 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create the SVG element
  const svg = d3
    .select("#" + chartId)
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Set the x-axis scale
  const x = d3.scaleLinear().domain([-1, 1]).nice().range([0, width]);

  // Set the y-axis scale
  const y = d3.scaleLinear().domain([-1, 1]).nice().range([height, 0]);

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
    .style("fill", primaryColor)
    .style("stroke", "none");

  // Add title
  svg
    .append("text")
    .attr("x", width / 2)
    .attr("y", 0)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(title);

  // Add tooltip
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "emotion-tooltip")
    .style("visibility", "hidden");

  // Add mouseover event handler to scatterplot points
  svg
    .selectAll(".dot")
    .on("mouseover", function () {
      tooltip.style("visibility", "hidden");
      d3.select(this).style("stroke", "black");

    })
    .on("mousemove", function (event, d) {
      tooltip.style("visibility", "visible");

      const page = data.indexOf(d) + 1;
      const valence = d.valence;
      const arousal = d.arousal;
      const emotion = d.emotion;
      const valText = "Valence: " + valence.toFixed(2);
      const arousalText = "Arousal: " + arousal.toFixed(2);

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
    .on("mouseleave", function () {
      tooltip.style("visibility", "hidden");
      d3.select(this).style("stroke", "none")
    });
}

function createLineChart(data, title, chartId) {
  //FIXME: want this dynamic
  const width = 400;
  const height = 200;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  const svg = d3
    .select("#" + chartId)
    .attr("width", width)
    .attr("height", height);

  const chart = svg
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Append a transparent overlay rectangle to capture mouse events
  chart
    .append("rect")
    .attr("class", "overlay")
    .attr("width", chartWidth)
    .attr("height", chartHeight)
    .style("opacity", 0)
    .on("mouseover", function () {
      tooltip.style("visibility", "visible");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
      chart.select(".vertical-line").style("visibility", "hidden");
    })
    .on("mousemove", function (event) {
      const mouseX = d3.pointer(event)[0];
      const mouseY = d3.pointer(event)[1];

      // Display tooltip and vertical line at the X position of the mouse
      tooltip.style("visibility", "visible");
      tooltip
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + 10 + "px");
      chart
        .select(".vertical-line")
        .attr("x1", mouseX)
        .attr("x2", mouseX)
        .attr("y1", 0)
        .attr("y2", chartHeight)
        .style("visibility", "visible");

      const index = Math.round(xScale.invert(mouseX));
      const val = data[index];
      const page = index + 1;
      const emotion = pages[index].emotion;
      const valText = title + ": " + val.toFixed(2);

      tooltip.html(
        "Page: " + page + "<br>" + valText + "<br>" + "Emotion: " + emotion
      );
    });

  // Set the scales for x and y axes
  const xScale = d3
    .scaleLinear()
    .domain([0, data.length - 1])
    .range([0, chartWidth]);
  const yScale = d3.scaleLinear().domain([-1, 1]).range([chartHeight, 0]);

  // Define the line generator
  const line = d3
    .line()
    .x((d, i) => xScale(i))
    .y((d) => yScale(d));

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
    .attr("y", -margin.top / 4)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .text(title);

  // Add tooltip
  //TODO : modularize this
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "emotion-tooltip")
    .style("visibility", "hidden");

  chart
    .append("line")
    .attr("class", "vertical-line")
    .attr("x1", 0)
    .attr("x2", 0)
    .attr("y1", 0)
    .attr("y2", chartHeight)
    .attr("stroke", "black")
    .attr("stroke-dasharray", "3 3")
    .style("visiblity", "hidden");

  // Add mouseover event handler
  chart
    .on("mouseover", function () {
      tooltip.style("visibility", "visible");
    })
    .on("mouseout", function () {
      tooltip.style("visibility", "hidden");
    })
    .on("mousemove", function (event) {
      const mouseX = d3.pointer(event)[0];
      const mouseY = d3.pointer(event)[1];

      const index = Math.round(xScale.invert(mouseX));
      const val = data[index];
      const page = index + 1;
      const emotion = pages[index].emotion;
      const valText = title + ": " + val.toFixed(2);

      tooltip
        .html(
          "Page: " + page + "<br>" + valText + "<br>" + "Emotion: " + emotion
        )
        .style("left", event.pageX + 10 + "px")
        .style("top", event.pageY + 10 + "px");
    });
}

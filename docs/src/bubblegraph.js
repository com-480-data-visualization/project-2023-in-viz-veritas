function whenDocumentLoaded(action) {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", action);
  } else {
    // `DOMContentLoaded` already fired
    action();
  }
}

function createBubbleGraph(bookId) {
  const threshold = 30;

  // Clear previous graph content
  const custom_colours = [
    "#EA522B",
    "#EFD4D1",
    "#2A4978",
    "#8BDBE1",
    "#ECA19D",
    "#B48E36",
    "#E1DCE0",
    "#B8BFCE",
    "#E0DCD1",
    "#91C5E4",
    "#6E8EAC",
    "#D2E7E0",
    "#ECD096",
    "#6C9686",
    "#E6E10F",
    "#9D4B37",
    "#A3B49D",
    "#BDC920",
    "#DBE3E5",
    "#6A8B8D",
    "#EFB3D1",
  ];

  d3.select("#bubblegraph").html("");
  whenDocumentLoaded(() => {
    d3.json("./src/data/locations_per_work.json").then(function (jsonData) {
      d3.json("./src/data/locations_per_page.json").then(function (pageData) {
        // Function to get the frequency per page of the city in a given book
        function getFrequencyData(city, book_id) {
          var bookData = pageData[book_id];
          var frequencyData = [];
          for (var page in bookData) {
            if (bookData.hasOwnProperty(page)) {
              var cities = bookData[page];
              // Count the frequency of the specified city on the page
              var frequency = cities.filter(function (c) {
                return c === city;
              }).length;
              frequencyData.push({ page: +page, frequency: frequency });
            }
          }
          return frequencyData;
        }

        // Function to create the line plot for each bubble
        function createLinePlot(cardContainer, city, data, total) {
          cardContainer.html("");

          var linePlotWidth = 200;
          var linePlotHeight = 150;
          var linePlotMargin = { top: 10, right: 10, bottom: 20, left: 50 };

          // Create a card element
          var card = cardContainer.append("div").attr("class", "bubbleCard");

          // Add the city name to the card
          card
            .append("h3")
            .text(city)
            .attr("x", (linePlotWidth + linePlotMargin.left) / 2);
          card
            .append("p")
            .text("Total times mentioned: " + total)
            .attr("x", (linePlotWidth + linePlotMargin.left) / 2);

          var svg = card
            .append("svg")
            .attr("class", "line-plot")
            .attr(
              "width",
              linePlotWidth + linePlotMargin.left + linePlotMargin.right
            )
            .attr(
              "height",
              linePlotHeight + linePlotMargin.top + linePlotMargin.bottom
            );
          var xScale = d3
            .scaleLinear()
            .domain(
              d3.extent(data, function (d) {
                return d.page;
              })
            )
            .range([linePlotMargin.left, linePlotWidth - linePlotMargin.right]);

          var yScale = d3
            .scaleLinear()
            .domain([
              0,
              d3.max(data, function (d) {
                return d.frequency;
              }),
            ])
            .range([
              linePlotHeight - linePlotMargin.bottom,
              linePlotMargin.top,
            ]);

          var line = d3
            .line()
            .x(function (d) {
              return xScale(d.page);
            })
            .y(function (d) {
              return yScale(d.frequency);
            });

          svg
            .append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", primaryColor)
            .attr("stroke-width", 1.5)
            .attr("d", line);

          svg
            .append("g")
            .attr(
              "transform",
              "translate(0," + (linePlotHeight - linePlotMargin.bottom) + ")"
            )
            .call(d3.axisBottom(xScale).ticks(5).tickSizeOuter(0));

          svg
            .append("text")
            .attr("class", "axis-label")
            .attr("x", (linePlotWidth + linePlotMargin.left) / 2)
            .attr(
              "y",
              linePlotHeight + linePlotMargin.top + linePlotMargin.bottom - 5
            )
            .style("text-anchor", "middle")
            .text("Pages");

          svg
            .append("g")
            .attr("transform", "translate(" + linePlotMargin.left + ",0)")
            .call(d3.axisLeft(yScale).ticks(5).tickSizeOuter(0));

          svg
            .append("text")
            .attr("class", "axis-label")
            .attr("transform", "rotate(-90)")
            .attr("x", linePlotHeight / 2)
            .attr("y", linePlotMargin.left)
            .style("text-anchor", "middle")
            .text("Frequency");

          return cardContainer;
        }

        // Retrieve the cities data for the selected book
        const bubbleData = jsonData[bookId];

        const diameter = 500; // Diameter of the bubble graph
        const color = d3.scaleOrdinal().range(custom_colours);

        const bubble = d3.pack().size([diameter, diameter]).padding(1);

        const container = d3.select("#bubblegraph");

        const div = container
          .append("div")
          .style("width", `${diameter}px`)
          .style("height", `${diameter}px`)
          .style("position", "relative");

        const root = d3
          .hierarchy({ children: Object.entries(bubbleData) })
          .sum((d) => d[1])
          .sort((a, b) => b.value - a.value);

        bubble(root);

        // Add tooltip
        var tooltip = d3
          .select("body")
          .append("div")
          .attr("class", "bubble-tooltip");
        //   .style("visibility", "hidden");

        const node = div
          .selectAll(".node")
          .data(root.descendants().slice(1))
          .enter()
          .append("circle")
          .attr("class", "node")
          .style("position", "absolute")
          .style("left", (d) => `${d.x - d.r}px`)
          .style("top", (d) => `${d.y - d.r}px`)
          .style("width", (d) => `${d.r * 2}px`)
          .style("height", (d) => `${d.r * 2}px`)
          .style("background-color", (d, i) => color(i))
          .style("border-radius", "50%")
          .on("click", function (event, d) {
            var data = getFrequencyData(d.data[0], bookId);
            cardContainer = createLinePlot(tooltip, d.data[0], data, d.data[1]);
            cardContainer
              .style("left", event.pageX - 300 + "px")
              .style("top", event.pageY - 270 + "px");
             
            cardContainer.style("visibility", "visible");
            d3.select(".bubble-tooltip").style("visibility", "visible");
          })
          .on("mouseout", function (d) {
            cardContainer.style("visibility", "hidden");
            d3.select(".bubble-tooltip").style("visibility", "hidden");
          });

        const span = node
          .append("span")
          .style("display", "flex")
          .style("align-items", "center")
          .style("justify-content", "center")
          .style("height", "100%");

        span
          .filter((d) => d.r > threshold)
          .text((d) => d.data[0])
          .classed("bubble-text", true);
      });
    });
  });
}

function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
    	document.addEventListener("DOMContentLoaded", action);
	} else {  // `DOMContentLoaded` already fired
		action();
	}
}

function createBubbleGraph(bookId) {
  const threshold = 30;

  // Clear previous graph content
  const custom_colours = ["#EA522B", "#EFD4D1", "#2A4978", "#8BDBE1", "#ECA19D", "#B48E36", "#E1DCE0", "#B8BFCE", "#E0DCD1", "#91C5E4",
        "#6E8EAC", "#D2E7E0", "#ECD096", "#6C9686", "#E6E10F", "#9D4B37", "#A3B49D", "#BDC920", "#DBE3E5", "#6A8B8D", "#EFB3D1"]



  d3.select("#bubblegraph").html("");
  whenDocumentLoaded(() =>{

    d3.json("./src/data/locations_per_work.json").then(function (jsonData) {


        // Retrieve the cities data for the selected book
        const bubbleData = jsonData[bookId];

        const diameter = 500; // Diameter of the bubble graph
        const color = d3.scaleOrdinal()
            .range(custom_colours);

        const bubble = d3.pack()
            .size([diameter, diameter])
            .padding(1);

        const container = d3.select("#bubblegraph")

        const div = container.append("div")
            .style("width", `${diameter}px`)
            .style("height", `${diameter}px`)
            .style("position", "relative");

        const root = d3.hierarchy({ children: Object.entries(bubbleData) })
            .sum(d => d[1])
            .sort((a, b) => b.value - a.value);

        bubble(root);

        // Add tooltip
        var tooltip = d3
            .select("body")
            .append("div")
            .attr("class", "bubble-tooltip")
            .style("visibility", "hidden");


        const node = div.selectAll(".node")
            .data(root.descendants().slice(1))
            .enter()
            .append("g")
            .attr("class", "node")
            .style("position", "absolute")
            .style("left", d => `${d.x - d.r}px`)
            .style("top", d => `${d.y - d.r}px`)
            .style("width", d => `${d.r * 2}px`)
            .style("height", d => `${d.r * 2}px`)
            .style("background-color", (d, i) => color(i))
            .style("border-radius", "50%")
            .on("mouseover", function (event, d) {
                tooltip.style("visibility", "visible")

                
                    .style("left", event.pageX + 10 + "px")
                    .style("top", event.pageY + 10 + "px")
                    .style("z-index", 10)
                    .html(
                        `<b>${d.data[0]}</b>` + "<br> Cited " + d.data[1] + " times"
                    )

            })
            .on("mouseout", function (d) {
                tooltip.style("visibility", "hidden");
            });

        const span = node.append("span")
            .style("display", "flex")
            .style("align-items", "center")
            .style("justify-content", "center")
            .style("height", "100%");

        span.filter(d => d.r > threshold)
            .text(d => d.data[0])
            .classed("bubble-text", true);;


    })
  });
}
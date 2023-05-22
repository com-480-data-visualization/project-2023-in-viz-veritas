function createBubbleGraph(bookId) {
    const threshold = 30;

    // Clear previous graph content
    d3.select("#bubblegraph").html("");

    d3.json("./src/data/locations_per_work.json").then(function (jsonData) {
        // Retrieve the cities data for the selected book
        const bubbleData = jsonData[bookId];

        const diameter = 400; // Diameter of the bubble graph
        const color = d3.scaleOrdinal(d3.schemeCategory10); // Color scale for bubbles

        const bubble = d3.pack()
            .size([diameter, diameter])
            .padding(1);

        const div = d3.select("#bubblegraph")
            .append("div")
            .style("width", `${diameter}px`)
            .style("height", `${diameter}px`)
            .style("position", "relative");

        const root = d3.hierarchy({ children: Object.entries(bubbleData) })
            .sum(d => d[1])
            .sort((a, b) => b.value - a.value);

        bubble(root);

        // Add tooltip
        var tooltip = d3
            .select("#bubblegraph")
            .append("div")
            .attr("class", "bubble-tooltip")
            .style("visibility", "hidden");

        const node = div.selectAll(".node")
            .data(root.descendants().slice(1))
            .enter()
            .append("div")
            .attr("class", "node")
            .style("position", "absolute")
            .style("left", d => `${d.x - d.r}px`)
            .style("top", d => `${d.y - d.r}px`)
            .style("width", d => `${d.r * 2}px`)
            .style("height", d => `${d.r * 2}px`)
            .style("background-color", (d, i) => color(i))
            .style("border-radius", "50%")
            .on("mouseover", function (event, d) {
                const containerRect = div.node().getBoundingClientRect();
                const tooltipWidth = parseInt(tooltip.style("width"), 10);
                const tooltipHeight = parseInt(tooltip.style("height"), 10);
                const mouseX = event.clientX - containerRect.left;
                const mouseY = event.clientY - containerRect.top;

                const tooltipX = mouseX - tooltipWidth / 2;
                const tooltipY = mouseY - tooltipHeight - 10;

                tooltip
                    .html(d.data[0] + "<br>")
                    .style("left", `${tooltipX}px`)
                    .style("top", `${tooltipY}px`)
                    .style("visibility", "visible");
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
            .text(d => d.data[0]);


    })
}
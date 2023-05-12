
// Get the width of the Bootstrap container
var containerWidth = d3.select(".scrollable-right").node().getBoundingClientRect().width;
var containerHeight = 400;

d3.csv("./src/data/books.csv").then(function (data) {

    d3.json("./src/data/locations_per_page.json").then(function (jsonData) {

        var svg = d3.select("#bubbles")
            .attr("width", containerWidth)
            .attr("height", containerHeight);


        const row_div = svg.append("foreignObject")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", "100%")
            .attr("height", "100%")
            .append("xhtml:div")
            .attr("class", "row");
        // Create the author selection section within the SVG element
        const auth_div = row_div.append("foreignObject")
            .attr("x", 50)
            .attr("y", 50)
            .attr("width", 200)
            .attr("height", 50)
            .append("xhtml:div")
            .attr("id", "author-selection")
            .attr("class", "col-sm-6");

        // Create the book selection section within the SVG element
        const book_div = row_div.append("foreignObject")
            .attr("x", 50)
            .attr("y", 120)
            .attr("width", 200)
            .attr("height", 50)
            .append("xhtml:div")
            .attr("id", "book-section")
            .attr("class", "col-sm-6");

        // Create the bubble graph section within the SVG element
        const bubble_div = row_div.append("foreignObject")
            .attr("x", 300)
            .attr("y", 50)
            .attr("width", 450)
            .attr("height", 300)
            .append("xhtml:div")
            .attr("id", "bubble-graph")
            .attr("class", "col-sm-6");


        const authorSelection = d3.select("#author-selection");
        const authors = d3.group(data, d => d.author)

        authorSelection.append("select")
            .selectAll("option")
            .data(authors)
            .enter()
            .append("option")
            .text(d => d[0])
            .attr("value", function (d) { return d[0] });


        const bookSection = d3.select("#book-section");

        authorSelection.select("select").on("change", function () {
            const author = d3.select(this).property("value");
            const works = data.filter(d => d.author === author)
            bookSection.selectAll("*").remove(); // Clear previous book selection

            bookSection.append("select")
                .selectAll("option")
                .data(works)
                .enter()
                .append("option")
                .text(d => d.title);
        });

    });

});

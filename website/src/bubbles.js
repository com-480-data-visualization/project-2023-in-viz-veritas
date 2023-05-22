
// Get the width of the Bootstrap container
var containerWidth = d3.select(".row").node().getBoundingClientRect().width;
var containerHeight = 600;

d3.csv("./src/data/books.csv").then(function (data) {

    // only the english books so far...
    data = data.filter(d => d.language === 'eng')

    d3.json("./src/data/locations_per_work.json").then(function (jsonData) {

        const maxFrequency = d3.max(Object.values(jsonData), d => d3.max(Object.values(d)));

        const bubbleScale = d3.scaleLinear()
            .domain([0, maxFrequency])
            .range([5, 30]);


        function createBubbleGraph(bookId) {
            const threshold = 30;

            // Clear previous graph content
            d3.select("#bubble-graph").html("");

            // Retrieve the cities data for the selected book
            const bubbleData = jsonData[bookId];
            console.log(bubbleData);

            const diameter = 400; // Diameter of the bubble graph
            const color = d3.scaleOrdinal(d3.schemeCategory10); // Color scale for bubbles

            const bubble = d3.pack()
                .size([diameter, diameter])
                .padding(1);

            const div = d3.select("#bubble-graph")
                .append("div")
                .style("width", `${diameter}px`)
                .style("height", `${diameter}px`)
                .style("position", "relative")


            const root = d3.hierarchy({ children: Object.entries(bubbleData) })
                .sum(d => d[1])
                .sort((a, b) => b.value - a.value);

            bubble(root);

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
                .on("mouseover", function (d) {
                    if (d.r <= threshold) {
                        d3.select(this)
                            .append("div")
                            .attr("class", "tooltip")
                            .text(d => d.data[0]);
                    }
                })
                .on("mouseout", function (d) {
                    if (d.r <= threshold) {
                        d3.select(this).select(".tooltip").remove();
                    }
                });

            const span = node.append("span")
                .style("display", "flex")
                .style("align-items", "center")
                .style("justify-content", "center")
                .style("height", "100%");

            span.filter(d => d.r > threshold)
                .text(d => d.data[0]);

            // TODO Append tooltip for small bubbles
            node.filter(d => d.r <= threshold)
                .append("div")
                .attr("class", "tooltip")
                .text(d => d.data[0]);
        }


        function createBookCards(container, books) {
            // Clear previous card content
            container.html("");

            // Create the book cards
            const bookCards = container.selectAll(".book-card")
                .data(books)
                .enter()
                .append("div")
                .attr("class", "book-card");

            const imageContainer = bookCards.append("div")
                .attr("class", "image-container");

            imageContainer.append("img")
                .attr("src", book => "./src/img/thumbnails/" + book.book_id + ".png")
                .attr("alt", book => book.title);

            const bookInfo = bookCards.append("div")
                .attr("class", "book-info");

            bookInfo.append("h3")
                .text(book => book.title);

            bookInfo.append("p")
                .text(book => book.author);

            return bookCards;
        }



        const svg = d3.select("#bubbles")
            .attr("width", containerWidth)
            .attr("height", containerHeight);

        const rowDiv = svg.append("foreignObject")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", "100%")
            .attr("height", "100%")
            .append("xhtml:div")
            .attr("class", "row");


        // Create the author selection section
        const authorSelectionDiv = rowDiv.append("div")
            .attr("id", "author-selection")
            .attr("class", "row");

        // Create the book selection section
        const bookSectionDiv = rowDiv.append("div")
            .attr("id", "book-section")
            .attr("class", "row")
            .style("display", "flex")
            .style("justify-content", "center");

        // Create the column for the bubble graph
        const bubbleGraphDiv = rowDiv.append("foreignObject")
            .attr("class", "col-sm-6")
            .append("xhtml:div")
            .attr("id", "bubble-graph")

        bookSectionDiv.style("margin-top", "10px");
        bubbleGraphDiv.style("height", "100%");

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
        // const bookSelection = bookSection.append("select");

        const bookCardContainer = bookSection.append("div")
            .attr("id", "book-cards");

        authorSelection.select("select").on("change", function () {
            const author = d3.select(this).property("value");
            const works = data.filter(d => d.author === author);

            // Clear previous book cards
            bookCardContainer.html(""); // Clear previous book selection

            // Create book cards for each work
            const bookCards = createBookCards(bookCardContainer, works)
            const firstbookId = works[0].book_id;
                createBubbleGraph(firstbookId);

            // Add event listener to book cards
            bookCards.on("click", function () {
                const bookId = d3.select(this).datum().book_id;
                createBubbleGraph(bookId);
            });
        });

        authorSelection.dispatch("change");

    });

});

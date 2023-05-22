// Get the width of the Bootstrap container
var containerWidth = d3.select(".scrollable-right").node().getBoundingClientRect().width;
var containerHeight = 600;

d3.csv("./src/data/books.csv").then(function (data) {

    data = data.filter(d => d.language === 'eng');

    d3.json("./src/data/locations_per_work.json").then(function (jsonData) {
        
        function createBookCards(container, books) {
            container.html("");

            const bookCardContainer = container.append("div")
                .attr("class", "book-card-container");

            const bookCards = bookCardContainer.selectAll(".book-card")
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

            bookInfo.append("p")
                .text(book => parseInt(book.year) + ', ' + book.place);

            // Add event listener to book cards
            bookCards.on("click", function (event, d) {
                console.log(d)
                createBubbleGraph(d.book_id);
            });

            return bookCardContainer;
        }

        const svg = d3.select("#books")
            .attr("width", containerWidth)
            .attr("height", containerHeight);

        const bookCardContainer = svg.append("foreignObject")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", containerWidth)
            .attr("height", containerHeight)
            .append("xhtml:div")
            .attr("id", "book-cards");

        // Create book cards for each work
        const bookCards = createBookCards(bookCardContainer, data);

    });
});

// Get the width of the Bootstrap container
var containerWidth = d3.select(".row").node().getBoundingClientRect().width;
var containerHeight = 600;

var selectedBook = document.getElementById("book-name");
const showSvgButton = document.getElementById("show-svg-button");
const bookInfoContainer = document.getElementById("book-info-container");
const booksSvg = document.getElementById("books");

function createBookCards(container, books) {
  container.html("");

  //FIXME: background color not independent of card
  const bookCardContainer = container
    .append("div")
    .attr("class", "book-card-container");

  const bookCards = bookCardContainer
    .selectAll(".book-card")
    .data(books)
    .enter()
    .append("div")
    .attr("class", "book-card");

  const imageContainer = bookCards
    .append("div")
    .attr("class", "image-container");

  imageContainer
    .append("img")
    .attr("src", (book) => "./src/img/thumbnails/" + book.book_id + ".png")
    .attr("alt", (book) => book.title);

  const bookInfo = bookCards.append("div").attr("class", "book-info");

  bookInfo.append("h3").text((book) => book.title);

  bookInfo.append("p").text((book) => book.author);

  bookInfo.append("p").text((book) => parseInt(book.year) + ", " + book.place);

  return bookCards;
}

d3.csv("./src/data/books.csv").then(function (data) {
  data = data.filter((d) => d.language === "eng");

  d3.json("./src/data/locations_per_work.json").then(function (jsonData) {
    const svg = d3
      .select("#books")
      .attr("width", containerWidth)
      .attr("height", containerHeight);

    const bookCardContainer = svg
      .append("foreignObject")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", containerWidth)
      .attr("height", containerHeight)
      .append("xhtml:div")
      .attr("id", "book-cards");

    // Create book cards for each work
    const bookCards = createBookCards(bookCardContainer, data);


    // Add event listener to book cards
    bookCards.on("click", function (event, d) {

      createBubbleGraph(d.book_id);
      createEmotionViz(d.book_id);
      createCitiesViz(d.book_id);

      // Hide the SVG
      booksSvg.style.display = "none";

      // Show the navigation bar
      bookInfoContainer.style.display = "flex";


      // Update the selected book name
      selectedBook.textContent = "Selected Book: " + d.title;

      // Disable scrolling on the body element
      d3.select("body").style("overflow", "hidden");
    });


  });
});

function showBooks() {
  // Show the SVG
  booksSvg.style.display = "block";
  // Hide the navigation bar
  bookInfoContainer.style.display = "none";
  // Enable scrolling on the body element
  d3.select("body").style("overflow", "auto");

}

// Add event listener for showing the SVG
showSvgButton.addEventListener("click", function () {
  showBooks();
});

bookInfoContainer.addEventListener("click", function (event) {
    if(event.target.id != "book-info-container") return;
    showBooks();
});


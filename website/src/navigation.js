document.addEventListener("DOMContentLoaded", function () {
    const pages = document.getElementsByClassName("page");
    const leftArrow = document.getElementById("left-arrow");
    const rightArrow = document.getElementById("right-arrow");
    const pageDotsContainer = document.getElementById("page-dots");
    
  
    let currentPageIndex = 0;
  
    // Show the initial page
    pages[currentPageIndex].style.display = "flex";
    createPageDots();
  
    // Event listener for left arrow click
    leftArrow.addEventListener("click", function () {
      navigatePage("left");
    });
  
    // Event listener for right arrow click
    rightArrow.addEventListener("click", function () {
      navigatePage("right");
    });
  
    // Event listener for page dot click
    pageDotsContainer.addEventListener("click", function (event) {
      if (event.target.classList.contains("page-dot")) {
        const dotIndex = Array.from(pageDotsContainer.children).indexOf(event.target);
        navigateToPage(dotIndex);
      }
    });
  
    // Function to navigate to the previous or next page
    function navigatePage(direction) {
      pages[currentPageIndex].style.display = "none";
      
      if (direction === "left") {
        currentPageIndex = (currentPageIndex === 0) ? pages.length - 1 : currentPageIndex - 1;
      } else if (direction === "right") {
        currentPageIndex = (currentPageIndex === pages.length - 1) ? 0 : currentPageIndex + 1;
      }
  
      pages[currentPageIndex].style.display = "flex";
      updateActivePageDot();
    }
  
    // Function to navigate to a specific page
    function navigateToPage(pageIndex) {
      pages[currentPageIndex].style.display = "none";
      currentPageIndex = pageIndex;
      pages[currentPageIndex].style.display = "flex";
      updateActivePageDot();
    }
  
    // Function to create page indicator dots
    function createPageDots() {
      for (let i = 0; i < pages.length; i++) {
        const dot = document.createElement("span");
        dot.classList.add("page-dot");
        if (i === currentPageIndex) {
          dot.classList.add("active");
        }
        pageDotsContainer.appendChild(dot);
      }
    }
  
    // Function to update the active page dot
    function updateActivePageDot() {
      const dots = document.getElementsByClassName("page-dot");
      for (let i = 0; i < dots.length; i++) {
        dots[i].classList.remove("active");
      }
      dots[currentPageIndex].classList.add("active");
    }
  });
  
document.querySelectorAll('.fixed-left a').forEach(anchor => {
    anchor.addEventListener('click', function (event) {
      event.preventDefault();
      const container = document.querySelector('.scrollable-right');
      const target = document.querySelector(this.getAttribute('href'));
      container.scrollTo({
        top: target.offsetTop,
        behavior: 'smooth'
      });
    });
  });
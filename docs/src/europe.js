function whenDocumentLoaded(action) {
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", action);
    } else {  // `DOMContentLoaded` already fired
        action();
    }
}


// Get the width of the Bootstrap container
var containerWidth = (d3.select(".row").node().getBoundingClientRect().width)/2;
var margin = { top: 20, right: 20, bottom: 30, left: 40 };
var width = containerWidth - margin.left - margin.right;
var height = 400;


whenDocumentLoaded(() => {
    d3.csv("./src/data/books.csv").then(function (bookdata){
      d3.json("./src/data/publilocations.json").then(function (data) {

        const cities = Object.keys(data);
        // Create a Leaflet map
        const map = L.map('map').setView([49.849318, -28.335938], 4);

        map.eachLayer(function (layer) {
            if (layer instanceof L.Marker) {
              layer.unbindPopup();
              map.removeLayer(layer);
            }
          });

        // Add a tile layer with the custom tile URL

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        const cityCoordinates = {
            'Amsterdam': { lat: 52.3702, lng: 4.8952 },
            'Berlin': { lat: 52.5200, lng: 13.4050 },
            'Bologna': { lat: 44.4949, lng: 11.3426 },
            'Boston': { lat: 42.3601, lng: -71.0589 },
            'Dublin': { lat: 53.3498, lng: -6.2603 },
            'Edinburgh': { lat: 55.9533, lng: -3.1883 },
            'Frankfurt': { lat: 50.1109, lng: 8.6821 },
            'Goettingen': { lat: 51.5344, lng: 9.9323 },
            'Helmstedt': { lat: 52.2288, lng: 11.0127 },
            'Leide': { lat: 52.1601, lng: 4.4970 },
            'Leipzig': { lat: 51.3396, lng: 12.3713 },
            'London': { lat: 51.5074, lng: -0.1278 },
            'Milano': { lat: 45.4642, lng: 9.1900 },
            'Naples': { lat: 40.8522, lng: 14.2681 },
            'New York': { lat: 40.7128, lng: -74.0060 },
            'Paris': { lat: 48.8566, lng: 2.3522 },
            'Roma': { lat: 41.9028, lng: 12.4964 },
            'Stuttgart': { lat: 48.7758, lng: 9.1829 },
            'Turin': { lat: 45.0703, lng: 7.6869 },
            'Venetia': { lat: 45.4408, lng: 12.3155 },
            'Vicenza': { lat: 45.5455, lng: 11.5353 }
        };

        // Geocode each city to obtain its coordinates
        for (let city in cityCoordinates) {
            if (cityCoordinates.hasOwnProperty(city)) {
                if (cities.includes(city)){
                let coord = cityCoordinates[city];
                let freq=data[city].frequency;
                let books_id=data[city].books_id;
                let dict={};

                for (let index in bookdata){
                    let book=parseInt(bookdata[index].book_id);
                    //console.log(books_id, book);
                    if (books_id.includes(book)){
                        let title=bookdata[index].title;
                        let url=bookdata[index].manifest;
                        dict[title]=url;
                    }
                }


                let clickText = '<ul>';
                Object.entries(dict).map(function (entries) {
                    key=entries[0];
                    value=entries[1];
                    clickText += `<li><a href=${value}>${key}</a></li>`;
                });
                clickText += '</ul>';

                // Add a marker to the map using the obtained coordinates
                const marker = L.marker([coord.lat, coord.lng]).addTo(map);

                let hoverText='';

                marker.on('mouseover', function (e) {
                    this.setPopupContent(hoverText);
                    this.openPopup();
                });

                marker.on('click', function (e) {
                    this.unbindPopup(); // Unbind the popup to prevent automatic closing
                    this.setPopupContent(clickText);

                    const customPopup = L.popup({
                        closeButton: true,
                        autoClose: false,
                        closeOnClick: false,
                        className: 'custom-popup'
                    });

                    const customPopupContent = document.createElement('div');
                    customPopupContent.innerHTML = clickText;

                    // Enable scrolling inside the custom popup
                    customPopupContent.style.maxHeight = '200px';
                    customPopupContent.style.overflowY = 'auto';

                    customPopup.setContent(customPopupContent);
                    this.bindPopup(customPopup);
                    this.openPopup();

                    //customPopupContent.addEventListener('click', function (e) {
                     //   e.stopPropagation();
                });
                
                map.on('click', function (e) {
                    marker.closePopup();
                });
                
                if (freq>1){
                   hoverText=`<b>${city}</b><br> ${freq} books were published here !`;
                }else{
                    hoverText=`<b>${city}</b><br> ${freq} book was published here !`;
                }

                marker.bindPopup(hoverText, {
                    closeOnClick: false
                });  

                }

            }
        }
      });
    });

});


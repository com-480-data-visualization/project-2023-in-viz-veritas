// Get the width of the Bootstrap container
var containerWidth = d3.select(".row").node().getBoundingClientRect().width;
var margin = { top: 20, right: 20, bottom: 30, left: 40 };
var width = containerWidth - margin.left - margin.right;
var height = 400;


 
d3.json("./src/data/city_emotions.json").then(function (data){
    console.log(data)
        
    d3.select("#map").html("");
        
    const cities=Object.keys(data);
    // document.getElementById("output").innerHTML = cities;

    //var svg = d3.select("")
     //           .attr("width", width)
      //          .attr("height", height + margin.top + margin.bottom);

    let svg = d3.select("#map")
      .attr("width", width)
      .attr("height", height);
    
    

    // actual width and height
    width = d3.select("#map").node().getBoundingClientRect().width
    height = d3.select("#map").node().getBoundingClientRect().height

    

    let g = svg.append("g");

    // Create a Leaflet map
    let map = L.map(g.node()).setView([41.8719, 12.5674], 6);

    // Add a tile layer to the map (e.g., OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "Map data © OpenStreetMap contributors"
    }).addTo(map);


    // Geocode each city to obtain its coordinates
   /* cities.forEach(function(city) {
        // Make a request to the geocoding API
        const geocodeUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + encodeURIComponent(city);

        fetch(geocodeUrl)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                // Extract the latitude and longitude from the API response
                let result = data.results[0];
                let lat = result.geometry.location.lat;
                let lng = result.geometry.location.lng;
                city_lat.push(lat);

                // Add a marker to the map using the obtained coordinates
                

                //L.marker([lat, lng]).addTo(map).bindPopup(city);
            })
            .catch(function(error) {
               console.log("Error:", error);
               pass;
            });
        }); 
        */
    //document.getElementById("output").innerHTML = city_lat;  

});








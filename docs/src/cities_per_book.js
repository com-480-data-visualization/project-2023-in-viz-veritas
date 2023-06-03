var width = (d3
  .select(".row")
  .node()
  .getBoundingClientRect().width);
var height = 400;
var margin = { top: 20, right: 20, bottom: 40, left: 40 };
const chartWidth = width/2 - margin.left - margin.right;
const chartHeight = height - margin.top - margin.bottom;

function whenDocumentLoaded(action) {
	if (document.readyState === "loading") {
    	document.addEventListener("DOMContentLoaded", action);
	} else {  // `DOMContentLoaded` already fired
		action();
	}
}


function checkFileExists(fileUrl) {
  return fetch(fileUrl, { method: 'HEAD' })
    .then(response => response.ok)
    .catch(error => {
      console.log('Error:', error);
      return false;
    });
}


function createCitiesViz(bookid) {
  // Clear previous charts
  d3.select("#cities-scatter").selectAll("*").remove();
  //d3.select("#cities-map").selectAll("*").remove();
  console.log(width, height, chartWidth, chartHeight);

  const mapContainer = document.getElementById('cities-map');
  if (mapContainer._leaflet_id) {
    mapContainer._leaflet_id = null;
    mapContainer.innerHTML = '';
  }

  console.log("Cities load");


  // Load the selected book's data
  d3.json("./src/data/valence_arousal.json").then(function (data) {

    const citiesdata = d3.range(1).map(() => null);

    d3.json("./src/data/locations_per_work.json").then(function (datawork) {

      const length = Object.keys(data[bookid]).length;

      for (let i = 0; i < length; i++) {
        let dict = data[bookid][i];

        dict['freq'] = datawork[bookid][data[bookid][i].city];
        citiesdata[i] = dict;
      }
      
      const fetchPromises = [];
      for (let i = 0; i < length; i++) {
        const citydata = citiesdata[i];
        const imageUrl = `./src/img/cities/${citydata.city}_image.png`;
      
        const fetchPromise = checkFileExists(imageUrl)
          .then(fileExists => {
            citiesdata[i]['img'] = fileExists;
          });
        fetchPromises.push(fetchPromise);
      }

      
      Promise.all(fetchPromises)
        .then(() => {
          
        let dots;
        let svg;
        createEmotionCities(citiesdata);

        const map = L.map('cities-map').setView([41.8933203, 12.4829321], 6);

          L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 10,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          }).addTo(map);

        // Fetch the coordinates.json file and cache the data
        d3.json("./src/data/coordinates.json").then(function (data) {
          let cachedCoordinates = data;
          
          createMap(citiesdata, map, cachedCoordinates);
        });

    });

    });

  });
}

function color(img){
  if (img) {
    return primaryColor;
  } else {
    const lightgreen = 'rgb(119, 179, 0)';
    return lightgreen;
  }
}

function rescale (d, rescaled_max=25, rescaled_min=5) {
  const max = 450; //max seems to be 420 for Rome somewhere
  const min = 1;
  const normalized = (d - min) / (max - min);
  return normalized * (rescaled_max - rescaled_min) + rescaled_min;

 }

function createMap(citiesdata, map, cached){

  map.eachLayer(function (layer) {
    if (layer instanceof L.Marker) {
      layer.unbindPopup();
      map.removeLayer(layer);
    }
  });


  for (let index in citiesdata){
    let city= citiesdata[index].city;
    if (cached && cached.hasOwnProperty(city)){
      let lat=cached[city]['lat'];
      let lon=cached[city]['lon'];
      let frequency=citiesdata[index].freq;
      //const marker = L.marker([lat,lon]).addTo(map);

      let circle = L.circle([lat, lon], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 5000*rescale(frequency, 30, 2) 
      }).addTo(map);

      // Bind popup on hover
      circle.on('mouseover', function (e) {
        this.openPopup();
        console.log(city);
        const selectedName = city;

        // Highlight the corresponding point in the second graph
        dots.filter(d => d.city === selectedName)
           .style('fill', '#f03')
           .style('opacity', 0.8);
      });

      // Hide popup on mouseout
      circle.on('mouseout', function (e) {
        this.closePopup();
        dots.filter(d => d.city === city)
           .style('fill', d => color(d.img));
      });

      if (frequency===1){
        circle.bindPopup(`<b>${city}</b><br> was named once`);
      } else if (frequency===2){
        circle.bindPopup(`<b>${city}</b><br> was named twice`);
      }else{
        circle.bindPopup(`<b>${city}</b><br> was named ${frequency} times`)
      }

    }

  }
}

function createEmotionCities(citiesdata){
  svg = d3.select("#cities-scatter")
        .attr("width", width )
        .attr("height", height )
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const XScale = d3.scaleLinear()
        .domain([-1, 1])
        .range([0, chartWidth]);

  svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + chartHeight/2 + ")")
        .call(d3.axisBottom(XScale));


  const YScale = d3.scaleLinear()
        .domain([-1, 1])
        .range([chartHeight, 0]);

  svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + chartWidth / 2 + ", 0)")
        .call(d3.axisLeft(YScale))

  // Add X axis label:
  svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", chartWidth - 30)
        .attr("y", chartHeight / 2 + 35)
        .text("Arousal")
        .style("font-size", "16px")

  // Y axis label:
  svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + chartWidth / 2)
        .attr("x", -margin.top)
        .text("Valence")
        .style("font-size", "16px")


  // Add tooltip
  let tooltip_cityemo = d3
        .select("body")
        .append("div")
        .attr("class", "emotion-tooltip")
        .style("visibility", "hidden")
        .style("position", "absolute")
        .style("z-index", 99999);

  const mouseover = function (d) {
        tooltip_cityemo
          .style("visibility", "visible")
        d3.select(this)
          .style("stroke", "black")
          .style("opacity", 0.8)
  }
  const mousemove = function (event, d) {

        tooltip_cityemo.style("visibility", "visible");
        const textcity = d.city.toString();

        tooltip_cityemo
          .html(`<b>${textcity}</b>` + " <br> Valence: " + d.city_valence.toFixed(2)
            + "<br> Arousal: " + d.city_arousal.toFixed(2) + "<br> Emotion: " + d.emotion
            + "<br> Cited: " + d.freq + " times")
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 90 + "px");
  }
  const mouseleave = function (d) {
        tooltip_cityemo
          .transition()
          .duration(200)
          .style("visibility", "hidden")
          tooltip_cityemo.html("");
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 0.8)
  }


  // Plotting the points
  dots=svg
        .selectAll(".dot")
        .data(citiesdata)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("cx", d => XScale(d.city_arousal))
        .attr("cy", d => YScale(d.city_valence))
        .attr("r", d => rescale(d.freq))
        .style("fill", d => color(d.img))
        .style("stroke", "none")
        .style("opacity", 0.8)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave)
        .on("click", (event, d) => {

          
          //console.log(d.img);
          if (d.img) {
            event.stopPropagation();
            //ImageContainer.html('');
            tooltip_cityemo.style("visibility", "visible")
              .style("left","50")
              .style("top", "200");
            tooltip_cityemo.selectAll("*").remove();

            const image = new Image();
            const imagesrc = "./src/img/cities/" + d.city + "_image.png";

            const ImageContainer = tooltip_cityemo.append("div")
                                  .on("click", function () {
                                    // Open a new page in the browser
                                    window.open(imagesrc, "_blank");
                                  });
            
            
            const imageElement = ImageContainer
              .append("img")
              .attr("src", imagesrc)
              .style("width", "auto")  // Set the desired width
              .style("height", "300px"); // Adjust the height accordingly
                  
              ImageContainer
              .style("left", "50")
              .style("top", "100");  

          }
        })

}



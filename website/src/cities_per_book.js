var width = d3
  .select(".row")
  .node()
  .getBoundingClientRect().width;

var height = 400;
var margin = { top: 20, right: 20, bottom: 40, left: 40 };


function createCitiesViz(bookid) {
  // Clear previous charts
  d3.select("#cities-scatter").selectAll("*").remove();

  console.log("Cities load");


  // Load the selected book's data
  d3.json("./src/data/valence_arousal.json").then(function (data) {

    const citiesdata = d3.range(1).map(() => null);

    d3.json("./src/data/locations_per_work.json").then(function (datawork) {
      //console.log("datawork",datawork[bookid][data[bookid][0].city]);

      const length = Object.keys(data[bookid]).length;
      //console.log("length?" + length);

      for (let i = 0; i < length; i++) {
        let dict = data[bookid][i];

        dict['freq'] = datawork[bookid][data[bookid][i].city];
        //console.log("dict",dict);
        citiesdata[i] = dict;
      }

      //console.log(citiesdata[0]);

      function checkFileExists(fileUrl) {
        return fetch(fileUrl, { method: 'HEAD' })
          .then(response => response.ok)
          .catch(error => {
            console.log('Error:', error);
            return false;
          });
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

      function color(img){
        if (img) {
          return primaryColor;
        } else {
          const lightgreen = 'rgb(119, 179, 0)';
          return lightgreen;
        }
      }
      
      Promise.all(fetchPromises)
        .then(() => {
          console.log(citiesdata);


        /*for (let i = 0; i < length; i++){
          citiesdata[i]['image']=`./src/img/cities/${citydata.city}_image.png`;

        }*/


       //document.getElementById("output").innerHTML=blablabla;//citiesdata[0].toString();

       const svg = d3.select("#cities-scatter")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

       const XScale = d3.scaleLinear()
        .domain([-1, 1])
        .range([0, width]);

       svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", "translate(0," + height / 2 + ")")
        .call(d3.axisBottom(XScale));


       const YScale = d3.scaleLinear()
        .domain([-1, 1])
        .range([height, 0]);

       svg.append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(" + width / 2 + ", 0)")
        .call(d3.axisLeft(YScale))

       // Add X axis label:
       svg.append("text")
        .attr("text-anchor", "middle")
        .attr("x", width - 30)
        .attr("y", height / 2 + 35)
        .text("Arousal")
        .style("font-size", "16px")

       // Y axis label:
       svg.append("text")
        .attr("text-anchor", "middle")
        .attr("transform", "rotate(-90)")
        .attr("y", -margin.left + width / 2)
        .attr("x", -margin.top)
        .text("Valence")
        .style("font-size", "16px")


       // Add tooltip
       const tooltip_cityemo = d3
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
          .style("top", event.pageY + 10 + "px");
       }
       const mouseleave = function (d) {
        tooltip_cityemo
          .transition()
          .duration(200)
          .style("visibility", "hidden")
        d3.select(this)
          .style("stroke", "none")
          .style("opacity", 0.8)
       }
       const mouseout = function (d) {
        tooltip_cityemo.html("");
       }

       const rescale = function (d) {
        const max = 450; //max seems to be 420 for Rome somewhere
        const min = 1;
        const rescaled_max = 25;
        const rescaled_min = 5;

        const normalized = (d - min) / (max - min);
        return normalized * (rescaled_max - rescaled_min) + rescaled_min;

       }


       // Plotting the points
       svg
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

          event.stopPropagation();
          //ImageContainer.html('');
          tooltip_cityemo.style("visibility", "visible")
            .style("left","50")
            .style("top", "200");
          tooltip_cityemo.selectAll("*").remove();
          //console.log(d.img);
          if (d.img) {

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
              .style("height", "400px"); // Adjust the height accordingly
                  
              ImageContainer
              .style("left", "50")
              .style("top", "100");

            

          }
        })


       /* // Add click event listener to document object
        d3.select(document).on("click", function () {
          tooltip.style("visibility", "hidden");
      });

      */


    });

    });

  });
}




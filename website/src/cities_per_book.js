var width = d3
    .select(".row")
    .node()
    .getBoundingClientRect().width;

var height = 400;
var margin = { top: 20, right: 20, bottom: 40, left: 40 };
var chartWidth = width - margin.left - margin.right;
var chartHeight = height - margin.top - margin.bottom;
  

function createCitiesViz(bookid) {

    console.log("Cities load");
  
    // Load the selected book's data
    d3.json("./src/data/valence_arousal.json").then(function (data) {

        const citiesdata=d3.range(1).map(() => null);
        
        for (let i=0; i<10; i++){
            citiesdata[i]=data[bookid][i];

        }
        console.log(citiesdata);
        
        

        //document.getElementById("output").innerHTML=blablabla;//citiesdata[0].toString();
  
        const svg = d3.select("#cities-scatter")
                        .attr("width", width + margin.left + margin.right)
                        .attr("height", height + margin.top + margin.bottom)
                        .append("g")
                            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        
        const XScale = d3.scaleLinear()
                         .domain([-1, 1])
                         .range([ 0, width ]);

        svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(XScale));
                        

        const YScale = d3.scaleLinear()
                         .domain([-1, 1])
                         .range([ height, 0]);

        svg.append("g")
          .attr("class", "y-axis")
          .call(d3.axisLeft(YScale))
        
        // Plotting the points
        svg.append()
          .selectAll("dot")
          .data(citiesdata)
          .enter()
          .append("circle")
            //.attr("class", "dot")
            .attr("cx", d => {return d.city_arousal})  // Example: Using age as the x-coordinate
            .attr("cy", d => {return d.city_valence})  // Example: Using the index as the y-coordinate
            .attr("r", 5)
            .style("fill", primaryColor)


  
        
      });
}
  

  

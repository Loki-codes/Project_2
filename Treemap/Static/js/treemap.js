var treemap = d3.select("#my_dataviz");
function cleardata()
{
     treemap.html("");
};

function tree()
{
  cleardata();
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = 1400 - margin.left - margin.right,
    height = 1400 - margin.top - margin.bottom;
  
  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

  // read json data
  d3.json("./Resources/raviStockInfo.json").then(function(data)  {

    //console.log(data.forEach(vol => vol.Ticker));
      // Give the data to this cluster layout:
      var root = d3.hierarchy(data)
      .sum(function(d)
      { 
  
        return Math.abs((((d.Cmo6-d.Omo1)/d.Omo1)*100)) ;// Here the size of each leave is given in the 'value' field in input data
      });
      
      //Math.abs((((d.Cmo6-d.Omo1)/d.Omo1)*100))     Math.abs(((vol["6moC"]-vol["1moO"]))/vol["1moO"])*100}); 
  
      // Then d3.treemap computes the position of each element of the hierarchy
      d3.treemap()
        .size([width, height])
        .padding(8)
        (root)

      var fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); }

      var color = d3.scaleOrdinal(d3.schemeCategory20.map(fader))

      

      //console.log(myColor(d3.max(root)));
      var color4 = d3.interpolateRdYlGn(0,1)


      // create a tooltip
      var Tooltip = d3.select("body")
        .append("div")
        .style("opacity", 0)
        .attr("class", "tooltip")
        .style("background-color", "grey")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("position","absolute")
        .style("padding", "10px")

      // Three function that change the tooltip when user hover / move / leave a cell
      var mouseover = function(d) 
      {
        Tooltip
          .style("opacity", 1)
        d3.select(this)
        
          .style("stroke", "black")
          .style("opacity", 1)
      };

      var mousemove = function(d) 
      {
        Tooltip
          .html(`<strong> Ticker:</strong> ${d.data.Ticker} <br>
          <strong> Company Name:</strong> ${d.data.name} <br>
          <strong> Sector:</strong> ${d.data.sector} <br> 
          <strong> Highest Price(in 6 months):</strong> ${Math.max(d.data.Hmo1,d.data.Hmo2,d.data.Hmo3,d.data.Hmo4,d.data.Hmo5,d.data.Hmo6)} <br>
          <strong> Lowest Price (in 6 months):</strong> ${Math.min(d.data.Lmo1,d.data.Lmo2,d.data.Lmo3,d.data.Lmo4,d.data.Lmo5,d.data.Lmo6)} <br>
          <strong> Volume:</strong> ${d.data.Vmo6} <br>
          <strong> % Change (in 6 months):</strong> ${(((d.data.Cmo6-d.data.Omo1)/d.data.Omo1)*100)} %`)
          .style("left", (d3.mouse(this)[0]+ 70) + "px")
          .style("top", (d3.mouse(this)[1]) + "px")
          
      //console.log(d.data.Ticker)
      };
      var mouseleave = function(d) 
      {
        Tooltip
          .style("display", "block")
          .style("opacity", 1) 
        d3.select(this)
          .style("stroke", "white")
          .style("opacity", 1)
      };
      // use this information to add rectangles:
      svg
        .selectAll("rect")
        .data(root.leaves())
        .enter()
        .append("rect")
          .attr('x', function (d) { return d.x0; })
          .attr('y', function (d) { return d.y0; })
          .attr('width', function (d) { return d.x1 - d.x0; })
          .attr('height', function (d) { return d.y1 - d.y0; })
          .style("stroke", "white")
          .on("mouseover", mouseover)
          .on("mouseleave", mouseleave)
          .on("mousemove", mousemove)
          
          .attr("fill", function (d)
          {
            if ((((d.data.Cmo6-d.data.Omo1)/d.data.Omo1)*100) <= -31)
            {
              return "#FF0000";
            }
            else if (((((d.data.Cmo6-d.data.Omo1)/d.data.Omo1)*100) > -31) && ((((d.data.Cmo6-d.data.Omo1)/d.data.Omo1)*100) < -22))
            {
              return "#CC0000";
            }
            else if (((((d.data.Cmo6-d.data.Omo1)/d.data.Omo1)*100) > -22) && ((((d.data.Cmo6-d.data.Omo1)/d.data.Omo1)*100) < -15))
            {
              return "#990000";
            }
            else if (((((d.data.Cmo6-d.data.Omo1)/d.data.Omo1)*100) > -15) && ((((d.data.Cmo6-d.data.Omo1)/d.data.Omo1)*100) < 0)) 
            {
              return "#971616";
            }
            else if ((((d.data.Cmo6-d.data.Omo1)/d.data.Omo1)*100) == 0)
            {
              return "#405147";
            }
            else if (((((d.data.Cmo6-d.data.Omo1)/d.data.Omo1)*100) > 0) && ((((d.data.Cmo6-d.data.Omo1)/d.data.Omo1)*100) < 4))
            {
              return "#006600";
            }
            else if ((((d.data.Cmo6-d.data.Omo1)/d.data.Omo1)*100) > 4)
            {
              return "#009900";
            }
          });
    
      // and to add the text labels
      svg
        .selectAll("text")
        .data(root.leaves())
        .enter()
        .append("text")
          .attr("x", function(d){ return d.x0 + 1})    // +10 to adjust position (more right)
          .attr("y", function(d){ return d.y0+30})    // +20 to adjust position (lower)
          .text(function(d){ return d.data.Ticker })
          .attr("font-size", "15px")
          .attr("fill", "white")
      svg
        .selectAll("vals")
        .data(root.leaves())
        .enter()
        .append("text")
          .attr("x", function(d){ return d.x0 + 1})    // +10 to adjust position (more right)
          .attr("y", function(d){ return d.y0+48})    // +20 to adjust position (lower)
          .text(function(d){ return Math.round(((((d.data.Cmo6-d.data.Omo1)/d.data.Omo1)*100) + Number.EPSILON)*100) / 100 })
          .attr("font-size", "15px")
          .attr("fill", "white")

      // add title
      svg
        .selectAll("titles")
        .data(root.descendants().filter(function(d){return d.depth==1}))
        .enter()
        .append("text")
          .attr("x", function(d){ return d.x0})
          .attr("y", function(d){ return d.y0+2})
          .text(function(d){ return d.data.sector })
          .attr("font-size", "19px")
          .attr("fill",  function(d){ return color(d.data.sector)} )
  });
};
tree();
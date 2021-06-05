var treemap = d3.select("#treemap");
var drop = d3.select("#dropdown");

function cleardata()
{
     treemap.html("");
};

function init()
{
    cleardata();

    d3.json("Static/js/stockInfo.json").then((data => {
        var tick = data;
        tick.forEach((value => {
            var tick = drop.append('option');
            tick.text(value.Ticker);
            //console.log(value.Ticker);
        }));
        // Object.entries(tick).forEach((value) => {
        //     var d = treemap.append('option');
        //     d.text(`${value[1].Ticker}`);
        //     //console.log(value[1].Ticker);
        // });

    }));
    tree();
};

function tree()
{
    var svgWidth = 455;
    var svgHeight = 455;
    var margin = {top: 10, right: 10, bottom: 10, left: 10},
    width = svgWidth - margin.left - margin.right,
  height = svgHeight - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
    .select("#treemap")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .append("g")
    .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

// read json data
d3.json("./Resources/raviStockInfo3.json").then(function(data)  {

  // Give the data to this cluster layout:
  var root = d3.hierarchy(data)
    .sum(function(d)
    { 
        return d.Cmo6;// and ${((((vol["6moC"]-vol["1moO"]))/vol["1moO"])*100 +"%")}`)));
    }) // Here the size of each leave is given in the 'value' field in input data
    //console.log(root);
  // Then d3.treemap computes the position of each element of the hierarchy
  d3.treemap()
    .size([width, height])
    .padding(2)
    (root)

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
      .style("stroke", "black")
      .style("fill", "slateblue")

  // and to add the text labels
  svg
    .selectAll("text")
    .data(root.leaves())
    .enter()
    .append("text")
      .attr("x", function(d){ return d.x0+5})    // +10 to adjust position (more right)
      .attr("y", function(d){ return d.y0+20})    // +20 to adjust position (lower)
      .text(function(d){ return d.data.Ticker })
      .attr("font-size", "15px")
      .attr("fill", "white")
});
};
init();
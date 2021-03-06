function d3waffle() {
  var margin = {top: 5, right: 5, bottom: 5, left: 5},
      icon = "&#9632;",
      scale = 1,
      rows = 10,
      adjust = 1,
      colorscale = d3.scale.category20(),
      appearancetimes = function(d, i){ return 400; },
      width = 600,
      height = 200;
     
  function chart(selection) {
    
    selection.each(function(data) {

      /* updating data */
      data.forEach(function(d, i){
        data[i].class = slugify(d.name);
        data[i].scalevalue = Math.round(data[i].value*scale);
      });

      /* setting parameters and data */
      var idcontainer = selection[0][0].id; // I need to change thiz plz
      var total = d3.sum(data, function(d) { return d.value; });
      var totalscales = d3.sum(data, function(d){ return d.scalevalue; })

      var cols = Math.ceil(totalscales/rows);
      
      var griddata = cartesianprod(d3.range(cols), d3.range(rows));
      var detaildata = [];

      data.forEach(function(d){
        d3.range(d.scalevalue).forEach(function(e){
          detaildata.push({ name: d.name, class: d.class })
        });
      });

      detaildata.forEach(function(d, i){
        detaildata[i].col = griddata[i][0];
        detaildata[i].row = griddata[i][1];
      })
      
      var gridSize = Math.floor((height - margin.top - margin.bottom) / rows)

      /* setting the container */
      var svg = selection.append("svg")
            .attr("width", width + "px")
            .attr("height", height + "px")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var tooltip = d3.select("body").append("div")
        .attr("class", "venntooltip")
        .style("position", "absolute")
        .style("text-align", "center")
        .style("width", 60 + "px")
        .style("height", 16 + "px")
        .style("background", "#333")
        .style("color","white")
        .style("padding","2px")
        .style("border","0px")
        .style("border-radius","8px")
        .style("opacity",0)
        .style('font-size',  "15px")
        .style('font-family', 'Arial');

      svg.style("cursor", "default");

      var nodes = svg.selectAll(".node")
            .data(detaildata)
            .enter().append("g")
            .attr("class", "node")
            .attr("transform", function(d) { return "translate(" + (d.col)*gridSize + "," + (rows - d.row)*gridSize  + ")"; });

      /* this is necesary, when the icons are small/thin activate mouseout */
      nodes.append("rect")
            .style("fill", "white")
            .attr('class', function(d){ return d.class; })
            .style("stroke", "gray")
            .attr("width", gridSize)
            .attr("height", gridSize)
/*            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mousemove)*/
            .style("opacity", 0.0)

      nodes.append("text")
            .style("opacity", 0)
            .html(icon)
            .attr('class', function(d){ return d.class; })
            .attr('font-family', 'FontAwesome')
            .attr("transform", function(d) { return "translate(" + gridSize/2 + "," + 5/6*gridSize  + ")"; })
            .style("text-anchor", "middle")
            .style('fill', function(d){ return colorscale(d.class); })
            .style("font-size", function(d) {
              val = 9;
              val2 = 2.5;
              textsize = Math.min(val2 * gridSize, (val2 * gridSize - val) / this.getComputedTextLength() * val);
              return textsize * adjust + "px";
            })
            .on("mouseover", mouseover)
            .on("mouseout", mouseout)
            .on("mousemove", mousemove)
            .transition()
            .duration(appearancetimes)
            .style("opacity", 1)

      function mouseover(d){
        tooltip.transition().duration(400).style("opacity", .9);
        el = data.filter(function(e){ return e.name == d.name})[0]
        tooltip.text(el.value);

        d3.select("#" + idcontainer).selectAll("text").transition().duration(400).style("opacity", 0.2);
        d3.select("#" + idcontainer).selectAll("text." + d.class).transition().duration(400).style("opacity", 1);
      }

      function mouseout(d){
        tooltip.transition().duration(400).style("opacity", 0);
        d3.select("#" + idcontainer).selectAll("text").transition().duration(400).style("opacity", 1);
      }

      function mousemove(d){
        tooltip
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 28) + "px");
      }

    });
  }

  chart.width = function(_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };

  chart.height = function(_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };

  chart.rows = function(_) {
    if (!arguments.length) return rows;
    rows = _;
    return chart;
  };

  chart.icon = function(_) {
    if (!arguments.length) return icon;
    icon = _;
    return chart;
  };

  chart.scale = function(_) {
    if (!arguments.length) return scale;
    scale = _;
    return chart;
  };

  chart.colorscale = function(_) {
    if (!arguments.length) return colorscale;
    colorscale = _;
    return chart;
  };

chart.appearancetimes = function(_) {
    if (!arguments.length) return appearancetimes;
    appearancetimes = _;
    return chart;
  };

chart.adjust = function(_) {
    if (!arguments.length) return adjust;
    adjust = _;
    return chart;
  };

  

  return chart;

}

function slugify(text){
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .trim();                        // Trim - from end of text
}

/* http://stackoverflow.com/questions/12303989/cartesian-product-of-multiple-arrays-in-javascript */
function cartesianprod(paramArray) {

  function addTo(curr, args) {

    var i, copy, 
        rest = args.slice(1),
        last = !rest.length,
        result = [];

    for (i = 0; i < args[0].length; i++) {

      copy = curr.slice();
      copy.push(args[0][i]);

      if (last) {
        result.push(copy);

      } else {
        result = result.concat(addTo(copy, rest));
      }
    }

    return result;
  }


  return addTo([], Array.prototype.slice.call(arguments));
}
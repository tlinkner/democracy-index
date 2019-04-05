import * as d3 from 'd3';

function CompareChart(rootDOM, data){

  console.group("CompareChart");
  console.log("test");
  
  
  
  // plot ---------------------------------------

  const plot = rootDOM.append("svg")
    .attr("width",1200)
    .attr("height",400);



  // labels -------------------------------------
  
  const labels = plot.append("g")
    .attr("class","labels");
  
  labels.append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",400)
    .attr("height",400)
    .attr("fill","pink");

  labels.append("text")
    .text("Labels")
    .attr("x",10)
    .attr("y",30);



  // composition plot ---------------------------

  const composition = plot.append("g")
    .attr("class","composition")
    .attr("transform", "translate(400,0)")

  composition.append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",400)
    .attr("height",400)
    .attr("fill","yellow");


  // count plot ---------------------------------

  const count = plot.append("g")
    .attr("class","count")
    .attr("transform", "translate(800,0)")

  count.append("rect")
    .attr("x",0)
    .attr("y",0)
    .attr("width",400)
    .attr("height",400)
    .attr("fill","lime");
    
//  rootDOM.append("text")
//    .text("CompareChart");

  console.groupEnd();

}

export default CompareChart;
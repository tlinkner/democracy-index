import * as d3 from "d3";



function makeToolTip(txt){

  const dom = d3.select("body");
  const tt = dom.selectAll(".tooltip")
    .data([1]);
		
  const ttEnter = tt.enter()
    .append("div")
    .attr("class","tooltip");
		
  tt.merge(ttEnter)
    .html(txt)
    .style("left",`${d3.event.pageX + 20}px`)
    .style("top",`${d3.event.pageY}px`);
}



function destroyToolTip(){
  d3.selectAll(".tooltip").remove();
}



export {
	makeToolTip,
	destroyToolTip
}
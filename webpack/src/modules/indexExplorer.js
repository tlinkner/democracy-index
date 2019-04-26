import * as d3 from "d3";
import colorMap from "./colorMap";
import {makeKey, getMax} from "../util"



function countryMenu(data, country, dispatch){

	const dataSorted = data.sort((a,b)=>a.country - b.country);

	const menu = d3.select("#indexMenu")
		.selectAll(".ui-menu")
    .data([1]);
		
	const menuEnter = menu.enter()
		.append("div")
		.attr("class","ui-menu")
    .append("select");
		
	const menuEnterUpdate = menuEnter.merge(menu);
		
	menuEnter.selectAll("option")
    .data(dataSorted)
    .enter()
    .append("option")
    .attr("value", d => d.country)
    .attr("selected", d=>{
      if (d.country === country){
        return "selected"
      }
    })
    .html(d => d.country);
		
	menu.exit().remove();    
    
	menuEnter.on('change', function(){
		dispatch.call('change:country',null,this.value);
	});
}



function indexExplorer(data, country){

	const c = colorMap();

	const dataFiltered = data.filter(d=>d.country===country)[0];
	
	d3.select("#indexCategory")
		.text(dataFiltered.indexCategory);
		
	d3.select("#indexScore")
		.text(dataFiltered.indexScore.toFixed(2));
		
	d3.select("#indexPluralism")
		.text(dataFiltered.indexPluralism.toFixed(2));
		
	d3.select("#indexFunctioning")
		.text(dataFiltered.indexFunctioning.toFixed(2));
		
	d3.select("#indexFunctioning")
		.text(dataFiltered.indexFunctioning.toFixed(2));
		
	d3.select("#indexParticipation")
		.text(dataFiltered.indexParticipation.toFixed(2));
		
	d3.select("#indexCulture")
		.text(dataFiltered.indexCulture.toFixed(2));
		
	d3.select("#indexCivil")
		.text(dataFiltered.indexCivil.toFixed(2));

	const colorCode = c.get(makeKey(dataFiltered.indexCategory));

	d3.select("#indexCategory")
		.select(function() { return this.parentNode; })
		.style("background-color",colorCode);
}



export {
	countryMenu,
	indexExplorer
}


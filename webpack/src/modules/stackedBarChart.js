import * as d3 from "d3";
import {makeKey, getMax} from "../util"


export default function stackedBarChart(dom, keys, data){

	// color map
	const colorMap = new Map([
		["authoritarian","#be202e"],
		["hybridregime","#ce9a2b"],
		["flaweddemocracy","#76ac42"],
		["fulldemocracy","#039447"]
	]);

	const nRows = data.length
	const rowHeight = 30;
	const rowMargin = 10;
	const plotWidth = 1100;
	const plotHeight = (nRows * rowHeight) + ((nRows - 1) * rowMargin)

	const sy = d3.scaleBand()
		.domain(data.map(d=>d.key))
		.range([plotHeight,0])
		.paddingInner(rowMargin/rowHeight);

	const maxN = getMax(data, keys.map(d=>makeKey(d)));

	const sx = d3.scaleLinear()
		.domain([0,maxN])
		.range([0,760])

	const stackGenerator = d3.stack()
		.keys(keys.map(d=>makeKey(d)))

// ===================

	console.group("function stackedBarChart")
	console.log(data);

	const svg = d3.select(dom)
		.selectAll("svg")
		.data([null]);
	const svgEnter = svg.enter()
		.append("svg")
		.attr('width', plotWidth)
		.attr('height', plotHeight);

  const g = svgEnter.selectAll("g")
    .data(stackGenerator(data))
	
	g.exit().remove();
		
	const gEnter = g.enter()
    .append("g");
		
	g.merge(gEnter)
    .attr("fill",d=>colorMap.get(makeKey(d.key)))
		.attr("transform","translate(170,0)");
		
// Problem is here: these child nodes are not updating
// the parent nodes will always be the same 4 categories 
// from the stack generator.
		
	const rect = gEnter.selectAll("rect")
    .data(d=>d)
		
	const rectEnter = rect.enter()
    .append("rect")
		
	rect.merge(rectEnter)
		.attr("x",d=>sx(d[0]))
		.attr("y",d=>sy(d.data.key))
		.attr("width",d=>sx(d[1])-sx(d[0]))
		.attr("height",sy.bandwidth())	

	rect.exit().remove();
	
	console.groupEnd();
	

}



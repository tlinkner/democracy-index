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

console.log(stackGenerator(data))

	const svg = d3.select(dom)
		.classed('stachedbar',true)
		.selectAll('svg')
		.data([1]);
		
	const svgEnter = svg.enter()
		.append('svg');

	const plot = svg.merge(svgEnter)
		.attr('width', plotWidth)
		.attr('height', plotHeight)
		.append("g")
		.attr("transform","translate(170,0)")
		
	const g = plot.selectAll(".series")
		.data(stackGenerator(data))
		.enter()
		.append("g")
		.classed("series",true)
		.attr("fill",d=>colorMap.get(makeKey(d.key)))

	g.selectAll("rect")
		.data(d=>d)
		.enter()
		.append("rect")
		.attr("x",d=>sx(d[0]))
		.attr("y",d=>sy(d.data.key))
		.attr("width",d=>sx(d[1])-sx(d[0]))
		.attr("height",sy.bandwidth())	

	 const yAxis = d3.axisLeft()
		.scale(sy)
		.tickSize(0)

	dom.append("g")
		.attr("class", "y axis")
		.call(yAxis)
		.attr("transform","translate(100,0)")
		.select(".domain").remove()

}



import * as d3 from "d3";
import colorMap from "./colorMap";
import {getGlobalState} from "../index"
import {makeKey, getMax} from "../util"


export default function stackedBarChart(dom, keys, data){

	let chartData = data;

	const c = colorMap();

	const nRows = data.length
	const rowHeight = 20;
	const rowMargin = 5;
	const plotWidth = 1100;
	const plotHeight = (nRows * rowHeight) + ((nRows - 1) * rowMargin)

	const sy = d3.scaleBand()
		.domain(data.map(d=>d.key))
		.range([plotHeight,0])
		.paddingInner(rowMargin/rowHeight);

	const globalState = getGlobalState();
	
	let maxN = getMax(data, keys.map(d=>makeKey(d)));
	
// kind of a hack. 
// the beginnings of compositino/count toggle
//	if (globalState.metricToggle === true) {
		if (globalState.axisToggle === true) {
			maxN = 2151880000;
		} else {
			maxN = 700680000;
		}
//	} else {
//		chartData = data.map(d=>{
//			keys.forEach(j=>{
//				d[makeKey(j)] = Math.round(d[makeKey(j)]/d.rowMax*100);
//			})
//			return d;
//		})
//		maxN = 100;
//	}

	const sx = d3.scaleLinear()
		.domain([0,maxN])
		.range([0,760])

	const stackGenerator = d3.stack()
		.keys(keys.map(d=>makeKey(d)))

	const svg = d3.select(dom)
		.selectAll("svg")
		.data([1]);
	const svgEnter = svg.enter()
		.append("svg");
		
	const svgEnterUpdate = svg.merge(svgEnter)
		.attr('width', plotWidth)
		.attr('height', plotHeight>0 ? plotHeight: 20);

  const column = svgEnterUpdate.selectAll(".column")
    .data(stackGenerator(chartData));

	const columnEnter = column.enter()
    .append("g")
		.attr("class","column");

	const columnEnterUpdate = column.merge(columnEnter)
    .attr("fill",d=>c.get(makeKey(d.key)))
		.attr("transform","translate(170,20)");

	const row = columnEnterUpdate.selectAll(".row")
    .data(d=>d);

	const rowEnter = row.enter()
    .append("rect")
		.attr("class","row")

	row.merge(rowEnter)
		.attr("x",d=>sx(d[0]))
		.attr("y",d=>sy(d.data.key))
		.attr("width",d=>sx(d[1])-sx(d[0]))
		.attr("height",sy.bandwidth())
		.attr("data-foo",d=>d.data.key)

	row.exit().remove();
	
	let axisXGenerator = d3.axisTop().ticks(5).tickSizeInner(5);
	let axisYGenerator = d3.axisLeft().tickSizeInner(10);
	
	axisXGenerator.scale(sx);
	axisYGenerator.scale(sy);
	
	
	let axisX = svgEnter.append('g')
		.attr('class','axis axis-x')
		.attr('transform', `translate(170,20)`);
	let axisY = svgEnter.append('g')
		.attr('class','axis axis-y')
		.attr('transform', `translate(170,20)`);
		
		svgEnter.merge(svg)
			.select('.axis-x')
			.call(axisXGenerator)

		svgEnter.merge(svg)
			.select('.axis-y')
			.call(axisYGenerator)

	d3.selectAll(".domain").remove()
	d3.selectAll(".axis-y .tick line").remove()
	
}

import * as d3 from "d3";
import {makeKey, getMax} from "../util"


export default function stackedBarChart(dom, keys, data){

	const colorMap = new Map([
		["authoritarian","#be202e"],
		["hybridregime","#ce9a2b"],
		["flaweddemocracy","#76ac42"],
		["fulldemocracy","#039447"]
	]);

	const nRows = data.length
	const rowHeight = 20;
	const rowMargin = 5;
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

	const svg = d3.select(dom).selectAll("svg")
		.data([1]);
	const svgEnter = svg.enter()
		.append("svg");
	const svgEnterUpdate = svg.merge(svgEnter)
		.attr('width', plotWidth)
		.attr('height', plotHeight);

  const column = svgEnterUpdate.selectAll(".column")
    .data(stackGenerator(data));

	const columnEnter = column.enter()
    .append("g")
		.attr("class","column");

	const columnEnterUpdate = column.merge(columnEnter)
    .attr("fill",d=>colorMap.get(makeKey(d.key)))
		.attr("transform","translate(170,0)");

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
}

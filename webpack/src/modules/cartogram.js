import * as d3 from "d3";
import {makeKey} from "../util";



export default function cartogram(dom, data){

	// set up
	const w = 760;
	const h = 320;

	// color map
	const colorMap = new Map([
		["authoritarian","#be202e"],
		["hybridregime","#ce9a2b"],
		["flaweddemocracy","#76ac42"],
		["fulldemocracy","#039447"]
	]);
	
	// max
	const maxTotalPop = d3.max(data, d=>d.totalPop);

	// scale for dot size
	const sr = d3.scaleSqrt()
		.domain([0,maxTotalPop])
		.range([0,30]);

	// projection
	const projection = d3.geoEquirectangular()
		.scale((w/640)*100)
		.translate([w/2, h/2]);

	const svg = d3.select(dom)
		.classed('cartogram',true)
		.selectAll('svg')
		.data([1]);
	const svgEnter = svg.enter()
		.append('svg');

	const plot = svg.merge(svgEnter)
		.attr('width', w)
		.attr('height', h)

	// labels
	const labels = [
			{txt:"North America",lat:32.7865,lng:-97.1148},
			{txt:"South America",lat:-8.7832,lng:-55.4915},
			{txt:"Europe",lat:48.8789,lng:2.32335},
			{txt:"Africa",lat:-8.7832,lng:34.5085},
			{txt:"Asia-Pacific",lat:34.0479,lng:100.6197}
		];

	plot.selectAll("text")
		.data(labels)
		.enter()
		.append("text")
		.attr("x",d=>projection([d.lng,d.lat])[0])
		.attr("y",d=>projection([d.lng,d.lat])[1])
		.text(d=>d.txt)
		.attr("class","cartogram-label")
		.attr("text-anchor","middle")

	// force layout dots
	
	const dots = plot.selectAll(".dot")
		.data(data);
		
	const dotsEnter = dots.enter()
			.append("circle")
			.attr("class","dot");

	dots.merge(dotsEnter)
			.attr("cx",d=>projection([d.lng,d.lat])[0])
			.attr("cy",d=>projection([d.lng,d.lat])[1])
			.attr("r", d=>sr(d.totalPop))
			.attr("fill",d=>{
				const k = makeKey(d.indexCategory);
				return colorMap.get(k);
			})
			.attr("opacity",0.8)
			.attr("data-country",d=>d.country)

		dots.exit().remove();	
	
	
}


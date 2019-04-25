import * as d3 from "d3";
import colorMap from "./colorMap";
import {makeKey} from "../util";
import {
	makeToolTip,
	destroyToolTip
} from "./toolTip";



export default function cartogram(dom, data){

	const c = colorMap();

	// set up
	const w = 760;
	const h = 320;

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
		
	const title = d3.select(dom)
		.selectAll("h4")
		.data([1])
		.enter()
		.append("h4")
		.text("Democracy Index Countries By Relative Population");

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

	const dots = plot.selectAll(".dot")
		.data(data);
		
	const dotsEnter = dots.enter()
			.append("circle")
			.attr("class","dot");
			
	dotsEnter
		.on("mouseover",d=>{
      makeToolTip(d.key)
    })
    .on("mouseout", destroyToolTip);
			

	dots.merge(dotsEnter)
			.attr("cx",d=>projection([d.lng,d.lat])[0])
			.attr("cy",d=>projection([d.lng,d.lat])[1])
			.attr("r", d=>sr(d.totalPop))
			.attr("fill",d=>{
				const k = makeKey(d.indexCategory);
				return c.get(k);
			})
			.attr("opacity",0.8)
			.attr("data-country",d=>d.country)

		dots.exit().remove();	
}


import * as d3 from "d3";
import colorMap from "./colorMap";
import {makeKey} from "../util";
import {getGlobalState} from "../index"
import {
	makeToolTip,
	destroyToolTip
} from "./toolTip";



export default function cartogram(dom, data){

	const c = colorMap();
	const globalState = getGlobalState();

	// set up
	const w = 760;
	const h = 320;

	// max
	 const maxTotalPop = d3.max(data, d=>d.totalPop);
	// It workd better here to adjust relative sizes for the data.
	// Otherwise small populations aren't visible.
	// const maxTotalPop = 2151880000

	// scale for dot size
	const sr = d3.scaleSqrt()
		.domain([0,2151880000])
		.range([0,70]);

	// projection
	const projection = d3.geoEquirectangular()
		.center([30,20])
		.scale((w/640)*100)
		.translate([w/2, h/2]);
		
	const title = d3.select(dom)
		.selectAll("h4")
		.data([1]);

	const titleEnter = title.enter()
		.append("h4");
		
	title.merge(titleEnter)
		.text("Democracy Index Countries By Relative Population: ")
		.append("span")
		.text(function(){
			if (globalState.axisToggle===true){
				return "All Religions"
			} else {
				return globalState.religion;
			}
		});

	const svg = d3.select(dom)
		.selectAll('svg')
		.data([1]);
		
	const svgEnter = svg.enter()
		.append('svg');

	const plot = svg.merge(svgEnter)
		.attr('width', w)
		.attr('height', h);

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
		.attr("text-anchor","middle");

	const dots = plot.selectAll(".dot")
		.data(data, d=>d.key);
		
	const dotsEnter = dots.enter()
			.append("circle")
			.attr("class","dot");
			
	dotsEnter
		.on("mouseover",d=>{
      makeToolTip(d.key)
    })
    .on("mouseout", destroyToolTip);
			
	dots.merge(dotsEnter)
			.attr("cx",w/2)
			.attr("cy",h/2)
			.attr("r", d=>sr(d.totalPop))
			.attr("fill",d=>{
				const k = makeKey(d.indexCategory);
				return c.get(k);
			})
			.attr("opacity",0.8)
			.attr("data-country",d=>d.country);

		dots.exit().remove();	
		
	const simulation = d3.forceSimulation();
	const forceX = d3.forceX().x(d=>projection([d.lng,d.lat])[0]);
	const forceY = d3.forceY().y(d=>projection([d.lng,d.lat])[1]);
	const forceCollide = d3.forceCollide().radius(d=>sr(d.totalPop)+2);
	simulation
		.force('x', forceX)
		.force('y', forceY)
		.force('collide', forceCollide);

	simulation.on('tick', () => {
			dots.merge(dotsEnter)
				.attr('cx', d => d.x)
				.attr('cy', d => d.y);
		})
		.nodes(data, d=>d.key);

}


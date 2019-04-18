import * as d3 from "d3";
import {makeKey} from "../util";



export default function cartogram(data){

	// set up
	const w = 760;
	const h = 380;

	// color map
	const colorMap = new Map([
		["authoritarian","#be202e"],
		["hybridregime","#ce9a2b"],
		["flaweddemocracy","#76ac42"],
		["fulldemocracy","#039447"]
	]);
	
	// max
	const maxReligionPop = d3.max(data, d=>d.allReligions);

	// scale for dot size
	const sr = d3.scaleSqrt()
		.domain([0,maxReligionPop])
		.range([0,30]);

	// projection
	const projection = d3.geoEquirectangular()
		.scale((w/640)*100)
		.translate([w/2, h/2]);

	// data for force layout
	const dataXY = data.map(d=>{
		d.x = projection([d.lng,d.lat])[0];
		d.y = projection([d.lng,d.lat])[1];
		return d;
	});
	
	// simulation
	const simulation = d3.forceSimulation(dataXY)
		.force('collision', d3.forceCollide().radius(5))
		.on('tick', ticked);

	const plot = d3.select("#cartogram")
		.append("svg")
		.attr("width",w)
		.attr("height",h);

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
	function ticked() {
		const dots = plot.selectAll("circle")
			.data(dataXY);

		const dotsEnter = dots.enter()
			.append("circle");

		dots.merge(dotsEnter)
			.attr("cx",d=>d.x)
			.attr("cy",d=>d.y)
			// todo: scale radius
			.attr("r", d=>sr(d.allReligions))
			.attr("fill",d=>{
				const k = makeKey(d.indexCategory);
				return colorMap.get(k);
			})
			.attr("opacity",0.8)
			.attr("data-country",d=>d.country)

		dots.exit()
			.remove();	
	}
}


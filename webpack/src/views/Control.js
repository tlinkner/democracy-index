import * as d3 from 'd3';
import {getReligionList, getCategoryList} from '../data';
import {makeKey, unmakeKey} from '../util';



function renderReligionMenu(data) {

	const religions = getReligionList(data);
	
	const dom = d3.select("#legend")
		.append("div")
		.attr("class", "country-menu")
		.append("select")
		.on("change", function () {
			// todo: replace with dispatch
			console.log(this.value)
		});
		
	const option = dom.selectAll("option")
		.data(religions);
	
	const optionEnter = option.enter()
		.append("option")
		// todo: read state object
		.attr("value", d => d.key)
		.text(d => unmakeKey(d.key));
		
}

function renderCategoryOptions(data) {

	const categories = getCategoryList(data);
	
	const dom = d3.select("#legend")
		.append("div")
		.attr("class", "category-options");
		
	const option = dom.selectAll(".option")
		.data(categories);
		
	const optionEnter = option.enter()
		.append("div")
		.attr("class", "option");
		
	const widget = optionEnter.append("input")
		.attr("type", "checkbox")
		.attr("id", d => makeKey(d.key))
		// todo: read state object
		.attr("class", d => `option-${makeKey(d.key)}`)
		.on("change", function () {
			// todo: replace with dispatch
			console.log(d3.select(this).attr("id"))
		});
		
	const label = optionEnter.append("label")
		.attr("for", d => makeKey(d.key))
		.text(d => d.key);
		
}

function renderValueToggle() {

	const dom = d3.select("#axis")
		.append("div")
		.attr("class", "value-toggle")
		.append("input")
		.attr("type", "checkbox")
		.attr("id", "value-toggle")
		.on("change", function () {
			// todo: replace with dispatch
			console.log(d3.select(this).attr("id"))
		});
}

function renderAxisToggle() {

	const dom = d3.select("#axis")
		.append("div")
		.attr("class", "axis-toggle")
		.append("input")
		.attr("type", "checkbox")
		.attr("id", "axis-toggle")
		.on("change", function () {
			// todo: replace with dispatch
			console.log(d3.select(this).attr("id"))
		});
		
}

function renderAxisToggle() {

	const dom = d3.select("#axis")
		.append("div")
		.attr("class", "axis-toggle")
		.append("input").attr("type", "checkbox")
		.attr("id", "axis-toggle")
		.on("change", function () {
			// todo: replace with dispatch
			console.log(d3.select(this).attr("id"))
		});
		
}



export {
	renderReligionMenu, 
	renderCategoryOptions, 
	renderValueToggle, 
	renderAxisToggle
}
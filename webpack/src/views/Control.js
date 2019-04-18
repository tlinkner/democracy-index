// import ---------------------------------------

import * as d3 from "d3";
import {getReligionList, getCategoryList} from "../data";
import {makeKey, unmakeKey} from "../util";


// functions ------------------------------------

function renderCategoryOptions(data, dispatch) {
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
			dispatch.call("change:category",null,data, this.checked)
		});
	const label = optionEnter.append("label")
		.attr("for", d => makeKey(d.key))
		.text(d => d.key);
}

function renderMetricToggle(data, dispatch) {
	const dom = d3.select("#axis")
		.append("div")
		.attr("class", "metric-toggle")
		.append("input")
		.attr("type", "checkbox")
		.attr("id", "metric-toggle")
		.on("change", function () {
			dispatch.call("change:metric",null,data, this.checked)
		}
	);
}

function renderAxisToggle(data, dispatch) {
	const dom = d3.select("#axis")
		.append("div")
		.attr("class", "axis-toggle")
		.append("input")
		.attr("type", "checkbox")
		.attr("id", "axis-toggle")
		.on("change", function () {
			dispatch.call("change:axis",null,data, this.checked)
		}
	);
}

function renderReligionMenu(data, dispatch) {
	const religions = getReligionList(data);
	const dom = d3.select("#legend")
		.append("div")
		.attr("class", "country-menu")
		.append("select")
		.on("change", function (d) {
			// todo: replace with dispatch
			dispatch.call("change:religion",null,data, this.checked)
		});
	const option = dom.selectAll("option")
		.data(religions);
	const optionEnter = option.enter()
		.append("option")
		// todo: read state object
		.attr("value", d => d.key)
		.text(d => unmakeKey(d.key));
}



// export ---------------------------------------

export {
	renderCategoryOptions, 
	renderMetricToggle, 
	renderAxisToggle,
	renderReligionMenu
}
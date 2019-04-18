// import ---------------------------------------

import "./style.css";
import * as d3 from "d3";

import {
	renderCategoryOptions,
	renderMetricToggle,
	renderAxisToggle,
	renderReligionMenu
} from "./views/Control";

import {
	makeKey
} from "./util";

import {
	democracyDataPromise, 
	getCategoryList
} from "./data";



// app ------------------------------------------

democracyDataPromise.then(data => {

	// set state
	setCategoryState(data);
	
	
	// dispatch
	const globalDispatch = d3.dispatch(
		"change:religion", 
		"change:axis", 
		"change:metric",
		"change:category",
		"change:foo"
	);

	globalDispatch.on("change:religion", (data, religion) =>{
		console.log("change religion")
	})
	globalDispatch.on("change:axis", (data, axis) =>{
		console.log("change axis")
	})
	globalDispatch.on("change:metric", (data, metric) =>{
		console.log("change metric")
	})
	globalDispatch.on("change:category", (data, category) =>{
		console.log("change category")
	})

	// render ui
	renderCategoryOptions(data, globalDispatch);
	renderMetricToggle(data, globalDispatch);
	renderAxisToggle(data, globalDispatch);
	renderReligionMenu(data, globalDispatch);
	
	// render plot
	renderPlots(data);
	
});



// app state ------------------------------------

const GlobalState = {
	axisToggle: 1,
	metricToggle: 1,
	religion: "muslim" // set default	
}

function setCategoryState(data){
	const categories = getCategoryList(data);
	categories.forEach(d=>{
		GlobalState[makeKey(d.key)] = 1;
	});
}



// dispatch -------------------------------------





// app state ------------------------------------


function renderPlots(data) {

}


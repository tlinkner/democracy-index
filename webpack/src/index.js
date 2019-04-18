// import ---------------------------------------

import "./style.css";
import * as d3 from "d3";
import renderMetricToggle from "./modules/metricToggle";
import renderAxisToggle from "./modules/axisToggle";
import renderCategoryOptions from "./modules/categoryOptions";
import renderReligionMenu from "./modules/religionMenu";
import cartogram from "./modules/cartogram";
import {makeKey} from "./util";
import {
	democracyDataPromise, 
	getCategoryList,
	getCountryData
} from "./data";



// app state ------------------------------------

const globalState = {
	axisToggle: 1,
	metricToggle: 1,
	religion: "muslim" // set default	
}

function setCategoryState(data){
	const categories = getCategoryList(data);
	categories.forEach(d=>{
		globalState[makeKey(d.key)] = 1;
	});
}



// app ------------------------------------------

democracyDataPromise.then(data => {

	// set state: update dynamic categories
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
		globalState.religion = religion;
		renderPlots(data);
	})
	globalDispatch.on("change:axis", (data, axis) =>{
		globalState.axisToggle ^= true;
		renderPlots(data);
	})
	globalDispatch.on("change:metric", (data, metric) =>{
		globalState.metricToggle ^= true;
		renderPlots(data);
	})
	globalDispatch.on("change:category", (data, category) =>{
		globalState[category] ^= true;
		renderPlots(data);
	})

	// render ui
	renderCategoryOptions(data, globalState, globalDispatch);
	renderMetricToggle(data, globalState, globalDispatch);
	renderAxisToggle(data, globalState, globalDispatch);
	renderReligionMenu(data, globalState, globalDispatch);
	
	// render plot
	renderPlots(data, globalState);
	
});



function renderPlots(data, state) {

	// axis
	// if axis == 0: filter by religion
	// metric
	// filter by categories

	// send to map
	
	// send to plot
	


//	console.log(globalState)

	cartogram(getCountryData(data));

}



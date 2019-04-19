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
		globalState.axisToggle = 0;
		globalState.religion = religion;
		renderPlots(data, globalState);
		updateUI(globalState);
	})
	globalDispatch.on("change:axis", (data, axis) =>{
		console.log("axis")
		globalState.axisToggle ^= true;
		renderPlots(data, globalState);
		updateUI(globalState);
		renderReligionMenu(data, globalState, globalDispatch);
	})
	globalDispatch.on("change:metric", (data, metric) =>{
		globalState.metricToggle ^= true;
		renderPlots(data, globalState);
		updateUI(globalState);
	})
	globalDispatch.on("change:category", (data, category) =>{
		globalState[category] ^= true;
		renderPlots(data, globalState);
		updateUI(globalState);
	})

	
	// render ui
	renderCategoryOptions(data, globalState, globalDispatch);
	renderMetricToggle(data, globalState, globalDispatch);
	renderAxisToggle(data, globalState, globalDispatch);
	renderReligionMenu(data, globalState, globalDispatch);


	// render plot
	renderPlots(data, globalState, globalDispatch);
	
});



function updateUI(state){
	// update axis toggle
	d3.select("#axis-toggle")
		.call(d=>{
			if (state.axisToggle===1){
				d.node().checked = true;
			} else {
				d.node().checked = false;
			}
		})
}



function renderPlots(data, state, dispatch) {

	let dataFiltered = data;

	// axis and religion filter
	if (state.axisToggle===0){
		dataFiltered = data.filter(d=>d.religion===state.religion);
	} else {
		dataFiltered = data;
	}

	// category filters
	const searchCategories = [];
	const categories = getCategoryList(data)
		.forEach(d=>{
			if (state[makeKey(d.key)]===1){
				searchCategories.push(d.key);
			}
		})
		
	dataFiltered = dataFiltered.filter(d=>{
		if(searchCategories.includes(d.indexCategory)){
			return d;
		}
	})

//		searchKeys.includes(d.indexCategory)

	// metric
	// filter by categories

	// send to map
	
	// send to plot
	
	
	d3.select('#cartogram')
		.each(function(){
			cartogram(this, getCountryData(dataFiltered));
		});
	

//	cartogram(plot, getCountryData(dataFiltered));

}



// import ---------------------------------------

import "./style.css";
import * as d3 from "d3";
import renderMetricToggle from "./modules/metricToggle";
import renderAxisToggle from "./modules/axisToggle";
import renderCategoryOptions from "./modules/categoryOptions";
import renderReligionMenu from "./modules/religionMenu";
import cartogram from "./modules/cartogram";
import stackedBarChart from "./modules/stackedBarChart";
import {makeKey} from "./util";
import {
	democracyDataPromise, 
	getReligionList,
	getCategoryList,
	getCountryData,
	getReligionData,
	getIndexSums
} from "./data";



// app state ------------------------------------

const globalState = {
	axisToggle: 1,
	metricToggle: 1,
	religion: "muslim"
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

	// religion filter
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

	// cartogram
	d3.select('#cartogram')
		.each(function(){
			cartogram(this, getCountryData(dataFiltered));
		});

	// stacked bar chart
	let barData = [];
	if (state.axisToggle===0){
		barData = getCountryData(dataFiltered);
	} else {
		barData = getReligionData(dataFiltered, getCategoryList(data).map(d=>d.key))
	}
	
	d3.select('#stackedbar')
		.each(function(){
			stackedBarChart(this, getCategoryList(data).map(d=>d.key), getIndexSums(barData,getCategoryList(data).map(d=>d.key)))
		})
}



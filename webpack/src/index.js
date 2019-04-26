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
	countryMenu,
	indexExplorer
} from "./modules/indexExplorer";
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
	axisToggle: true,
	metricToggle: false,
	religion: "christian"
}

function setCategoryState(data){
	const categories = getCategoryList(data);
	categories.forEach(d=>{
		globalState[makeKey(d.key)] = true;
	});
}



// app ------------------------------------------

democracyDataPromise.then(data => {

	// set state: update dynamic categories
	setCategoryState(data);

	// dispatch
	const globalDispatch = d3.dispatch(
		"general:update",
		"change:religion",
		"change:axis",
		"change:metric",
		"change:category",
		"change:country"
	);

	globalDispatch.on("general:update", (data) =>{
		renderPlots(data, globalState, globalDispatch);
		updateUI(globalState);
	})
	globalDispatch.on("change:religion", (data, religion) =>{
		globalState.axisToggle = false;
		globalState.religion = religion;
		renderPlots(data, globalState, globalDispatch);
		updateUI(globalState);
	})
	globalDispatch.on("change:axis", (data, axis) =>{
		globalState.axisToggle = !globalState.axisToggle;
		renderPlots(data, globalState, globalDispatch);
		renderReligionMenu(data, globalState, globalDispatch);
		updateUI(globalState);
	})
	globalDispatch.on("change:metric", (data, metric) =>{
		globalState.metricToggle = !globalState.metricToggle;
		renderPlots(data, globalState, globalDispatch);
		updateUI(globalState);
	})
	globalDispatch.on("change:category", (data, category) =>{
		globalState[category] = !globalState[category];
		renderPlots(data, globalState, globalDispatch);
		updateUI(globalState);
	})
	globalDispatch.on("change:country", (country) =>{
		countryMenu(data, country, globalDispatch);
		indexExplorer(data,country);
	})

	// render ui
	renderCategoryOptions(data, globalState, globalDispatch);
	renderAxisToggle(data, globalState, globalDispatch);
	renderReligionMenu(data, globalState, globalDispatch);
	
	// render explorer
	globalDispatch.call("change:country",null,"United States");

	// render plot
	globalDispatch.call("general:update",null,data);

});

function updateUI(state){
	// update axis toggle
	d3.select("#axis-toggle")
		.call(d=>{
			if (state.axisToggle===true){
				d.node().checked = true;
			} else {
				d.node().checked = false;
			}
		})
}

function renderPlots(data, state, dispatch) {

	let dataFiltered = data;

	// religion filter
	if (state.axisToggle===false){
		dataFiltered = data.filter(d=>d.religion===state.religion);
	} else {
		dataFiltered = data;
	}

	// category filters
	const searchCategories = [];
	const categories = getCategoryList(data)
		.forEach(d=>{
			if (state[makeKey(d.key)]===true){
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

	if (state.axisToggle===false){
		barData = getCountryData(dataFiltered);
	} else {
		barData = getReligionData(dataFiltered, getCategoryList(data).map(d=>d.key))
	}

	d3.select('#stackedbar')
		.each(function(){
			stackedBarChart(
				this, // dom
				getCategoryList(data).map(d=>d.key), // keys
				getIndexSums(barData,getCategoryList(data).map(d=>d.key))) // data
		});
}



// export ---------------------------------------

function getGlobalState(){
	return globalState;
}

export {
	getGlobalState
}

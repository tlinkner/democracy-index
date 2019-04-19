import * as d3 from 'd3';
import {makeKey} from "./util";



const democracyDataPromise = d3.json("./data/democracy_religion_long.json");

function getReligionList(data){

	const religionData = d3.nest()
		.key(d=>d.religion)
		.entries(data)
		.map(d=>{
			const thisReligion = data.filter(j=>j.religion == d.key)
			const thisReligionSum = d3.sum(thisReligion,d=>d.religionPop);
			d.religionSum = thisReligionSum;
			return d;
		})
		.sort((a,b)=>b.religionSum-a.religionSum);
		
	return religionData;
}

function getCategoryList(data){

	const categories = d3.nest()
		.key(d=>d.indexCategory)
		.rollup(values=>d3.mean(values, d=>d.indexScore))
		.entries(data)
		.sort((a,b)=>a.value-b.value);

	return categories;
}

function getCountryData(data){

	const countryData = d3.nest()
		.key(d=>d.country)
		.entries(data)
		.map(d=>{
			d.indexScore = d.values[0].indexScore;
			d.indexCategory = d.values[0].indexCategory;
			d.totalPop = d3.sum(d.values,j=>j.religionPop);
			d.lat = d.values[0].lat;
			d.lng = d.values[0].lng;
			return d
		})
		
	return countryData;
}

function getReligionData(data, categories){

	const religionData = d3.nest()
		.key(d=>d.religion)
		.entries(data)
		.map(d=>{
			const thisReligion = data.filter(j=>j.religion == d.key)
			const thisReligionSum = d3.sum(thisReligion,d=>d.religionPop);
			d.religionSum = thisReligionSum;
			return d;
		})
		.sort((a,b)=>a.religionSum-b.religionSum);		
		
	return religionData;

}

function getIndexSums(data,categories){

	const simplifiedData = data.map(d=>{
		categories.forEach(j=>{
			const tmpData = d.values.filter(k=>k.indexCategory===j);
			d[makeKey(j)] = d3.sum(tmpData,d=>d.religionPop);
		})
		return d;
	})

 return simplifiedData;
}


export {
  democracyDataPromise, 
	getReligionList, 
	getCategoryList,
	getCountryData,
	getReligionData,
	getIndexSums
}


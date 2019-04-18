import * as d3 from 'd3';



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
			d.allReligions = d.values[0].allReligions;
			d.lat = d.values[0].lat;
			d.lng = d.values[0].lng;
			return d
		})
		
	return countryData;
}



export {
  democracyDataPromise, 
	getReligionList, 
	getCategoryList,
	getCountryData
}


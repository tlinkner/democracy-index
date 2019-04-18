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



export {
  democracyDataPromise, 
	getReligionList, 
	getCategoryList
}


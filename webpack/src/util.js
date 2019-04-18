import * as d3 from 'd3';



function getCategorySum(data, category){
	const tmpData = data.filter(d=>d.indexCategory===category);
	const tmpSum = d3.sum(tmpData,d=>d.religionPop);
	return tmpSum;
}



function makeKey(str){
	const newStr = str.replace(/ /g,"").toLowerCase();
	return newStr;
}



function unmakeKey(str){
	const newStr = str.replace(/([A-Z])/g, " $1")
		.trim()
		.replace(/\b\w/g, l => l.toUpperCase());
	return newStr;
}



export {
	getCategorySum,
	makeKey,
	unmakeKey
}
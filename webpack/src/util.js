// import ---------------------------------------

import * as d3 from "d3";


// functions ------------------------------------

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



function getMax(data,keys){

	console.log(data);

//	tmpData = data.map(d=>{
//		d.rowNums = d3.sum(keys.map(j=>d[j]))
//		return d;
//	});
//	
//	return d3.max(tmpData,d=>d.rowNums);
}


// exmport --------------------------------------

export {
	makeKey,
	unmakeKey,
	getMax
}
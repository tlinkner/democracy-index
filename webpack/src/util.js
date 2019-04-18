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



// exmport --------------------------------------

export {
	makeKey,
	unmakeKey
}
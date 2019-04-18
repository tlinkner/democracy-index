// import ---------------------------------------

//import * as d3 from 'd3';
//
//
//// module ---------------------------------------
//
//function ReligionMenu() {
//
//		const religions = getReligionList(data);
//
//		const dom = d3.select("#legend")
//			.append("div")
//			.attr("class", "country-menu")
//			.append("select")
//			.on("change", function (d) {
//				// todo: replace with dispatch
//				onChangeCallBack(this.value);
//			});
//
//		const option = dom.selectAll("option")
//			.data(religions);
//
//		const optionEnter = option.enter()
//			.append("option")
//			// todo: read state object
//			.attr("value", d => d.key)
//			.text(d => unmakeKey(d.key));
//			
//}
//
//
//
//// export ---------------------------------------
//
//export ReligionMenu;
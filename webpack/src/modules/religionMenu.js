import * as d3 from "d3";
import {getReligionList, getCategoryList} from "../data";
import {makeKey, unmakeKey} from "../util";



export default function renderReligionMenu(data, state, dispatch) {

	const religions = getReligionList(data);
	
	const dom = d3.select("#legend")
		.append("div")
		.attr("class", "country-menu")
		.append("select")
		.on("change", function (d) {
			dispatch.call("change:religion",null,data, this.value)
		});
		
	const option = dom.selectAll("option")
		.data(religions);
		
	const optionEnter = option.enter()
		.append("option")
		.attr("value", d => d.key)
		.attr("selected",d=>{
			if (state.religion===d.key){
				return "selected";
			}
		})
		.text(d => unmakeKey(d.key));
		
}


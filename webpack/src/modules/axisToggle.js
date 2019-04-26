import * as d3 from "d3";
import {
	makeToolTip,
	destroyToolTip
} from "./toolTip";



export default function renderAxisToggle(data, state, dispatch) {

	const dom = d3.select("#legend")
		.append("div")
		.attr("class", "axis-toggle")
		.append("input")
		.attr("type", "checkbox")
		.attr("id", "axis-toggle")
		.call(d=>{
			if (state.axisToggle===true){
				d.node().checked = true;
			} else {
				d.node().checked = false;
			}
		})
		.on("change", function () {
			dispatch.call("change:axis",null,data, this.checked)
		})
		.on("mouseover",function(){
			makeToolTip("Switch chart axes");
		})
    .on("mouseout", function(){
			destroyToolTip();
		})
}

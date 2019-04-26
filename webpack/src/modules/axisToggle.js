import * as d3 from "d3";
import {
	makeToolTip,
	destroyToolTip
} from "./toolTip";



export default function renderAxisToggle(data, state, dispatch) {

	const dom = d3.select("#legend");
	
	dom
		.append("p")
		.attr("class","axis-toggle-info")
		.text("Toggle axis")
		
	const component = dom
		.append("div")
		.attr("class", "axis-toggle")
		
	const widget = component
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
		});
}

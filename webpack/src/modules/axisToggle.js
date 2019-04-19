import * as d3 from "d3";



export default function renderAxisToggle(data, state, dispatch) {

	const dom = d3.select("#legend")
		.append("div")
		.attr("class", "axis-toggle")
		.append("input")
		.attr("type", "checkbox")
		.attr("id", "axis-toggle")
		.call(d=>{
			if (state.axisToggle===1){
				d.node().checked = true;
			} else {
				d.node().checked = false;
			}
		})
		.on("change", function () {
			dispatch.call("change:axis",null,data, this.checked)
		}
	)
	
}
import * as d3 from "d3";



export default function renderMetricToggle(data, state, dispatch) {

	const dom = d3.select("#legend")
		.append("div")
		.attr("class", "metric-toggle")
		.append("input")
		.attr("type", "checkbox")
		.attr("id", "metric-toggle")
		.call(d=>{
			if (state.metricToggle===true){
				d.node().checked = true;
			} else {
				d.node().checked = false;
			}
		})
		.on("change", function () {
			dispatch.call("change:metric",null,data, this.checked)
		});

}

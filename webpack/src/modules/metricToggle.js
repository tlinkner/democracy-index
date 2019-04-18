import * as d3 from "d3";



export default function renderMetricToggle(data, state, dispatch) {

	const dom = d3.select("#axis")
		.append("div")
		.attr("class", "metric-toggle")
		.append("input")
		.attr("type", "checkbox")
		.attr("id", "metric-toggle")
		.attr("checked",()=>{
			if (state.metricToggle===1){
				return "checked";
			}
		})
		.on("change", function () {
			dispatch.call("change:metric",null,data, this.checked)
		}
	)
	
}
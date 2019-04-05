// imports --------------------------------------

import "../dist/style.css";
import * as d3 from 'd3';

// promises
import {
  democracyPromise,
  religionPromise
} from './data';

// util module
import {
	fooUtil
} from './util';

// view modules
import Control from './views/Control';
import Cartogram from './views/Cartogram';
import CompareChart from './views/CompareChart';



// dispatch -------------------------------------

const globalDispatch = d3.dispatch(
  "change:religion", 
  "change:country"
);

globalDispatch.on('change:religion', religion => {
  console.log(religion);
});

globalDispatch.on('change:country', country => {
  console.log(country);
});



// app ------------------------------------------

Promise.all([
		democracyPromise,
		religionPromise
	])
	.then(([migration, countryCode, metadataMap]) => {

    // lookup full text of democracy index categories
    const democracyLookup = [
      {key: "demPluralism",value: "Electoral process and pluralism"},
      {key: "demFunctioning",value: "Functioning of government"},
      {key: "demParticipation",value: "Political participation"},
      {key: "demCulture",value: "Political culture"},
      {key: "demCivil",value: "Civil liberties"},
      {key: "demCategory",value: "Category"}
    ];
    
    // tests
    const dom = d3.select(".plot");
    const data = [1,2,3,4,5];

    const headerDOM = d3.select(".chart_header");
    headerDOM.append("h2")
      .html("Chart title");

    const controlDOM = d3.select(".chart_control")
    Control(controlDOM, data);

    const cartogramDOM = d3.select(".chart_cartogram")
    Cartogram(cartogramDOM, data);

    const compareDOM = d3.select(".chart_compare")
    CompareChart(compareDOM, data);

  });








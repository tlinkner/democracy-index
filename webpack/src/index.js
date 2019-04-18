// imports --------------------------------------

import "./style.css";
import * as d3 from 'd3';

import {
	renderReligionMenu,
	renderCategoryOptions,
	renderValueToggle,
	renderAxisToggle
} from './views/Control';

// promises
import {democracyDataPromise} from './data';



// app ------------------------------------------

democracyDataPromise.then(data => {

	// render ui
	renderReligionMenu(data);
	renderCategoryOptions(data);
	renderValueToggle();
	renderAxisToggle();
	
	
});







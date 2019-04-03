import "../dist/style.css";
import * as d3 from 'd3';

// view modules
import Cartogram from './views/Cartogram';
import CompositionChart from './views/CompositionChart';
import CountChart from './views/CountChart';

const dom = d3.select(".plot");
const data = [];

Cartogram(dom, data);
CompositionChart(dom, data);
CountChart(dom, data);
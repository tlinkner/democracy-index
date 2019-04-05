import * as d3 from 'd3';



const democracyPromise = d3.json('./data/democracy-index.json');
const religionPromise = d3.json('./data/religion.json');



export {
  democracyPromise,
  religionPromise
}
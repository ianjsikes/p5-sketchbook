import { dungen } from "./dungen";
import test from "./test";
import tenPrint from "./tenPrint";
import voronoi from "./voronoi";
// import { gravity } from './gravity';

const sketches = [
  { label: "Voronoi", value: voronoi },
  { label: "10 Print", value: tenPrint },
  { label: "DunGen", value: dungen }
  // { label: 'Gravity', value: gravity },
];

export default sketches;

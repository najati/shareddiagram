
import Viz from 'viz.js';
import workerURL from 'viz.js/full.render.js';

const viz = new Viz({workerURL});

export function renderGraph(graphCode) {
  return viz.renderString(graphCode);
}

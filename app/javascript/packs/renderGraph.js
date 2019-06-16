import Viz from 'viz.js';
import workerURL from 'viz.js/full.render.js';

let viz = new Viz({workerURL});

export function renderGraph(graphCode) {
  return new Promise(function (resolve, reject) {
    viz.renderString(graphCode)
      .then(element => {
        resolve(element);
      })
      .catch(error => {
        viz = new Viz({workerURL});
        reject(error);
      });
  });
}

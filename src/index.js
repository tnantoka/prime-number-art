import p5 from 'p5';
import 'bootstrap-material-design';
import 'bootstrap-material-design/dist/css/bootstrap-material-design.css';
import { debounce, random, sample, sampleSize } from 'lodash';

import './index.css';

const primeNumbers = [5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];
const colors = [
  '#F44336',
  '#E91E63',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFEB3B',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#795548',
  '#9E9E9E'
];

const seed = ({ size, numberOfPins, isMulticolor }) => sketch => {
  const step = 360 / numberOfPins;
  const points = [];

  sketch.setup = () => {
    sketch.createCanvas(size, size);

    const { width } = sketch;
    const center = width * 0.5;

    sampleSize(primeNumbers, random(2, primeNumbers.length - 1)).forEach(
      (n, i) => {
        for (var j = 0; j < numberOfPins; j++) {
          const radian = sketch.radians(j * step * n);
          const color =
            (i === 0 && j === 0) || isMulticolor ? sample(colors) : null;
          points.push({
            x: center + width * 0.4 * sketch.cos(radian),
            y: center + width * 0.4 * sketch.sin(radian),
            color
          });
        }
      }
    );
  };

  sketch.draw = () => {
    const { width, height } = sketch;

    sketch.fill(255);
    sketch.circle(width * 0.5, height * 0.5, width * 0.8);

    points.forEach(point => {
      sketch.fill(0);
      sketch.circle(point.x, point.y, 3);
    });

    for (var i = 1; i < points.length; i++) {
      const point1 = points[i - 1];
      const point2 = points[i];
      if (point1.color) {
        sketch.stroke(sketch.color(point1.color));
      }
      sketch.line(point1.x, point1.y, point2.x, point2.y);
    }
  };
};

let p5sketch;
const initSketch = () => {
  if (p5sketch) {
    p5sketch.remove();
  }
  const $parent = $('#p5sketch');
  const size = $parent.width();
  const numberOfPins = parseInt($('#numberOfPins').val());
  const isMulticolor = $('#multicolor').prop('checked');
  p5sketch = new p5(
    seed({ size, numberOfPins, isMulticolor }),
    document.getElementById('p5sketch')
  );
};

$(() => {
  $('#numberOfPins')
    .html(primeNumbers.map(n => `<option>${n}</option>`).join(''))
    .val(sample(primeNumbers));
  initSketch();
  $('#refresh').on('click', initSketch);
  $('#save').on('click', () => p5sketch.save());
  $('body').bootstrapMaterialDesign();
});

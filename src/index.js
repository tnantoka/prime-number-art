import p5 from 'p5/lib/p5.min';
import 'bootstrap-material-design';
import 'bootstrap-material-design/dist/css/bootstrap-material-design.css';
import { debounce, random, sample, sampleSize } from 'lodash';
import Animated from 'p5-animated-draw';

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
const animatedStep = 40.0;

const seed = ({ size, numberOfPins, isMulticolor, isDrawCircle }) => sketch => {
  const step = 360 / numberOfPins;
  const points = [];
  const animated = new Animated(sketch);
  let inProgress = true;

  sketch.setup = () => {
    sketch.createCanvas(size, size);

    const { width, height } = sketch;
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

    sketch.fill(255);

    if (isDrawCircle) {
      animated.addCircle(
        { x: width * 0.5, y: height * 0.5 },
        width * 0.8,
        sketch.color('gray'),
        animatedStep
      );
    }

    let lastColor;
    for (var i = 1; i < points.length; i++) {
      const point1 = points[i - 1];
      const point2 = points[i];
      const color = point1.color || lastColor;
      animated.addLine(point1, point2, sketch.color(color), animatedStep);
      lastColor = color;
    }
  };

  sketch.draw = () => {
    if (inProgress) {
      sketch.clear();
      animated.draw();
      const progress = Math.floor(
        (animated.shapes.filter(shape => !shape.inProgress).length /
          animated.shapes.length) *
          100
      );
      $('#progress-bar').css({ width: `${progress}%` });
      if (!animated.shapes[animated.shapes.length - 1].inProgress) {
        $('#progress').addClass('invisible');
        $('#refresh').prop('disabled', false);
        inProgress = false;
      }
    }
  };
};

let p5sketch;
const initSketch = () => {
  $('#progress').removeClass('invisible');
  $('#progress-bar').css({ width: 0 });
  $('#refresh').prop('disabled', true);
  if (p5sketch) {
    p5sketch.remove();
  }
  const $parent = $('#p5sketch');
  const size = $parent.width();
  const numberOfPins = parseInt($('#numberOfPins').val());
  const isMulticolor = $('#multicolor').prop('checked');
  const isDrawCircle = $('#drawCircle').prop('checked');
  p5sketch = new p5(
    seed({ size, numberOfPins, isMulticolor, isDrawCircle }),
    document.getElementById('p5sketch')
  );
};

$(() => {
  $('#numberOfPins')
    .html(primeNumbers.map(n => `<option>${n}</option>`).join(''))
    .val(sample(primeNumbers));
  initSketch();
  $('#refresh').on('click', initSketch);
  $('#download').on('click', () => p5sketch.save());
  $('body').bootstrapMaterialDesign();
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('./service-worker.bundle.js')
    .then(() => console.log('Service Worker Registered'));
}

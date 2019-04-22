import _ from 'lodash';
import p5 from 'p5';

new p5(sketch => {
  const x = 100;
  const y = 100;

  sketch.setup = () => {
    sketch.createCanvas(200, 200);
  };

  sketch.draw = () => {
    sketch.background(0);
    sketch.fill(255);
    sketch.rect(x, y, 50, 50);
  };
}, document.getElementById('p5sketch'));

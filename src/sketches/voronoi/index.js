import VEvent from "./event";
import VEdge from "./edge";
import VParabola from "./parabola";
import VBeachline from "./beachline";
import VQueue from "./queue";

const voronoi = opts => p => {
  let WIDTH = opts.width || p.windowWidth,
    HEIGHT = opts.height || p.windowHeight;
  let points = [];
  let NUM_POINTS = 20;
  // let beachline = new VBeachline();
  let beachline;

  p.setup = () => {
    for (let i = 0; i < NUM_POINTS; i++) {
      points.push({
        x: Math.random() * WIDTH,
        y: Math.random() * HEIGHT
      });
    }
    p.createCanvas(opts.width || p.windowWidth, opts.height || p.windowHeight);
    beachline = new VBeachline(points, WIDTH, HEIGHT, p);
    p.frameRate(20);
  };

  p.draw = () => {
    p.background(255);
    for (const point of beachline.sites) {
      p.ellipse(point.x, point.y, 2, 2);
    }
    beachline.update();
    beachline.draw();
  };
};

export default voronoi;

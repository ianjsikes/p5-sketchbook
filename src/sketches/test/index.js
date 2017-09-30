const test = opts => p => {
  let imgs
  p.setup = () => {
    p.createCanvas(opts.width || p.windowWidth, opts.height || p.windowHeight)
    p.background('lightgreen')
    imgs = {
      FLOOR: p.loadImage(require('../dungen/img/floor.png')),
      CORNER: p.loadImage(require('../dungen/img/corner.png')),
      CORRIDOR: p.loadImage(require('../dungen/img/corridor.png')),
      WALL: p.loadImage(require('../dungen/img/wall.png')),
    }
  }
  p.draw = () => {
    p.rect(200, 200, 200, 200)
    p.image(imgs.FLOOR, 100, 100)
  }
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }
}

export default test

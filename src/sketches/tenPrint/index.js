const tenPrint = opts => p => {
  let x = 0
  let y = 0
  let size = 40
  let pattern

  const boxesPattern = {
    setup: () => {},
    tiles: [
      (x, y, size) => {
        p.line(x, y + size / 3, x + 2 * size / 3, y + size)
        p.line(x, y + 2 * size / 3, x + size / 3, y + size)
        p.line(x, y, x + size, y + size)
        p.line(x + size / 3, y, x + size, y + 2 * size / 3)
        p.line(x + 2 * size / 3, y, x + size, y + size / 3)
      },
      (x, y, size) => {
        p.line(x + 2 * size / 3, y + size, x + size, y + 2 * size / 3)
        p.line(x + size / 3, y + size, x + size, y + size / 3)
        p.line(x, y + size, x + size, y)
        p.line(x, y + 2 * size / 3, x + 2 * size / 3, y)
        p.line(x, y + size / 3, x + size / 3, y)
      },
    ],
  }

  const circlePattern = {
    setup: () => {
      p.background(240)
      p.noFill()
      p.stroke(99, 199, 178)
      p.strokeWeight(size / 6)
    },
    tiles: [
      (x, y, size) => {
        p.arc(x, y, size, size, 0, p.HALF_PI)
        p.arc(x + size, y + size, size, size, p.PI, p.PI + p.HALF_PI)
      },
      (x, y, size) => {
        p.arc(x + size, y, size, size, p.HALF_PI, p.PI)
        p.arc(x, y + size, size, size, p.PI + p.HALF_PI, p.TWO_PI)
      },
    ],
  }

  pattern = circlePattern

  p.setup = () => {
    p.createCanvas(opts.width || p.windowWidth, opts.height || p.windowHeight)
    pattern.setup()
  }

  p.draw = () => {
    let tileIndex = Math.floor(p.random(pattern.tiles.length))
    pattern.tiles[tileIndex](x, y, size)

    x += size
    if (x > p.width) {
      y += size
      x = 0
    }

    if (y > p.height) {
      p.noLoop()
      console.log('Finished')
    }
  }
}

export default tenPrint

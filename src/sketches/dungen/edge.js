import p5 from 'p5'

const edgeCreator = p =>
  class Edge {
    constructor(r1, r2, gridSize) {
      this.r1 = r1
      this.r2 = r2
      this.p1 = r1.center
      this.p2 = r2.center
      this.gridSize = gridSize
      this.coinFlip = Math.floor(p.random(2))

      this.start = r1.randomPoint()
      this.end = r2.randomPoint()
    }

    length = () => {
      return p5.Vector.dist(this.p1, this.p2)
    }

    render = () => {
      p.line(
        this.p1.x * this.gridSize,
        this.p1.y * this.gridSize,
        this.p2.x * this.gridSize,
        this.p2.y * this.gridSize
      )
    }

    renderCorridor = () => {
      p.push()
      p.noFill()
      p.stroke('red')
      p.strokeWeight(this.gridSize)
      p.strokeJoin(p.MITER)
      p.strokeCap(p.SQUARE)
      p.beginShape()
      p.vertex(
        this.start.x * this.gridSize - this.gridSize / 2,
        this.start.y * this.gridSize - this.gridSize / 2
      )
      this.coinFlip
        ? p.vertex(
            this.start.x * this.gridSize - this.gridSize / 2,
            this.end.y * this.gridSize - this.gridSize / 2
          )
        : p.vertex(
            this.end.x * this.gridSize - this.gridSize / 2,
            this.start.y * this.gridSize - this.gridSize / 2
          )
      p.vertex(
        this.end.x * this.gridSize - this.gridSize / 2,
        this.end.y * this.gridSize - this.gridSize / 2
      )
      p.endShape()
      p.pop()
    }

    equals = e2 => {
      return (
        (this.r1 === e2.r1 && this.r2 === e2.r2) ||
        (this.r1 === e2.r2 && this.r2 === e2.r1)
      )
    }

    otherRoom = r => {
      if (r === this.r1) return this.r2
      if (r === this.r2) return this.r1
      return
    }

    // fillGrid = (grid) => {
    //   if (this.coinFlip) {
    //     for (let i = 0; i < (this.end.x - this.start.x - 1); i++) {
    //       grid[this.start.x + i][this.start.y] = { type: 'CORRIDOR-H' };
    //     }
    //     for (let j = 0; j < (this.end.y - this.start.y - 1); j++) {
    //       grid[this.start.x][this.start.y + j] = { type: 'CORRIDOR-V' };
    //     }
    //     if (this.start.y > this.end.y) {
    //       grid[this.start.x][this.end.y] = { type: 'TURN-UR' };
    //     }
    //     else {
    //       grid[this.start.x][this.end.y] = { type: 'TURN-LR' };
    //     }
    //   }
    //   else {
    //     for (let i = 0; i < (this.end.x - this.start.x - 1); i++) {
    //       grid[this.start.x + i][this.end.y] = { type: 'CORRIDOR-H' };
    //     }
    //     for (let j = 0; j < (this.end.y - this.start.y - 1); j++) {
    //       grid[this.start.x][this.end.y + j] = { type: 'CORRIDOR-V' };
    //     }
    //     if (this.start.y > this.end.y) {
    //       grid[this.start.x][this.end.y] = { type: 'TURN-UR' };
    //     }
    //     else {
    //       grid[this.start.x][this.end.y] = { type: 'TURN-LR' };
    //     }
    //   }
    // }
  }

export default edgeCreator

// if (rooms.length !== 0) {
//   const prevRoom = rooms[rooms.length - 1];
//   const coinFlip = Math.floor(p.random(2));
//   vCorridor(r.center.y, prevRoom.center.y, coinFlip ? prevRoom.center.x : r.center.x);
//   hCorridor(r.center.x, prevRoom.center.x, coinFlip ? r.center.y : prevRoom.center.y);
// }

// const vCorridor = (y1, y2, x) => {
//     p.rect(x - CORRIDOR_WIDTH/2, y1, CORRIDOR_WIDTH, y2-y1);
//   }
//   const hCorridor = (x1, x2, y) => {
//     p.rect(x1, y - CORRIDOR_WIDTH/2, x2-x1, CORRIDOR_WIDTH);
//   }

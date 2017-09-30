const roomCreator = p =>
  class Room {
    constructor(x, y, w, h, gridSize) {
      this.x = x
      this.y = y
      this.w = w
      this.h = h
      this.gridSize = gridSize
      this.edges = []
      this.center = p.createVector(Math.round(w / 2) + x, Math.round(h / 2) + y)
    }

    neighbors = () => {
      return this.edges.map(edge => {
        return edge.r1 !== this ? edge.r1 : edge.r2
      })
    }

    shortestEdge = () => {
      return this.edges.reduce((min, curr) => {
        return curr.length() < min.length() ? curr : min
      })
    }

    move = (x, y) => {
      this.x = x
      this.y = y
      this.center = p.createVector(
        Math.round(this.w / 2) + x,
        Math.round(this.h / 2) + y
      )
    }

    render = () => {
      p.rect(
        this.x * this.gridSize,
        this.y * this.gridSize,
        this.w * this.gridSize,
        this.h * this.gridSize
      )
    }

    intersects = r2 => {
      return (
        this.x <= r2.x + r2.w &&
        r2.x <= this.x + this.w &&
        this.y <= r2.y + r2.h &&
        r2.y <= this.y + this.h
      )
    }

    addEdge = e => {
      for (let i = 0; i < this.edges.length; i++) {
        if (e.equals(this.edges[i])) return
      }
      this.edges.push(e)
    }

    sortEdges = () => {
      this.edges.sort((a, b) => {
        return a.length() - b.length()
      })
    }

    randomPoint = () => {
      const x = Math.round(this.x + p.random(1, this.w - 1))
      const y = Math.round(this.y + p.random(1, this.h - 1))
      return p.createVector(x, y)
    }

    fillGrid = grid => {
      grid[this.x][this.y] = { type: 'CORNER-UL' }
      grid[this.x][this.y + this.h - 1] = { type: 'CORNER-LL' }
      grid[this.x + this.w - 1][this.y] = { type: 'CORNER-UR' }
      grid[this.x + this.w - 1][this.y + this.h - 1] = { type: 'CORNER-LR' }

      for (let i = 1; i < this.w - 1; i++) {
        grid[this.x + i][this.y] = { type: 'WALL-U' }
        grid[this.x + i][this.y + this.h - 1] = { type: 'WALL-D' }

        for (let j = 1; j < this.h - 1; j++) {
          grid[this.x + i][this.y + j] = { type: 'FLOOR' }
        }
      }
      for (let i = 1; i < this.h - 1; i++) {
        grid[this.x][this.y + i] = { type: 'WALL-L' }
        grid[this.x + this.w - 1][this.y + i] = { type: 'WALL-R' }
      }
    }
  }

export default roomCreator

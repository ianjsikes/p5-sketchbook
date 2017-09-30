import Delaunay from 'delaunay-fast'
import dat from 'dat.gui/build/dat.gui'

import roomCreator from './room'
import edgeCreator from './edge'

export const dungen = opts => p => {
  let gui
  let imgs = {}
  let floorImg, cornerImg, wallImg, corridorImg
  let floorSprite, cornerSprite, wallSprite, corridorSprite
  let grid = []
  const GRID_SIZE = 16
  const MAX_ATTEMPTS = 2000
  let ROWS, COLS
  let regenerateButton
  let params = {
    MAX_ROOMS: 6,
    MIN_SIZE: 4,
    MAX_SIZE: 10,
    LOOPS: 4,
    DRAW_GRID: false,
    DRAW_MODE: 'SPRITE',
  }
  let rooms = []
  let edges = []
  // Create classes with context
  const Room = roomCreator(p)
  const Edge = edgeCreator(p)
  const drawGrid = () => {
    p.push()
    p.noFill()
    p.stroke('black')
    p.strokeWeight(1)
    for (let i = 0; i < p.width; i += GRID_SIZE) {
      for (let j = 0; j < p.height; j += GRID_SIZE) {
        p.rect(i, j, GRID_SIZE, GRID_SIZE)
      }
    }
    p.pop()
  }
  const addExtraEdges = () => {
    let extraEdges = []
    while (extraEdges.length < params.LOOPS) {
      const randRoomIndex = Math.floor(p.random(0, rooms.length))
      const room = rooms[randRoomIndex]
      const randEdgeIndex = Math.floor(p.random(0, room.edges.length))
      const edge = room.edges[randEdgeIndex]
      if (!edge.visited) {
        extraEdges.push(edge)
      }
    }
    return extraEdges
  }
  const triangulate = () => {
    const triangulation = Delaunay.triangulate(
      rooms.map(room => [room.center.x, room.center.y])
    )
    for (let i = 0; i < triangulation.length; i += 3) {
      const r = [
        rooms[triangulation[i]],
        rooms[triangulation[i + 1]],
        rooms[triangulation[i + 2]],
      ]
      const e = [
        new Edge(r[0], r[1], GRID_SIZE),
        new Edge(r[1], r[2], GRID_SIZE),
        new Edge(r[2], r[0], GRID_SIZE),
      ]
      // TODO: Fix this adding duplicate edges
      edges.push(e[0], e[1], e[2])
      r[0].addEdge(e[0])
      r[0].addEdge(e[2])
      r[1].addEdge(e[0])
      r[1].addEdge(e[1])
      r[2].addEdge(e[1])
      r[2].addEdge(e[2])
    }
  }
  const placeRoom = () => {
    let attempts = 0
    let isValidRoom = false
    let r
    while (!isValidRoom && attempts < MAX_ATTEMPTS) {
      isValidRoom = true
      const randX = Math.round(p.random(1, COLS - params.MAX_SIZE - 1))
      const randY = Math.round(p.random(1, ROWS - params.MAX_SIZE - 1))
      const randW = Math.round(p.random(params.MIN_SIZE, params.MAX_SIZE))
      const randH = Math.round(p.random(params.MIN_SIZE, params.MAX_SIZE))
      r = new Room(randX, randY, randW, randH, GRID_SIZE)
      rooms.forEach(room => {
        if (room.intersects(r)) isValidRoom = false
      })
      attempts++
    }
    return r
  }
  const placeRooms = () => {
    for (let i = 0; i < params.MAX_ROOMS; i++) {
      let r = placeRoom()
      if (r) rooms.push(r)
    }
  }
  const buildMST = () => {
    let mstEdges = []
    rooms.forEach(r => r.sortEdges())
    let frontier = [rooms[0]]
    frontier[0].visited = true
    let finished = false
    while (!finished) {
      finished = true
      let nextEdge = null
      let nextRoom = null
      // eslint-disable-next-line
      frontier.forEach(room => {
        for (let j = 0; j < room.edges.length; j++) {
          let edge = room.edges[j]
          if (!edge.visited && !edge.otherRoom(room).visited) {
            if (!nextEdge || nextEdge.length() > edge.length()) {
              finished = false
              nextEdge = edge
              nextRoom = edge.otherRoom(room)
              break
            }
          }
        }
      })
      if (nextEdge && nextRoom) {
        nextEdge.visited = true
        nextRoom.visited = true
        mstEdges.push(nextEdge)
        frontier.push(nextRoom)
      }
    }
    return mstEdges
  }
  const setupGUI = () => {
    gui = new dat.GUI()
    // gui.add(params, 'MAX_ROOMS', 5, 40);
    gui
      .add(params, 'MAX_ROOMS')
      .min(5)
      .max(40)
      .step(2)
    gui.add(params, 'MIN_SIZE', 3, 8)
    gui.add(params, 'MAX_SIZE', 8, 20)
    gui.add(params, 'LOOPS', 0, 6)
    gui.add(params, 'DRAW_GRID')
    gui.add(params, 'DRAW_MODE', ['SPRITE', 'RECT'])
  }
  const generateMap = () => {
    rooms = []
    edges = []
    placeRooms()
    triangulate()
    edges = [...buildMST(), ...addExtraEdges()]
  }
  const renderMap = () => {
    p.background('lightgreen')
    p.push()
    p.fill('white')
    p.noStroke()
    p.stroke('blue')
    edges.forEach(e => e.renderCorridor())
    if (params.DRAW_MODE === 'RECT') rooms.forEach(r => r.render())
    p.pop()
  }
  const generateGrid = () => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] && grid[i][j].sprite) {
          grid[i][j].sprite.remove()
        }
      }
    }
    grid = []
    for (let i = 0; i < COLS; i++) {
      grid.push(new Array(ROWS))
    }
    rooms.forEach(r => r.fillGrid(grid))
  }
  const renderGrid = () => {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        if (grid[i][j] && grid[i][j].type) {
          grid[i][j].sprite = p.createSprite(
            i * GRID_SIZE + GRID_SIZE / 2,
            j * GRID_SIZE + GRID_SIZE / 2
          )
          let imgName = grid[i][j].type.split('-')[0]
          grid[i][j].sprite.addImage(imgs[imgName])
          switch (grid[i][j].type) {
            case 'WALL-U':
            case 'CORNER-UR':
              grid[i][j].sprite.rotation = 90
              break
            case 'WALL-D':
            case 'CORNER-LL':
              grid[i][j].sprite.rotation = 270
              break
            case 'WALL-R':
            case 'CORNER-LR':
              grid[i][j].sprite.rotation = 180
              break
            default:
              break
          }
        }
      }
    }
  }
  p.setup = () => {
    p.createCanvas(opts.width || p.windowWidth, opts.height || p.windowHeight)
    p.background('lightgreen')
    COLS = Math.round(p.width / GRID_SIZE)
    ROWS = Math.round(p.height / GRID_SIZE)
    setupGUI()
    imgs = {
      FLOOR: p.loadImage(require('./img/floor.png')),
      CORNER: p.loadImage(require('./img/corner.png')),
      CORRIDOR: p.loadImage(require('./img/corridor.png')),
      WALL: p.loadImage(require('./img/wall.png')),
    }
    regenerateButton = p.createButton('Regenerate map')
    regenerateButton.position(10, p.height - 20)
    regenerateButton.mousePressed(() => {
      generateMap()
      generateGrid()
      renderGrid()
    })
    generateMap()
    generateGrid()
    renderGrid()
  }
  p.draw = () => {
    renderMap()
    if (params.DRAW_GRID) drawGrid()
    if (params.DRAW_MODE === 'SPRITE') p.drawSprites()
  }
  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight)
  }
}

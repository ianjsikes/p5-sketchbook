import p5 from 'p5'
import 'p5/lib/addons/p5.dom'
import '@code-dot-org/p5.play/lib/p5.play'
import sketches from './sketches'
const html = require('choo/html')
const choo = require('choo')

const app = choo()
app.use(countStore)
app.route('/', main)
app.mount('body')

function main(state, emit) {
  return html`
    <body>
      <div id='sketch-container'></div>
      <img src=${require('./sketches/dungen/img/wall.png')}/>
    </body>
  `

  // function onclick() {
  //   emit('increment', 1)
  // }
}

function countStore(state, emitter) {
  const opts = { width: window.innerWidth, height: window.innerHeight }
  state.activeSketch = 0
  state.sketchInstance = new p5(sketches[0].value(opts), 'sketch-container')
  // emitter.on('increment', count => {
  //   state.count += count
  //   emitter.emit('render')
  // })
}

import p5 from 'p5'
import 'p5/lib/addons/p5.dom'
import '@code-dot-org/p5.play/lib/p5.play'
import sketches from './sketches'
const html = require('choo/html')
const choo = require('choo')
import dropdown from './dropdown'
import log from 'choo-log'

const app = choo()
app.use(log())
app.use(store)
app.route('/', main)
app.route('/p5-sketchbook', main)
app.mount('#choo')

function main(state, emit) {
  return html`
    <div class="fixed top-0 left-0">
      ${dropdown(state.dropdown, emit)}
    </div>
  `
}

function store(state, emitter) {
  state.dropdown = {
    open: false,
    index: 0,
    options: sketches.map(sketch => sketch.label),
  }
  state.sketchOpts = { width: window.innerWidth, height: window.innerHeight }
  state.sketch = new p5(
    sketches[state.dropdown.index].value(state.sketchOpts),
    'sketch-container'
  )

  emitter.on('open-dropdown', () => {
    state.dropdown.open = true
    emitter.emit('render')
  })

  emitter.on('close-dropdown', () => {
    state.dropdown.open = false
    emitter.emit('render')
  })

  emitter.on('pick-dropdown-item', index => {
    if (index !== state.dropdown.index) {
      state.sketch.remove()
      state.sketch = new p5(
        sketches[index].value(state.sketchOpts),
        'sketch-container'
      )
    }

    state.dropdown.index = index
    emitter.emit('close-dropdown')
  })
}

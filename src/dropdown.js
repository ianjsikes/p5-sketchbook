import html from 'choo/html'

export default function(state, emit) {
  const open = html`
    <div>

      <div
        onclick=${() => emit('close-dropdown')}
        class="f5 no-underline white bg-black flex items-center pa3 ba border-box w4"
      >
        <span class="pl1 flex-auto">${state.options[state.index]}</span>
        <span>🔼</span>
      </div>

      <div class="inline-flex w4">
        <ul class="list bg-white w-100 pl0 mv0 ml0 center mw5 ba b--light-silver">
          ${state.options.map(
            (opt, i) => html`
            <li class="pa3 bg-animate hover-bg-black hover-white bb b--light-silver" onclick=${() =>
              emit('pick-dropdown-item', i)}>${opt}</li>
          `
          )}
        </ul>
      </div>

    </div>
  `

  const closed = html`
    <div>
      <div
        onclick=${() => emit('open-dropdown')}
        class="f5 no-underline black bg-white bg-animate hover-bg-black hover-white inline-flex items-center pa3 ba border-box w4"
      >
        <span class="pl1 flex-auto">${state.options[state.index]}</span>
        <span>🔽</span>
      </div>
    </div>
  `

  return state.open ? open : closed
}

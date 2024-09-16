import { flushSync } from 'react-dom'
import { createRoot } from 'react-dom/client'

const INITIALIZATION = Symbol('phase.initialization')
const UPDATE = Symbol('phase.update')
type Phase = typeof INITIALIZATION | typeof UPDATE
let phase: Phase
let hookIndex = 0
const states: Array<[any, (newState: any) => void]> = []
type EffectCallback = () => void

type Effect = {
	callback: EffectCallback
	deps?: undefined | any[]
	prevDeps?: undefined | any[]
}

const effects: Array<Effect> = []

export function useState<State>(initialState: State) {
	const id = hookIndex++
	if (phase === INITIALIZATION) {
		states[id] = [
			initialState,
			(newState: State) => {
				states[id][0] = newState
				render(UPDATE)
			},
		]
	}
	return states[id] as [State, (newState: State) => void]
}

// 🐨 add an optional deps argument here
export function useEffect(callback: EffectCallback, deps?: any[]) {
	const id = hookIndex++

	effects[id] = {
		callback,
		prevDeps: effects[id]?.deps,
		deps,
	}
}

function Counter() {
	const [count, setCount] = useState(0)
	const increment = () => setCount(count + 1)

	const [enabled, setEnabled] = useState(true)
	const toggle = () => setEnabled(!enabled)

	useEffect(() => {
		if (enabled) {
			console.info('consider yourself effective!')
		} else {
			console.info('consider yourself ineffective!')
		}
	}, [enabled])

	return (
		<div className="counter">
			<button onClick={toggle}>{enabled ? 'Disable' : 'Enable'}</button>
			<button disabled={!enabled} onClick={increment}>
				{count}
			</button>
		</div>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
const appRoot = createRoot(rootEl)

function render(newPhase: Phase) {
	hookIndex = 0
	phase = newPhase
	flushSync(() => {
		appRoot.render(<Counter />)
	})

	for (const effect of effects) {
		if (!effect) continue

		if (effect.deps == null) {
			effect.callback()
			continue
		}

		if (effect.deps.length !== effect.prevDeps?.length) {
			effect.callback()
			continue
		}

		let hasDepsChanged = false

		for (let i = 0; i < effect.prevDeps.length; i++) {
			const prevValue = effect.prevDeps[i]
			const newValue = effect.deps[i]

			if (!Object.is(prevValue, newValue)) {
				hasDepsChanged = true
				break
			}
		}

		if (hasDepsChanged) {
			effect.callback()
		}
	}
}

render(INITIALIZATION)

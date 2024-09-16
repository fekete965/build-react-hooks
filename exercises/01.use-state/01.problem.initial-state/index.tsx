import { createRoot } from 'react-dom/client'

function useState<State>(initialValue: State) {
	let state = initialValue

	const setState = (newState: State) => {}

	return [state, setState] as const
}

// 🐨 create a `useState` function which accepts the initial state and returns
// an array of the state and a no-op function: () => {}
// 🦺 note you may need to ignore some typescript errors here. We'll fix them later.
// Feel free to make the `useState` a generic though!
// ⚠️ don't forget to `export` your `useState` function so the tests can find it

function Counter() {
	const [count, setCount] = useState(0)
	// 🦺 you'll get an error for this we'll fix that next
	const increment = () => setCount(count + 1)

	return (
		<div className="counter">
			<button onClick={increment}>{count}</button>
		</div>
	)
}

const rootEl = document.createElement('div')
document.body.append(rootEl)
const appRoot = createRoot(rootEl)
appRoot.render(<Counter />)

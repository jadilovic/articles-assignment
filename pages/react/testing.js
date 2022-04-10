import React, { useState, useReducer, useEffect } from 'react';

const reducer = (state, action) => {
	switch (action.type) {
		case 'increment':
			return { number: state.number + 1 };
		case 'decrement':
			return { number: state.number - 1 };
		default:
			return state;
	}
};

export default function App() {
	const initialState = { number: 0 };
	const [state, dispatch] = useReducer(reducer, initialState);
	const [count, setCount] = useState({ num: 0 });
	const [countState, setCountState] = useState({ count: 0 });

	useEffect(() => {
		setCountState((prevState, props) => ({
			count: prevState.count + 1,
		}));
		// this.state.count === 3 as expected
	}, []);

	function incrementCountHandler() {
		setCount((prevCount) => {
			return { num: prevCount.num + 1 };
		});
	}

	const arr = [1, 3, 4, 2, 3, 1, 3];
	const uniqueValue = arr.filter((value, index, self) => {
		console.log(arr);
		return self.indexOf(value) === index;
	});
	console.log(uniqueValue);

	const unique = [...new Set([...arr])];
	console.log(unique);

	const oldObj = { name: 'aki' };
	const newObj = {};
	Object.assign(newObj, oldObj);

	console.log(newObj);
	console.log(countState);

	return (
		<>
			<button onClick={incrementCountHandler}>Increment Count</button>
			{count.num}
			<div>
				<button onClick={() => dispatch({ type: 'increment' })}>+</button>
				{state.number}
				<button onClick={() => dispatch({ type: 'decrement' })}>-</button>
			</div>
		</>
	);
}

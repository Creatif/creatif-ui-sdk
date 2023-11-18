import { useState } from 'react';
import type { HttpState } from '@root/types/app';
export function useHttpState<T>(): [
  boolean,
  boolean,
  boolean,
  T | undefined,
  Error | undefined,
  boolean,
  (state: Partial<HttpState<T>>) => void,
  ] {
	const [state, setState] = useState<HttpState<T>>({
		state: 'idle',
		value: undefined,
		error: undefined,
		isCacheHit: false,
	});

	return [
		state.state === 'idle',
		state.state === 'isFetching',
		state.state === 'isError',
		state.value,
		state.error,
		state.isCacheHit,
		(state: Partial<HttpState<T>>) => {
			setState((prev) => ({
				...prev,
				...state,
			}));
		},
	];
}

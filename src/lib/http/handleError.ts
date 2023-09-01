import { AxiosError } from 'axios';

export function handleError(e: unknown) {
	if (e instanceof AxiosError) {
		if (e.response) {
			const data = e.response.data;

			return {
				error: data,
			};
		}
	}

	if (e && Object.hasOwn(e, 'message')) {
		return {
			error: new Error(`An error occurred: ${(e as Error).message}`),
		};
	}

	return {
		error: new Error('An error occurred.'),
	};
}

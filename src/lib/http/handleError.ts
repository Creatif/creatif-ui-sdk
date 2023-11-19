import { AxiosError } from 'axios';
export function handleError(e: unknown) {
	if (e instanceof AxiosError) {
		if (e.response) {
			let data = e.response.data;
			if (!data) {
				data = 'Unexpected error';
			}

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

import { ApiError } from '@lib/http/apiError';
import { AxiosError } from 'axios';
export function handleError(e: unknown): { error: ApiError } {
	if (e instanceof AxiosError) {
		if (e.response) {
			let data = e.response.data;
			if (!data) {
				data = 'Unexpected error';
			}

			return {
				error: new ApiError('An error occurred', e.response.data),
			};
		}
	}

	if (e && Object.hasOwn(e, 'message')) {
		return {
			error: new ApiError(`An error occurred: ${(e as Error).message}`, null),
		};
	}

	return {
		error: new ApiError('An error occurred.', null),
	};
}

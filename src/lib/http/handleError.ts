import { ApiError } from '@lib/http/apiError';
import { AxiosError } from 'axios';
export function handleError(e: unknown): { error: ApiError; status: number } {
	if (e instanceof AxiosError) {
		if (e.response) {
			let data = e.response.data;
			if (!data) {
				data = 'Unexpected error';
			}

			return {
				error: new ApiError('An error occurred', e.response.data),
				status: e.response.status,
			};
		}
	}

	if (e && Object.hasOwn(e, 'message')) {
		return {
			error: new ApiError(`An error occurred: ${(e as Error).message}`, null),
			status: 500,
		};
	}

	return {
		error: new ApiError('An error occurred.', null),
		status: 500,
	};
}

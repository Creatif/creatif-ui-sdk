import { Api } from '@lib/http/api';
import { ApiError } from '@lib/http/apiError';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import type { AxiosInstance } from 'axios';
export default function useHttpMutation<Body, Response>(
	instance: AxiosInstance,
	method: 'post' | 'put' | 'delete',
	path: string,
	headers: Record<string, string> = {},
) {
	return useMutation<Response, ApiError, Body>(async (body: Body) => {
		try {
			const res = await Api[method](instance, path, body, headers);
			return res.data as Response;
		} catch (e: unknown) {
			if (e instanceof AxiosError) {
				if (e.response) {
					throw new ApiError('An API error occurred', e.response.data);
				}
			}

			throw new Error('Unexpected error');
		}
	});
}

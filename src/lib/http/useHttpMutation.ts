import { Api } from '@lib/http/api';
import { ApiError } from '@lib/http/apiError';
import { AxiosError } from 'axios';
import { useMutation, useQueryClient } from 'react-query';
import type { AxiosInstance } from 'axios';
import type { QueryKey } from 'react-query';
export default function useHttpMutation<Body, Response>(
	instance: AxiosInstance,
	method: 'post' | 'put' | 'delete',
	path: string,
	options?: {
    onError?: (error: ApiError) => void;
    onSuccess?: (data: Response) => void;
  },
	headers: Record<string, string> = {},
) {
	const queryClient = useQueryClient();

	return {
		...useMutation<Response, ApiError, Body>(
			async (body: Body) => {
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
			},
			{
				onError: options?.onError,
				onSuccess: options?.onSuccess,
			},
		),
		invalidateQueries: (key: QueryKey) => {
			queryClient.invalidateQueries(key);
		},
	};
}

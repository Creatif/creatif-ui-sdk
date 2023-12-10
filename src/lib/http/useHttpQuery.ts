import { Api } from '@lib/http/api';
import { ApiError } from '@lib/http/apiError';
import { AxiosError } from 'axios';
import { useQuery } from 'react-query';
import type { AxiosInstance } from 'axios';
import type { QueryKey } from 'react-query';
export default function useHttpQuery<Response>(
	instance: AxiosInstance,
	key: QueryKey,
	path: string,
	options?: {
        onError?: (error: ApiError) => void;
        onSuccess?: (data: Response) => void;
    },
	headers: Record<string, string> = {},
) {
	return useQuery<unknown, ApiError, Response>(
		key,
		async () => {
			try {
				const res = await Api.get(instance, path, headers);
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
			staleTime: Infinity,
			keepPreviousData: true,
			refetchOnWindowFocus: false,
		},
	);
}

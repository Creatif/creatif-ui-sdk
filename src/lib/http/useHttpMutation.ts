import useNotification from '@app/systems/notifications/useNotification';
import { Api } from '@lib/http/api';
import { ApiError } from '@lib/http/apiError';
import { AxiosError } from 'axios';
import { useMutation } from 'react-query';
import type { AxiosInstance } from 'axios';
import type React from 'react';
export default function useHttpMutation<Body, Response>(
	instance: AxiosInstance,
	method: 'post' | 'put' | 'delete',
	path: string,
	options?: {
		onError?: {
			title: string;
			message: React.ReactNode;
		},
		onSuccess?: {
			title: string;
			message: React.ReactNode;
		}
	},
	headers: Record<string, string> = {},
) {
	const {error} = useNotification();
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
	}, {
		onError: () => {
			if (options && options.onError) {
				error(options.onError.title, options.onError.message);
			}
		},
		onSuccess: () => {
			if (options && options.onSuccess) {
				error(options.onSuccess.title, options.onSuccess.message);
			}
		}
	});
}

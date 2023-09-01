import { handleError } from '@lib/http/handleError';
import { Api } from './api';
import type { TryResult } from '@root/types';
import type { AxiosInstance } from 'axios';

export async function tryPut<ReturnType, Body = unknown>(
	instance: AxiosInstance,
	path: string,
	model: Body,
): Promise<TryResult<ReturnType>> {
	try {
		const res = await Api.put(instance, path, model);

		return {
			result: res.data as ReturnType,
		};
	} catch (e) {
		return handleError(e);
	}
}

import { handleError } from '@lib/http/handleError';
import { Api } from './api';
import type { TryResult } from '@root/types/types';
import type { AxiosInstance } from 'axios';

export async function tryPost<ReturnType, Body = unknown>(
	instance: AxiosInstance,
	path: string,
	model: Body,
	headers: Record<string, string> = {},
): Promise<TryResult<ReturnType>> {
	try {
		const res = await Api.post(instance, path, model, headers);

		return {
			result: res.data as ReturnType,
			status: res.status,
		};
	} catch (e) {
		return handleError(e);
	}
}

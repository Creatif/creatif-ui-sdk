import { Api } from '@lib/http/api';
import { handleError } from '@lib/http/handleError';
import type { TryResult } from '@root/types/types';
import type { AxiosInstance } from 'axios';
export async function tryGet<ReturnType>(
	instance: AxiosInstance,
	path: string,
	headers: Record<string, string> = {},
): Promise<TryResult<ReturnType>> {
	try {
		const res = await Api.get(instance, path, headers);

		return {
			result: res.data as ReturnType,
			status: res.status,
		};
	} catch (e) {
		return handleError(e);
	}
}

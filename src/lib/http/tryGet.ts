import { Api } from '@lib/http/api';
import { handleError } from '@lib/http/handleError';
import type { TryResult } from '@root/types';
import type { AxiosInstance } from 'axios';
export async function tryGet<ReturnType>(instance: AxiosInstance, path: string): Promise<TryResult<ReturnType>> {
	try {
		const res = await Api.get(instance, path);

		return {
			result: res.data as ReturnType,
		};
	} catch (e) {
		return handleError(e);
	}
}

import { ApiError } from '@lib/http/apiError';
import { handleError } from '@lib/http/handleError';
import { Api } from './api';
import type { FetchInstance } from '@lib/http/fetchInstance';
import type { TryResult } from '@root/types/types';
import { Runtime } from '@app/runtime/Runtime';
export async function tryHttp<ReturnType, Body = unknown>(
    instance: FetchInstance,
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
    body?: Body,
    headers: Record<string, string> = {},
): Promise<TryResult<ReturnType>> {
    try {
        const res = await Api[method](instance, path, body, headers);

        if (res.ok) {
            return {
                result: (await res.json()) as ReturnType,
                status: res.status,
            };
        }

        if (res.status === 403) {
            return {
                error: new ApiError('Forbidden', { data: { message: 'Forbidden' } }, 403),
                status: res.status,
            };
        }

        if (res.status === 422) {
            return {
                error: new ApiError('Forbidden', await res.json(), 403),
                status: res.status,
            };
        }

        if (res.status === 404) {
            return {
                error: new ApiError(
                    'Not found',
                    {
                        data: {
                            message: 'This resource does not exist',
                        },
                    },
                    404,
                ),
                status: res.status,
            };
        }

        if (res.status === 400) {
            const data = await res.json();
            const errorData: { data: Record<string, string> } = { data: {} };
            if ('message' in data) {
                errorData.data = data;
            }

            return {
                error: new ApiError('Application error', errorData, 400),
                status: res.status,
            };
        }

        return {
            error: new ApiError('Unexpected error', { data: { message: 'Unexpected error' } }, 500),
            status: res.status,
        };
    } catch (e) {
        return handleError<ReturnType>(e as TypeError);
    }
}
export function throwIfHttpFails<T>(fn: () => Promise<TryResult<T>>) {
    return async () => {
        console.log('sdčlkfjsačljfčsaf');
        const response = await fn();
        if (response.error) throw response.error;

        return response;
    };
}

export const authHeaders = () => ({
    'X-CREATIF-API-KEY': Runtime.instance.credentials.apiKey,
    'X-CREATIF-PROJECT-ID': Runtime.instance.credentials.projectId,
});

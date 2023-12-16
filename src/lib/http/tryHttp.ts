import { Initialize } from '@app/initialize';
import { ApiError } from '@lib/http/apiError';
import { handleError } from '@lib/http/handleError';
import { Api } from './api';
import type { FetchInstance } from '@lib/http/fetchInstance';
import type { TryResult } from '@root/types/types';
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

        if (res.status === 400 || res.status === 404) {
            return {
                error: await res.json(),
                status: res.status,
            };
        }

        if (res.status === 403) {
            return {
                error: {
                    data: {
                        message: 'Unauthenticated',
                    },
                },
                status: res.status,
            };
        }

        return {
            error: {
                data: {
                    message: 'Unexpected error',
                },
            },
            status: res.status,
        };
    } catch (e) {
        console.log(e);
        return handleError<ReturnType>(e as TypeError);
    }
}
export function throwIfHttpFails<T>(fn: () => Promise<TryResult<T>>) {
    return async () => {
        const response = await fn();
        if (response.error) throw new ApiError('', response.error, response.status);

        return response;
    };
}

export const authHeaders = () => ({
    'X-CREATIF-API-KEY': Initialize.ApiKey(),
    'X-CREATIF-PROJECT-ID': Initialize.ProjectID(),
});

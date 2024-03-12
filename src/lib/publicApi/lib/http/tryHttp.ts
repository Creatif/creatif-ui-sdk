import { CreatifError, TryHttpResult } from '@root/types/api/publicApi/Http';
import { Api } from '@lib/publicApi/lib/http/api';

export function isError(val: unknown): val is CreatifError {
    const a = val as CreatifError;
    return a && 'call' in a && 'messages' in a;
}

export async function tryHttp<ReturnType, Body = unknown>(
    method: 'get' | 'post' | 'put' | 'delete',
    path: string,
    body?: Body,
    headers: Record<string, string> = {},
): Promise<TryHttpResult<ReturnType>> {
    try {
        const res = await Api[method](path, body, headers);

        if (res.ok) {
            return {
                result: (await res.json()) as ReturnType,
                status: res.status,
            };
        }

        if (res.status === 422) {
            return {
                result: (await res.json()) as ReturnType,
                status: res.status,
            };
        }

        if (res.status === 400) {
            return {
                result: (await res.json()) as ReturnType,
                status: res.status,
            };
        }

        return {
            result: {
                call: 'unknown',
                messages: 'An unexpected error happened',
            } as ReturnType,
            status: 500,
        };
    } catch (e) {
        return {
            result: {
                call: 'unknown',
                messages: 'An unexpected error happened',
            } as ReturnType,
            status: 500,
        };
    }
}

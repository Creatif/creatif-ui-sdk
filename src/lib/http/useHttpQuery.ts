import { useQuery } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { throwIfHttpFails } from '@lib/http/tryHttp';
import type { QueryKey } from 'react-query';
import type { RetryValue } from 'react-query/types/core/retryer';
export default function useHttpQuery<Response>(
    key: QueryKey,
    fn: ReturnType<typeof throwIfHttpFails>,
    options?: {
        onError?: (error: ApiError) => void;
        onSuccess?: (data: Response) => void;
        enabled?: boolean;
        retry?: RetryValue<unknown>;
    },
) {
    let enabled = true;
    if (typeof options?.enabled !== 'undefined') {
        enabled = options.enabled;
    }

    let retries: RetryValue<unknown> = 2;
    if (typeof options?.retry !== 'undefined') {
        retries = options.retry;
    }

    return useQuery<unknown, ApiError, Response>(key, async () => await fn(), {
        onError: options?.onError,
        onSuccess: options?.onSuccess,
        retry: retries,
        staleTime: Infinity,
        enabled: enabled,
        keepPreviousData: true,
        refetchOnWindowFocus: false,
    });
}

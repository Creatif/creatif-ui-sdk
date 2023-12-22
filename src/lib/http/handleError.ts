import type { TryResult } from '@root/types/shared';
import { ApiError } from '@lib/http/apiError';
export function handleError<T>(e: TypeError): TryResult<T> {
    return {
        result: undefined,
        error: new ApiError('Someting went wrong', { data: { message: e.message } }, 500),
        status: 500,
    };
}

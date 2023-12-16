import type { TryResult } from '@root/types/shared';
export function handleError<T>(e: TypeError): TryResult<T> {
    return {
        result: undefined,
        error: {
            data: {
                message: e.message,
            },
        },
        status: 500,
    };
}

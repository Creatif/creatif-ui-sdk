import { isError } from '@lib/publicApi/lib/http/tryHttp';
import type { TryHttpResult } from '@root/types/api/publicApi/Http';

export function determineResult<T>(httpResult: TryHttpResult<T>) {
    const result = httpResult.result;
    if (isError(result)) {
        return {
            result: undefined,
            error: result,
        };
    }

    return {
        result: result,
        error: undefined,
    };
}

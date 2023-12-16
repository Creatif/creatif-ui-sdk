import { useCache } from '@app/cache/useCache';
import { useHttpState } from '@app/hooks/useHttpState';
import { getBatchedNodes } from '@lib/api';
import type { BatchRequestBlueprint, BatchResponse, TryResult } from '@root/types/types';
export function useGetBatch(args: BatchRequestBlueprint[]) {
    const cacheFn = useCache();
    const [isIdle, isFetching, isError, value, error, isCacheHit, setState] = useHttpState<TryResult<BatchResponse>>();

    cacheFn<TryResult<BatchResponse>>(
        'getBatch',
        () => {
            setState({
                state: 'isFetching',
            });
            return getBatchedNodes(args);
        },
        (value, error) => {
            if (error) {
                setState({
                    state: 'isError',
                    error: error,
                });
            }

            if (value) {
                setState({
                    state: 'idle',
                    value: value.value,
                    isCacheHit: value.hit,
                });
            }
        },
    );

    return {
        isIdle,
        isFetching,
        isError,
        error,
        value,
        isCacheHit,
    };
}

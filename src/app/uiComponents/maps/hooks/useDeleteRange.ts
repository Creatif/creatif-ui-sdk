import { Initialize } from '@app/initialize';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { type QueryKey, useMutation, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import deleteMapRange from '@lib/api/declarations/maps/deleteMapRange';
export default function useDeleteRange(onSuccess: () => void, onError: () => void) {
    const queryClient = useQueryClient();
    return {
        ...useMutation<unknown, ApiError, { items: string[]; name: string }>(
            async (body: { items: string[]; name: string }) => {
                const fn = throwIfHttpFails<unknown>(() =>
                    deleteMapRange({
                        name: body.name,
                        items: body.items,
                        projectId: Initialize.ProjectID(),
                    }),
                );

                return await fn();
            },
            {
                onSuccess: onSuccess,
                onError: onError,
            },
        ),
        invalidateQueries: (key: QueryKey) => {
            queryClient.invalidateQueries(key);
        },
    };
}

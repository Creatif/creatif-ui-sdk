import { Credentials } from '@app/credentials';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { type QueryKey, useMutation, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import deleteMapRange from '@lib/api/declarations/maps/deleteMapRange';
import { Runtime } from '@app/runtime/Runtime';
export default function useDeleteRange(onSuccess: () => void, onError: () => void) {
    const queryClient = useQueryClient();
    return {
        ...useMutation<unknown, ApiError, { items: string[]; name: string }>(
            async (body: { items: string[]; name: string }) => {
                const fn = throwIfHttpFails<unknown>(() =>
                    deleteMapRange({
                        name: body.name,
                        items: body.items,
                        projectId: Runtime.instance.credentials.projectId,
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

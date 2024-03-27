import { throwIfHttpFails } from '@lib/http/tryHttp';
import { type QueryKey, useMutation, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import deleteRange from '@lib/api/declarations/lists/deleteRange';
import { Runtime } from '@app/runtime/Runtime';
import deleteMapRange from '@lib/api/declarations/maps/deleteMapRange';
import type { StructureType } from '@root/types/shell/shell';
export default function useDeleteRange(structureType: StructureType, onSuccess: () => void, onError: () => void) {
    const queryClient = useQueryClient();
    return {
        ...useMutation<unknown, ApiError, { items: string[]; name: string }>(
            async (body: { items: string[]; name: string }) =>
                await throwIfHttpFails<unknown>(() => {
                    if (structureType === 'list') {
                        return deleteRange({
                            name: body.name,
                            items: body.items,
                            projectId: Runtime.instance.credentials.projectId,
                        });
                    }

                    return deleteMapRange({
                        name: body.name,
                        items: body.items,
                        projectId: Runtime.instance.credentials.projectId,
                    });
                }),
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

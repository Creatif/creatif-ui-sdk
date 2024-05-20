import { throwIfHttpFails } from '@lib/http/tryHttp';
import { type QueryKey, useMutation, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import { Runtime } from '@app/systems/runtime/Runtime';
import type { StructureType } from '@root/types/shell/shell';
import deleteListItemByID from '@lib/api/declarations/lists/deleteListItemByID';
import deleteMapItem from '@lib/api/declarations/maps/deleteMapItem';
export default function useDeleteVariable(
    structureType: StructureType,
    onSuccess: () => void,
    onError: (error: ApiError) => void,
) {
    const queryClient = useQueryClient();
    return {
        ...useMutation<unknown, ApiError, { name: string; itemId: string }>(
            async (body: { name: string; itemId: string }) =>
                await throwIfHttpFails<unknown>(() => {
                    if (structureType === 'list') {
                        return deleteListItemByID({
                            name: body.name,
                            itemId: body.itemId,
                            projectId: Runtime.instance.currentProjectCache.getProject().id,
                        });
                    }

                    return deleteMapItem({
                        name: body.name,
                        itemId: body.itemId,
                        projectId: Runtime.instance.currentProjectCache.getProject().id,
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

import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useQuery, useQueryClient } from 'react-query';
import queryListItemByID from '@lib/api/declarations/lists/queryListItemByID';
import { ApiError } from '@lib/http/apiError';
import { Runtime } from '@app/systems/runtime/Runtime';
import type { StructureType } from '@root/types/shell/shell';
import queryMapVariable from '@lib/api/declarations/maps/queryMapVariable';
import type { ConnectionViewType } from '@root/types/api/shared';
export default function useQueryVariable<Value, Metadata>(
    name: string | undefined,
    itemId: string | undefined,
    structureType: StructureType,
    enabled: boolean,
    connectionViewType: ConnectionViewType = 'connection',
) {
    const queryClient = useQueryClient();
    const key = ['get_list_or_map', name, itemId, connectionViewType];

    return {
        ...useQuery(
            key,
            () =>
                throwIfHttpFails(() => {
                    if (!name || !itemId) {
                        return Promise.reject({
                            error: new ApiError(
                                'List name and item ID not provided. They should be provided in the URL',
                                { data: { message: 'List name and item ID not provided' } },
                                500,
                            ),
                            status: 500,
                        });
                    }

                    if (structureType === 'list') {
                        return queryListItemByID<Value, Metadata>({
                            structureId: name,
                            itemId: itemId,
                            projectId: Runtime.instance.currentProjectCache.getProject().id,
                            connectionViewType: connectionViewType,
                        });
                    }

                    return queryMapVariable<Value, Metadata>({
                        structureId: name,
                        itemId: itemId,
                        projectId: Runtime.instance.currentProjectCache.getProject().id,
                        connectionViewType: connectionViewType,
                    });
                }),
            {
                retry: 0,
                staleTime: Infinity,
                enabled: enabled,
                keepPreviousData: true,
                refetchOnWindowFocus: false,
                refetchOnReconnect: true,
            },
        ),
        invalidateQuery: () => {
            queryClient.invalidateQueries(key);
        },
    };
}

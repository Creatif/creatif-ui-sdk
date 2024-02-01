import { Credentials } from '@app/credentials';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useQuery, useQueryClient } from 'react-query';
import { ApiError } from '@lib/http/apiError';
import queryMapVariable from '@lib/api/declarations/maps/queryMapVariable';
import { Runtime } from '@app/runtime/Runtime';
export default function useQueryMapVariable<Value, Metadata>(
    mapName: string | undefined,
    itemId: string | undefined,
    enabled: boolean,
) {
    const queryClient = useQueryClient();
    const key = ['getMap', mapName, itemId];

    return {
        ...useQuery(
            key,
            throwIfHttpFails(() => {
                if (!mapName || !itemId) {
                    return Promise.reject({
                        error: new ApiError(
                            'Map name and item ID not provided. They should be provided in the URL',
                            { data: { message: 'Map name and item ID not provided' } },
                            500,
                        ),
                        status: 500,
                    });
                }

                return queryMapVariable<Value, Metadata>({
                    structureId: mapName,
                    itemId: itemId,
                    projectId: Runtime.instance.credentials.projectId,
                });
            }),
            {
                retry: 0,
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

import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useQuery, useQueryClient } from 'react-query';
import queryListItemByID from '@lib/api/declarations/lists/queryListItemByID';
import { ApiError } from '@lib/http/apiError';
import { Runtime } from '@app/runtime/Runtime';
export default function useQueryListItem<Value, Metadata>(
    listName: string | undefined,
    itemId: string | undefined,
    enabled: boolean,
) {
    const queryClient = useQueryClient();
    const key = ['get_list', listName, itemId];

    return {
        ...useQuery(
            key,
            throwIfHttpFails(() => {
                if (!listName || !itemId) {
                    return Promise.reject({
                        error: new ApiError(
                            'List name and item ID not provided. They should be provided in the URL',
                            { data: { message: 'List name and item ID not provided' } },
                            500,
                        ),
                        status: 500,
                    });
                }

                return queryListItemByID<Value, Metadata>({
                    structureId: listName,
                    itemId: itemId,
                    projectId: Runtime.instance.credentials.projectId,
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

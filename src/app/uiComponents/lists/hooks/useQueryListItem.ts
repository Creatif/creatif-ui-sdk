import { Initialize } from '@app/initialize';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useQuery, useQueryClient } from 'react-query';
import queryListItemByID from '@lib/api/declarations/lists/queryListItemByID';
import { ApiError } from '@lib/http/apiError';
import { TryResult } from '@root/types/shared';
import { QueriedListItem } from '@root/types/api/list';
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
                            'List name and item ID not provided',
                            { data: { message: 'List name and item ID not provided' } },
                            500,
                        ),
                        status: 500,
                    });
                }

                return queryListItemByID<Value, Metadata>({
                    structureId: listName,
                    itemId: itemId,
                    projectId: Initialize.ProjectID(),
                });
            }),
            {
                retry: 1,
                enabled: enabled,
                staleTime: Infinity,
                keepPreviousData: true,
                refetchOnWindowFocus: false,
            },
        ),
        invalidateQueries: () => {
            queryClient.invalidateQueries(key);
        },
    };
}

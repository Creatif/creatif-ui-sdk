import { Initialize } from '@app/initialize';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useQuery, useQueryClient } from 'react-query';
import queryListItemByID from '@lib/api/declarations/lists/queryListItemByID';
export default function useQueryListItem<Value, Metadata>(
    listName: string,
    itemId: string,
    locale: string,
    enabled: boolean,
) {
    const queryClient = useQueryClient();

    return {
        ...useQuery(
            `get_list_${listName}_${itemId}`,
            throwIfHttpFails(() =>
                queryListItemByID<Value, Metadata>({
                    structureId: listName,
                    itemId: itemId,
                    locale: locale,
                    projectId: Initialize.ProjectID(),
                }),
            ),
            {
                enabled: enabled,
                staleTime: Infinity,
                keepPreviousData: true,
            },
        ),
        invalidateQueries: () => {
            queryClient.invalidateQueries(`get_list_${listName}_${itemId}`);
        },
    };
}

import useNotification from '@app/systems/notifications/useNotification';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { type QueryKey, useMutation, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { UpdateListItemResult, UpdateListItemVariableBlueprint } from '@root/types/api/list';
import type { TryResult } from '@root/types/shared';
import { updateListItem } from '@lib/api/declarations/lists/updateListItem';
import { Runtime } from '@app/systems/runtime/Runtime';
import type { StructureType } from '@root/types/shell/shell';
import { updateMapVariable } from '@lib/api/declarations/maps/updateMapVariable';
import type { UpdateMapItemResult } from '@root/types/api/map';

type Body = {
    fields: string[];
    values: UpdateListItemVariableBlueprint;
};
export default function useUpdateVariable(
    structureType: StructureType,
    listName: string,
    itemId: string,
    itemName: string,
) {
    const { success: successNotification, error: errorNotification } = useNotification();
    const queryClient = useQueryClient();

    return {
        ...useMutation<TryResult<UpdateListItemResult | UpdateMapItemResult>, ApiError, Body>(
            async (body: Body) =>
                await throwIfHttpFails(() => {
                    if (structureType === 'list') {
                        return updateListItem({
                            name: listName,
                            itemId: itemId,
                            projectId: Runtime.instance.currentProjectCache.getProject().id,
                            values: body.values,
                            fields: body.fields,
                            connections: [],
                            imagePaths: [],
                        });
                    }

                    return updateMapVariable({
                        name: listName,
                        itemId: itemId,
                        projectId: Runtime.instance.currentProjectCache.getProject().id,
                        values: body.values,
                        fields: body.fields,
                        connections: [],
                        imagePaths: [],
                    });
                }),
            {
                onSuccess: () => {
                    successNotification(
                        'Item updated.',
                        `Item for structure '${listName}' and item '${itemName}' has been updated.`,
                    );
                },
                onError: (error) => {
                    if (error && error.error && error.error.data.groups) {
                        errorNotification('Groups invalid', error.error.data.groups);

                        return;
                    }

                    if (error && error.error && error.error.data.maximumGroups) {
                        errorNotification('Groups invalid', error.error.data.maximumGroups);

                        return;
                    }

                    errorNotification(
                        'Something went wrong.',
                        'Item could not be updated at this time. Please, try again later.',
                    );
                },
            },
        ),
        invalidateQueries: (key: QueryKey) => {
            queryClient.invalidateQueries(key);
        },
    };
}

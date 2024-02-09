import useNotification from '@app/systems/notifications/useNotification';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { type QueryKey, useMutation, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { UpdateListItemVariableBlueprint } from '@root/types/api/list';
import type { TryResult } from '@root/types/shared';
import { updateMapVariable } from '@lib/api/declarations/maps/updateMapVariable';
import type { UpdateMapItemResult } from '@root/types/api/map';
import { Runtime } from '@app/runtime/Runtime';

type Body = {
    fields: string[];
    values: UpdateListItemVariableBlueprint;
};
export default function useUpdateMapVariable(mapName: string, itemId: string, itemName: string) {
    const { success: successNotification, error: errorNotification } = useNotification();
    const queryClient = useQueryClient();

    return {
        ...useMutation<TryResult<UpdateMapItemResult>, ApiError, Body>(
            async (body: Body) => {
                const fn = throwIfHttpFails(() =>
                    updateMapVariable({
                        name: mapName,
                        itemId: itemId,
                        projectId: Runtime.instance.credentials.projectId,
                        values: body.values,
                        fields: body.fields,
                        references: [],
                    }),
                );

                return await fn();
            },
            {
                onSuccess: () => {
                    successNotification(
                        'Item updated.',
                        `Item for structure '${mapName}' and item '${itemName}' has been updated.`,
                    );
                },
                onError: () => {
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

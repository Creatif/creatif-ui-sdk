import { Credentials } from '@app/credentials';
import useNotification from '@app/systems/notifications/useNotification';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { type QueryKey, useMutation, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { TryResult } from '@root/types/shared';
import { updateMapVariable } from '@lib/api/declarations/maps/updateMapVariable';
import type { UpdateMapItemResult, UpdateMapItemVariableBlueprint } from '@root/types/api/map';
import { Runtime } from '@app/runtime/Runtime';
export default function useEditLocale(mapName: string, itemId: string, itemName: string) {
    const { success: successNotification, error: errorNotification } = useNotification();
    const queryClient = useQueryClient();

    return {
        ...useMutation<TryResult<UpdateMapItemResult>, ApiError, { values: UpdateMapItemVariableBlueprint }>(
            async (body: { values: UpdateMapItemVariableBlueprint }) => {
                const fn = throwIfHttpFails(() =>
                    updateMapVariable({
                        name: mapName,
                        itemId: itemId,
                        projectId: Runtime.instance.credentials.projectId,
                        values: body.values,
                        fields: ['locale'],
                    }),
                );

                return await fn();
            },
            {
                onSuccess: () => {
                    successNotification(
                        'Locale changed.',
                        `Locale for structure '${mapName}' and item '${itemName}' has been updated.`,
                    );
                },
                onError: () => {
                    errorNotification(
                        'Something went wrong.',
                        'Locale cannot be changed at this moment. Please, try again later.',
                    );
                },
            },
        ),
        invalidateQueries: (key: QueryKey) => {
            queryClient.invalidateQueries(key);
        },
    };
}

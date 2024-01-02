import { Initialize } from '@app/initialize';
import useNotification from '@app/systems/notifications/useNotification';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { type QueryKey, useMutation, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { UpdateListItemResult, UpdateListItemVariableBlueprint } from '@root/types/api/list';
import type { TryResult } from '@root/types/shared';
import { updateListItem } from '@lib/api/declarations/lists/updateListItem';
export default function useEditLocale(listName: string, itemId: string, itemName: string) {
    const { success: successNotification, error: errorNotification } = useNotification();
    const queryClient = useQueryClient();

    return {
        ...useMutation<TryResult<UpdateListItemResult>, ApiError, { values: UpdateListItemVariableBlueprint }>(
            async (body: { values: UpdateListItemVariableBlueprint }) => {
                const fn = throwIfHttpFails(() =>
                    updateListItem({
                        name: listName,
                        itemId: itemId,
                        projectId: Initialize.ProjectID(),
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
                        `Locale for structure '${listName}' and item '${itemName}' has been updated.`,
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

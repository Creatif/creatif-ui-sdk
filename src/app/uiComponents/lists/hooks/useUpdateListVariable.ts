import { Credentials } from '@app/credentials';
import useNotification from '@app/systems/notifications/useNotification';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { type QueryKey, useMutation, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { UpdateListItemResult, UpdateListItemVariableBlueprint } from '@root/types/api/list';
import type { TryResult } from '@root/types/shared';
import { updateListItem } from '@lib/api/declarations/lists/updateListItem';

type Body = {
    fields: string[];
    values: UpdateListItemVariableBlueprint;
};
export default function useUpdateListVariable(listName: string, itemId: string, itemName: string) {
    const { success: successNotification, error: errorNotification } = useNotification();
    const queryClient = useQueryClient();

    return {
        ...useMutation<TryResult<UpdateListItemResult>, ApiError, Body>(
            async (body: Body) => {
                const fn = throwIfHttpFails(() =>
                    updateListItem({
                        name: listName,
                        itemId: itemId,
                        projectId: Credentials.ProjectID(),
                        values: body.values,
                        fields: body.fields,
                    }),
                );

                return await fn();
            },
            {
                onSuccess: () => {
                    successNotification(
                        'Item updated.',
                        `Item for structure '${listName}' and item '${itemName}' has been updated.`,
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
import useNotification from '@app/systems/notifications/useNotification';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import StructureStorage from '@lib/storage/structureStorage';
import { type QueryKey, useMutation, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { CreateListBlueprint } from '@root/types/api/list';
import createList from '@lib/api/declarations/lists/createList';
export default function useCreateList(listName: string) {
    const { success: successNotification, error: errorNotification } = useNotification();
    const queryClient = useQueryClient();

    return {
        ...useMutation<unknown, ApiError, CreateListBlueprint>(
            async (body: CreateListBlueprint) => {
                const fn = throwIfHttpFails(() => createList(body));

                return await fn();
            },
            {
                onSuccess() {
                    successNotification(
                        `List with name ${listName} created.`,
                        `List '${listName}' has been successfully created. This message will only appear once.`,
                    );
                },
                onError() {
                    errorNotification(
                        'Something wrong happened.',
                        'We are working to resolve this problem. Please, try again later.',
                    );
                },
            },
        ),
        invalidateQueries: (key: QueryKey) => {
            queryClient.invalidateQueries(key);
        },
    };
}

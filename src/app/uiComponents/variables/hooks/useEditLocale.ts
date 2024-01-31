import { Credentials } from '@app/credentials';
import useNotification from '@app/systems/notifications/useNotification';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { type QueryKey, useMutation, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { UpdateListItemResult } from '@root/types/api/list';
import type { TryResult } from '@root/types/shared';
import updateVariable from '@lib/api/declarations/variables/updateVariable';
export default function useEditLocale(name: string) {
    const { success: successNotification, error: errorNotification } = useNotification();
    const queryClient = useQueryClient();

    return {
        ...useMutation<
            TryResult<UpdateListItemResult>,
            ApiError,
            { id: string; currentLocale: string; nextLocale: string }
        >(
            async (body: { id: string; currentLocale: string; nextLocale: string }) => {
                const fn = throwIfHttpFails(() =>
                    updateVariable({
                        name: body.id,
                        locale: body.currentLocale,
                        projectId: Credentials.ProjectID(),
                        values: {
                            locale: body.nextLocale,
                        },
                        fields: ['locale'],
                    }),
                );

                return await fn();
            },
            {
                onSuccess: () => {
                    successNotification('Locale changed.', `Locale for item '${name}' has been updated`);
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

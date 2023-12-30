import { Initialize } from '@app/initialize';
import useNotification from '@app/systems/notifications/useNotification';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import getVariable from '@lib/api/declarations/variables/getVariable';
import { useQuery, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';

export function useGetVariable<Value = unknown, Metadata = unknown>(
    variableName: string,
    locale: string | undefined,
    enabled = true,
    onError?: () => void,
) {
    const { error: errorNotification } = useNotification();
    const key = [variableName, locale];
    const queryClient = useQueryClient();

    return {
        ...useQuery(
            key,
            () =>
                throwIfHttpFails(() =>
                    getVariable<Value, Metadata>({
                        name: variableName,
                        locale: locale,
                        projectId: Initialize.ProjectID(),
                    }),
                )(),
            {
                onError: onError
                    ? onError
                    : (error: ApiError) => {
                          if (error.status === 404) {
                              return;
                          }

                          errorNotification(
                              'Failed to get variable',
                              `Something went wrong when trying to get variable ${variableName}. Please, try again later`,
                          );
                      },
                retry: 0,
                staleTime: Infinity,
                enabled: enabled,
                keepPreviousData: true,
                refetchOnWindowFocus: false,
                refetchOnReconnect: true,
            },
        ),
        invalidateQuery() {
            queryClient.invalidateQueries(key);
        },
    };
}

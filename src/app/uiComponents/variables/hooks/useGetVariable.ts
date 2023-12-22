import { Initialize } from '@app/initialize';
import useNotification from '@app/systems/notifications/useNotification';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import getVariable from '@lib/api/declarations/variables/getVariable';
import { useQuery } from 'react-query';
import type { ApiError } from '@lib/http/apiError';

export function useGetVariable<Value = unknown, Metadata = unknown>(
    variableName: string,
    locale: string | undefined,
    enabled = true,
    onError?: () => void,
) {
    const { error: errorNotification } = useNotification();

    return useQuery(
        `get_${variableName}_${locale || ''}`,
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
            enabled: enabled,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
        },
    );
}

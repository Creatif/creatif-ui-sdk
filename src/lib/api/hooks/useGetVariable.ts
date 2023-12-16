import { Initialize } from '@app/initialize';
import useNotification from '@app/systems/notifications/useNotification';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import useHttpQuery from '@lib/http/useHttpQuery';
import type { GetVariableResponse } from '@root/types/api/variable';
import type { TryResult } from '@root/types/shared';
import getVariable from '@lib/api/declarations/variables/getVariable';

export function useGetVariable<Variable = TryResult<GetVariableResponse>>(variableName: string) {
    const { error: errorNotification } = useNotification();

    return useHttpQuery<Variable>(
        `get_${variableName}`,
        throwIfHttpFails(() =>
            getVariable({
                name: variableName,
                projectId: Initialize.ProjectID(),
            }),
        ),
        {
            onError: (error) => {
                if (error.status === 404) {
                    return;
                }

                errorNotification(
                    'Failed to get variable',
                    `Something went wrong when trying to get variable ${variableName}. Please, try again later`,
                );
            },
            retry: 0,
        },
    );
}

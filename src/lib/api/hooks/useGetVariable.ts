import { Initialize } from '@app/initialize';
import useNotification from '@app/systems/notifications/useNotification';
import { declarations } from '@lib/http/axios';
import useHttpQuery from '@lib/http/useHttpQuery';
import type { CreatedVariable } from '@root/types/api/variable';

export function useGetVariable<Variable = CreatedVariable>(variableName: string) {
    const { error } = useNotification();

    return useHttpQuery<Variable>(
        declarations(),
        `get_${variableName}`,
        `/variable/${Initialize.ProjectID()}/${variableName}/${Initialize.Locale()}`,
        {
            onError: () => {
                error(
                    'Failed to get variable',
                    `Something went wrong when trying to get variable ${variableName}. Please, try again later`,
                );
            },
        },
        {
            'X-CREATIF-API-KEY': Initialize.ApiKey(),
            'X-CREATIF-PROJECT-ID': Initialize.ProjectID(),
        },
    );
}

import useNotification from '@app/systems/notifications/useNotification';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useMutation, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { CreatedVariable, UpdateVariableBlueprint } from '@root/types/api/variable';
import updateVariable from '@lib/api/declarations/variables/updateVariable';
import type { TryResult } from '@root/types/shared';
export default function useUpdateVariable(variableName: string) {
    const { success: successNotification, error: errorNotification } = useNotification();
    const queryClient = useQueryClient();

    return {
        ...useMutation<TryResult<CreatedVariable>, ApiError, UpdateVariableBlueprint>(
            async (body: UpdateVariableBlueprint) => {
                const fn = throwIfHttpFails(() => updateVariable(body));

                return await fn();
            },
            {
                onSuccess() {
                    successNotification(`Variable with name ${variableName} updated.`, '');

                    queryClient.invalidateQueries(`get_${variableName}`);
                },
                onError() {
                    errorNotification(
                        'Something wrong happened.',
                        'We are working to resolve this problem. Please, try again later.',
                    );
                },
            },
        ),
    };
}

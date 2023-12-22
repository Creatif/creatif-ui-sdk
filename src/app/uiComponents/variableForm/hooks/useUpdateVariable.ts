import useNotification from '@app/systems/notifications/useNotification';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import StructureStorage from '@lib/storage/structureStorage';
import { useMutation, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { UpdateVariableBlueprint } from '@root/types/api/variable';
import updateVariable from '@lib/api/declarations/variables/updateVariable';
export default function useUpdateVariable(variableName: string) {
    const { success: successNotification, error: errorNotification } = useNotification();
    const queryClient = useQueryClient();

    return {
        ...useMutation<unknown, ApiError, UpdateVariableBlueprint>(
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

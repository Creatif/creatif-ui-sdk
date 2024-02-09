import useNotification from '@app/systems/notifications/useNotification';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useMutation, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { DeleteVariableBlueprint } from '@root/types/api/variable';
import deleteVariable from '@lib/api/declarations/variables/deleteVariable';
export default function useDeleteVariable(variableName: string) {
    const { success: successNotification, error: errorNotification } = useNotification();
    const queryClient = useQueryClient();

    return {
        ...useMutation<unknown, ApiError, DeleteVariableBlueprint>(
            async (body: DeleteVariableBlueprint) => {
                const fn = throwIfHttpFails(() => deleteVariable(body));

                return await fn();
            },
            {
                onSuccess() {
                    successNotification(
                        `Variable with name ${variableName} deleted.`,
                        `Variable '${variableName}' has been successfully deleted.`,
                    );

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

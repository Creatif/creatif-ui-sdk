import useNotification from '@app/systems/notifications/useNotification';
import getVariable from '@lib/api/declarations/variables/getVariable';
import updateVariable from '@lib/api/declarations/variables/updateVariable';
import { useParams } from 'react-router-dom';
import type { UpdateableVariableValuesBlueprint } from '@root/types/api/variable';
import { Initialize } from '@app/initialize';
export default function useUpdateVariable<Value>(isUpdateMode: boolean, currentDefaultValues: Value) {
    if (!isUpdateMode) return undefined;

    const { structureId } = useParams();
    const { error: errorNotification } = useNotification();

    if (!structureId) {
        throw new Error(
            'There is no \'structureId\' route parameter in the URL. It must be provided in order for automatic update to work.',
        );
    }

    return {
        defaultValues: async (): Promise<Value> => {
            const { result, error } = await getVariable({
                name: structureId,
                projectId: Initialize.ProjectID(),
            });

            if (error) {
                errorNotification(
                    'Query list item error.',
                    'The system cannot query this list item. Please, try again later.',
                );

                return currentDefaultValues;
            }

            if (result) {
                return result?.value as Value;
            }

            return currentDefaultValues;
        },
        update: async (id: string, fields: string[], values: UpdateableVariableValuesBlueprint<unknown, unknown>) =>
            updateVariable({
                name: id,
                fields: fields,
                values: values,
            }),
    };
}

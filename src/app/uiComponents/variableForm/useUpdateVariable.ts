import useNotification from '@app/systems/notifications/useNotification';
import getVariable from '@lib/api/declarations/variables/getVariable';
import updateVariable from '@lib/api/declarations/variables/updateVariable';
import { useParams } from 'react-router-dom';
import type { UpdateableVariableValuesBlueprint } from '@root/types/api/variable';
import { Initialize } from '@app/initialize';
import type { SpecialFieldsStore } from '@app/systems/stores/specialFields';
import type { StoreApi, UseBoundStore } from 'zustand';
import { ApiError } from '@lib/http/apiError';
export default function useUpdateVariable<Value>(
    isUpdateMode: boolean,
    currentDefaultValues: Value,
    specialFieldsStore: UseBoundStore<StoreApi<SpecialFieldsStore>>,
    onError: (err: ApiError) => void,
) {
    const setLocale = specialFieldsStore((state) => state.setLocale);
    const setGroups = specialFieldsStore((state) => state.setGroups);
    const setBehaviour = specialFieldsStore((state) => state.setBehaviour);

    if (!isUpdateMode) return undefined;

    const { structureId, variableLocale } = useParams();

    if (!structureId || !variableLocale) {
        onError(new ApiError('No structure ID in url.', { data: { message: 'No ID in url.' } }, 404));
        return;
    }

    return {
        defaultValues: async (): Promise<Value> => {
            const { result, error } = await getVariable({
                name: structureId,
                projectId: Initialize.ProjectID(),
                locale: variableLocale,
            });

            if (error) {
                onError(error);
                return currentDefaultValues;
            }

            if (result) {
                console.log('result: ', result.locale);
                setLocale(result.locale);
                if (result.groups) setGroups(result.groups);
                setBehaviour(result.behaviour);
                return result?.value as Value;
            }

            return currentDefaultValues;
        },
        update: async (
            id: string,
            fields: string[],
            values: UpdateableVariableValuesBlueprint<unknown, unknown>,
            locale: string,
        ) =>
            updateVariable({
                name: id,
                fields: fields,
                values: values,
                locale: locale,
                projectId: Initialize.ProjectID(),
            }),
    };
}
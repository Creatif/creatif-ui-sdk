import useNotification from '@app/systems/notifications/useNotification';
import getVariable from '@lib/api/declarations/variables/getVariable';
import updateVariable from '@lib/api/declarations/variables/updateVariable';
import { useParams } from 'react-router-dom';
import type { UpdateableVariableValuesBlueprint } from '@root/types/api/variable';
import { Initialize } from '@app/initialize';
import type { SpecialFieldsStore } from '@app/systems/stores/specialFields';
import type { StoreApi, UseBoundStore } from 'zustand';
import { useGetVariable } from '@app/uiComponents/variables/hooks/useGetVariable';
import { ApiError } from '@lib/http/apiError';

interface UseUpdateVariable {}
export default function usePrepareForUpdate<Value>(
    isUpdateMode: boolean,
    currentDefaultValues: Value,
    specialFieldsStore: UseBoundStore<StoreApi<SpecialFieldsStore>>,
) {
    const setLocale = specialFieldsStore((state) => state.setLocale);
    setLocale(Initialize.Locale());
    const setGroups = specialFieldsStore((state) => state.setGroups);
    const setBehaviour = specialFieldsStore((state) => state.setBehaviour);

    const { structureId } = useParams();
    const { error: errorNotification } = useNotification();

    if (!structureId) {
        return {
            isFetching: false,
            variable: null,
            getVariableError: new ApiError('Route does not exist', { data: {} }, 404),
        };
    }

    const { isFetching, data, error } = useGetVariable(structureId, isUpdateMode);

    if (!isFetching && data?.result) {
        setLocale(data.result.locale);
        if (data.result.groups) setGroups(data.result.groups);
        setBehaviour(data.result.behaviour);
    }

    return {
        isFetching,
        variable: data,
        getVariableError: error,
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

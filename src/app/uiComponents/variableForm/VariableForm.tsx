import Loading from '@app/components/Loading';
import useNotification from '@app/systems/notifications/useNotification';
import { getOptions } from '@app/systems/stores/options';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import useResolveBindings from '@app/uiComponents/variableForm/useResolveBindings';
import valueMetadataValidator from '@app/uiComponents/listForm/helpers/valueMetadataValidator';
import { wrappedBeforeSave } from '@app/uiComponents/util';
import { createVariable } from '@lib/api/declarations/variables/createVariable';
import StructureStorage from '@lib/storage/structureStorage';
import { Alert } from '@mantine/core';
import React, { useCallback, useState } from 'react';
import { useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import type { CreatedVariable } from '@root/types/api/variable';
import type { AfterSaveFn, BeforeSaveFn, Bindings } from '@root/types/forms/forms';
import type { HTMLAttributes, BaseSyntheticEvent } from 'react';

import type {
    FieldValues,
    UseFormProps,
    UseFormGetFieldState,
    UseFormGetValues,
    UseFormReset,
    UseFormResetField,
    UseFormSetError,
    UseFormSetFocus,
    UseFormSetValue,
    UseFormTrigger,
    UseFormUnregister,
    UseFormWatch,
} from 'react-hook-form';
import { Credentials } from '@app/credentials';
import type { InputLocaleProps } from '@app/uiComponents/inputs/InputLocale';
import { useGetVariable } from '@app/uiComponents/variables/hooks/useGetVariable';
import Form from '@app/uiComponents/shared/Form';
import updateVariable from '@lib/api/declarations/variables/updateVariable';
import UIError from '@app/components/UIError';
import type { InputGroupsProps } from '@app/uiComponents/inputs/InputGroups';
import RuntimeErrorModal from '@app/uiComponents/shared/RuntimeErrorModal';
import chooseAndDeleteBindings from '@app/uiComponents/shared/hooks/chooseAndDeleteBindings';
import type { IncomingValues } from '@app/uiComponents/shared/hooks/chooseAndDeleteBindings';

interface Props<T extends FieldValues, Value, Metadata> {
    variableName: string;
    bindings?: Bindings<T>;
    formProps: UseFormProps<T>;
    mode?: 'update';
    inputs: (
        submitButton: React.ReactNode,
        actions: {
            setValue: UseFormSetValue<T>;
            getValues: UseFormGetValues<T>;
            setFocus: UseFormSetFocus<T>;
            setError: UseFormSetError<T>;
            reset: UseFormReset<T>;
            resetField: UseFormResetField<T>;
            unregister: UseFormUnregister<T>;
            watch: UseFormWatch<T>;
            trigger: UseFormTrigger<T>;
            getFieldState: UseFormGetFieldState<T>;
            defaultValues: T;
            inputLocale: (props?: InputLocaleProps) => React.ReactNode;
            inputGroups: (props?: InputGroupsProps) => React.ReactNode;
            inputBehaviour: () => React.ReactNode;
        },
    ) => React.ReactNode;
    beforeSave?: BeforeSaveFn<T>;
    afterSave?: AfterSaveFn<CreatedVariable<Value, Metadata>>;
    form?: HTMLAttributes<HTMLFormElement>;
}
export default function VariableForm<T extends FieldValues, Value = unknown, Metadata = unknown>({
    variableName,
    formProps,
    bindings,
    inputs,
    beforeSave,
    afterSave,
    mode,
}: Props<T, Value, Metadata>) {
    const { success: successNotification, error: errorNotification } = useNotification();
    const [beforeSaveError, setBeforeSaveError] = useState(false);
    const { variableLocale, structureId } = useParams();
    const [isSaving, setIsSaving] = useState(false);

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const resolveBindings = useResolveBindings();
    const { store: useStructureOptionsStore, error: runtimeError } = getOptions(variableName);

    const [isVariableExistsError, setIsVariableExistsError] = useState(false);
    const [isGenericUpdateError, setIsGenericUpdateError] = useState(false);
    const [isVariableReadonly, setIsVariableReadonly] = useState(false);

    const {
        isFetching,
        data,
        error: getError,
    } = useGetVariable(variableName, variableLocale, Boolean(mode && variableLocale), () => {});

    const onInternalSubmit = useCallback((value: T, e: BaseSyntheticEvent | undefined) => {
        if (!value) {
            errorNotification(
                'No data submitted.',
                'undefined has been submitted which means there are no values to save. Have you added some fields to your form?',
            );
            return;
        }

        setIsVariableExistsError(false);
        setIsGenericUpdateError(false);
        setIsVariableReadonly(false);

        const binding = resolveBindings(value, bindings);
        if (!binding) return;
        const { locale, groups, behaviour } = binding;

        wrappedBeforeSave(value, e, beforeSave).then((result) => {
            if (!valueMetadataValidator(result)) {
                setBeforeSaveError(true);
                setIsSaving(false);
                return;
            }

            setIsVariableExistsError(false);
            setIsGenericUpdateError(false);
            setIsVariableReadonly(false);
            setIsSaving(true);

            if (mode && result && structureId && useStructureOptionsStore) {
                const { chosenLocale, chosenBehaviour, chosenGroups } = chooseAndDeleteBindings(
                    result.value as IncomingValues,
                    locale,
                    behaviour,
                    groups,
                );

                updateVariable({
                    projectId: Credentials.ProjectID(),
                    name: structureId,
                    fields: ['value', 'metadata', 'groups', 'behaviour', 'locale', 'name'],
                    values: {
                        behaviour: chosenBehaviour,
                        name: variableName,
                        groups: chosenGroups,
                        metadata: result.metadata,
                        value: result.value,
                        locale: chosenLocale,
                    },
                    locale: variableLocale || Credentials.Locale(),
                }).then(({ result: response, error }) => {
                    setIsSaving(false);

                    if (error && error.error.data['exists']) {
                        setIsVariableExistsError(true);
                        return;
                    } else if (error && error.error.data['behaviourReadonly']) {
                        setIsVariableReadonly(true);
                        return;
                    } else if (error) {
                        setIsGenericUpdateError(true);
                        return;
                    }

                    if (result) {
                        successNotification(
                            'Variable updated',
                            `Variable with name '${variableName}' has been updated.`,
                        );

                        queryClient.invalidateQueries(variableName);
                        afterSave?.(response, e);
                        navigate(useStructureOptionsStore.getState().paths.listing);
                    }
                });
            }

            if (!mode && result) {
                const { chosenLocale, chosenBehaviour, chosenGroups } = chooseAndDeleteBindings(
                    result.value as IncomingValues,
                    locale,
                    behaviour,
                    groups,
                );

                createVariable<Value, Metadata>({
                    name: variableName,
                    behaviour: chosenBehaviour,
                    groups: chosenGroups,
                    projectId: Credentials.ProjectID(),
                    locale: chosenLocale,
                    metadata: result.metadata,
                    value: result.value,
                }).then(({ result: response, error }) => {
                    setIsSaving(false);
                    if (error && error.error.data['exists']) {
                        errorNotification('Variable name exists', 'Variable with this name and locale already exists');
                        setIsSaving(false);
                        return;
                    } else if (error) {
                        errorNotification(
                            'Something went wrong.',
                            'Variable could not be created. Please, try again later.',
                        );
                        setIsSaving(false);
                        return;
                    }

                    if (response && useStructureOptionsStore) {
                        successNotification(
                            'Variable created',
                            `Variable with name '${variableName}' and locale '${chosenLocale}' has been created.`,
                        );

                        queryClient.invalidateQueries(variableName);
                        queryClient.invalidateQueries(['get_groups']);
                        afterSave?.(response, e);
                        setIsSaving(false);
                        navigate(useStructureOptionsStore.getState().paths.listing);
                    }
                });
            }
        });
    }, []);

    return (
        <div className={contentContainerStyles.root}>
            {beforeSaveError && (
                <Alert
                    style={{
                        marginBottom: '2rem',
                    }}
                    color="red"
                    title="beforeSubmit() error">
                    {
                        "Return value of 'beforeSave' must be in the form of type: {value: unknown, metadata: unknown}. Something else was returned"
                    }
                </Alert>
            )}

            {Boolean(getError) && <UIError title="Not found">{'This item could not be found.'}</UIError>}
            {isVariableExistsError && (
                <div
                    style={{
                        marginBottom: '1rem',
                    }}>
                    <UIError title="Item exists">Item with this name already exists</UIError>
                </div>
            )}

            {isGenericUpdateError && (
                <div
                    style={{
                        marginBottom: '1rem',
                    }}>
                    <UIError title="Something went wrong">
                        We cannot update this item at this moment. We are working to solve this issue. Please, try again
                        later.
                    </UIError>
                </div>
            )}

            {isVariableReadonly && (
                <div
                    style={{
                        marginBottom: '1rem',
                    }}>
                    <UIError title="Item is readonly">
                        This is a readonly item and can be updated only by the administrator.
                    </UIError>
                </div>
            )}
            <Loading isLoading={isFetching} />

            {!isFetching && !getError && (
                <Form
                    structureType={'variable'}
                    structureId={variableName}
                    formProps={formProps}
                    inputs={inputs}
                    onSubmit={onInternalSubmit}
                    isSaving={isSaving}
                    mode={mode}
                    currentData={data?.result}
                />
            )}

            <RuntimeErrorModal open={Boolean(runtimeError)} error={runtimeError} />
        </div>
    );
}

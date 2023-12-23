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
import { Initialize } from '@app/initialize';
import type { InputLocaleProps } from '@app/uiComponents/inputs/InputLocale';
import { useGetVariable } from '@app/uiComponents/variables/hooks/useGetVariable';
import Form from '@app/uiComponents/shared/Form';
import updateVariable from '@lib/api/declarations/variables/updateVariable';
import UIError from '@app/components/UIError';
import type { InputGroupsProps } from '@app/uiComponents/inputs/InputGroups';
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
        },
    ) => React.ReactNode;
    beforeSave?: BeforeSaveFn<T>;
    afterSave?: AfterSaveFn<CreatedVariable<Value, Metadata>>;
    form?: HTMLAttributes<HTMLFormElement>;
}

function chooseLocale(fieldLocale: string, bindingLocale: string): string {
    if (bindingLocale) return bindingLocale;
    if (fieldLocale) return fieldLocale;
    return Initialize.Locale();
}

function chooseGroups(fieldGroups: string[], bindingGroups: string[]): string[] {
    if (bindingGroups.length !== 0) return bindingGroups;
    if (fieldGroups.length !== 0) return fieldGroups;
    return ['default'];
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
    const useStructureOptionsStore = getOptions(variableName);

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

        const binding = resolveBindings(value, bindings);
        if (!binding) return;
        const { locale, groups, behaviour } = binding;

        wrappedBeforeSave(value, e, beforeSave).then((result) => {
            setIsSaving(true);
            if (!valueMetadataValidator(result)) {
                setBeforeSaveError(true);
                setIsSaving(false);
                return;
            }

            if (mode && result && structureId) {
                type localeType = { locale: string };
                type groupsType = { groups: string[] };
                const chosenLocale = chooseLocale((result.value as localeType).locale, locale);
                if (Object.hasOwn(result.value as object, 'locale')) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    delete (result.value as localeType).locale;
                }

                const chosenGroups = chooseGroups((result.value as groupsType).groups, groups);
                if (Object.hasOwn(result.value as object, 'groups')) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    delete (result.value as groupsType).groups;
                }

                updateVariable({
                    projectId: Initialize.ProjectID(),
                    name: structureId,
                    fields: ['value', 'metadata', 'groups', 'behaviour', 'locale', 'name'],
                    values: {
                        behaviour: behaviour,
                        name: variableName,
                        groups: chosenGroups,
                        metadata: result.metadata,
                        value: result.value,
                        locale: chosenLocale,
                    },
                    locale: variableLocale || Initialize.Locale(),
                }).then(({ result, error }) => {
                    setIsSaving(false);

                    if (error && error.error.data['exists']) {
                        errorNotification('Variable exists', 'Variable with this name and locale already exists');
                        return;
                    } else if (error) {
                        errorNotification(
                            'Something went wrong',
                            'Variable could not be updated. Please, try again later',
                        );
                        return;
                    }

                    if (result) {
                        successNotification(
                            'Variable updated',
                            `Variable with name '${variableName}' has been updated.`,
                        );

                        queryClient.invalidateQueries(variableName);
                        afterSave?.(result, e);
                        navigate(useStructureOptionsStore.getState().paths.listing);
                    }
                });
            }

            if (!mode && result) {
                setIsSaving(true);
                type localeType = { locale: string };
                type groupsType = { groups: string[] };
                const chosenLocale = chooseLocale((result.value as localeType).locale, locale);
                if (result && (result.value as localeType).locale) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    delete (result.value as localeType).locale;
                }

                const chosenGroups = chooseGroups((result.value as groupsType).groups, groups);
                if (Object.hasOwn(result.value as object, 'groups')) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    delete (result.value as groupsType).groups;
                }

                createVariable<Value, Metadata>({
                    name: variableName,
                    behaviour: behaviour,
                    groups: chosenGroups,
                    projectId: Initialize.ProjectID(),
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

                    if (response) {
                        successNotification(
                            'Variable created',
                            `Variable with name '${variableName}' and locale '${chosenLocale}' has been created.`,
                        );

                        StructureStorage.instance.addVariable(variableName, response.locale);
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

            {getError && <UIError title="Not found">{'This item could not be found.'}</UIError>}

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
        </div>
    );
}

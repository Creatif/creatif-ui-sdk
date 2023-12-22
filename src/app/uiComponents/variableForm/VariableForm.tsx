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
import useUpdateVariable from '@app/uiComponents/variableForm/hooks/useUpdateVariable';
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
    const { variableLocale } = useParams();

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const resolveBindings = useResolveBindings();
    const useStructureOptionsStore = getOptions(variableName);

    const { isFetching, data, error } = useGetVariable(variableName, variableLocale, Boolean(mode && variableLocale));
    const { mutateAsync, isLoading } = useUpdateVariable(variableName);

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
            if (!valueMetadataValidator(result)) {
                setBeforeSaveError(true);
                return;
            }

            if (mode && result) {
                type localeType = { locale: string };
                const chosenLocale = chooseLocale((result.value as localeType).locale, locale);
                if (Object.hasOwn(result.value as object, 'locale')) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    delete (result.value as localeType).locale;
                }

                mutateAsync({
                    projectId: Initialize.ProjectID(),
                    name: variableName,
                    fields: ['value', 'metadata', 'groups', 'behaviour', 'locale'],
                    values: {
                        behaviour: behaviour,
                        groups: groups.length === 0 ? ['default'] : groups,
                        metadata: result.metadata,
                        value: result.value,
                        locale: chosenLocale,
                    },
                    locale: variableLocale || Initialize.Locale(),
                }).then((response) => {
                    if (error) {
                        errorNotification(
                            'Something went wrong.',
                            'Variable could not be update. Please, try again later.',
                        );
                        return;
                    }

                    if (response) {
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
                type localeType = { locale: string };
                const locale = (result.value as localeType).locale
                    ? (result.value as localeType).locale
                    : Initialize.Locale();
                if (result && (result.value as localeType).locale) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    delete (result.value as localeType).locale;
                }

                createVariable<Value, Metadata>({
                    name: variableName,
                    behaviour: behaviour,
                    groups: groups.length === 0 ? ['default'] : groups,
                    projectId: Initialize.ProjectID(),
                    locale: locale ? locale : Initialize.Locale(),
                    metadata: result.metadata,
                    value: result.value,
                }).then(({ result: response, error }) => {
                    if (error && error.data['nameExists']) {
                        errorNotification('Variable name exists', `Variable with the name '${name}' already exists.`);

                        return;
                    } else if (error) {
                        errorNotification(
                            'Something went wrong.',
                            'Variable could not be created. Please, try again later.',
                        );
                        return;
                    }

                    if (response) {
                        successNotification('Variable created', `Variable with name '${name}' has been created.`);

                        StructureStorage.instance.addVariable(variableName, response.locale);
                        queryClient.invalidateQueries(variableName);
                        afterSave?.(response, e);
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

            <Loading isLoading={isFetching} />

            {!isFetching && (
                <Form
                    formProps={formProps}
                    inputs={inputs}
                    onSubmit={onInternalSubmit}
                    isSaving={isLoading}
                    mode={mode}
                    currentData={data?.result}
                />
            )}
        </div>
    );
}

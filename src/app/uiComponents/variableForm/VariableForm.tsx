import Loading from '@app/components/Loading';
import useNotification from '@app/systems/notifications/useNotification';
import { getOptions } from '@app/systems/stores/options';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import useResolveBindings from '@app/uiComponents/listForm/helpers/useResolveBindings';
import valueMetadataValidator from '@app/uiComponents/listForm/helpers/valueMetadataValidator';
import { wrappedBeforeSave } from '@app/uiComponents/util';
import useUpdateVariable from '@app/uiComponents/variableForm/useUpdateVariable';
import { createVariable } from '@lib/api/declarations/variables/createVariable';
import StructureStorage from '@lib/storage/structureStorage';
import { Alert, Button, Group } from '@mantine/core';
import React, { useCallback, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const defaultValuesForUpdate = useUpdateVariable<T>(Boolean(mode), formProps.defaultValues);
    if (mode === 'update' && defaultValuesForUpdate?.defaultValues) {
        formProps.defaultValues = defaultValuesForUpdate.defaultValues;
    }

    const methods = useForm(formProps);
    const { success: successNotification, error: errorNotification } = useNotification();

    const [beforeSaveError, setBeforeSaveError] = useState(false);

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const resolveBindings = useResolveBindings();
    const useStructureOptionsStore = getOptions(variableName);
    const [isSaving, setIsSaving] = useState(false);

    const {
        setValue,
        getValues,
        setError,
        setFocus,
        reset,
        resetField,
        unregister,
        watch,
        trigger,
        getFieldState,
        formState: { isLoading },
    } = methods;

    const onInternalSubmit = useCallback((value: T, e: BaseSyntheticEvent | undefined) => {
        if (!value) {
            errorNotification(
                'No data submitted.',
                'undefined has been submitted which means there are no values to save. Have you added some fields to your form?',
            );
            return;
        }

        setIsSaving(true);

        const binding = resolveBindings(value, bindings);
        if (!binding) return;
        const { name, groups, behaviour } = binding;

        wrappedBeforeSave(value, e, beforeSave).then((result) => {
            if (!valueMetadataValidator(result)) {
                setBeforeSaveError(true);
                setIsSaving(false);
                return;
            }

            if (mode && result && defaultValuesForUpdate?.update) {
                defaultValuesForUpdate
                    .update(variableName, ['value', 'metadata', 'groups', 'behaviour'], {
                        behaviour: behaviour,
                        groups: groups,
                        metadata: result.metadata,
                        value: result.value,
                    })
                    .then(({ result: response, error }) => {
                        if (error) {
                            setIsSaving(false);
                            errorNotification(
                                'Something went wrong.',
                                'Variable could not be update. Please, try again later.',
                            );
                            return;
                        }

                        if (response) {
                            successNotification('Variable updated', `Variable with name '${name}' has been updated.`);

                            StructureStorage.instance.addVariable(name);
                            queryClient.invalidateQueries(`get_${variableName}`);
                            afterSave?.(response, e);
                            setIsSaving(false);
                            navigate(useStructureOptionsStore.getState().paths.listing);
                        }
                    });
            }

            if (!mode && result) {
                createVariable<Value, Metadata>({
                    name: name || variableName,
                    behaviour: behaviour,
                    groups: groups,
                    metadata: result.metadata,
                    value: result.value,
                }).then(({ result: response, error }) => {
                    if (error && error.data['nameExists']) {
                        setIsSaving(false);
                        errorNotification('Variable name exists', `Variable with the name '${name}' already exists.`);

                        return;
                    } else if (error) {
                        setIsSaving(false);
                        errorNotification(
                            'Something went wrong.',
                            'Variable could not be created. Please, try again later.',
                        );
                        return;
                    }

                    if (response) {
                        successNotification('Variable created', `Variable with name '${name}' has been created.`);

                        StructureStorage.instance.addVariable(name);
                        queryClient.invalidateQueries(variableName);
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
                        'Return value of \'beforeSave\' must be in the form of type: {value: unknown, metadata: unknown}. Something else was returned'
                    }
                </Alert>
            )}

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onInternalSubmit)}>
                    <Loading isLoading={isLoading} />
                    {!isLoading &&
                        inputs(
                            <Group justify="end">
                                <Button loaderProps={{ size: 14 }} loading={isSaving} type="submit">
                                    {mode && 'Update'}
                                    {!mode && 'Create'}
                                </Button>
                            </Group>,
                            {
                                setValue: setValue,
                                getValues: getValues,
                                setFocus: setFocus,
                                setError: setError,
                                reset: reset,
                                resetField: resetField,
                                unregister: unregister,
                                watch: watch,
                                trigger: trigger,
                                getFieldState: getFieldState,
                                defaultValues: getValues(),
                            },
                        )}
                </form>
            </FormProvider>
        </div>
    );
}

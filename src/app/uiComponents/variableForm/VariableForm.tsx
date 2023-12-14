import Loading from '@app/components/Loading';
import { Initialize } from '@app/initialize';
import useNotification from '@app/systems/notifications/useNotification';
import { getOptions } from '@app/systems/stores/options';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import useAppendToList from '@app/uiComponents/listForm/helpers/useAppendToList';
import useResolveBindings from '@app/uiComponents/listForm/helpers/useResolveBindings';
import useUpdateListItem from '@app/uiComponents/listForm/helpers/useUpdateListItem';
import valueMetadataValidator from '@app/uiComponents/listForm/helpers/valueMetadataValidator';
import { createVariable } from '@lib/api/declarations/variables/createVariable';
import { declarations } from '@lib/http/axios';
import useHttpMutation from '@lib/http/useHttpMutation';
import StructureStorage from '@lib/storage/structureStorage';
import { Alert, Button, Group } from '@mantine/core';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import type { AfterSaveFn, BeforeSaveFn, Bindings } from '@app/uiComponents/types/forms';
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
interface Props<T extends FieldValues> {
    variableName: string;
    bindings: Bindings<T>;
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
    afterSave?: AfterSaveFn;
    form?: HTMLAttributes<HTMLFormElement>;
}
export default function VariableForm<T extends FieldValues>({
    variableName,
    formProps,
    bindings,
    inputs,
    beforeSave,
    afterSave,
    mode,
}: Props<T>) {
    const updateListItem = useUpdateListItem(Boolean(mode));

    const methods = useForm(formProps);
    const { success: successNotification, error: errorNotification } = useNotification();

    const [beforeSaveError, setBeforeSaveError] = useState(false);

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const appendToList = useAppendToList(listName);
    const resolveBindings = useResolveBindings();
    const useStructureOptionsStore = getOptions(variableName);
    const [isSaving, setIsSaving] = useState(false);
    const { error: notificationError } = useNotification();
    const { mutate } = useHttpMutation(
        declarations(),
        'put',
        `/list/${Initialize.ProjectID()}/${Initialize.Locale()}`,
        {
            onSuccess() {
                successNotification(
                    `Variable with name ${variableName} created.`,
                    `Variable '${variableName}' has been successfully created. This message will only appear once.`,
                );

                StructureStorage.instance.addList(variableName);
            },
            onError() {
                errorNotification(
                    'Something wrong happened.',
                    'We are working to resolve this problem. Please, try again later.',
                );
            },
        },
        {
            'X-CREATIF-API-KEY': Initialize.ApiKey(),
            'X-CREATIF-PROJECT-ID': Initialize.ProjectID(),
        },
    );

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

    useEffect(() => {
        if (!StructureStorage.instance.hasList(variableName)) {
            mutate({
                name: variableName,
            });
        }
    }, []);

    const onInternalSubmit = useCallback((value: T, e: BaseSyntheticEvent | undefined) => {
        if (!value) {
            notificationError(
                'No data submitted.',
                <span>
                    <strong>undefined</strong> has been submitted which means there are no values to save. Have you
                    added some fields to your form?
                </span>,
            );
            return;
        }

        const binding = resolveBindings(value, bindings);
        if (!binding) return;
        const { name, groups, behaviour } = binding;

        setIsSaving(true);

        Promise.resolve(beforeSave?.(value, e)).then((result) => {
            if (!valueMetadataValidator(result)) {
                setBeforeSaveError(true);
                setIsSaving(false);
                return;
            }

            if (!mode && result) {
                createVariable({
                    name: name,
                    behaviour: behaviour,
                    groups: groups,
                    metadata: result.metadata,
                    value: result.value,
                }).then(() => {
                    queryClient.invalidateQueries(variableName);
                    afterSave?.(result, e);
                    setIsSaving(false);
                    navigate(useStructureOptionsStore.getState().paths.listing);
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
                        "Return value of 'beforeSave' must be in the form of type: value: unknown, metadata: unknown}. Something else was returned"
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

import Loading from '@app/components/Loading';
import useNotification from '@app/systems/notifications/useNotification';
import { getOptions } from '@app/systems/stores/options';
import useUpdateList from '@app/systems/updateList/useUpdateList';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import useAppendToList from '@app/uiComponents/listForm/helpers/useAppendToList';
import useResolveBindings from '@app/uiComponents/listForm/helpers/useResolveBindings';
import useUpdateListItem from '@app/uiComponents/listForm/helpers/useUpdateListItem';
import valueMetadataValidator from '@app/uiComponents/listForm/helpers/valueMetadataValidator';
import useCreateList from '@app/uiComponents/listForm/mutations/useCreateList';
import StructureStorage from '@lib/storage/structureStorage';
import { Alert, Button, Group } from '@mantine/core';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
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
interface Props<T extends FieldValues> {
    listName: string;
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
export default function ListForm<T extends FieldValues>({
    listName,
    formProps,
    bindings,
    inputs,
    beforeSave,
    afterSave,
    mode,
}: Props<T>) {
    const defaultListUpdate = useUpdateList<T>(Boolean(mode));
    if (mode === 'update' && defaultListUpdate) {
        formProps.defaultValues = defaultListUpdate;
    }

    const updateListItem = useUpdateListItem(Boolean(mode));

    const methods = useForm(formProps);
    const { success: successNotification, error: errorNotification } = useNotification();

    const [beforeSaveError, setBeforeSaveError] = useState(false);

    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const appendToList = useAppendToList(listName);
    const resolveBindings = useResolveBindings();
    const useStructureOptionsStore = getOptions(listName);
    const [isSaving, setIsSaving] = useState(false);
    const { error: notificationError } = useNotification();
    const { mutate } = useCreateList(listName);

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
        if (!StructureStorage.instance.hasList(listName)) {
            mutate({
                name: listName,
                projectId: Initialize.ProjectID(),
                locale: Initialize.Locale(),
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
                appendToList(name, behaviour, groups, result).then((appendResult) => {
                    if (appendResult) {
                        queryClient.invalidateQueries(listName);
                        afterSave?.(result, e);
                        setIsSaving(false);
                        navigate(useStructureOptionsStore.getState().paths.listing);
                    }
                });
            }

            if (mode && result && updateListItem) {
                updateListItem(name, result.value, result.metadata, groups, behaviour).then((updateResult) => {
                    if (updateResult) {
                        successNotification('Item updated', `Item '${name}' has been updated.`);
                        setIsSaving(false);
                        queryClient.invalidateQueries(listName);
                        queryClient.invalidateQueries(`get_list_${listName}_${updateResult.id}`);
                        afterSave?.(result, e);
                        navigate(useStructureOptionsStore.getState().paths.listing);

                        return;
                    }

                    setIsSaving(false);
                    errorNotification(
                        'Something went wrong',
                        `Item '${name}' could not be updated. Please, try again later.`,
                    );
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

import Loading from '@app/components/Loading';
import useNotification from '@app/systems/notifications/useNotification';
import { getOptions } from '@app/systems/stores/options';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import useResolveBindings from '@app/uiComponents/shared/hooks/useResolveBindings';
import valueMetadataValidator from '@app/uiComponents/listForm/helpers/valueMetadataValidator';
import { Alert } from '@mantine/core';
import React, { useCallback, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import UIError from '@app/components/UIError';
import Form from '@app/uiComponents/shared/Form';
import useQueryListItem from '@app/uiComponents/lists/hooks/useQueryListItem';
import { wrappedBeforeSave } from '@app/uiComponents/util';
import { appendToList } from '@lib/api/declarations/lists/appendToList';
import type { InputLocaleProps } from '@app/uiComponents/inputs/InputLocale';
import type { InputGroupsProps } from '@app/uiComponents/inputs/InputGroups';
import { updateListItem } from '@lib/api/declarations/lists/updateListItem';
import { useQueryClient } from 'react-query';
import RuntimeErrorModal from '@app/uiComponents/shared/RuntimeErrorModal';
import type { UpdateListItemResult } from '@root/types/api/list';
import chooseAndDeleteBindings, { type IncomingValues } from '@app/uiComponents/shared/hooks/chooseAndDeleteBindings';
import { addToList } from '@lib/api/declarations/lists/addToList';
import { createInputReferenceStore } from '@app/systems/stores/inputReferencesStore';
import removeReferencesFromForm from '@app/uiComponents/shared/hooks/removeReferencesFromForm';

interface Props<T extends FieldValues> {
    listName: string;
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
    afterSave?: AfterSaveFn<unknown>;
    form?: HTMLAttributes<HTMLFormElement>;
}

export default function ListForm<T extends FieldValues, Value = unknown, Metadata = unknown>({
    listName,
    formProps,
    bindings,
    inputs,
    beforeSave,
    afterSave,
    mode,
}: Props<T, Value, Metadata>) {
    const { store: useStructureOptionsStore, error: runtimeError } = getOptions(listName, 'list');

    const { structureId, itemId } = useParams();

    const {
        isFetching,
        data,
        error: getError,
        invalidateQuery,
    } = useQueryListItem(structureId, itemId, Boolean(mode && structureId && useStructureOptionsStore));

    const { success: successNotification, error: errorNotification } = useNotification();
    const queryClient = useQueryClient();
    const [beforeSaveError, setBeforeSaveError] = useState(false);
    const navigate = useNavigate();
    const resolveBindings = useResolveBindings();
    const [isSaving, setIsSaving] = useState(false);
    const referenceStore = createInputReferenceStore();

    const [isVariableExistsError, setIsVariableExistsError] = useState(false);
    const [isGenericUpdateError, setIsGenericUpdateError] = useState(false);
    const [isVariableReadonly, setIsVariableReadonly] = useState(false);

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
        const { name, groups, behaviour, locale } = binding;

        wrappedBeforeSave(value, e, beforeSave).then((result) => {
            if (!valueMetadataValidator(result)) {
                setBeforeSaveError(true);
                return;
            }

            setIsVariableExistsError(false);
            setIsGenericUpdateError(false);
            setIsVariableReadonly(false);
            setIsSaving(true);

            if (!mode && result) {
                const { chosenLocale, chosenBehaviour, chosenGroups } = chooseAndDeleteBindings(
                    result.value as IncomingValues,
                    locale,
                    behaviour,
                    groups,
                );

                addToList({
                    name: listName,
                    projectId: Initialize.ProjectID(),
                    variable: {
                        name: name,
                        behaviour: chosenBehaviour,
                        value: result.value,
                        metadata: result.metadata,
                        groups: chosenGroups,
                        locale: chosenLocale,
                    },
                }).then(({ result: response, error }) => {
                    setIsSaving(false);

                    if (error && error.error.data['exists']) {
                        setIsVariableExistsError(true);
                        return;
                    } else if (error) {
                        setIsGenericUpdateError(true);
                        return;
                    }

                    if (response && useStructureOptionsStore) {
                        successNotification(
                            'List item created',
                            `List item with name '${name}' and locale '${chosenLocale}' has been created.`,
                        );

                        queryClient.invalidateQueries(listName);
                        afterSave?.(response, e);
                        setIsSaving(false);
                        navigate(useStructureOptionsStore.getState().paths.listing);
                    }
                });
            }

            if (mode && result && structureId && itemId) {
                const { chosenLocale, chosenBehaviour, chosenGroups } = chooseAndDeleteBindings(
                    result.value as IncomingValues,
                    locale,
                    behaviour,
                    groups,
                );

                updateListItem({
                    fields: ['name', 'behaviour', 'value', 'metadata', 'groups', 'locale'],
                    name: structureId,
                    projectId: Initialize.ProjectID(),
                    itemId: itemId,
                    values: {
                        name: name,
                        value: result.value,
                        metadata: result.metadata,
                        groups: chosenGroups,
                        behaviour: chosenBehaviour,
                        locale: chosenLocale,
                    },
                }).then(({ result: response, error }) => {
                    setIsSaving(false);

                    if (error && error.error.data['behaviourReadonly']) {
                        setIsVariableReadonly(true);
                        return;
                    } else if (error) {
                        setIsGenericUpdateError(true);
                        return;
                    }

                    if (response && useStructureOptionsStore) {
                        successNotification(
                            'List item updated',
                            `List item with item name '${name}' has been updated.`,
                        );

                        invalidateQuery();
                        queryClient.invalidateQueries(listName);
                        afterSave?.(response as UpdateListItemResult<Value, Metadata>, e);
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
                    structureType={'list'}
                    structureId={listName}
                    formProps={formProps}
                    inputs={inputs}
                    onSubmit={onInternalSubmit}
                    isSaving={isSaving}
                    mode={mode}
                    referenceStore={referenceStore}
                    currentData={data?.result}
                />
            )}

            <RuntimeErrorModal open={Boolean(runtimeError)} error={runtimeError} />
        </div>
    );
}

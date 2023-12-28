import Loading from '@app/components/Loading';
import useNotification from '@app/systems/notifications/useNotification';
import { getOptions } from '@app/systems/stores/options';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import useResolveBindings from '@app/uiComponents/listForm/helpers/useResolveBindings';
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
import type { Behaviour } from '@root/types/api/shared';
import type { CreatedVariable } from '@root/types/api/variable';
import type { InputLocaleProps } from '@app/uiComponents/inputs/InputLocale';
import type { InputGroupsProps } from '@app/uiComponents/inputs/InputGroups';
import { updateListItem } from '@lib/api/declarations/lists/updateListItem';
import { useQueryClient } from 'react-query';
import RuntimeErrorModal from '@app/uiComponents/shared/RuntimeErrorModal';

interface Props<T extends FieldValues, Value, Metadata> {
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

function chooseBehaviour(field: Behaviour, binding: Behaviour | undefined): Behaviour {
    if (binding) return binding;
    if (field) return field;
    return 'modifiable';
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
    const { store: useStructureOptionsStore, error: runtimeError } = getOptions(listName);

    const { structureId, itemId } = useParams();
    const {
        isFetching,
        data,
        error: getError,
        invalidateQueries,
    } = useQueryListItem(structureId, itemId, Boolean(mode && structureId && useStructureOptionsStore));

    const { success: successNotification, error: errorNotification } = useNotification();
    const queryClient = useQueryClient();
    const [beforeSaveError, setBeforeSaveError] = useState(false);
    const navigate = useNavigate();
    const resolveBindings = useResolveBindings();
    const [isSaving, setIsSaving] = useState(false);

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

            setIsSaving(true);
            if (!mode && result) {
                type localeType = { locale: string };
                type groupsType = { groups: string[] };
                type behaviourType = { behaviour: Behaviour };
                const chosenLocale = chooseLocale((result.value as localeType).locale, locale);
                if (Object.hasOwn(result.value as object, 'locale')) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    delete (result.value as localeType).locale;
                }

                const chosenGroups = chooseGroups(
                    (result.value as groupsType).groups || ['default'],
                    groups || ['default'],
                );
                if (Object.hasOwn(result.value as object, 'groups')) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    delete (result.value as groupsType).groups;
                }

                const chosenBehaviour = chooseBehaviour((result.value as behaviourType).behaviour, behaviour);
                if (Object.hasOwn(result.value as object, 'behaviour')) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    delete (result.value as behaviourType).behaviour;
                }

                appendToList({
                    name: listName,
                    projectId: Initialize.ProjectID(),
                    variables: [
                        {
                            name: name,
                            behaviour: chosenBehaviour,
                            value: result.value,
                            metadata: result.metadata,
                            groups: chosenGroups,
                            locale: chosenLocale,
                        },
                    ],
                }).then(({ result: response, error }) => {
                    setIsSaving(false);

                    if (error && error.error.data['exists']) {
                        errorNotification('List item exists', 'List item with this name and locale already exists');
                        return;
                    } else if (error) {
                        errorNotification(
                            'Something went wrong',
                            'Variable could not be updated. Please, try again later',
                        );
                        return;
                    }

                    if (response && useStructureOptionsStore) {
                        successNotification(
                            'List item created',
                            `List item with name '${response.name}' and locale '${chosenLocale}' has been created.`,
                        );

                        invalidateQueries();
                        afterSave?.(response, e);
                        setIsSaving(false);
                        queryClient.invalidateQueries(listName);
                        navigate(useStructureOptionsStore.getState().paths.listing);
                    }
                });
            }

            if (mode && result && structureId && itemId) {
                type localeType = { locale: string };
                type groupsType = { groups: string[] };
                type behaviourType = { behaviour: Behaviour };
                const chosenLocale = chooseLocale((result.value as localeType).locale, locale);
                if (Object.hasOwn(result.value as object, 'locale')) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    delete (result.value as localeType).locale;
                }

                const chosenGroups = chooseGroups(
                    (result.value as groupsType).groups || ['default'],
                    groups || ['default'],
                );
                if (Object.hasOwn(result.value as object, 'groups')) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    delete (result.value as groupsType).groups;
                }

                const chosenBehaviour = chooseBehaviour((result.value as behaviourType).behaviour, behaviour);
                if (Object.hasOwn(result.value as object, 'behaviour')) {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    delete (result.value as behaviourType).behaviour;
                }
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

                    if (error) {
                        errorNotification(
                            'Something went wrong',
                            'Variable could not be updated. Please, try again later',
                        );
                        return;
                    }

                    if (response && useStructureOptionsStore) {
                        successNotification(
                            'List item updated',
                            `List item with item name '${name}' has been updated.`,
                        );

                        queryClient.invalidateQueries(listName);
                        afterSave?.(result, e);
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

            {getError && <UIError title="Not found">{'This item could not be found.'}</UIError>}

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
                    currentData={data?.result}
                />
            )}

            <RuntimeErrorModal open={Boolean(runtimeError)} error={runtimeError} />
        </div>
    );
}

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
import { wrappedBeforeSave } from '@app/uiComponents/util';
import type { Behaviour } from '@root/types/api/shared';
import type { CreatedVariable } from '@root/types/api/variable';
import type { InputLocaleProps } from '@app/uiComponents/inputs/InputLocale';
import type { InputGroupsProps } from '@app/uiComponents/inputs/InputGroups';
import { useQueryClient } from 'react-query';
import RuntimeErrorModal from '@app/uiComponents/shared/RuntimeErrorModal';
import useQueryMapVariable from '@app/uiComponents/maps/hooks/useQueryMapVariable';
import addToMap from '@lib/api/declarations/maps/addToMap';
import { updateMapVariable } from '@lib/api/declarations/maps/updateMapVariable';

interface Props<T extends FieldValues, Value, Metadata> {
    mapName: string;
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

export default function MapsForm<T extends FieldValues, Value = unknown, Metadata = unknown>({
    mapName,
    formProps,
    bindings,
    inputs,
    beforeSave,
    afterSave,
    mode,
}: Props<T, Value, Metadata>) {
    const { store: useStructureOptionsStore, error: runtimeError } = getOptions(mapName);

    const { structureId, itemId } = useParams();

    const {
        isFetching,
        data,
        error: getError,
        invalidateQuery,
    } = useQueryMapVariable(structureId, itemId, Boolean(mode && structureId && useStructureOptionsStore));

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
                console.log('create');
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

                addToMap({
                    name: mapName,
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
                        errorNotification('Map item exists', 'Map item with this name and locale already exists');
                        return;
                    } else if (error) {
                        errorNotification(
                            'Something went wrong',
                            'Variable could not be updated. Please, try again later',
                        );
                        return;
                    }

                    if (useStructureOptionsStore) {
                        successNotification(
                            'Map item created',
                            `Map item with name '${name}' and locale '${chosenLocale}' has been created.`,
                        );

                        queryClient.invalidateQueries(mapName);
                        afterSave?.(response, e);
                        setIsSaving(false);
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

                updateMapVariable({
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

                    if (error && error.error && error.error.data['exists']) {
                        errorNotification('Map item exists', `Map item with name '${name}' already exists.`);
                        return;
                    } else if (error) {
                        errorNotification(
                            'Something went wrong',
                            'Variable could not be updated. Please, try again later',
                        );
                        return;
                    }

                    if (response && useStructureOptionsStore) {
                        successNotification('Map item updated', `Map item with item name '${name}' has been updated.`);

                        queryClient.invalidateQueries(mapName);
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
                        "Return value of 'beforeSave' must be in the form of type: {value: unknown, metadata: unknown}. Something else was returned"
                    }
                </Alert>
            )}

            {getError && <UIError title="Not found">{'This item could not be found.'}</UIError>}

            <Loading isLoading={isFetching} />

            {!isFetching && !getError && (
                <Form
                    structureType={'map'}
                    structureId={mapName}
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

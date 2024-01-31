import Loading from '@app/components/Loading';
import useNotification from '@app/systems/notifications/useNotification';
import { getOptions } from '@app/systems/stores/options';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import useResolveBindings from '@app/uiComponents/shared/hooks/useResolveBindings';
import valueMetadataValidator from '@app/uiComponents/listForm/helpers/valueMetadataValidator';
import { Alert } from '@mantine/core';
import React, { useCallback, useMemo, useState } from 'react';
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
import type { ReferenceInputProps } from '@app/uiComponents/shared/Form';
import { wrappedBeforeSave } from '@app/uiComponents/util';
import type { CreatedVariable } from '@root/types/api/variable';
import type { InputLocaleProps } from '@app/uiComponents/inputs/InputLocale';
import type { InputGroupsProps } from '@app/uiComponents/inputs/InputGroups';
import { useQueryClient } from 'react-query';
import RuntimeErrorModal from '@app/uiComponents/shared/RuntimeErrorModal';
import useQueryMapVariable from '@app/uiComponents/maps/hooks/useQueryMapVariable';
import addToMap from '@lib/api/declarations/maps/addToMap';
import { updateMapVariable } from '@lib/api/declarations/maps/updateMapVariable';
import chooseAndDeleteBindings, { type IncomingValues } from '@app/uiComponents/shared/hooks/chooseAndDeleteBindings';
import removeReferencesFromForm from '@app/uiComponents/shared/hooks/removeReferencesFromForm';
import type { Reference, UpdateMapVariableReferenceBlueprint } from '@root/types/api/map';
import { createInputReferenceStore } from '@app/systems/stores/inputReferencesStore';

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
            inputReference: (props: ReferenceInputProps) => React.ReactNode;
        },
    ) => React.ReactNode;
    beforeSave?: BeforeSaveFn<T>;
    afterSave?: AfterSaveFn<CreatedVariable<Value, Metadata>>;
    form?: HTMLAttributes<HTMLFormElement>;
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
    const { store: useStructureOptionsStore, error: runtimeError } = getOptions(mapName, 'map');
    const referenceStore = useMemo(() => createInputReferenceStore(), []);

    const { structureId, itemId } = useParams();

    const {
        isFetching,
        data,
        error: getError,
    } = useQueryMapVariable(structureId, itemId, Boolean(mode && structureId && useStructureOptionsStore));

    const { success: successNotification, error: errorNotification } = useNotification();
    const queryClient = useQueryClient();
    const [beforeSaveError, setBeforeSaveError] = useState(false);
    const navigate = useNavigate();
    const resolveBindings = useResolveBindings();
    const [isSaving, setIsSaving] = useState(false);

    const [isVariableExistsError, setIsVariableExistsError] = useState(false);
    const [isGenericUpdateError, setIsGenericUpdateError] = useState(false);
    const [isVariableReadonly, setIsVariableReadonly] = useState(false);
    const [isNotFoundError, setIsNotFoundError] = useState(false);

    const onInternalSubmit = useCallback(
        (value: T, e: BaseSyntheticEvent | undefined) => {
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

                    removeReferencesFromForm(result.value as { [key: string]: unknown }, referenceStore);

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
                        references: referenceStore.getState().references.map((item) => ({
                            structureName: item.structureName,
                            structureType: 'map',
                            name: item.name,
                            variableId: item.variableId,
                        })) as Reference[],
                    }).then(({ result: response, error }) => {
                        setIsSaving(false);

                        if (error && error.error.data['exists']) {
                            setIsVariableExistsError(true);
                            errorNotification('Map item exists', 'Map item with this name and locale already exists');
                            return;
                        } else if (error) {
                            setIsGenericUpdateError(true);
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
                    const { chosenLocale, chosenBehaviour, chosenGroups } = chooseAndDeleteBindings(
                        result.value as IncomingValues,
                        locale,
                        behaviour,
                        groups,
                    );

                    removeReferencesFromForm(result.value as { [key: string]: unknown }, referenceStore);

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
                        references: referenceStore.getState().references.map((item) => ({
                            structureName: item.structureName,
                            name: item.name,
                            structureType: 'map',
                            variableId: item.variableId,
                        })) as UpdateMapVariableReferenceBlueprint[],
                    }).then(({ result: response, error }) => {
                        setIsSaving(false);

                        if (error && error.error && error.error.data['exists']) {
                            setIsVariableExistsError(true);
                            return;
                        } else if (error && error.error && error.error.data['behaviourReadonly']) {
                            setIsVariableReadonly(true);
                            return;
                        } else if (error) {
                            setIsGenericUpdateError(true);
                            return;
                        }

                        if (response && useStructureOptionsStore) {
                            successNotification(
                                'Map item updated',
                                `Map item with item name '${name}' has been updated.`,
                            );

                            queryClient.invalidateQueries(mapName);
                            afterSave?.(result, e);
                            navigate(useStructureOptionsStore.getState().paths.listing);
                        }
                    });
                }
            });
        },
        [referenceStore],
    );

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

            {isNotFoundError && (
                <div
                    style={{
                        marginBottom: '1rem',
                    }}>
                    <UIError title="Structure not found">
                        Structure with {mapName} not found. Are you sure that you haven&apos;t misspelled the name?
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
                    structureType={'map'}
                    structureId={mapName}
                    formProps={formProps}
                    inputs={inputs}
                    referenceStore={referenceStore}
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

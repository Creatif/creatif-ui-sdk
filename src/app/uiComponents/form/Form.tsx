import Loading from '@app/components/Loading';
import useNotification from '@app/systems/notifications/useNotification';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import useResolveBindings from '@app/uiComponents/shared/hooks/useResolveBindings';
import valueMetadataValidator from '@app/uiComponents/form/helpers/valueMetadataValidator';
import { Alert } from '@mantine/core';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
import BaseForm, { type ReferenceInputProps } from '@app/uiComponents/shared/BaseForm';
import useQueryVariable from '@app/uiComponents/lists/hooks/useQueryVariable';
import { wrappedBeforeSave } from '@app/uiComponents/util';
import type { InputLocaleProps } from '@app/uiComponents/inputs/InputLocale';
import type { InputGroupsProps } from '@app/uiComponents/inputs/InputGroups';
import { useQueryClient } from 'react-query';
import type { UpdateListItemResult } from '@root/types/api/list';
import chooseAndDeleteBindings, { type IncomingValues } from '@app/uiComponents/shared/hooks/chooseAndDeleteBindings';
import { createInputReferenceStore } from '@app/systems/stores/inputReferencesStore';
import type { CreatedVariable } from '@root/types/api/variable';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import removeReferencesFromForm from '@app/uiComponents/shared/hooks/removeReferencesFromForm';
import type { Reference, UpdateMapVariableReferenceBlueprint } from '@root/types/api/map';
import { Runtime } from '@app/runtime/Runtime';
import { Error } from '@app/uiComponents/shared/Error';
import { useHttpActions } from '@app/uiComponents/form/hooks/useHttpActions';
import type { StructureType } from '@root/types/shell/shell';
import { createSpecialFields } from '@app/systems/stores/specialFields';
import RuntimeErrorModal from '@app/uiComponents/shared/RuntimeErrorModal';

interface Props<T extends FieldValues, Value, Metadata> {
    bindings?: Bindings<T>;
    formProps: UseFormProps<T>;
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

export default function Form<T extends FieldValues, Value = unknown, Metadata = unknown>({
    formProps,
    bindings,
    inputs,
    beforeSave,
    afterSave,
}: Props<T, Value, Metadata>) {
    const useSpecialFields = createSpecialFields();
    const duplicateFields = useSpecialFields.getState().getDuplicateFields();

    const store = getProjectMetadataStore();
    const { structureId, itemId, structureType } = useParams();
    const structureItem = store.getState().getStructureItemByID(structureId || '');
    const { add, update } = useHttpActions(structureType as StructureType);
    const isUpdate = new RegExp('/update/').test(location.pathname);

    const isCreateRoute = location.pathname.includes('/create/');
    const isUpdateRoute = location.pathname.includes('/update/');

    const referenceStore = useMemo(() => createInputReferenceStore(), []);

    const { success: successNotification, error: errorNotification } = useNotification();
    const queryClient = useQueryClient();
    const [beforeSaveError, setBeforeSaveError] = useState(false);
    const navigate = useNavigate();
    const resolveBindings = useResolveBindings();
    const [isSaving, setIsSaving] = useState(false);

    const [isVariableExistsError, setIsVariableExistsError] = useState(false);
    const [isGenericUpdateError, setIsGenericUpdateError] = useState(false);
    const [isVariableReadonly, setIsVariableReadonly] = useState(false);
    const [isNotFoundError, setIsNotFoundError] = useState(!(add && update));

    const {
        isFetching,
        data,
        error: getError,
        invalidateQuery,
    } = useQueryVariable(
        structureId,
        itemId,
        structureType as StructureType,
        Boolean(isUpdate && structureItem && itemId),
    );

    useEffect(() => {
        if (isCreateRoute && !structureItem) {
            setIsNotFoundError(true);
        }

        if (isUpdateRoute && !structureItem && !itemId) {
            setIsNotFoundError(true);
        }
    }, [structureItem, itemId]);

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
            setIsNotFoundError(false);

            setIsSaving(true);
            if (!isUpdate && result && structureItem) {
                const { chosenLocale, chosenBehaviour, chosenGroups } = chooseAndDeleteBindings(
                    result.value as IncomingValues,
                    locale,
                    behaviour,
                    groups,
                );

                removeReferencesFromForm(result.value as { [key: string]: unknown }, referenceStore);

                add?.()({
                    name: structureItem.id,
                    projectId: Runtime.instance.credentials.projectId,
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
                        structureType: item.structureType,
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

                    if (response && structureItem) {
                        successNotification(
                            'List item created',
                            `List item with name '${name}' and locale '${chosenLocale}' has been created.`,
                        );

                        queryClient.invalidateQueries(structureItem.id);
                        afterSave?.(response, e);
                        setIsSaving(false);
                        if (structureItem) {
                            navigate(`${structureItem.navigationListPath}/${structureId}`);
                        }
                    }
                });
            }

            if (isUpdate && result && structureItem && itemId) {
                const { chosenLocale, chosenBehaviour, chosenGroups } = chooseAndDeleteBindings(
                    result.value as IncomingValues,
                    locale,
                    behaviour,
                    groups,
                );
                
                const specialFields = useSpecialFields.getState().fieldsUsed;
                const isReferenceStoreLocked = referenceStore.getState().locked;
                removeReferencesFromForm(result.value as { [key: string]: unknown }, referenceStore);

                let fields = ['name', 'value', 'metadata'];
                if (!isReferenceStoreLocked) {
                    fields.push('references');
                }
                
                if (specialFields.length > 0) {
                    fields = [...fields, ...specialFields.map((item) => item.replace('creatif_', ''))];
                }

                update?.()({
                    fields: fields,
                    name: structureItem.id,
                    projectId: Runtime.instance.credentials.projectId,
                    itemId: itemId,
                    values: {
                        name: name,
                        value: result.value,
                        metadata: result.metadata,
                        groups: chosenGroups,
                        behaviour: chosenBehaviour,
                        locale: chosenLocale,
                    },
                    references: !isReferenceStoreLocked ? referenceStore.getState().references.map((item) => ({
                        structureName: item.structureName,
                        name: item.name,
                        structureType: item.structureType,
                        variableId: item.variableId,
                    })) as UpdateMapVariableReferenceBlueprint[] : [],
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

                    if (response && structureItem) {
                        successNotification(
                            'List item updated',
                            `List item with item name '${name}' has been updated.`,
                        );

                        invalidateQuery();
                        queryClient.invalidateQueries(structureItem.id);
                        afterSave?.(response as UpdateListItemResult<Value, Metadata>, e);
                        if (structureItem) {
                            navigate(`${structureItem.navigationListPath}/${structureId}`);
                        }
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

            <Error title="Not found" message="This item could not be found" show={Boolean(getError)} />
            <Error title="Item exists" message="Item with this name already exists" show={isVariableExistsError} />
            <Error
                title="Something went wrong"
                message="We cannot update this item at this moment. We are working to solve this issue. Please, try again later."
                show={isGenericUpdateError}
            />
            <Error title="Route not found" message="This route does not seem to exist." show={isNotFoundError} />
            <Error
                title="Item is readonly"
                message="This is a readonly item and can be updated only by the administrator."
                show={isVariableReadonly}
            />

            {Boolean(duplicateFields.length) && <RuntimeErrorModal open={Boolean(duplicateFields.length)} error={{
                message: 'Some fields are duplicated.'
            }} />}

            <Loading isLoading={isFetching} />

            {!isFetching && !getError && structureItem && structureType && (
                <>
                    <h1 className={contentContainerStyles.heading}>
                        {isUpdate ? 'Update' : 'Create new '} <span>{structureItem.name}</span>
                    </h1>
                    <BaseForm
                        useSpecialFields={useSpecialFields}
                        structureType={structureItem.structureType}
                        structureItem={structureItem}
                        formProps={formProps}
                        isUpdate={isUpdate}
                        inputs={inputs}
                        referenceStore={referenceStore}
                        onSubmit={onInternalSubmit}
                        isSaving={isSaving}
                        currentData={data?.result}
                    />
                </>
            )}
        </div>
    );
}

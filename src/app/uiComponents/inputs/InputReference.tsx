import React, { useCallback, useEffect, useState } from 'react';
import paginateList from '@lib/api/declarations/lists/paginateList';
import paginateMapVariables from '@lib/api/declarations/maps/paginateMapVariables';
import paginateVariables from '@lib/api/declarations/variables/paginateVariables';
import type { StructureType } from '@root/types/shell/shell';
import { Controller, useFormContext } from 'react-hook-form';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { AsyncAutocompleteSelectOption } from '@app/uiComponents/inputs/fields/AsyncAutocompleteSelect';
import AsyncAutocompleteSelect from '@app/uiComponents/inputs/fields/AsyncAutocompleteSelect';
import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import type { RegisterOptions } from 'react-hook-form/dist/types/validator';
import type { ReferencesStore } from '@app/systems/stores/inputReferencesStore';
import RuntimeErrorModal from '@app/uiComponents/shared/RuntimeErrorModal';
import { Runtime } from '@app/runtime/Runtime';
import type { StructureItem } from '@app/systems/stores/projectMetadataStore';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';

interface Props {
    name: string;
    structureName: string;
    parentStructureItem: StructureItem;
    structureType: StructureType;
    placeholder: string;
    label?: string;
    validation?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    store: UseBoundStore<StoreApi<ReferencesStore>>;
}

async function searchAndCreateOptions(
    structureId: string,
    structureType: StructureType,
    search: string,
): Promise<AsyncAutocompleteSelectOption[]> {
    if (structureType === 'list') {
        const { result, error } = await paginateList({
            search: search,
            name: structureId,
            limit: 1000,
            page: 1,
            orderBy: 'created_at',
            projectId: Runtime.instance.credentials.projectId,
        });

        if (result) {
            return result.data.map((item) => ({
                label: item.name,
                value: item.id,
            }));
        }

        if (error) {
            throw error;
        }

        return [];
    }

    if (structureType === 'map') {
        const { result, error } = await paginateMapVariables({
            search: search,
            name: structureId,
            limit: 100,
            page: 1,
            projectId: Runtime.instance.credentials.projectId,
        });

        if (result) {
            return result.data.map((item) => ({
                label: item.name,
                value: item.id,
            }));
        }

        if (error) {
            throw error;
        }

        return [];
    }

    const { result, error } = await paginateVariables({
        search: search,
        name: structureId,
        limit: 100,
        page: 1,
        projectId: Runtime.instance.credentials.projectId,
    });

    if (result) {
        return result.data.map((item) => ({
            label: item.name,
            value: item.id,
        }));
    }

    if (error) {
        throw error;
    }

    return [];
}

export default function InputReference({
    parentStructureItem,
    structureName,
    structureType,
    placeholder,
    label,
    validation,
    name,
    store,
}: Props) {
    const { control, setValue: setFormValue } = useFormContext();
    const [selected, setSelected] = useState<AsyncAutocompleteSelectOption | undefined>();
    const internalStructureItem = getProjectMetadataStore().getState().getStructureItemByName(structureName);

    const [isEqualStructureNameError, setIsEqualStructureNameError] = useState(false);

    const hasReference = store((state) => state.has);
    const updateReference = store((state) => state.update);
    const addReference = store((state) => state.add);

    useEffect(() => {
        if (parentStructureItem.name === structureName) {
            setIsEqualStructureNameError(true);
        }
    }, [parentStructureItem, structureName]);

    useEffect(() => {
        if (selected) {
            const ref = {
                name: name,
                structureType: structureType,
                structureName: parentStructureItem.name,
                variableId: selected.value,
            };

            setFormValue(name, ref);

            if (hasReference(name)) {
                updateReference(ref);
                return;
            }

            addReference(ref);
        }
    }, [selected]);

    const searchFn = useCallback(
        async (searchValue: string) => {
            if (!internalStructureItem) return [];

            const result = await searchAndCreateOptions(internalStructureItem.id, structureType, searchValue);
            const existingReferences = store.getState().references;

            if (existingReferences.length) {
                for (const ref of existingReferences) {
                    const existingRef = result.find((item) => item.value === ref.structureName);

                    if (existingRef && !selected) {
                        setSelected(existingRef);
                        break;
                    }
                }
            }

            return result;
        },
        [selected, internalStructureItem],
    );

    return (
        <>
            {isEqualStructureNameError && (
                <RuntimeErrorModal
                    open={isEqualStructureNameError}
                    error={{
                        message: `You are trying to create a reference to itself which is not allowed. Structure '${structureName}' cannot reference itself in a form.`,
                    }}
                />
            )}

            {!internalStructureItem && (
                <RuntimeErrorModal
                    open={true}
                    error={{
                        message: `You are trying to create a reference on a structure ${structureName} but that structure does not exist.`,
                    }}
                />
            )}

            {!isEqualStructureNameError && (
                <Controller
                    control={control}
                    rules={validation}
                    render={({ field: { onChange } }) => (
                        <AsyncAutocompleteSelect
                            selected={selected}
                            error={useFirstError(name)}
                            onOptionSelected={(item) => {
                                if (item) {
                                    const ref = {
                                        name: name,
                                        structureType: structureType,
                                        structureName: structureName,
                                        variableId: item.value,
                                    };

                                    onChange(ref);

                                    if (hasReference(name)) {
                                        updateReference(ref);
                                        return;
                                    }

                                    addReference(ref);
                                }
                            }}
                            searchFn={searchFn}
                            label={label}
                            placeholder={placeholder}
                        />
                    )}
                    name={name}
                />
            )}
        </>
    );
}

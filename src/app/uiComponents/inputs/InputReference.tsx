import React, { useCallback, useEffect, useState } from 'react';
import paginateList from '@lib/api/declarations/lists/paginateList';
import paginateMap from '@lib/api/declarations/maps/paginateMap';
import paginateVariables from '@lib/api/declarations/variables/paginateVariables';
import type { StructureType } from '@root/types/shell/shell';
import { Initialize } from '@app/initialize';
import { Controller, useFormContext } from 'react-hook-form';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { AsyncAutocompleteSelectOption } from '@app/uiComponents/inputs/fields/AsyncAutocompleteSelect';
import AsyncAutocompleteSelect from '@app/uiComponents/inputs/fields/AsyncAutocompleteSelect';
import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import type { RegisterOptions } from 'react-hook-form/dist/types/validator';
import type { ReferencesStore } from '@app/systems/stores/inputReferencesStore';

/**
 *
 */

export interface ReferenceValue {
    name: string;
    structureName: string;
    structureType: StructureType;
    value: string;
}

interface Props {
    name: string;
    structureName: string;
    structureType: StructureType;
    placeholder: string;
    label?: string;
    validation?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    store: UseBoundStore<StoreApi<ReferencesStore>>;
}

async function searchAndCreateOptions(
    structureName: string,
    structureType: StructureType,
    search: string,
): Promise<AsyncAutocompleteSelectOption[]> {
    if (structureType === 'list') {
        const { result, error } = await paginateList({
            search: search,
            name: structureName,
            limit: 1000,
            page: 1,
            orderBy: 'created_at',
            projectId: Initialize.ProjectID(),
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
        const { result, error } = await paginateMap({
            search: search,
            name: structureName,
            limit: 100,
            page: 1,
            projectId: Initialize.ProjectID(),
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
        name: structureName,
        limit: 100,
        page: 1,
        projectId: Initialize.ProjectID(),
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

    const hasReference = store((state) => state.has);
    const updateReference = store((state) => state.update);
    const addReference = store((state) => state.add);

    useEffect(() => {
        if (selected) {
            setFormValue(name, {
                name: name,
                structureType: structureType,
                structureName: structureName,
                value: selected.value,
            });
        }
    }, [selected]);

    const searchFn = useCallback(
        async (searchValue: string) => {
            const result = await searchAndCreateOptions(structureName, structureType, searchValue);
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
        [selected],
    );

    return (
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
    );
}

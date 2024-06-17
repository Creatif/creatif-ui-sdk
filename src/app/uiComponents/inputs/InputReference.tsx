import React, { useEffect, useState } from 'react';
import type { StructureType } from '@root/types/shell/shell';
import { Controller, useFormContext } from 'react-hook-form';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { RegisterOptions } from 'react-hook-form/dist/types/validator';
import type { ReferencesStore, ReferenceStoreItem } from '@app/systems/stores/inputReferencesStore';
import RuntimeErrorModal from '@app/uiComponents/shared/RuntimeErrorModal';
import type { StructureItem } from '@app/systems/stores/projectMetadataStore';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import type { ReferenceSearchInputOption } from '@app/uiComponents/inputs/fields/ReferenceSearchInput';
import ReferenceSearchInput from '@app/uiComponents/inputs/fields/ReferenceSearchInput';
import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';

interface Props {
    name: string;
    structureName: string;
    parentStructureItem: StructureItem;
    structureType: StructureType;
    label?: string;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    store: UseBoundStore<StoreApi<ReferencesStore>>;
}
export function InputReference({
    parentStructureItem,
    structureName,
    structureType,
    label,
    options,
    name,
    store,
}: Props) {
    const { control, setValue: setFormValue } = useFormContext();
    const internalStructureItem = getProjectMetadataStore()
        .getState()
        .getStructureItemByName(structureName, structureType);
    const reference = store.getState().get(name);
    const [isEqualStructureNameError, setIsEqualStructureNameError] = useState(false);

    const hasReference = store((state) => state.has);
    const updateReference = store((state) => state.update);
    const addReference = store((state) => state.add);
    const unlock = store((state) => state.unlock);
    unlock();

    useEffect(() => {
        if (parentStructureItem.name === structureName) {
            setIsEqualStructureNameError(true);
        }
    }, [parentStructureItem, structureName]);

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
                        message: `You are trying to create a reference on a structure ${structureName} but that structure does not exist or the structure type is invalid.`,
                    }}
                />
            )}

            {!isEqualStructureNameError && internalStructureItem && (
                <Controller
                    control={control}
                    rules={options}
                    render={({ field: { onChange } }) => (
                        <ReferenceSearchInput
                            inputError={useFirstError(name)}
                            reference={reference}
                            referenceStructureItem={internalStructureItem}
                            onDefaultOptionLoaded={(selected: ReferenceSearchInputOption) => {
                                const value = JSON.parse(selected.value);
                                const ref = {
                                    name: name,
                                    structureType: value.structureType,
                                    structureName: structureName,
                                    variableId: value.id,
                                };

                                setFormValue(name, ref);

                                if (hasReference(name)) {
                                    updateReference(ref as ReferenceStoreItem);

                                    return;
                                }

                                addReference(ref as ReferenceStoreItem);
                            }}
                            onOptionSelected={(item) => {
                                if (item) {
                                    const value = JSON.parse(item.value);
                                    const ref = {
                                        name: name,
                                        structureType: value.structureType,
                                        structureName: structureName,
                                        variableId: value.id,
                                    };

                                    onChange(ref);

                                    if (hasReference(name)) {
                                        updateReference(ref as ReferenceStoreItem);
                                        return;
                                    }

                                    addReference(ref as ReferenceStoreItem);
                                    return;
                                }

                                onChange(undefined);
                            }}
                            label={label ? label : structureName}
                        />
                    )}
                    name={name}
                />
            )}
        </>
    );
}

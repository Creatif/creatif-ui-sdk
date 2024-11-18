import React, { memo, useEffect, useState } from 'react';
import type { StructureType } from '@root/types/shell/shell';
import { Controller, useFormContext } from 'react-hook-form';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { RegisterOptions } from 'react-hook-form/dist/types/validator';
import RuntimeErrorModal from '@app/uiComponents/shared/RuntimeErrorModal';
import type { StructureItem } from '@app/systems/stores/projectMetadataStore';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import type { ReferenceSearchInputOption } from '@app/uiComponents/inputs/fields/ReferenceSearchInput';
import ReferenceSearchInput from '@app/uiComponents/inputs/fields/ReferenceSearchInput';
import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import type { ConnectionStore, ConnectionStoreItem } from '@app/systems/stores/inputConnectionStore';

interface Props {
    name: string;
    structureName: string;
    parentStructureItem: StructureItem;
    structureType: StructureType;
    label?: string;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    store: UseBoundStore<StoreApi<ConnectionStore>>;
}
function InputReferenceBlueprint({
    parentStructureItem,
    structureName,
    structureType,
    label,
    options,
    name,
    store,
}: Props) {
    const {
        control,
        formState: { errors },
    } = useFormContext();
    const internalStructureItem = getProjectMetadataStore()
        .getState()
        .getStructureItemByName(structureName, structureType);
    const connection = store.getState().get(name);
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
                            connection={connection}
                            referenceStructureItem={internalStructureItem}
                            onDefaultOptionLoaded={(selected: ReferenceSearchInputOption) => {
                                const value = JSON.parse(selected.value);
                                const ref = {
                                    name: value.name,
                                    structureType: value.structureType,
                                    variableId: value.id,
                                };

                                if (hasReference(name)) {
                                    updateReference(ref as ConnectionStoreItem);

                                    return;
                                }

                                addReference(ref as ConnectionStoreItem);
                            }}
                            onOptionSelected={(item: ReferenceSearchInputOption | undefined) => {
                                console.log('onOptionSelected: ', item);
                                if (item) {
                                    const value = JSON.parse(item.value);
                                    const ref = {
                                        name: name,
                                        structureType: value.structureType,
                                        variableId: value.id,
                                    };

                                    onChange(ref);

                                    if (hasReference(name)) {
                                        updateReference(ref as ConnectionStoreItem);
                                        return;
                                    }

                                    addReference(ref as ConnectionStoreItem);
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

export const InputReference = memo(InputReferenceBlueprint);

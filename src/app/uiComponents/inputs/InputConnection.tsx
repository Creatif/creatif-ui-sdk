import React, { useEffect } from 'react';
import type { StructureType } from '@root/types/shell/shell';
import { Controller, useFormContext } from 'react-hook-form';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { RegisterOptions } from 'react-hook-form/dist/types/validator';
import RuntimeErrorModal from '@app/uiComponents/shared/RuntimeErrorModal';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import type { ConnectionSearchInputOption } from '@app/uiComponents/inputs/fields/ConnectionSearchInput';
import ConnectionSearchInput from '@app/uiComponents/inputs/fields/ConnectionSearchInput';
import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import type { ConnectionStore } from '@app/systems/stores/inputConnectionStore';
import { useConnectionStore } from '@app/systems/stores/inputConnectionStore';

interface Props {
    name: string;
    structureName: string;
    structureType: StructureType;
    label?: string;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
    store: UseBoundStore<StoreApi<ConnectionStore>>;
}
export function InputConnection({ structureName, structureType, label, options, name }: Props) {
    const { control, setValue, getValues, unregister } = useFormContext();
    const internalStructureItem = getProjectMetadataStore()
        .getState()
        .getStructureItemByName(structureName, structureType);

    const internalVariable = getValues(name);

    let defaultValue: ConnectionSearchInputOption | undefined = undefined;

    if (internalVariable) {
        defaultValue = {
            label: internalVariable.value,
            value: JSON.stringify({
                id: internalVariable.variableId,
                structureType: internalVariable.structureType,
            }),
        };
    }

    useEffect(
        () => () => {
            unregister(name, {
                keepDirty: false,
                keepError: false,
                keepValue: false,
                keepTouched: false,
                keepIsValid: false,
                keepDefaultValue: false,
                keepDirtyValues: false,
                keepIsSubmitSuccessful: false,
            });
        },
        [],
    );

    return (
        <>
            {!internalStructureItem && (
                <RuntimeErrorModal
                    open={true}
                    error={{
                        message: `You are trying to create a reference on a structure ${structureName} but that structure does not exist or the structure type is invalid.`,
                    }}
                />
            )}

            {internalStructureItem && (
                <Controller
                    control={control}
                    rules={options}
                    render={({ field: { onChange } }) => (
                        <ConnectionSearchInput
                            inputError={useFirstError(name)}
                            defaultValue={defaultValue}
                            referenceStructureItem={internalStructureItem}
                            onOptionSelected={(item: ConnectionSearchInputOption | undefined) => {
                                if (item) {
                                    const value = JSON.parse(item.value);
                                    const ref = {
                                        name: name,
                                        structureType: value.structureType,
                                        variableId: value.id,
                                        creatif_special_variable: true,
                                    };

                                    onChange(ref);

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

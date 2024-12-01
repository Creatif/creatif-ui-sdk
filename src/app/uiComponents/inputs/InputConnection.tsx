import React, { useCallback, useEffect, useState } from 'react';
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
    const { control, getValues, unregister, setValue } = useFormContext();
    const internalStructureItem = getProjectMetadataStore()
        .getState()
        .getStructureItemByName(structureName, structureType);

    const [defaultValue, setDefaultValue] = useState<ConnectionSearchInputOption>({
        label: '',
        value: '{}',
    });

    useEffect(() => {
        const internalVariable = getValues(name);

        if (internalVariable) {
            const defaultRef = {
                label: internalVariable.value,
                value: JSON.stringify({
                    id: internalVariable.variableId,
                    structureType: internalVariable.structureType,
                }),
            };

            setDefaultValue(defaultRef);
            setValue(name, defaultRef);
            return;
        }
    }, []);

    useEffect(
        () => () => {
            unregister(name, {
                keepError: false,
                keepDirty: false,
                keepValue: false,
                keepTouched: false,
                keepDirtyValues: false,
                keepDefaultValue: false,
                keepIsValid: false,
                keepIsSubmitSuccessful: false,
            });
        },
        [name],
    );

    const onOptionSelectedCallback = useCallback(
        (item: ConnectionSearchInputOption | undefined) => {
            if (item) {
                const value = JSON.parse(item.value);
                const ref = {
                    path: name,
                    value: '',
                    structureType: value.structureType,
                    variableId: value.id,
                    creatif_special_variable: true,
                };

                return ref;
            }
        },
        [name],
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
                    name={name}
                    render={({ field: { onChange } }) => (
                        <ConnectionSearchInput
                            inputError={useFirstError(name)}
                            defaultValue={defaultValue}
                            referenceStructureItem={internalStructureItem}
                            onOptionSelected={(item: ConnectionSearchInputOption | undefined) => {
                                const ref = onOptionSelectedCallback(item);

                                onChange(ref);
                            }}
                            label={label ? label : structureName}
                        />
                    )}
                />
            )}
        </>
    );
}
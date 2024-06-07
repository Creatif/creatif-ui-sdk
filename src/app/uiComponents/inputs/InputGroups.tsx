import { useEffect, useState } from 'react';
import type { MultiSelectProps } from '@mantine/core';
import { MultiSelect } from '@mantine/core';
import useGetGroups from '@app/uiComponents/shared/hooks/useGetGroups';
import { Controller, type RegisterOptions, useFormContext } from 'react-hook-form';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { SpecialFieldsStore } from '@app/systems/stores/specialFields';
import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import { groupsField } from '@app/uiComponents/form/bindings/bindingResolver';
import type { Group } from '@root/types/api/groups';
export interface InputGroupsProps extends MultiSelectProps {
    store: UseBoundStore<StoreApi<SpecialFieldsStore>>;
    options?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}

function createOptions(groups: Group[]) {
    return groups.map((item) => ({
        value: item.id,
        label: item.name,
    }));
}

export function InputGroups({ options, store }: InputGroupsProps) {
    const { control, setValue: setFormValue, setError } = useFormContext();
    const [value, setValue] = useState<string[]>([]);
    const { isFetching, data: groups, error: groupsError } = useGetGroups();

    const name = groupsField;

    useEffect(() => {
        store.getState().addField(name);
        setFormValue(name, value);
    }, [value]);

    useEffect(() => {
        if (groups) {
            const currentGroups = store.getState().groups;
            const allGroups = groups.result;

            if (allGroups) {
                const filtered = allGroups.filter((allGroupsItem) =>
                    currentGroups.find((currentItem) => currentItem === allGroupsItem.name),
                );

                setValue(filtered.map((item) => item.id));
            }
        }
    }, [groups]);

    useEffect(() => {
        if (groupsError) {
            setError(name, {
                type: 'required',
                message: 'External groups could not be loaded. Please, try again later.',
            });
        }
    }, [groupsError]);

    return (
        <Controller
            control={control}
            name={name}
            rules={options}
            render={({ field: { onChange } }) => (
                <MultiSelect
                    description="If no groups are given, current groups will be removed."
                    label="Groups"
                    error={useFirstError('groups')}
                    disabled={isFetching}
                    placeholder="Choose your groups"
                    clearable={true}
                    value={value}
                    data={createOptions(groups?.result || [])}
                    onChange={(groups) => {
                        setFormValue(name, groups);
                        setValue(groups);
                        onChange(groups);
                    }}
                />
            )}
        />
    );
}

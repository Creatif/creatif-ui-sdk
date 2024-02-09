import { useEffect, useState } from 'react';
import type { MultiSelectProps } from '@mantine/core';
import { MultiSelect } from '@mantine/core';
import useGetGroups from '@app/uiComponents/shared/hooks/useGetGroups';
import { Controller, type RegisterOptions, useFormContext } from 'react-hook-form';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { SpecialFieldsStore } from '@app/systems/stores/specialFields';
import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
export interface InputGroupsProps extends MultiSelectProps {
    store: UseBoundStore<StoreApi<SpecialFieldsStore>>;
    validation?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}
// groups must be sorted
// selection must be clearable
// must be loadable
export function InputGroups({ validation, store }: InputGroupsProps) {
    const { control, setValue: setFormValue, setError } = useFormContext();
    const [value, setValue] = useState<string[]>(store.getState().groups || []);
    const { isFetching, data: groups, error: groupsError } = useGetGroups();

    useEffect(() => {
        setFormValue('groups', value);
    }, [value]);

    useEffect(() => {
        if (groupsError) {
            setError('groups', {
                type: 'required',
                message: "'External groups could not be loaded. Please, try again later.'",
            });
        }
    }, [groupsError]);

    return (
        <Controller
            control={control}
            name="groups"
            rules={validation}
            render={({ field: { onChange } }) => (
                <MultiSelect
                    label="Groups"
                    error={useFirstError('groups')}
                    disabled={isFetching}
                    placeholder="Choose your groups"
                    clearable={true}
                    value={value}
                    data={(groups && groups.result) || []}
                    onChange={(groups) => {
                        setValue(groups);
                        onChange(groups);
                    }}
                />
            )}
        />
    );
}

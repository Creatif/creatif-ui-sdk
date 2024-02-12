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
    const { control, setValue: setFormValue, setError, formState: {errors} } = useFormContext();
    const [value, setValue] = useState<string[]>(store.getState().groups || []);
    const { isFetching, data: groups, error: groupsError } = useGetGroups();
    const name = 'creatif_groups';

    useEffect(() => {
        store.getState().addField(name);
        setFormValue('groups', value);

        return () => store.getState().removeField(name);
    }, [value]);

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
            rules={validation}
            render={({ field: { onChange } }) => (
                <MultiSelect
                    description="If no groups are given, current groups will be removed."
                    label="Groups"
                    error={useFirstError('groups')}
                    disabled={isFetching}
                    placeholder="Choose your groups"
                    clearable={true}
                    value={value}
                    data={(groups && groups.result) || []}
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

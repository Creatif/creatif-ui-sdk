import { useEffect, useState } from 'react';
import type { MultiSelectProps } from '@mantine/core';
import useGetGroups from '@app/uiComponents/shared/hooks/useGetGroups';
import { Controller, type RegisterOptions, useFormContext } from 'react-hook-form';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { SpecialFieldsStore } from '@app/systems/stores/specialFields';
import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
import MultiSelectWithAdd from '@app/uiComponents/inputs/fields/MultiSelectWithAdd';
export interface InputGroupsProps extends MultiSelectProps {
    structureType: string;
    structureId: string;
    store: UseBoundStore<StoreApi<SpecialFieldsStore>>;
    validation?: Omit<RegisterOptions, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>;
}
// groups must be sorted
// selection must be clearable
// must be loadable
export function InputGroups({ structureType, structureId, validation, store }: InputGroupsProps) {
    const { control, setValue: setFormValue, setError } = useFormContext();

    const [value, setValue] = useState<string[]>(store.getState().groups);
    const [isQueryEnabled, setIsQueryEnabled] = useState(false);

    const { data: groups, error: groupsError, isFetching } = useGetGroups(structureType, structureId, isQueryEnabled);

    useEffect(() => {
        setFormValue('groups', value);
    }, [value]);

    useEffect(() => {
        if (groupsError) {
            setError('groups', {
                type: 'required',
                message: '\'External groups could not be loaded. Please, try again later.\'',
            });
        }
    }, [groupsError]);

    return (
        <Controller
            control={control}
            name="groups"
            rules={
                !validation
                    ? {
                          required: 'Groups field is required. At least the \'default\' group must be set.',
                          validate: (value: string[]) => {
                              if (value.length === 0)
                                  return 'Groups field is required. At least the \'default\' group must be set.';
                          },
                      }
                    : validation
            }
            render={({ field: { onChange } }) => (
                <MultiSelectWithAdd
                    isLoading={isFetching}
                    currentValues={value}
                    selectableValues={groups?.result || []}
                    label="Groups"
                    error={useFirstError('groups')}
                    onDropdownOpen={() => setIsQueryEnabled(true)}
                    onSearchChange={onChange}
                    onChange={setValue}
                />
            )}
        />
    );
}

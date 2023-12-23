import { useEffect, useState } from 'react';
import { CheckIcon, Combobox, Group, Loader, Pill, PillsInput, useCombobox } from '@mantine/core';
import type { MultiSelectProps } from '@mantine/core';
import useGetGroups from '@app/uiComponents/shared/hooks/useGetGroups';
import { Controller, type RegisterOptions, useFormContext } from 'react-hook-form';
import type { StoreApi, UseBoundStore } from 'zustand';
import type { SpecialFieldsStore } from '@app/systems/stores/specialFields';
import useFirstError from '@app/uiComponents/inputs/helpers/useFirstError';
function createOptions(groups: string[]) {
    return groups.map((item) => ({
        label: item,
        value: item,
    }));
}

function mergeValues(currentGroups: string[], currentValues: string[]) {
    return Array.from(new Set([...currentValues, ...currentGroups]));
}
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
    const [search, setSearch] = useState('');
    const [isQueryEnabled, setIsQueryEnabled] = useState(false);

    const { data: groups, error: groupsError, isFetching } = useGetGroups(structureType, structureId, isQueryEnabled);

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

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => {
            combobox.updateSelectedOptionIndex('active');
            setIsQueryEnabled(true);
        },
    });

    const exactOptionMatch = groups?.result && groups.result.some((item) => item === search);

    const handleValueSelect = (val: string) => {
        setSearch('');

        if (val === '$create') {
            setValue((current) => Array.from(new Set([...current, search])));
        } else {
            setValue((current) => {
                if (current.includes(val)) {
                    return current.filter((v) => v !== val);
                }

                return [...current, val];
            });
        }
    };

    const handleValueRemove = (val: string) => setValue((current) => current.filter((v) => v !== val));

    const values = value.map((item) => (
        <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
            {item}
        </Pill>
    ));

    const options = mergeValues(groups?.result || [], value)
        .filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()))
        .map((item) => (
            <Combobox.Option value={item} key={item} active={value.includes(item)}>
                <Group gap="sm">
                    {value.includes(item) ? <CheckIcon size={12} /> : null}
                    <span>{item}</span>
                </Group>
            </Combobox.Option>
        ));

    return (
        <Controller
            control={control}
            name="groups"
            rules={
                !validation
                    ? {
                          required: "Groups field is required. At least the 'default' group must be set.",
                          validate: (value: string[]) => {
                              if (value.length === 0)
                                  return "Groups field is required. At least the 'default' group must be set.";
                          },
                      }
                    : validation
            }
            render={({ field: { onChange } }) => (
                <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
                    <Combobox.DropdownTarget>
                        <PillsInput
                            rightSection={isFetching && <Loader size={16} />}
                            error={useFirstError('groups')}
                            onClick={() => combobox.openDropdown()}>
                            <Pill.Group>
                                {values}

                                <Combobox.EventsTarget>
                                    <PillsInput.Field
                                        onFocus={() => combobox.openDropdown()}
                                        onBlur={() => combobox.closeDropdown()}
                                        value={search}
                                        placeholder="Search values"
                                        onChange={(event) => {
                                            combobox.updateSelectedOptionIndex();
                                            setSearch(event.currentTarget.value);
                                            onChange(event.currentTarget.value);
                                        }}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Backspace' && search.length === 0) {
                                                event.preventDefault();
                                                handleValueRemove(value[value.length - 1]);
                                            }
                                        }}
                                    />
                                </Combobox.EventsTarget>
                            </Pill.Group>
                        </PillsInput>
                    </Combobox.DropdownTarget>

                    <Combobox.Dropdown>
                        <Combobox.Options>
                            {options}

                            {!exactOptionMatch && search.trim().length > 0 && (
                                <Combobox.Option value="$create">
                                    + Create <Pill color="blue">{search}</Pill>
                                </Combobox.Option>
                            )}

                            {options && exactOptionMatch && search.trim().length > 0 && options.length === 0 && (
                                <Combobox.Empty>Nothing found</Combobox.Empty>
                            )}
                        </Combobox.Options>
                    </Combobox.Dropdown>
                </Combobox>
            )}
        />
    );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/inputs/css/InputGroups.module.css';
import { CheckIcon, Combobox, Group, Loader, Pill, PillsInput, useCombobox } from '@mantine/core';
import { useEffect, useState } from 'react';

interface Props {
    isLoading: boolean;
    onDropdownOpen?: () => void;
    onChange?: (values: string[]) => void;
    onSearchChange?: (value: string) => void;
    error?: string | undefined;
    currentValues: string[];
    selectableValues: string[];
    label: string;
}

export default function MultiSelectWithAdd({
    onDropdownOpen,
    isLoading,
    onSearchChange,
    onChange,
    error,
    currentValues,
    selectableValues,
    label,
}: Props) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => {
            combobox.updateSelectedOptionIndex('active');
            onDropdownOpen?.();
        },
    });

    const [value, setValue] = useState<string[]>(currentValues);
    const [search, setSearch] = useState('');

    useEffect(() => {
        onChange?.(value);
    }, [value]);

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

    const renderedValues = value.map((item) => (
        <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
            {item}
        </Pill>
    ));

    const options = selectableValues
        .filter((item) => item.toLowerCase().includes(search.trim().toLowerCase()))
        .map((item) => (
            <Combobox.Option value={item} key={item} active={value.includes(item)}>
                <Group gap="sm">
                    {value.includes(item) ? <CheckIcon size={12} /> : null}
                    <span>{item}</span>
                </Group>
            </Combobox.Option>
        ));

    const exactOptionMatch = currentValues.some((item) => item === search);

    return (
        <div className={styles.root}>
            <label className={styles.label}>{label}</label>
            <Combobox
                position="bottom"
                middlewares={{ flip: false, shift: false }}
                store={combobox}
                onOptionSubmit={handleValueSelect}
                withinPortal={false}>
                <Combobox.DropdownTarget>
                    <PillsInput
                        rightSection={isLoading && <Loader size={16} />}
                        error={error}
                        onClick={() => combobox.openDropdown()}>
                        <Pill.Group>
                            {renderedValues}

                            <Combobox.EventsTarget>
                                <PillsInput.Field
                                    onFocus={() => combobox.openDropdown()}
                                    onBlur={() => combobox.closeDropdown()}
                                    value={search}
                                    placeholder="Search..."
                                    onChange={(event) => {
                                        combobox.updateSelectedOptionIndex();
                                        setSearch(event.currentTarget.value);
                                        onSearchChange?.(event.currentTarget.value);
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
                        {options.length === 0 && <Combobox.Empty>Type to create new groups</Combobox.Empty>}

                        {!exactOptionMatch && search.trim().length > 0 && (
                            <Combobox.Option value="$create">
                                + Create{' '}
                                <Pill onClick={() => combobox.closeDropdown()} color="blue">
                                    {search}
                                </Pill>
                            </Combobox.Option>
                        )}

                        {options && exactOptionMatch && search.trim().length > 0 && options.length === 0 && (
                            <Combobox.Empty>Nothing found</Combobox.Empty>
                        )}
                    </Combobox.Options>
                </Combobox.Dropdown>
            </Combobox>
        </div>
    );
}

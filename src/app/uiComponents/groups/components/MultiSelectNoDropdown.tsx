// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/inputs/css/InputGroups.module.css';
import { Combobox, Loader, Pill, PillsInput, useCombobox } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

interface Props {
    isLoading: boolean;
    error?: string | undefined;
    currentValues: string[];
    name: string;
    label: string;
    onDirty?: () => void;
}

export function MultiSelectNoDropdown({ isLoading, error, name, currentValues, label, onDirty }: Props) {
    const { control, setValue: setFormValue } = useFormContext();

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => {
            combobox.updateSelectedOptionIndex('active');
        },
    });

    const [value, setValue] = useState<string[]>(currentValues);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if (Array.isArray(value)) {
            setFormValue(name, value);
            onDirty?.();
        }
    }, [value]);

    const handleValueSelect = useCallback(
        (val: string) => {
            if (val === '$create' && search) {
                setValue((current) => Array.from(new Set([...current, search])));
            } else if (search) {
                setValue((current) => {
                    if (current.includes(search)) {
                        return current.filter((v) => v !== val);
                    }

                    return [...current, search];
                });
            }

            setSearch('');
        },
        [search],
    );

    const handleValueRemove = (val: string) => setValue((current) => current.filter((v) => v !== val));

    const renderedValues = value.map((item) => (
        <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
            {item}
        </Pill>
    ));

    return (
        <div className={styles.root}>
            <label className={styles.label}>{label}</label>

            <Controller
                control={control}
                name={name}
                render={() => (
                    <Combobox
                        disabled={isLoading}
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
                                            placeholder="Type to add group"
                                            onChange={(event) => {
                                                combobox.updateSelectedOptionIndex();
                                                setSearch(event.currentTarget.value);
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
                                <Combobox.Option onClick={() => combobox.closeDropdown()} value="$create">
                                    + Create
                                    {search && <Pill>{search}</Pill>}
                                </Combobox.Option>
                            </Combobox.Options>
                        </Combobox.Dropdown>
                    </Combobox>
                )}
            />
        </div>
    );
}

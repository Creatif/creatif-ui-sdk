// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/inputs/css/InputGroups.module.css';
import { Combobox, Loader, Pill, PillsInput, useCombobox } from '@mantine/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import type { Group, SingleGroupBlueprint } from '@root/types/api/groups';

interface Props {
    isLoading: boolean;
    error?: string | undefined;
    currentValues: Group[];
    name: string;
    label: string;
    onDirty?: () => void;
}

export interface InternalGroup {
    type: 'new' | 'current';
    name: string;
    id?: string;
}

export function MultiSelectNoDropdown({ isLoading, error, name, currentValues, label, onDirty }: Props) {
    const { control, setValue: setFormValue } = useFormContext();

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => {
            combobox.updateSelectedOptionIndex('active');
        },
    });

    const removedRef = useRef<InternalGroup[]>([]);
    const [value, setValue] = useState<InternalGroup[]>(
        currentValues.map((item) => ({ type: 'current', name: item.name, id: item.id })),
    );
    const [search, setSearch] = useState('');
    const createdTickRef = useRef(false);

    useEffect(() => {
        if (Array.isArray(value)) {
            const finalProduct: SingleGroupBlueprint[] = [
                ...removedRef.current.map(
                    (item) =>
                        ({
                            name: item.name,
                            id: item.id,
                            action: 'remove',
                            type: 'current',
                        }) as SingleGroupBlueprint,
                ),
                ...value.map((item) => {
                    if (item.type === 'new') {
                        return {
                            type: 'new',
                            action: 'create',
                            name: item.name,
                            id: '',
                        } as SingleGroupBlueprint;
                    }

                    return {
                        type: 'current',
                        action: 'void',
                        name: item.name,
                        id: item.id,
                    } as SingleGroupBlueprint;
                }),
            ];

            setFormValue(name, finalProduct);

            onDirty?.();
        }
    }, [value]);

    const handleValueSelect = useCallback(
        (val: string) => {
            if (val === '$create' && search) {
                for (const current of value) {
                    if (current.name === search) {
                        return;
                    }
                }

                setValue([...value, { name: search, type: 'new' }]);
            }

            setSearch('');
        },
        [search],
    );

    const handleValueRemove = (val: InternalGroup) => {
        const resolved: InternalGroup[] = [];
        for (const current of value) {
            if (current.type === 'current' && current.name === val.name) {
                removedRef.current.push(val);
                continue;
            } else if (current.type === 'new' && current.name === val.name) {
                continue;
            }

            resolved.push(current);
        }

        setValue(resolved);
    };

    const renderedValues = value.map((item) => (
        <Pill key={item.name} withRemoveButton onRemove={() => handleValueRemove(item)}>
            {item.name}
        </Pill>
    ));

    const onClickCreate = useCallback(() => {
        if (!createdTickRef.current) {
            combobox.closeDropdown();
            createdTickRef.current = true;
        }
    }, []);

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
                                    {renderedValues}`
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
                                <Combobox.Option onClick={onClickCreate} value="$create">
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

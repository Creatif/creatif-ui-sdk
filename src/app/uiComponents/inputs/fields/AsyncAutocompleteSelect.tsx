import { Combobox, useCombobox, TextInput, Loader } from '@mantine/core';
import React, { useCallback, useEffect, useRef, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/inputs/css/InputGroups.module.css';
import { useDebouncedValue } from '@mantine/hooks';
import classNames from 'classnames';

export interface AsyncAutocompleteSelectOption {
    label: string;
    value: string;
}

interface Props {
    data?: AsyncAutocompleteSelectOption[];
    selected?: AsyncAutocompleteSelectOption;
    onOptionSelected: (option: AsyncAutocompleteSelectOption | undefined) => void;
    searchFn: (search: string) => Promise<AsyncAutocompleteSelectOption[]>;

    label?: string;
    placeholder?: string;
    debounceWait?: number;
    value?: string;
    error?: string;
    disabled?: boolean;
}

export default function AsyncAutocompleteSelect({
    label,
    selected,
    placeholder,
    data,
    onOptionSelected,
    debounceWait,
    searchFn,
    disabled,
    error,
}: Props) {
    const [internalData, setInternalData] = useState<AsyncAutocompleteSelectOption[]>(data || []);
    const [internalError, setInternalError] = useState<string | undefined>(error);
    const [search, setSearch] = useState('');
    const [debouncedValue] = useDebouncedValue(search, debounceWait || 300);
    const [isSearchFnRunning, setIsSearchFnRunning] = useState(false);
    const [internalDisabled, setInternalDisabled] = useState(disabled);
    const dirtyInputRef = useRef(false);

    const selectedRef = useRef(false);
    const focusRef = useRef(false);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => {
            combobox.updateSelectedOptionIndex('active');
        },
    });

    const runSearch = useCallback(
        async (value: string) => {
            try {
                const options = await searchFn(value);

                setInternalData(options);
                if (focusRef.current) {
                    combobox.openDropdown();
                }
            } catch (e) {
                setInternalDisabled(true);
                setInternalError(
                    'Something went wrong while trying to find your search data. Please, try again later.',
                );
            }
        },
        [debouncedValue],
    );

    useEffect(() => {
        setIsSearchFnRunning(true);
        runSearch('').then(() => {
            setIsSearchFnRunning(false);
        });
    }, []);

    useEffect(() => {
        if (selected) {
            setSearch(selected.label);
        }
    }, [selected]);

    useEffect(() => {
        if (selectedRef.current) return;
        if (!dirtyInputRef.current) return;

        setIsSearchFnRunning(true);
        runSearch(debouncedValue).then(() => {
            setIsSearchFnRunning(false);
        });
    }, [debouncedValue]);

    useEffect(() => {
        setInternalError(error);
    }, [error]);

    useEffect(() => {
        if (disabled) {
            combobox.closeDropdown();
        }
    }, [disabled]);

    const options = internalData.map((item) => (
        <Combobox.Option value={item.value} key={item.value}>
            {item.label}
        </Combobox.Option>
    ));

    return (
        <div className={styles.root}>
            {label && (
                <label className={classNames(styles.label, error || internalError ? styles.labelError : undefined)}>
                    {label}
                </label>
            )}
            <Combobox
                store={combobox}
                onOptionSubmit={(val) => {
                    combobox.closeDropdown();
                    const item = internalData?.find((t) => t.value === val);
                    if (item) {
                        onOptionSelected?.(item);
                        selectedRef.current = true;
                        setSearch(item.label);
                    }
                }}>
                <Combobox.Target>
                    <TextInput
                        styles={{
                            input: {
                                border: internalError ? '1px solid var(--mantine-color-red-7)' : '',
                            },
                        }}
                        disabled={internalDisabled}
                        pointer
                        value={search}
                        rightSection={isSearchFnRunning ? <Loader size={16} /> : <Combobox.Chevron />}
                        rightSectionPointerEvents="none"
                        onChange={(event) => {
                            dirtyInputRef.current = true;
                            selectedRef.current = false;
                            setSearch(event.target.value);
                        }}
                        onFocus={() => {
                            focusRef.current = true;
                        }}
                        onBlur={() => {
                            focusRef.current = false;
                            combobox.closeDropdown();
                        }}
                        placeholder={placeholder}
                        onClick={() => combobox.toggleDropdown()}
                    />
                </Combobox.Target>
                {internalError && <p className={styles.error}>{internalError}</p>}

                {options && (
                    <Combobox.Dropdown>
                        {options.length > 0 && <Combobox.Options>{options}</Combobox.Options>}

                        {!options.length && (
                            <Combobox.Options>
                                <p
                                    style={{
                                        color: 'var(--mantine-color-gray-6)',
                                        fontSize: '0.9rem',
                                        textAlign: 'center',
                                        padding: '0.5rem',
                                    }}>
                                    Nothing found
                                </p>
                            </Combobox.Options>
                        )}
                    </Combobox.Dropdown>
                )}
            </Combobox>
        </div>
    );
}

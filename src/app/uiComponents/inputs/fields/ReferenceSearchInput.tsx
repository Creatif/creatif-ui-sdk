import { Combobox, useCombobox, TextInput, Loader } from '@mantine/core';
import React, { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/inputs/css/InputGroups.module.css';
import { useDebouncedValue } from '@mantine/hooks';
import classNames from 'classnames';
import type { ApiError } from '@lib/http/apiError';

export interface ReferenceSearchInputOption {
    label: string;
    value: string;
}

interface Props {
    onOptionSelected: (option: ReferenceSearchInputOption | undefined) => void;
    onDefaultOptionLoaded: (option: ReferenceSearchInputOption) => void;
    label?: string;
    disabled?: boolean;
}

export default function ReferenceSearchInput({
    label,
    onOptionSelected,
    onDefaultOptionLoaded,
    disabled,
}: Props) {
    const [isSearching, setIsSearching] = useState(false);
    const [search, setSearch] = useState('');
    const [searchedOptions, setSearchedOptions] = useState<ReferenceSearchInputOption[]>([]);
    const [debouncedValue] = useDebouncedValue(search, 300);
    const [selected, setSelected] = useState<ReferenceSearchInputOption | undefined>();
    const [internalError, setInternalError] = useState<ApiError | undefined>();

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => {
            combobox.updateSelectedOptionIndex('active');
        },
    });

    useEffect(() => {
        if (disabled) {
            combobox.closeDropdown();
        }
    }, [disabled]);

    const options = searchedOptions.map((item) => (
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
                    const item = searchedOptions?.find((t) => t.value === val);
                    if (item) {
                        onOptionSelected?.(item);
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
                        disabled={Boolean(internalError) || disabled}
                        pointer
                        value={search}
                        rightSection={isSearching ? <Loader size={16} /> : <Combobox.Chevron />}
                        rightSectionPointerEvents="none"
                        onChange={(event) => {
                            setSearch(event.target.value);
                        }}
                        onBlur={() => {
                            combobox.closeDropdown();
                        }}
                        placeholder="Type to search..."
                        onClick={() => combobox.toggleDropdown()}
                    />
                </Combobox.Target>
                {internalError && <p className={styles.error}>Something wrong happened and this input is unusable. Try refreshing your browser or try again later.</p>}

                {options && (
                    <Combobox.Dropdown>
                        {options.length > 0 && (
                            <Combobox.Options mah={200} style={{ overflowY: 'auto' }}>
                                {options}
                            </Combobox.Options>
                        )}

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

import { Combobox, useCombobox, TextInput, Loader, Tooltip } from '@mantine/core';
import React, { useEffect, useRef, useState, useTransition } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/inputs/css/InputGroups.module.css';
import { useDebouncedValue } from '@mantine/hooks';
import type { ApiError } from '@lib/http/apiError';
import { searchAndCreateOptions } from '@app/uiComponents/inputs/fields/searchHelper';
import type { StructureItem } from '@app/systems/stores/projectMetadataStore';
import { IntersectionObserverOption } from '@app/uiComponents/inputs/fields/IntersectionObserverOption';
import { IconX } from '@tabler/icons-react';

export interface ConnectionSearchInputOption {
    label: string;
    value: string;
}

interface Props {
    onOptionSelected: (option: ConnectionSearchInputOption | undefined) => void;
    label: string;
    defaultValue: ConnectionSearchInputOption | undefined;
    referenceStructureItem: StructureItem;
    disabled?: boolean;
    inputError: string | undefined;
}

export default function ConnectionSearchInput({
    label,
    onOptionSelected,
    defaultValue,
    inputError,
    referenceStructureItem,
    disabled,
}: Props) {
    const [isSearching, setIsSearching] = useState(false);
    const [search, setSearch] = useState(defaultValue ? defaultValue.label : '');
    const [searchedOptions, setSearchedOptions] = useState<ConnectionSearchInputOption[]>([]);
    const [debouncedValue] = useDebouncedValue(search, 300);
    const [internalError, setInternalError] = useState<ApiError | undefined>();
    const componentMountedRef = useRef(true);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, runTransition] = useTransition();

    const scrollAreaViewportRef = useRef<HTMLDivElement | null>(null);

    const [page, setPage] = useState(1);

    // when an item dropdown item is clicked, onChange event on input is fired.
    // Setting this ref to true disables that. On first user search input, it should be
    // set back to false.
    const selectedRef = useRef(false);

    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
        onDropdownOpen: () => {
            combobox.updateSelectedOptionIndex('active');
        },
    });

    useEffect(() => {
        if (defaultValue) {
            selectedRef.current = true;
            setSearch(defaultValue.label);
        }
    }, [defaultValue]);

    useEffect(() => {
        if (disabled) {
            combobox.closeDropdown();
        }
    }, [disabled]);

    useEffect(() => {
        setIsSearching(true);
        componentMountedRef.current = false;

        runTransition(() => {
            searchAndCreateOptions(
                referenceStructureItem.id,
                referenceStructureItem.structureType,
                debouncedValue || '',
                page,
            ).then(({ options, error }) => {
                if (error) {
                    setInternalError(error);
                }

                if (options) {
                    setSearchedOptions([...searchedOptions, ...options]);
                }

                setIsSearching(false);
            });
        });
    }, [page]);

    useEffect(() => {
        if (debouncedValue && !selectedRef.current && !componentMountedRef.current) {
            setIsSearching(true);
            runTransition(() => {
                searchAndCreateOptions(
                    referenceStructureItem.id,
                    referenceStructureItem.structureType,
                    debouncedValue,
                    page,
                ).then(({ options, error }) => {
                    if (error) {
                        setInternalError(error);
                    }

                    if (options) {
                        setSearchedOptions(options);
                    }

                    setIsSearching(false);
                });
            });
        }
    }, [debouncedValue]);

    const options = searchedOptions.map((item, idx) => (
        <Combobox.Option value={item.value} key={item.value}>
            {item.label}

            {idx === searchedOptions.length - 1 && scrollAreaViewportRef.current && (
                <IntersectionObserverOption
                    isFinal={searchedOptions.length % 100 !== 0}
                    rootElem={scrollAreaViewportRef.current}
                    onIntersected={() => {
                        setPage((page) => page + 1);
                    }}
                />
            )}
        </Combobox.Option>
    ));

    return (
        <div className={styles.root}>
            <Combobox
                store={combobox}
                onOptionSubmit={(val) => {
                    combobox.closeDropdown();
                    const item = searchedOptions?.find((t) => t.value === val);
                    if (item) {
                        selectedRef.current = true;
                        setSearch(item.label);
                        onOptionSelected(item);
                    }
                }}>
                <Combobox.Target>
                    <TextInput
                        leftSection={
                            <Tooltip label="Clear selection">
                                <IconX
                                    onClick={() => {
                                        setSearch('');
                                        setPage(1);
                                        onOptionSelected(undefined);
                                    }}
                                    className={styles.clearSelection}
                                    size={12}
                                    color="var(--mantine-color-gray-4)"
                                />
                            </Tooltip>
                        }
                        label={label}
                        error={inputError}
                        styles={{
                            input: {
                                border: internalError ? '1px solid var(--mantine-color-red-7)' : '',
                            },
                        }}
                        description={`Start typing and pick a ${label} from the list.`}
                        disabled={Boolean(internalError) || disabled}
                        pointer
                        value={search}
                        rightSection={isSearching ? <Loader size={16} /> : <Combobox.Chevron />}
                        rightSectionPointerEvents="none"
                        onChange={(event) => {
                            if (selectedRef.current) {
                                selectedRef.current = false;
                                return;
                            }
                            setSearch(event.target.value);
                        }}
                        onBlur={() => {
                            combobox.closeDropdown();
                        }}
                        placeholder="Type to search..."
                        onClick={() => combobox.toggleDropdown()}
                    />
                </Combobox.Target>
                {internalError && (
                    <p className={styles.error}>
                        Something wrong happened and this input is unusable. Try refreshing your browser or try again
                        later.
                    </p>
                )}

                {options && (
                    <Combobox.Dropdown ref={scrollAreaViewportRef}>
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

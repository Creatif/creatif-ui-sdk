import { Combobox, useCombobox, TextInput, Loader, ScrollArea } from '@mantine/core';
import React, { useEffect, useRef, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/inputs/css/InputGroups.module.css';
import { useDebouncedValue } from '@mantine/hooks';
import type { ApiError } from '@lib/http/apiError';
import type { ReferenceStoreItem } from '@app/systems/stores/inputReferencesStore';
import { queryItemById, searchAndCreateOptions } from '@app/uiComponents/inputs/fields/searchHelper';
import type { StructureItem } from '@app/systems/stores/projectMetadataStore';
import { IntersectionObserverOption } from '@app/uiComponents/inputs/fields/IntersectionObserverOption';

export interface ReferenceSearchInputOption {
    label: string;
    value: string;
}

interface Props {
    onOptionSelected: (option: ReferenceSearchInputOption | undefined) => void;
    onDefaultOptionLoaded: (option: ReferenceSearchInputOption) => void;
    label: string;
    referenceStructureItem: StructureItem;
    disabled?: boolean;
    inputError: string | undefined;
    reference: ReferenceStoreItem | undefined;
}

export default function ReferenceSearchInput({
    label,
    onOptionSelected,
    inputError,
    onDefaultOptionLoaded,
    referenceStructureItem,
    reference,
    disabled,
}: Props) {
    const [isSearching, setIsSearching] = useState(false);
    const [search, setSearch] = useState('');
    const [searchedOptions, setSearchedOptions] = useState<ReferenceSearchInputOption[]>([]);
    const [debouncedValue] = useDebouncedValue(search, 300);
    const [internalError, setInternalError] = useState<ApiError | undefined>();

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
        if (disabled) {
            combobox.closeDropdown();
        }
    }, [disabled]);

    useEffect(() => {
        if (reference) {
            queryItemById(reference.parentStructureId, reference.parentId, reference.parentType).then((data) => {
                if (data) {
                    const { result, error } = data;
                    if (error) {
                        setInternalError(error);
                    }

                    if (result) {
                        const option = {
                            label: result.name,
                            value: JSON.stringify({
                                id: result.id,
                                structureType: reference.parentType,
                            }),
                        };

                        selectedRef.current = true;
                        setSearch(option.label);
                        onDefaultOptionLoaded(option);
                    }
                }
            });
        }
    }, []);

    useEffect(() => {
        setIsSearching(true);

        searchAndCreateOptions(referenceStructureItem.id, referenceStructureItem.structureType, '', page).then(
            ({ options, error }) => {
                if (error) {
                    setInternalError(error);
                }

                if (options) {
                    setSearchedOptions([...searchedOptions, ...options]);
                }

                setIsSearching(false);
            },
        );
    }, [page]);

    useEffect(() => {
        if (!debouncedValue) {
            searchAndCreateOptions(referenceStructureItem.id, referenceStructureItem.structureType, '', page).then(
                ({ options, error }) => {
                    if (error) {
                        setInternalError(error);
                    }

                    if (options) {
                        setSearchedOptions(options);
                    }

                    setIsSearching(false);
                },
            );
        }

        if (debouncedValue && !selectedRef.current) {
            setIsSearching(true);
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
        }
    }, [debouncedValue]);

    const options = searchedOptions.map((item, idx) => (
        <Combobox.Option value={item.value} key={item.value}>
            {item.label}

            {idx === searchedOptions.length - 1 && scrollAreaViewportRef.current && (
                <IntersectionObserverOption
                    isFinal={searchedOptions.length % 100 !== 0}
                    rootElem={scrollAreaViewportRef.current}
                    onIntersected={() => setPage((p) => p + 1)}
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
                    <Combobox.Dropdown>
                        {options.length > 0 && (
                            <Combobox.Options mah={200} style={{ overflowY: 'auto' }}>
                                <ScrollArea.Autosize viewportRef={scrollAreaViewportRef} mah={50} type="scroll">
                                    {options}
                                </ScrollArea.Autosize>
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

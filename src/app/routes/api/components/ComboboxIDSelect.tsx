import { Combobox, Loader, TextInput, useCombobox } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { paginateListItems } from '@lib/publicApi/app/lists/paginateListItems';
import { paginateMapItems } from '@lib/publicApi/app/maps/paginateMapItems';
import { useDebouncedValue } from '@mantine/hooks';
import type { StructureType } from '@root/types/shell/shell';
import { IconX } from '@tabler/icons-react';
import type { ListItem } from '@root/types/api/publicApi/Lists';

interface Props {
    versionName: string;
    onSelected: (id: string) => void;
    toSelect?: 'name';
    structureData: { name: string; type: StructureType } | undefined;
}

export function ComboboxIDSelect({ versionName, onSelected, structureData, toSelect }: Props) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [search, setSearch] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('');
    const [debounced] = useDebouncedValue(search, 500);

    const savedDataRef = useRef<ListItem<unknown>[]>();
    const initialFetchRef = useRef(false);

    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!debounced) {
            setSearchCriteria('');
            return;
        }

        const newData = [];
        for (const d of data) {
            const r = new RegExp(debounced);
            if (r.test(d.label)) {
                newData.push(d);
            }
        }

        setSearchCriteria(debounced);
    }, [debounced]);

    const error = isError
        ? 'An error occurred while trying to fetch a list of items. Please, try again later.'
        : undefined;

    const { isFetching: areListsFetching, data: listData } = useQuery(
        ['paginate_list_items', structureData, searchCriteria, searchCriteria, versionName],
        async () => {
            if (!structureData) return;

            const { result, error } = await paginateListItems({
                versionName: versionName,
                structureName: structureData.name,
                page: 1,
                groups: [],
                orderBy: 'index',
                orderDirection: 'desc',
                search: searchCriteria,
                locales: [],
            });

            initialFetchRef.current = true;

            if (error) throw error;

            savedDataRef.current = result;
            return { result, error };
        },
        {
            enabled: structureData && structureData.type === 'list',
            keepPreviousData: true,
            retry: 3,
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            onError() {
                setIsError(true);
            },
        },
    );

    const { isFetching: areMapsFetching, data: mapData } = useQuery(
        ['paginate_map_items', structureData, searchCriteria, searchCriteria, versionName],
        async () => {
            if (!structureData) return;

            const { result, error } = await paginateMapItems({
                versionName: versionName,
                structureName: structureData.name,
                page: 1,
                groups: [],
                orderBy: 'index',
                orderDirection: 'desc',
                search: searchCriteria,
                locales: [],
            });

            if (error) throw error;

            savedDataRef.current = result;
            return { result, error };
        },
        {
            enabled: structureData && structureData.type === 'map',
            keepPreviousData: true,
            retry: 3,
            staleTime: Infinity,
            refetchOnWindowFocus: false,
            onError() {
                setIsError(true);
            },
        },
    );

    useEffect(() => {
        if (structureData) {
            setSearchCriteria('');
            setSearch('');
            onSelected('');
        }
    }, [structureData]);

    const isFetching = areMapsFetching || areListsFetching;
    let data: { label: string; value: string }[] = [];
    if (structureData?.type === 'list' && listData?.result) {
        data = listData.result.map((item) => ({ value: item.itemId, label: item.itemName }));
    } else if (structureData?.type === 'map' && mapData?.result) {
        data = mapData.result.map((item) => ({ value: item.itemId, label: item.itemName }));
    }

    const options = data.map((item) => (
        <Combobox.Option
            onClick={() => {
                setSearch(item.label);
                if (!toSelect) onSelected(item.value);
                if (toSelect === 'name') {
                    if (savedDataRef.current) {
                        const found = savedDataRef.current.find((t) => t.itemId === item.value);

                        if (found) {
                            onSelected(found.itemName);
                            return;
                        }
                    }

                    onSelected(item.label);
                }

                combobox.closeDropdown();
            }}
            key={item.value}
            value={item.value}>
            {item.label}
        </Combobox.Option>
    ));

    return (
        <Combobox
            store={combobox}
            withinPortal={false}
            onOptionSubmit={() => {
                combobox.closeDropdown();
            }}>
            <Combobox.Target>
                <TextInput
                    error={error}
                    leftSection={isFetching && !initialFetchRef.current && <Loader size={14} />}
                    rightSection={
                        <IconX
                            onClick={() => {
                                setSearch('');
                                onSelected('');
                            }}
                            style={{
                                cursor: 'pointer',
                            }}
                            size={14}
                        />
                    }
                    value={search}
                    onChange={(evn) => {
                        setSearch(evn.target.value);
                    }}
                    placeholder={structureData ? `Search ${structureData.name}` : 'Search...'}
                    description="Search for an item to see its raw response"
                    onClick={() => combobox.openDropdown()}
                />
            </Combobox.Target>

            <Combobox.Dropdown
                styles={{
                    dropdown: {
                        maxHeight: '30vh',
                        overflowY: 'scroll',
                    },
                }}>
                <Combobox.Options>
                    {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}

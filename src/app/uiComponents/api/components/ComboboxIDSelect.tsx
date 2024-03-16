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
    onSelected: (id: string) => void;
    toSelect?: 'name';
    structureData: { name: string; type: StructureType } | undefined;
}

export function ComboboxIDSelect({ onSelected, structureData, toSelect }: Props) {
    const combobox = useCombobox({
        onDropdownClose: () => combobox.resetSelectedOption(),
    });

    const [forceRequery, setForceRequery] = useState(false);
    const [search, setSearch] = useState('');
    const [searchCriteria, setSearchCriteria] = useState('');
    const [debounced] = useDebouncedValue(search, 500);
    const [data, setData] = useState<{ label: string; value: string }[]>([]);

    const savedDataRef = useRef<ListItem<unknown>[]>();

    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (!debounced) {
            setForceRequery(true);
            setSearchCriteria('');
            return;
        }

        setForceRequery(false);

        const newData = [];
        for (const d of data) {
            const r = new RegExp(debounced);
            if (r.test(d.label)) {
                newData.push(d);
            }
        }

        if (newData.length !== 0) {
            setData(newData);
            return;
        }

        setSearchCriteria(debounced);
    }, [debounced]);

    const error = isError
        ? 'An error occurred while trying to fetch a list of items. Please, try again later.'
        : undefined;

    const { isFetching: areListsFetching } = useQuery(
        ['paginate_list_items', structureData, searchCriteria, forceRequery],
        async () => {
            if (!structureData) return;
            if (!forceRequery) return;

            const { result, error } = await paginateListItems({
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
            enabled: structureData && structureData.type === 'list',
            keepPreviousData: true,
            refetchOnWindowFocus: false,
            onError() {
                setIsError(true);
            },
            onSuccess(data) {
                if (data && data.result) {
                    const d = data.result.map((item) => ({
                        value: item.itemId,
                        label: `${item.itemName} (${item.locale})`,
                    }));
                    setData(d);
                }
            },
        },
    );

    const { isFetching: areMapsFetching } = useQuery(
        ['paginate_map_items', structureData, searchCriteria, forceRequery],
        async () => {
            if (!structureData) return;
            if (!forceRequery) return;

            const { result, error } = await paginateMapItems({
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
            onError() {
                setIsError(true);
            },
            onSuccess(data) {
                if (data && data.result) {
                    const d = data.result.map((item) => ({ value: item.itemId, label: item.itemName }));
                    setData(d);
                }
            },
        },
    );

    useEffect(() => {
        if (structureData) {
            setSearchCriteria('');
            setSearch('');
            onSelected('');
            setForceRequery(true);
        }
    }, [structureData]);

    const isFetching = areMapsFetching || areListsFetching;

    const options = data.map((item) => (
        <Combobox.Option
            onClick={() => {
                setSearch(item.label);
                if (!toSelect) onSelected(item.value);
                if (toSelect === 'name' && savedDataRef.current) {
                    const found = savedDataRef.current.find((t) => t.itemId === item.value);
                    if (found) onSelected(found.itemName);
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
                    leftSection={isFetching && <Loader size={14} />}
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

            <Combobox.Dropdown>
                <Combobox.Options>
                    {options.length === 0 ? <Combobox.Empty>Nothing found</Combobox.Empty> : options}
                </Combobox.Options>
            </Combobox.Dropdown>
        </Combobox>
    );
}

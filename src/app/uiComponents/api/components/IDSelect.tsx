import { Loader, Select } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { paginateListItems } from '@lib/publicApi/app/lists/paginateListItems';
import { StructureType } from '@root/types/shell/shell';
import { useQuery } from 'react-query';
import { paginateMapItems } from '@lib/publicApi/app/maps/paginateMapItems';

interface Props {
    onSelected: (id: string) => void;
    structureData: { name: string; type: StructureType } | undefined;
}

export function IDSelect({ onSelected, structureData }: Props) {
    const [selected, setSelected] = useState<string>('');

    const [search, setSearch] = useState('');
    const [debounced] = useDebouncedValue(search, 500);
    const [data, setData] = useState<{ label: string; value: string }[]>([]);

    const [isError, setIsError] = useState(false);

    const error = isError
        ? 'An error occurred while trying to fetch a list of items. Please, try again later.'
        : !structureData
        ? 'Structure is not selected. You must select a structure first.'
        : undefined;

    const { isFetching } = useQuery(
        ['paginate_list_items', structureData, debounced],
        async () => {
            if (!structureData) return;

            const { result, error } = await paginateListItems({
                structureName: structureData.name,
                page: 1,
                groups: [],
                orderBy: 'index',
                orderDirection: 'desc',
                search: debounced,
                locales: [],
            });

            if (error) throw error;

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
                    const d = data.result.map((item) => ({ value: item.itemId, label: item.itemName }));
                    setData(d);
                }
            },
        },
    );

    useQuery(
        ['paginate_map_items', structureData, debounced],
        async () => {
            if (!structureData) return;

            const { result, error } = await paginateMapItems({
                structureName: structureData.name,
                page: 1,
                groups: [],
                orderBy: 'index',
                orderDirection: 'desc',
                search: debounced,
                locales: [],
            });

            if (error) throw error;

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
            setSearch('');
            setSelected('');
        }
    }, [structureData]);

    return (
        <Select
            value={selected}
            disabled={isError || !structureData || isFetching}
            onChange={(id) => {
                if (typeof id !== 'string') return;

                setSelected(id);
                onSelected(id);
            }}
            leftSection={isFetching && <Loader size={14} />}
            allowDeselect
            clearable
            error={error}
            description="Search for an item to see its raw response"
            data={data}
            placeholder="Search"
            searchable
            searchValue={search}
            onSearchChange={(s) => {
                setSearch(s);
            }}
        />
    );
}

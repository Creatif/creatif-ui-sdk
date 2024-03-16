import { Loader, Select } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { getStructures } from '@lib/publicApi/app/structures/getStructures';
import type { StructureType } from '@root/types/shell/shell';

interface Props {
    onSelected: (name: string, structureType: StructureType) => void;
    structureToShow?: StructureType | undefined;
}

export function StructureSelect({ onSelected, structureToShow }: Props) {
    const [selected, setSelected] = useState<string>('');

    const [data, setData] = useState<{ group: string; items: { label: string; value: string }[] }[]>([]);

    const [isError, setIsError] = useState(false);

    const { isFetching, data: queryData } = useQuery(
        'get_public_structure',
        async () => {
            const { result, error } = await getStructures();
            if (error) throw error;

            return { result, error };
        },
        {
            staleTime: Infinity,
            keepPreviousData: true,
            onError() {
                setIsError(true);
            },
        },
    );

    useEffect(() => {
        if (queryData && queryData.result) {
            const lists = queryData.result.lists;
            const maps = queryData.result.maps;

            const groups = [
                {
                    group: 'Lists',
                    items: lists.map((item) => ({ value: item.id, label: item.name })),
                },
                {
                    group: 'Maps',
                    items: maps.map((item) => ({ value: item.id, label: item.name })),
                },
            ];

            if (structureToShow === 'list') {
                groups.splice(1, 1);
            } else if (structureToShow === 'map') {
                groups.splice(0, 1);
            }

            if (lists.length !== 0 && (structureToShow === 'list' || !structureToShow)) {
                setSelected(lists[0].id);
                onSelected(lists[0].name, 'list');
            } else if (maps.length !== 0 && (structureToShow === 'map' || !structureToShow)) {
                setSelected(maps[0].id);
                onSelected(maps[0].name, 'map');
            }

            setData(groups);
        }
    }, [queryData]);

    return (
        <Select
            disabled={isError || isFetching}
            value={selected}
            onChange={(id) => {
                if (typeof id !== 'string') return;

                setSelected(id);

                for (const d of data) {
                    const found = d.items.find((t) => t.value === id);
                    if (found) {
                        let structureType: StructureType = 'map';
                        if (d.group === 'Lists') {
                            structureType = 'list';
                        }

                        onSelected(found.label, structureType);
                    }
                }
            }}
            leftSection={isFetching && <Loader size={14} />}
            allowDeselect
            error={isError && 'An error occurred while trying to fetch a list of structures. Please, try again later.'}
            description="Select a structure to search"
            data={data}
            placeholder="Search structures"
        />
    );
}

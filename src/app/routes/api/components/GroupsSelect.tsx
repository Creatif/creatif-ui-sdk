import { useGetGroups } from '@app/routes/groups/hooks/useGetGroups';
import type { Group } from '@root/types/api/groups';
import type { TryResult } from '@root/types/shared';
import type { ComboboxItem} from '@mantine/core';
import { MultiSelect } from '@mantine/core';
import { useState } from 'react';

interface Props {
    onSelectedGroups: (groups: string[]) => void;
}

export function GroupsSelect({ onSelectedGroups }: Props) {
    const { isFetching, data, error } = useGetGroups<TryResult<Group[]>>();
    const [value, setValue] = useState<string[]>([]);

    return (
        <MultiSelect
            disabled={isFetching || Boolean(error)}
            error={error && 'Groups failed to load. You can still use the rest of the field. Please, try again later.'}
            clearable
            value={value}
            description="Select groups (optional)"
            searchable
            onChange={(groups) => {
                onSelectedGroups(groups);
                setValue(groups);
            }}
            nothingFoundMessage="No groups found"
            filter={({ options, search }) => {
                const filtered = (options as ComboboxItem[]).filter((option) =>
                    option.label.toLowerCase().trim().includes(search.toLowerCase().trim()),
                );

                filtered.sort((a, b) => a.label.localeCompare(b.label));
                return filtered;
            }}
            placeholder="Select groups"
            data={data?.result?.map((item) => ({ value: item.name, label: item.name })) || []}
        />
    );
}

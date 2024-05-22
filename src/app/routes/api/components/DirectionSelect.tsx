import { Select } from '@mantine/core';
import { useState } from 'react';
import type { PaginationDirection } from '@root/types/api/shared';

interface Props {
    onChange: (value: PaginationDirection) => void;
}

export function DirectionSelect({ onChange }: Props) {
    const [value, setValue] = useState<PaginationDirection>('desc');

    return (
        <Select
            clearable
            value={value}
            onChange={(value) => {
                setValue(value as PaginationDirection);
                onChange(value as PaginationDirection);
            }}
            allowDeselect
            description="Select sort direction"
            data={[
                {
                    label: 'Descending',
                    value: 'desc',
                },
                {
                    label: 'Ascending',
                    value: 'asc',
                },
            ]}
        />
    );
}

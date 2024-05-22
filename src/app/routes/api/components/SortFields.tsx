import { Select } from '@mantine/core';
import { useState } from 'react';
import { PaginationDirection } from '@root/types/api/shared';
import type { OrderBy } from '@root/types/api/publicApi/Shared';

interface Props {
    onChange: (value: OrderBy) => void;
}

export function SortFields({ onChange }: Props) {
    const [value, setValue] = useState<OrderBy>('created_at');

    return (
        <Select
            clearable
            value={value}
            allowDeselect
            onChange={(value) => {
                setValue(value as OrderBy);
                onChange(value as OrderBy);
            }}
            description="Select sort field"
            data={[
                {
                    label: 'Name',
                    value: 'name',
                },
                {
                    label: 'Date created',
                    value: 'created_at',
                },
                {
                    label: 'Date updated',
                    value: 'updated_at',
                },
                {
                    label: 'Index',
                    value: 'index',
                },
            ]}
        />
    );
}

import { Select } from '@mantine/core';
import { useState } from 'react';
import { Runtime } from '@app/runtime/Runtime';

interface Props {
    onSelected: (locale: string) => void;
}

export function LocaleSelect({ onSelected }: Props) {
    const [selected, setSelected] = useState<string | null>('');
    const data = Runtime.instance.localesCache
        .getLocales()
        .map((item) => ({ label: `${item.name} (${item.alpha})`, value: item.alpha }));

    return (
        <Select
            value={selected}
            onChange={(id) => {
                if (!id) return;

                setSelected(id);
                onSelected(id);
            }}
            allowDeselect
            description="Select a locale (optional)"
            data={data}
            placeholder="Search locales"
        />
    );
}

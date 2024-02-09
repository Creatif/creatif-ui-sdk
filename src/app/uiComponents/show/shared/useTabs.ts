import type { QueryReference } from '@root/types/api/reference';
import { useMemo, useState } from 'react';

type Tab = { label: string; value: string; type: 'internal' | 'reference'; reference?: QueryReference };

function createTabsFromReferences(references: QueryReference[]): Tab[] {
    return references.map((ref) => ({
        label: ref.structureName,
        value: ref.id,
        type: 'reference',
        reference: references.find((r) => r.id === ref.id),
    }));
}

export default function useTabs(references: QueryReference[]): {
    selected: Tab;
    tabs: Tab[];
    onChange: (value: string) => void;
} {
    const tabs = useMemo<Tab[]>(
        () => [
            {
                label: 'Structure data',
                value: 'structure',
                type: 'internal',
            },
            {
                label: 'Your data',
                value: 'yourData',
                type: 'internal',
            },
            ...createTabsFromReferences(references),
        ],
        [references],
    );

    const [selectedTab, setSelectedTab] = useState<Tab>(tabs[0]);

    return {
        selectedTab: selectedTab,
        tabs: tabs,
        onChange: (value: string) => {
            const item = tabs.find((item) => item.value === value);
            if (item) setSelectedTab(item);
        },
    };
}

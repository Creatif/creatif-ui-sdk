import type { QueryConnection } from '@root/types/api/reference';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type Tab = { label: string; value: string; type: 'internal' | 'reference'; reference?: QueryConnection };

function createTabsFromReferences(references: QueryConnection[]): Tab[] {
    return references.map((ref) => ({
        label: ref.structureName,
        value: ref.id,
        type: 'reference',
        reference: references.find((r) => r.id === ref.id),
    }));
}

export default function useTabs(references: QueryConnection[]): {
    selected: Tab;
    tabs: Tab[];
    onChange: (value: string | null) => void;
} {
    const [params, setParams] = useSearchParams();

    const tabs = useMemo<Tab[]>(
        () => [
            {
                label: 'Item data',
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

    const activeTab = params.get('activeTab');
    const selectedTabFromActiveTab = tabs.find((tab) => activeTab === tab.value);

    const [selectedTab, setSelectedTab] = useState<Tab>(selectedTabFromActiveTab ? selectedTabFromActiveTab : tabs[0]);

    useEffect(() => {
        const activeTab = params.get('activeTab');

        for (const ref of references) {
            if (ref.id === activeTab) {
                const foundTab = tabs.find((tab) => tab.value === ref.id);
                if (foundTab) {
                    setSelectedTab(foundTab);
                }
            }
        }
    }, [references]);

    useEffect(() => {
        if (selectedTab.value !== activeTab) {
            const foundTab = tabs.find((item) => item.value === activeTab);
            if (foundTab) {
                setSelectedTab(foundTab);
            }
        }
    }, [activeTab]);

    return {
        selected: selectedTab,
        tabs: tabs,
        onChange: (value: string | null) => {
            if (!value) return;

            const item = tabs.find((item) => item.value === value);
            if (item) {
                setParams({ ...params, activeTab: value });
                setSelectedTab(item);
            }
        },
    };
}

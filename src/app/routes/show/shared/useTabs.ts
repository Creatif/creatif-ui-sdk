import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { ChildStructure } from '@root/types/api/shared';
import type { StructureType } from '@root/types/shell/shell';

type Tab = { label: string; value: string; type: StructureType | 'internal' };

function createTabsFromChildStructures(structures: ChildStructure[]) {
    return structures.map((structure) => ({
        label: structure.structureName,
        value: structure.structureId,
        type: structure.structureType,
    }));
}

export default function useTabs(childStructures: ChildStructure[]): {
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
            ...createTabsFromChildStructures(childStructures),
        ],
        [childStructures],
    );

    const activeTab = params.get('activeTab');
    const selectedTabFromActiveTab = tabs.find((tab) => activeTab === tab.value);

    const [selectedTab, setSelectedTab] = useState<Tab>(selectedTabFromActiveTab ? selectedTabFromActiveTab : tabs[0]);

    useEffect(() => {
        const activeTab = params.get('activeTab');

        for (const ref of childStructures) {
            if (ref.structureId === activeTab) {
                const foundTab = tabs.find((tab) => tab.value === ref.structureId);
                if (foundTab) {
                    setSelectedTab(foundTab);
                }
            }
        }
    }, [childStructures]);

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

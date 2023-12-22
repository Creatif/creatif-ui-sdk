import CreateNew from '@app/uiComponents/button/CreateNew';
import Sort from '@app/uiComponents/shared/Sort';
import { Button, Drawer, Loader, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconAdjustments, IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/ActionSection.module.css';
import type { Behaviour } from '@root/types/api/shared';
import type { CurrentSortType } from '@root/types/components/components';
interface Props {
    onSearch: (text: string) => void;
    onSelectedGroups: (groups: string[]) => void;
    onSortChange: (sortType: CurrentSortType) => void;
    onBehaviourChange: (behaviour: Behaviour | undefined) => void;
    onDirectionChange: (direction: 'desc' | 'asc' | undefined) => void;
    onSelectedLocales: (locales: string[]) => void;
    includeSortBy: string[];
    structureType: 'variable' | 'map' | 'list';

    direction: 'desc' | 'asc' | undefined;
    sortBy: CurrentSortType;
    structureName: string;
    behaviour: Behaviour | undefined;
    groups: string[];
    isLoading: boolean;
    locales: string[];
}
export default function ActionSection({
    onSearch,
    structureName,
    structureType,
    includeSortBy = ['created_at', 'index', 'updated_at'],
    isLoading,
    onSelectedGroups,
    onSortChange,
    onSelectedLocales,
    onBehaviourChange,
    onDirectionChange,
    direction,
    behaviour,
    groups,
    sortBy,
    locales,
}: Props) {
    const [isDrawerOpened, setIsDrawerOpened] = useState(false);
    const [value, setValue] = useState('');
    const [debounced] = useDebouncedValue(value, 500);

    useEffect(() => {
        onSearch(debounced);
    }, [debounced]);

    return (
        <>
            <div className={styles.root}>
                <div className={styles.paddingSection}>
                    <div className={styles.leftMenu}>
                        <TextInput
                            styles={{
                                input: { borderRadius: '0.2rem' },
                            }}
                            size="md"
                            value={value}
                            onChange={(e) => setValue(e.currentTarget.value)}
                            placeholder="Search"
                            leftSection={<IconSearch size={16} />}
                        />

                        <Button
                            onClick={() => setIsDrawerOpened(true)}
                            size="md"
                            color="black"
                            variant="white"
                            leftSection={<IconAdjustments size={20} />}
                            style={{
                                fontWeight: '200',
                                fontSize: '0.8rem',
                                border: '1px dashed var(--mantine-color-gray-4)',
                            }}>
                            FILTERS
                        </Button>
                    </div>

                    <div className={styles.buttonWidthLoadingWrapper}>
                        {isLoading && <Loader size={20} />}
                        <CreateNew structureName={structureName} />
                    </div>
                </div>
            </div>

            <Drawer opened={isDrawerOpened} onClose={() => setIsDrawerOpened(false)} position="right">
                <Sort
                    structureType={structureType}
                    includeSortBy={includeSortBy}
                    onSelectedLocales={onSelectedLocales}
                    onDirectionChange={onDirectionChange}
                    onBehaviourChange={onBehaviourChange}
                    onSortChange={onSortChange}
                    onSelectedGroups={onSelectedGroups}
                    structureName={structureName}
                    currentDirection={direction}
                    currentBehaviour={behaviour}
                    currentLocales={locales}
                    currentSort={sortBy}
                    currentGroups={groups}
                />
            </Drawer>
        </>
    );
}

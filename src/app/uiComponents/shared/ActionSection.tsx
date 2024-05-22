import CreateNew from '@app/uiComponents/button/CreateNew';
import Sort from '@app/uiComponents/shared/Sort';
import { Button, Drawer, Loader, TextInput, Tooltip } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import {
    IconAdjustments,
    IconLanguage,
    IconReplace,
    IconRouteSquare2,
    IconSearch,
    IconSortAscending,
    IconSortDescending,
} from '@tabler/icons-react';
import { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/ActionSection.module.css';
import type { Behaviour } from '@root/types/api/shared';
import type { CurrentSortType } from '@root/types/components/components';
import type { StructureItem } from '@app/systems/stores/projectMetadataStore';
interface Props {
    onSearch: (text: string) => void;
    onSelectedGroups: (groups: string[]) => void;
    onSortChange: (sortType: CurrentSortType) => void;
    onBehaviourChange: (behaviour: Behaviour | undefined) => void;
    onDirectionChange: (direction: 'desc' | 'asc' | undefined) => void;
    onSelectedLocales: (locales: string[]) => void;
    includeSortBy: string[];

    direction: 'desc' | 'asc' | undefined;
    sortBy: CurrentSortType;
    structureItem: StructureItem;
    behaviour: Behaviour | undefined;
    groups: string[];
    isLoading: boolean;
    locales: string[];
    search: string;

    includeCreateButton?: boolean;
    includeHeading?: boolean;
}
export default function ActionSection({
    onSearch,
    structureItem,
    includeSortBy = ['created_at', 'index', 'updated_at'],
    isLoading,
    search,
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
    includeCreateButton = true,
    includeHeading = true,
}: Props) {
    const [isDrawerOpened, setIsDrawerOpened] = useState(false);
    const [value, setValue] = useState(search);
    const [debounced] = useDebouncedValue(value, 500);

    useEffect(() => {
        onSearch(debounced);
    }, [debounced]);

    return (
        <>
            <div className={styles.root}>
                {includeHeading && (
                    <div className={styles.paddingSection}>
                        <h1 className={styles.heading}>{structureItem.name}</h1>
                    </div>
                )}

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
                                display: 'flex',
                                justifyContent: 'space-between',
                                gap: '10rem',
                                alignItems: 'center',
                            }}>
                            <span
                                style={{
                                    margin: '0 0.5rem 0 0',
                                }}>
                                FILTERS
                            </span>

                            {behaviour && (
                                <Tooltip label={'Behaviour - ' + behaviour}>
                                    <IconReplace
                                        size={16}
                                        style={{
                                            margin: '0 0.5rem 0 0',
                                        }}
                                    />
                                </Tooltip>
                            )}

                            {locales.length !== 0 && (
                                <Tooltip label={'Locale - ' + locales.join(', ')}>
                                    <IconLanguage
                                        size={16}
                                        style={{
                                            margin: '0 0.5rem 0 0',
                                        }}
                                    />
                                </Tooltip>
                            )}

                            {groups.length !== 0 && (
                                <Tooltip label={'Groups - ' + groups.join(', ')}>
                                    <IconRouteSquare2
                                        size={16}
                                        style={{
                                            margin: '0 0.5rem 0 0',
                                        }}
                                    />
                                </Tooltip>
                            )}

                            {direction === 'desc' && (
                                <Tooltip label="Descending sorting">
                                    <IconSortDescending
                                        size={16}
                                        style={{
                                            margin: '0 0.5rem 0 0',
                                        }}
                                    />
                                </Tooltip>
                            )}

                            {direction === 'asc' && (
                                <Tooltip label="Ascending sorting">
                                    <IconSortAscending
                                        size={16}
                                        style={{
                                            margin: '0 0.5rem 0 0',
                                        }}
                                    />
                                </Tooltip>
                            )}
                        </Button>
                    </div>

                    <div className={styles.buttonWidthLoadingWrapper}>
                        {isLoading && <Loader size={20} />}
                        {includeCreateButton && (
                            <CreateNew path={`${structureItem.navigationCreatePath}/${structureItem.id}`} />
                        )}
                    </div>
                </div>
            </div>

            <Drawer opened={isDrawerOpened} onClose={() => setIsDrawerOpened(false)} position="right">
                <Sort
                    includeSortBy={includeSortBy}
                    onSelectedLocales={onSelectedLocales}
                    onDirectionChange={onDirectionChange}
                    onBehaviourChange={onBehaviourChange}
                    onSortChange={onSortChange}
                    onSelectedGroups={onSelectedGroups}
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

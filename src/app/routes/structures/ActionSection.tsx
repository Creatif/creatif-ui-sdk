import { Button, Drawer, Loader, TextInput, Tooltip } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconAdjustments, IconSearch, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shared/css/ActionSection.module.css';
import type { CurrentSortType } from '@root/types/components/components';
import Sort from '@app/routes/structures/Sort';
interface Props {
    onSearch: (text: string) => void;
    title: string;
    onSortChange: (sortType: CurrentSortType) => void;
    onDirectionChange: (direction: 'desc' | 'asc' | undefined) => void;
    includeSortBy: string[];

    direction: 'desc' | 'asc' | undefined;
    sortBy: CurrentSortType;
    isLoading: boolean;
    search: string;

    includeHeading?: boolean;
}
export default function ActionSection({
    onSearch,
    title,
    includeSortBy = ['created_at', 'index', 'updated_at'],
    isLoading,
    search,
    onSortChange,
    onDirectionChange,
    direction,
    sortBy,
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
                        <h1 className={styles.heading}>{title}</h1>
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
                            className={styles.filterButton}
                            variant="white"
                            leftSection={<IconAdjustments size={20} />}
                            style={{
                                fontWeight: '200',
                                fontSize: '0.8rem',
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

                    <div className={styles.buttonWidthLoadingWrapper}>{isLoading && <Loader size={20} />}</div>
                </div>
            </div>

            <Drawer opened={isDrawerOpened} onClose={() => setIsDrawerOpened(false)} position="right">
                <Sort
                    includeSortBy={includeSortBy}
                    onDirectionChange={onDirectionChange}
                    onSortChange={onSortChange}
                    currentDirection={direction}
                    currentSort={sortBy}
                />
            </Drawer>
        </>
    );
}

import { IconCheck, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shared/css/Sort.module.css';
import type { CurrentSortType } from '@root/types/components/components';
import AppPill from '@app/uiComponents/shared/AppPill';
interface Props {
    currentSort: CurrentSortType;
    currentDirection: 'desc' | 'asc' | undefined;
    includeSortBy: string[];

    onSortChange: (sort: CurrentSortType) => void;
    onDirectionChange: (direction: 'desc' | 'asc' | undefined) => void;
}
export default function Sort({
    currentSort = 'index',
    includeSortBy = ['created_at', 'updated_at'],
    onSortChange,
    onDirectionChange,
    currentDirection,
}: Props) {
    const [selectedSort, setSelectedSort] = useState<CurrentSortType>(currentSort);
    const [direction, setDirection] = useState<'desc' | 'asc' | undefined>(currentDirection);

    const onSortSelected = useCallback(
        (field: CurrentSortType) => {
            setSelectedSort(field);
            onSortChange(field);
        },
        [selectedSort],
    );

    return (
        <div className={styles.root}>
            <div className={styles.sortRoot}>
                <h2 className={styles.sortTitle}>SORT BY</h2>

                <div className={styles.column}>
                    {includeSortBy.includes('created_at') && (
                        <div
                            className={classNames(
                                styles.row,
                                selectedSort === 'created_at' ? styles.selectedRow : undefined,
                            )}
                            onClick={() => onSortSelected('created_at')}>
                            <IconCheck
                                size={20}
                                style={{
                                    color: `${
                                        selectedSort === 'created_at'
                                            ? 'var(--mantine-color-gray-9)'
                                            : 'var(--mantine-color-gray-4)'
                                    }`,
                                }}
                            />
                            <span>Date created</span>
                        </div>
                    )}

                    {includeSortBy.includes('updated_at') && (
                        <div
                            className={classNames(
                                styles.row,
                                selectedSort === 'updated_at' ? styles.selectedRow : undefined,
                            )}
                            onClick={() => onSortSelected('updated_at')}>
                            <IconCheck
                                size={20}
                                style={{
                                    color: `${
                                        selectedSort === 'updated_at'
                                            ? 'var(--mantine-color-gray-9)'
                                            : 'var(--mantine-color-gray-4)'
                                    }`,
                                }}
                            />
                            <span>Date updated</span>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.sortRoot}>
                <h2 className={styles.sortTitle}>DIRECTION</h2>

                <div className={classNames(styles.column, styles.behaviourColumn)}>
                    <AppPill
                        onChange={() => {
                            setDirection((item) => {
                                if (item === 'asc') {
                                    onDirectionChange(undefined);
                                    return undefined;
                                }

                                onDirectionChange('asc');
                                return 'asc';
                            });
                        }}
                        value="asc"
                        icon={<IconSortAscending size={16} />}
                        text="Ascending"
                        selected={direction === 'asc'}
                    />

                    <AppPill
                        onChange={() => {
                            setDirection((item) => {
                                if (item === 'desc') {
                                    onDirectionChange(undefined);
                                    return undefined;
                                }

                                onDirectionChange('desc');
                                return 'desc';
                            });
                        }}
                        value="desc"
                        icon={<IconSortDescending size={16} />}
                        text="Descending"
                        selected={direction === 'desc'}
                    />
                </div>
            </div>
        </div>
    );
}

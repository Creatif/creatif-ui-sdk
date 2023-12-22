import useGetGroups from '@app/uiComponents/shared/hooks/useGetGroups';
import { MultiSelect } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconCheck, IconEyeOff, IconReplace, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/Sort.module.css';
import type { ComboboxItem } from '@mantine/core';
import type { Behaviour } from '@root/types/api/shared';
import type { CurrentSortType } from '@root/types/components/components';
import LocalesCache from '@lib/storage/localesCache';
interface Props {
    currentSort: CurrentSortType;
    currentGroups: string[];
    structureName: string;
    structureType: string;
    currentDirection: 'desc' | 'asc' | undefined;
    currentBehaviour: Behaviour | undefined;
    currentLocales: string[];
    includeSortBy: string[];

    onSelectedGroups: (groups: string[]) => void;
    onSortChange: (sort: CurrentSortType) => void;
    onBehaviourChange: (sort: Behaviour | undefined) => void;
    onDirectionChange: (direction: 'desc' | 'asc' | undefined) => void;
    onSelectedLocales: (locales: string[]) => void;
}
export default function Sort({
    currentSort = 'index',
    currentGroups = [],
    includeSortBy = ['created_at', 'index', 'updated_at'],
    structureName,
    structureType,
    currentLocales,
    onSelectedGroups,
    onSelectedLocales,
    onSortChange,
    onBehaviourChange,
    onDirectionChange,
    currentDirection,
    currentBehaviour,
}: Props) {
    const [selectedSort, setSelectedSort] = useState<CurrentSortType>(currentSort);
    const [groups, setGroups] = useState<string[]>(currentGroups);
    const [locales, setLocales] = useState<string[]>(currentLocales);
    const [behaviour, setBehaviour] = useState<Behaviour | undefined>(currentBehaviour);
    const cachedLocales = LocalesCache.instance.getLocales() || [];
    const [direction, setDirection] = useState<'desc' | 'asc' | undefined>(currentDirection);
    const { isFetching: areGroupsLoading, data, error: groupError } = useGetGroups(structureType, structureName);

    const [debouncedGroups] = useDebouncedValue(groups, 500);

    useEffect(() => {
        onSelectedGroups(debouncedGroups);
    }, [debouncedGroups]);

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

                    {includeSortBy.includes('index') && (
                        <div
                            className={classNames(
                                styles.row,
                                selectedSort === 'index' ? styles.selectedRow : undefined,
                            )}
                            onClick={() => onSortSelected('index')}>
                            <IconCheck
                                size={20}
                                style={{
                                    color: `${
                                        selectedSort === 'index'
                                            ? 'var(--mantine-color-gray-9)'
                                            : 'var(--mantine-color-gray-4)'
                                    }`,
                                }}
                            />
                            <span>Index</span>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.sortRoot}>
                <h2 className={styles.sortTitle}>LOCALES</h2>

                <div className={styles.column}>
                    <MultiSelect
                        value={locales}
                        searchable
                        clearable
                        onChange={(locales) => {
                            setLocales(locales);
                            onSelectedLocales(locales);
                        }}
                        nothingFoundMessage="No locales found"
                        filter={({ options, search }) => {
                            const filtered = (options as ComboboxItem[]).filter((option) =>
                                option.label.toLowerCase().trim().includes(search.toLowerCase().trim()),
                            );

                            filtered.sort((a, b) => a.label.localeCompare(b.label));
                            return filtered;
                        }}
                        placeholder="Select locales"
                        data={cachedLocales.map((item) => ({
                            value: item.alpha,
                            label: `${item.name} - ${item.alpha}`,
                        }))}
                    />
                </div>
            </div>

            <div className={styles.sortRoot}>
                <h2 className={styles.sortTitle}>GROUPS</h2>

                <div className={styles.column}>
                    <MultiSelect
                        disabled={areGroupsLoading || Boolean(groupError)}
                        error={
                            groupError &&
                            'Group filter could not be loaded and is not usable but the rest of the filters are usable. Please, try again later.'
                        }
                        value={groups}
                        clearable
                        searchable
                        onChange={setGroups}
                        nothingFoundMessage="No groups found"
                        filter={({ options, search }) => {
                            const filtered = (options as ComboboxItem[]).filter((option) =>
                                option.label.toLowerCase().trim().includes(search.toLowerCase().trim()),
                            );

                            filtered.sort((a, b) => a.label.localeCompare(b.label));
                            return filtered;
                        }}
                        placeholder="Select groups"
                        data={data?.result || []}
                    />
                </div>
            </div>

            <div className={styles.sortRoot}>
                <h2 className={styles.sortTitle}>BEHAVIOUR</h2>

                <div className={classNames(styles.column, styles.behaviourColumn)}>
                    <div
                        onClick={() => {
                            setBehaviour((item) => {
                                if (item === 'modifiable') {
                                    onBehaviourChange(undefined);
                                    return undefined;
                                }

                                onBehaviourChange('modifiable');
                                return 'modifiable';
                            });
                        }}
                        className={classNames(
                            styles.behaviourPill,
                            behaviour === 'modifiable' ? styles.selectedBehaviourPill : undefined,
                        )}>
                        <IconReplace size={16} />
                        <span>Modifiable</span>
                    </div>

                    <div
                        onClick={() => {
                            setBehaviour((item) => {
                                if (item === 'readonly') {
                                    onBehaviourChange(undefined);
                                    return undefined;
                                }

                                onBehaviourChange('readonly');
                                return 'readonly';
                            });
                        }}
                        className={classNames(
                            styles.behaviourPill,
                            behaviour === 'readonly' ? styles.selectedBehaviourPill : undefined,
                        )}>
                        <IconEyeOff size={16} />
                        <span>Readonly</span>
                    </div>
                </div>
            </div>

            <div className={styles.sortRoot}>
                <h2 className={styles.sortTitle}>DIRECTION</h2>

                <div className={classNames(styles.column, styles.behaviourColumn)}>
                    <div
                        onClick={() => {
                            setDirection((item) => {
                                if (item === 'asc') {
                                    onDirectionChange(undefined);
                                    return undefined;
                                }

                                onDirectionChange('asc');
                                return 'asc';
                            });
                        }}
                        className={classNames(
                            styles.behaviourPill,
                            direction === 'asc' ? styles.selectedBehaviourPill : undefined,
                        )}>
                        <IconSortAscending size={16} />
                        <span>Ascending</span>
                    </div>

                    <div
                        onClick={() => {
                            setDirection((item) => {
                                if (item === 'desc') {
                                    onDirectionChange(undefined);
                                    return undefined;
                                }

                                onDirectionChange('desc');
                                return 'desc';
                            });
                        }}
                        className={classNames(
                            styles.behaviourPill,
                            direction === 'desc' ? styles.selectedBehaviourPill : undefined,
                        )}>
                        <IconSortDescending size={16} />
                        <span>Descending</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
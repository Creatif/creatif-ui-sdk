import useGetGroups from '@app/uiComponents/shared/hooks/useGetGroups';
import { MultiSelect } from '@mantine/core';
import { IconCheck, IconEyeOff, IconReplace, IconSortAscending, IconSortDescending } from '@tabler/icons-react';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from './css/Sort.module.css';
import type { ComboboxItem } from '@mantine/core';
import type { Behaviour } from '@root/types/api/shared';
import type { CurrentSortType } from '@root/types/components/components';
import AppPill from '@app/uiComponents/shared/AppPill';
import { Runtime } from '@app/systems/runtime/Runtime';
interface Props {
    currentSort: CurrentSortType;
    currentGroups: string[];
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
    const cachedLocales = Runtime.instance.localesCache.getLocales() || [];
    const [direction, setDirection] = useState<'desc' | 'asc' | undefined>(currentDirection);
    const { isFetching: areGroupsLoading, data, error: groupError } = useGetGroups();

    const groupsAreDisabled = areGroupsLoading || Boolean(groupError);

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
                                className={selectedSort === 'created_at' ? styles.selectedSort : styles.unselectedSort}
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
                                className={selectedSort === 'updated_at' ? styles.selectedSort : styles.unselectedSort}
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
                                className={selectedSort === 'index' ? styles.selectedSort : styles.unselectedSort}
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
                <h2 className={classNames(styles.sortTitle, groupsAreDisabled ? styles.disabledTitle : undefined)}>
                    GROUPS
                </h2>

                <div className={styles.column}>
                    <MultiSelect
                        disabled={groupsAreDisabled}
                        error={
                            groupError &&
                            'Group filter could not be loaded and is not usable but the rest of the filters are usable. Please, try again later.'
                        }
                        value={groups}
                        clearable
                        searchable
                        onChange={(groups) => {
                            onSelectedGroups(groups);
                            setGroups(groups);
                        }}
                        nothingFoundMessage="No groups found"
                        filter={({ options, search }) => {
                            const filtered = (options as ComboboxItem[]).filter((option) =>
                                option.label.toLowerCase().trim().includes(search.toLowerCase().trim()),
                            );

                            filtered.sort((a, b) => a.label.localeCompare(b.label));
                            return filtered;
                        }}
                        placeholder="Select groups"
                        data={data?.result?.map((item) => ({ value: item.id, label: item.name })) || []}
                    />
                </div>
            </div>

            <div className={styles.sortRoot}>
                <h2 className={styles.sortTitle}>BEHAVIOUR</h2>

                <div className={classNames(styles.column, styles.behaviourColumn)}>
                    <AppPill
                        onChange={(item) => {
                            setBehaviour(() => {
                                if (item === 'modifiable') {
                                    onBehaviourChange(undefined);
                                    return undefined;
                                }

                                onBehaviourChange('modifiable');
                                return 'modifiable';
                            });
                        }}
                        value="behaviour"
                        icon={<IconReplace size={16} />}
                        text="Modifiable"
                        selected={behaviour === 'modifiable'}
                    />

                    <AppPill
                        onChange={(item) => {
                            setBehaviour(() => {
                                if (item === 'readonly') {
                                    onBehaviourChange(undefined);
                                    return undefined;
                                }

                                onBehaviourChange('readonly');
                                return 'readonly';
                            });
                        }}
                        value="behaviour"
                        icon={<IconEyeOff size={16} />}
                        text="Readonly"
                        selected={behaviour === 'readonly'}
                    />

                    {behaviour && (
                        <span
                            onClick={() => {
                                setBehaviour(undefined);
                                onBehaviourChange(undefined);
                            }}
                            className={styles.behaviourReset}>
                            RESET
                        </span>
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

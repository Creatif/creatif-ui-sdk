import {Initialize} from '@app/initialize';
import {declarations} from '@lib/http/axios';
import useHttpMutation from '@lib/http/useHttpMutation';
import {MultiSelect} from '@mantine/core';
import {useDebouncedValue} from '@mantine/hooks';
import {IconCheck, IconEyeOff, IconReplace, IconSortAscending, IconSortDescending} from '@tabler/icons-react';
import classNames from 'classnames';
import {useCallback, useEffect, useState} from 'react';
import styles from './css/Sort.module.css';
import type {CurrentSortType} from '@app/uiComponents/listing/types/components';
import type {Behaviour} from '@lib/api/declarations/types/sharedTypes';
import type {ComboboxItem} from '@mantine/core';
interface Props {
	currentSort: CurrentSortType;
	currentGroups: string[];
	structureName: string;

	onSelectedGroups: (groups: string[]) => void;
	onSortChange: (sort: CurrentSortType) => void;
	onBehaviourChange: (sort: Behaviour | undefined) => void;
}
export default function Sort({currentSort = 'index', currentGroups = [], structureName, onSelectedGroups, onSortChange, onBehaviourChange}: Props) {
	const [selectedSort, setSelectedSort] = useState<CurrentSortType>(currentSort);
	const [groups, setGroups] = useState<string[]>(currentGroups);
	const [behaviour, setBehaviour] = useState<Behaviour | undefined>();
	const [direction, setDirection] = useState<'desc' | 'asc' | undefined>();
	const {mutate, isLoading, data, error} = useHttpMutation<{name: string}, string[]>(declarations(), 'post',`/list/groups/${Initialize.ProjectID()}/${Initialize.Locale()}`);
	const [debouncedGroups] = useDebouncedValue(groups, 500);

	useEffect(() => {
		onSelectedGroups(debouncedGroups);
	}, [debouncedGroups]);

	useEffect(() => {
		mutate({
			name: structureName,
		});
	}, []);

	const onSortSelected = useCallback((field: CurrentSortType) => {
		setSelectedSort(field);
		onSortChange(field);
	}, [selectedSort]);

	return <div className={styles.root}>
		<div className={styles.sortRoot}>
			<h2 className={styles.sortTitle}>SORT BY</h2>

			<div className={styles.column}>
				<div className={classNames(styles.row, selectedSort === 'created_at' ? styles.selectedRow : undefined)} onClick={() => onSortSelected('created_at')}>
					<IconCheck size={20} style={{
						color: `${selectedSort === 'created_at' ? 'var(--mantine-color-gray-9)' : 'var(--mantine-color-gray-4)'}`
					}} />
					<span>Date created</span>
				</div>

				<div className={classNames(styles.row, selectedSort === 'updated_at' ? styles.selectedRow : undefined)} onClick={() => onSortSelected('updated_at')}>
					<IconCheck size={20} style={{
						color: `${selectedSort === 'updated_at' ? 'var(--mantine-color-gray-9)' : 'var(--mantine-color-gray-4)'}`
					}} />
					<span>Date updated</span>
				</div>

				<div className={classNames(styles.row, selectedSort === 'index' ? styles.selectedRow : undefined)} onClick={() => onSortSelected('index')}>
					<IconCheck size={20} style={{
						color: `${selectedSort === 'index' ? 'var(--mantine-color-gray-9)' : 'var(--mantine-color-gray-4)'}`
					}} />
					<span>Index</span>
				</div>
			</div>
		</div>

		<div className={styles.sortRoot}>
			<h2 className={styles.sortTitle}>GROUPS</h2>

			<div className={styles.column}>
				<MultiSelect
					disabled={isLoading || Boolean(error)}
					value={groups}
					searchable
					onChange={setGroups}
					nothingFoundMessage='No groups found'
					filter={({ options, search }) => {
						const filtered = (options as ComboboxItem[]).filter((option) =>
							option.label.toLowerCase().trim().includes(search.toLowerCase().trim())
						);

						filtered.sort((a, b) => a.label.localeCompare(b.label));
						return filtered;
					}}
					placeholder="Select groups"
					data={data}
				/>
			</div>
		</div>

		<div className={styles.sortRoot}>
			<h2 className={styles.sortTitle}>BEHAVIOUR</h2>

			<div className={classNames(styles.column, styles.behaviourColumn)}>
				<div onClick={() => {
					setBehaviour((item) => {
						if (item === 'modifiable') {
							onBehaviourChange(undefined);
							return undefined;
						}

						onBehaviourChange('modifiable');
						return 'modifiable';
					});
				}} className={classNames(styles.behaviourPill, behaviour === 'modifiable' ? styles.selectedBehaviourPill : undefined)}>
					<IconReplace size={16} />
					<span>Modifiable</span>
				</div>

				<div onClick={() => {
					setBehaviour((item) => {
						if (item === 'readonly') {
							onBehaviourChange(undefined);
							return undefined;
						}

						onBehaviourChange('readonly');
						return 'readonly';
					});
				}} className={classNames(styles.behaviourPill, behaviour === 'readonly' ? styles.selectedBehaviourPill : undefined)}>
					<IconEyeOff size={16} />
					<span>Readonly</span>
				</div>
			</div>
		</div>

		<div className={styles.sortRoot}>
			<h2 className={styles.sortTitle}>DIRECTION</h2>

			<div className={classNames(styles.column, styles.behaviourColumn)}>
				<div onClick={() => {
					setDirection((item) => {
						if (item === 'asc') return undefined;

						return 'asc';
					});
				}} className={classNames(styles.behaviourPill, direction === 'asc' ? styles.selectedBehaviourPill : undefined)}>
					<IconSortAscending size={16} />
					<span>Ascending</span>
				</div>

				<div onClick={() => {
					setDirection((item) => {
						if (item === 'desc') return undefined;

						return 'desc';
					});
				}} className={classNames(styles.behaviourPill, direction === 'desc' ? styles.selectedBehaviourPill : undefined)}>
					<IconSortDescending size={16} />
					<span>Descending</span>
				</div>
			</div>
		</div>
	</div>;
}
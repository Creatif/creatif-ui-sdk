import CreateNew from '@app/uiComponents/button/CreateNew';
import Sort from '@app/uiComponents/listing/Sort';
import { Button, Drawer, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { IconAdjustments, IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import styles from './css/ActionSection.module.css';
import type { CurrentSortType } from '@app/uiComponents/listing/types/components';
import type { Behaviour } from '@lib/api/declarations/types/sharedTypes';
interface Props {
  onSearch: (text: string) => void;
  onSelectedGroups: (groups: string[]) => void;
  onSortChange: (sortType: CurrentSortType) => void;
  onBehaviourChange: (behaviour: Behaviour | undefined) => void;
  onDirectionChange: (direction: 'desc' | 'asc' | undefined) => void;

  direction: 'desc' | 'asc' | undefined;
  sortBy: CurrentSortType;
  structureName: string;
  behaviour: Behaviour | undefined;
  groups: string[];
}
export default function ActionSection({
	onSearch,
	structureName,
	onSelectedGroups,
	onSortChange,
	onBehaviourChange,
	onDirectionChange,
	direction,
	behaviour,
	groups,
	sortBy,
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
				<div className={styles.leftMenu}>
					<TextInput
						styles={{
							input: { borderRadius: 50 },
						}}
						size="md"
						value={value}
						onChange={(e) => setValue(e.currentTarget.value)}
						placeholder="Search"
						leftSection={<IconSearch size={14} />}
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
						}}
					>
            FILTERS
					</Button>
				</div>

				<CreateNew structureName={structureName} />
			</div>

			<Drawer
				opened={isDrawerOpened}
				onClose={() => setIsDrawerOpened(false)}
				position="right"
			>
				<Sort
					onDirectionChange={onDirectionChange}
					onBehaviourChange={onBehaviourChange}
					onSortChange={onSortChange}
					onSelectedGroups={onSelectedGroups}
					structureName={structureName}
					currentDirection={direction}
					currentBehaviour={behaviour}
					currentSort={sortBy}
					currentGroups={groups}
				/>
			</Drawer>
		</>
	);
}

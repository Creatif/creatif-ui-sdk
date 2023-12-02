import useNotification from '@app/systems/notifications/useNotification';
import ValueMetadata from '@app/uiComponents/listing/ValueMetadata';
import styles from '@app/uiComponents/listing/css/Item.module.css';
import deleteListItemByID from '@lib/api/declarations/lists/deleteListItemByID';
import { ActionIcon, Pill } from '@mantine/core';
import {
	IconChevronDown,
	IconChevronRight,
	IconEdit,
	IconPlus,
	IconReplace,
	IconTrash,
	IconWorld,
} from '@tabler/icons-react';
import classNames from 'classnames';
import { useState } from 'react';
import type { PaginatedVariableResult } from '@lib/api/declarations/types/listTypes';
interface Props {
  item: PaginatedVariableResult<any, any>;
  listName: string;
  onDeleted: () => void;
}
export default function Item({ item, listName, onDeleted }: Props) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const { error: errorNotification, success } = useNotification();

	return (
		<div className={styles.item}>
			<div
				onClick={() => setIsExpanded((item) => !item)}
				className={styles.visibleSectionWrapper}
			>
				<div className={styles.infoColumn}>
					<h2 className={styles.name}>
						<span>{item.name}</span>
						<span className={styles.locale}>
							<IconWorld size={20} />
							{item.locale}
						</span>
					</h2>

					<div className={styles.information}>
						<div className={styles.behaviour}>
							<IconReplace
								className={
									item.behaviour === 'modifiable'
										? styles.modifiable
										: styles.readonly
								}
								size={20}
							/>
							<p>
								{item.behaviour === 'modifiable' ? 'Modifiable' : 'Readonly'}
							</p>
						</div>

						{item.groups && (
							<div className={styles.groups}>
								{item.groups.slice(0, 3).map((item) => (
									<Pill
										key={item}
										styles={{
											root: { backgroundColor: 'var(--mantine-color-blue-0)' },
											label: { cursor: 'pointer' },
										}}
									>
										{item}
									</Pill>
								))}
								{item.groups.length > 3 && (
									<p className={styles.groupsSize}>
										<IconPlus size={10} />
										{item.groups.length - 3} more
									</p>
								)}
							</div>
						)}
					</div>
				</div>

				<div className={styles.menu}>
					<div className={styles.actionMenu}>
						<ActionIcon
							variant="white"
							onClick={(e) => {
								e.stopPropagation();
							}}
						>
							<IconEdit className={styles.actionMenuIcon} size={20} />
						</ActionIcon>

						<ActionIcon
							loading={isDeleting}
							variant="white"
							onClick={async (e) => {
								e.stopPropagation();

								setIsDeleting(true);
								const { error, status } = await deleteListItemByID({
									name: listName,
									itemId: item.id,
								});

								if (error) {
									errorNotification(
										'Cannot delete list item',
										'An error occurred when trying to delete list item. Please, try again later.',
									);
								}

								if (status === 200) {
									success(
										'List item deleted.',
										'List item was deleted successfully',
									);
								}

								setIsDeleting(false);

								onDeleted();
							}}
						>
							<IconTrash
								className={classNames(
									styles.actionMenuIcon,
									styles.actionMenuDelete,
								)}
								size={20}
							/>{' '}
						</ActionIcon>
					</div>
					{!isExpanded ? (
						<IconChevronRight className={styles.dropdownIcon} />
					) : (
						<IconChevronDown className={styles.dropdownIcon} />
					)}
				</div>
			</div>

			<div
				className={classNames(
					styles.expandedSection,
					isExpanded ? styles.expandedSectionExpanded : undefined,
				)}
			>
				<ValueMetadata item={item} />
			</div>
		</div>
	);
}

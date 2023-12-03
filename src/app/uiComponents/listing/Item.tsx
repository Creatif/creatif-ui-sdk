import useNotification from '@app/systems/notifications/useNotification';
import DeleteModal from '@app/uiComponents/listing/DeleteModal';
import GroupsPopover from '@app/uiComponents/listing/GroupsPopover';
import ValueMetadata from '@app/uiComponents/listing/ValueMetadata';
import styles from '@app/uiComponents/listing/css/Item.module.css';
import deleteListItemByID from '@lib/api/declarations/lists/deleteListItemByID';
import { ActionIcon, Checkbox, Pill } from '@mantine/core';
import {
	IconChevronDown,
	IconChevronRight,
	IconEdit,
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
  disabled?: boolean;
  onChecked: (itemId: string, checked: boolean) => void;
}
export default function Item({
	item,
	listName,
	onDeleted,
	onChecked,
	disabled,
}: Props) {
	const [isExpanded, setIsExpanded] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const { error: errorNotification, success } = useNotification();

	const [deleteItemId, setDeleteItemId] = useState<string>();

	return (
		<div
			className={classNames(
				styles.item,
				isDeleting ? styles.itemDisabled : undefined,
			)}
		>
			{(isDeleting || disabled) && <div className={styles.disabled} />}
			<div
				onClick={() => setIsExpanded((item) => !item)}
				className={styles.visibleSectionWrapper}
			>
				<div className={styles.checkboxWrapper}>
					<Checkbox
						onClick={(e) => {
							e.stopPropagation();
							onChecked(item.id, e.currentTarget.checked);
						}}
					/>
				</div>

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

								<GroupsPopover groups={item.groups} />
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
								setDeleteItemId(item.id);
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

			<DeleteModal
				message="Are you sure? This action cannot be undone and this item will be permanently deleted."
				open={deleteItemId}
				onClose={() => setDeleteItemId(undefined)}
				onDelete={async () => {
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
						success('List item deleted.', 'List item was deleted successfully');
					}

					setIsDeleting(false);
					onDeleted();
					setDeleteItemId(undefined);
				}}
			/>
		</div>
	);
}

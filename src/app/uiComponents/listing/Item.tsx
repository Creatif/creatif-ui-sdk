import useNotification from '@app/systems/notifications/useNotification';
import { getOptions } from '@app/systems/stores/options';
import DeleteModal from '@app/uiComponents/listing/DeleteModal';
import GroupsPopover from '@app/uiComponents/listing/GroupsPopover';
import ValueMetadata from '@app/uiComponents/listing/ValueMetadata';
import styles from '@app/uiComponents/listing/css/Item.module.css';
import deleteListItemByID from '@lib/api/declarations/lists/deleteListItemByID';
import {ActionIcon, Button, Checkbox, Pill} from '@mantine/core';
import {
	IconChevronDown,
	IconChevronRight,
	IconEdit,
	IconReplace,
	IconTrash,
} from '@tabler/icons-react';
import classNames from 'classnames';
import { useState } from 'react';
import { Link } from 'react-router-dom';
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
	const useOptions = getOptions(listName);

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
					<div className={styles.nameRow}>
						<h2 className={styles.nameRowTitle}>{item.name}</h2>

						<div className={styles.actionRow}>
							<Button leftSection={<IconEdit size={16} />} size="xs" variant="default" className={styles.locale}>{item.locale} locale</Button>

							<div className={styles.actionMenu}>
								<ActionIcon
									component={Link}
									to={`${useOptions.getState().paths.update}/${listName}/${
										item.id
									}`}
									variant="white"
								>
									<IconEdit
										className={classNames(
											styles.actionMenuIcon,
											styles.actionMenuEdit,
										)}
										size={18}
									/>
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
										size={18}
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

				<div className={styles.menu}></div>
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
				open={Boolean(deleteItemId)}
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

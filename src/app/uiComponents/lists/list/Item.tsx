import useNotification from '@app/systems/notifications/useNotification';
import { getOptions } from '@app/systems/stores/options';
import useEditLocale from '@app/uiComponents/lists/hooks/useEditLocale';
import DeleteModal from '@app/uiComponents/lists/list/DeleteModal';
import EditLocaleModal from '@app/uiComponents/shared/EditLocaleModal';
import GroupsPopover from '@app/uiComponents/lists/list/GroupsPopover';
import ItemView from '@app/uiComponents/lists/list/ItemView';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/list/css/Item.module.css';
import deleteListItemByID from '@lib/api/declarations/lists/deleteListItemByID';
import { ActionIcon, Button, Checkbox, Loader, Pill } from '@mantine/core';
import {
    IconChevronDown,
    IconChevronRight,
    IconEdit,
    IconGridDots,
    IconGripVertical,
    IconReplace,
    IconTrash,
} from '@tabler/icons-react';
import classNames from 'classnames';
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { PaginatedVariableResult } from '@root/types/api/list';
import useQueryListItem from '@app/uiComponents/lists/hooks/useQueryListItem';
import UIError from '@app/components/UIError';
import type { DragSourceMonitor } from 'react-dnd';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import type { DragItem } from '@app/uiComponents/lists/list/MainListView';
interface Props<Value, Metadata> {
    item: PaginatedVariableResult<Value, Metadata>;
    listName: string;
    onDeleted: () => void;
    disabled?: boolean;
    onChecked: (itemId: string, checked: boolean) => void;
    onMove: (fromIdx: number, toIdx: number) => void;
    onDrop: (draggedItem: DragItem, dropTarget: DragItem) => void;
    isHovered: boolean;
    index: number;
}
export default function Item<Value, Metadata>({
    item,
    listName,
    onDeleted,
    onChecked,
    disabled,
    index,
    onMove,
    onDrop,
    isHovered,
}: Props<Value, Metadata>) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { error: errorNotification, success } = useNotification();
    const { store: useOptions } = getOptions(listName);

    const [deleteItemId, setDeleteItemId] = useState<string>();
    const [isEditLocaleOpen, setIsEditLocaleOpen] = useState(false);
    const {
        isFetching,
        data: queriedItem,
        error: queryError,
    } = useQueryListItem<Value, Metadata>(listName, item.id, isExpanded);

    const { mutate, isLoading, data } = useEditLocale(listName, item.id, item.name);

    item.locale = data?.result && data.result.locale ? data.result.locale : item.locale;

    const ref = useRef<HTMLDivElement>(null);
    const [{ handlerId }, drop] = useDrop<DragItem, DragItem, { handlerId: Identifier | null }>({
        accept: 'card',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            };
        },
        drop(dropItem) {
            onDrop(dropItem, {
                id: item.id,
                index: index,
                name: item.name,
            });

            return dropItem;
        },
        hover(dragItem: DragItem, monitor) {
            if (!ref.current) {
                return;
            }

            const dragIndex = dragItem.index;
            const hoverIndex = index;

            if (dragIndex === hoverIndex) {
                return;
            }

            const hoverBoundingRect = ref.current?.getBoundingClientRect();
            const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
            const clientOffset = monitor.getClientOffset();
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY - 100) {
                return;
            }

            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY + 100) {
                return;
            }

            onMove(dragIndex, hoverIndex);
        },
    });

    const [{ isDragging }, drag] = useDrag({
        type: 'card',
        item: () => ({
            id: item.id,
            index: index,
            name: item.name,
        }),
        collect: (monitor: DragSourceMonitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });

    const opacity = isDragging ? 0 : 1;
    drag(drop(ref));

    return (
        <div
            ref={ref}
            data-handler-id={handlerId}
            style={{ opacity: opacity }}
            className={classNames(
                styles.item,
                isDeleting ? styles.itemDisabled : undefined,
                isHovered ? styles.hovered : undefined,
            )}>
            {(isDeleting || disabled) && <div className={styles.disabled} />}
            <div onClick={() => setIsExpanded((item) => !item)} className={styles.visibleSectionWrapper}>
                <div className={styles.checkboxWrapper}>
                    <IconGripVertical className={styles.dragAndDropIcon} color="gray" size={18} />

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
                            {isFetching && <Loader size={16} />}

                            <Button
                                disabled={isLoading}
                                loading={isLoading}
                                loaderProps={{ size: 12 }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsEditLocaleOpen(true);
                                }}
                                leftSection={
                                    <IconEdit
                                        style={{
                                            color: isLoading
                                                ? 'var(--mantine-color-gray-4)'
                                                : 'var(--mantine-color-gray-8)',
                                        }}
                                        size={12}
                                    />
                                }
                                size="xs"
                                variant="default"
                                className={styles.locale}>
                                {item.locale} locale
                            </Button>

                            <div className={styles.actionMenu}>
                                {useOptions && (
                                    <ActionIcon
                                        component={Link}
                                        to={`${useOptions.getState().paths.update}/${listName}/${item.id}`}
                                        variant="white">
                                        <IconEdit
                                            className={classNames(styles.actionMenuIcon, styles.actionMenuEdit)}
                                            size={18}
                                        />
                                    </ActionIcon>
                                )}

                                <ActionIcon
                                    loading={isDeleting}
                                    variant="white"
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        setDeleteItemId(item.id);
                                    }}>
                                    <IconTrash
                                        className={classNames(styles.actionMenuIcon, styles.actionMenuDelete)}
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
                                className={item.behaviour === 'modifiable' ? styles.modifiable : styles.readonly}
                                size={20}
                            />
                            <p>{item.behaviour === 'modifiable' ? 'Modifiable' : 'Readonly'}</p>
                        </div>

                        {item.groups && (
                            <div className={styles.groups}>
                                {item.groups.slice(0, 3).map((item) => (
                                    <Pill
                                        key={item}
                                        styles={{
                                            root: { backgroundColor: 'var(--mantine-color-blue-0)' },
                                            label: { cursor: 'pointer' },
                                        }}>
                                        {item}
                                    </Pill>
                                ))}

                                <GroupsPopover groups={item.groups} />
                            </div>
                        )}
                    </div>
                </div>

                <div className={styles.menu} />
            </div>

            <div
                className={classNames(styles.expandedSection, isExpanded ? styles.expandedSectionExpanded : undefined)}>
                {!isFetching && queryError && (
                    <UIError title="Cannot show item">Something went wrong. Please, try again later.</UIError>
                )}
                {!isFetching && queriedItem?.result && (
                    <ItemView<Value, Metadata>
                        value={queriedItem.result.value}
                        metadata={queriedItem.result.metadata}
                    />
                )}
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

            <EditLocaleModal
                currentLocale={item.locale}
                open={isEditLocaleOpen}
                onClose={() => setIsEditLocaleOpen(false)}
                onEdit={(locale) => {
                    if (item.locale === locale) {
                        setIsEditLocaleOpen(false);
                        return;
                    }

                    mutate({
                        values: {
                            locale: locale,
                        },
                    });
                    setIsEditLocaleOpen(false);
                }}
            />
        </div>
    );
}

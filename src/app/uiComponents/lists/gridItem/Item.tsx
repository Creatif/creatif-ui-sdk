import useNotification from '@app/systems/notifications/useNotification';
import DeleteModal from '@app/uiComponents/shared/modals/DeleteModal';
import EditLocaleModal from '@app/uiComponents/shared/modals/EditLocaleModal';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/css/listGridItem.module.css';
import { ActionIcon, Checkbox, Menu, Tooltip } from '@mantine/core';
import {
    IconCalendarTime,
    IconDotsVertical,
    IconEdit,
    IconEyeOff,
    IconGripVertical,
    IconLanguage,
    IconReplace,
    IconRoute,
    IconTrash,
} from '@tabler/icons-react';
import classNames from 'classnames';
import { type MouseEvent, useCallback, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import type { PaginatedVariableResult } from '@root/types/api/list';
import type { DragSourceMonitor } from 'react-dnd';
import { useDrag, useDrop } from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core';
import type { DragItem } from '@app/uiComponents/shared/listView/DraggableList';
import Groups from '@app/components/Groups';
import appDate from '@lib/helpers/appDate';
import EditGroups from '@app/uiComponents/shared/modals/EditGroups';
import type { StructureItem } from '@app/systems/stores/projectMetadataStore';
import useUpdateVariable from '@app/uiComponents/lists/hooks/useUpdateVariable';
import useDeleteVariable from '@app/uiComponents/lists/hooks/useDeleteVariable';
import type { ApiError } from '@lib/http/apiError';
interface Props<Value, Metadata> {
    item: PaginatedVariableResult<Value, Metadata>;
    structureItem: StructureItem;
    onDeleted: (error?: ApiError) => void;
    disabled?: boolean;
    onChecked: (itemId: string, checked: boolean) => void;
    onMove: (fromIdx: number, toIdx: number) => void;
    onDrop: (draggedItem: DragItem, dropTarget: DragItem) => void;
    isHovered: boolean;
    index: number;
}
export function Item<Value, Metadata>({
    item,
    structureItem,
    onDeleted,
    onChecked,
    disabled,
    index,
    onMove,
    onDrop,
    isHovered,
}: Props<Value, Metadata>) {
    const { success } = useNotification();

    const [deleteItemId, setDeleteItemId] = useState<string>();
    const [isEditLocaleOpen, setIsEditLocaleOpen] = useState(false);
    const [isEditGroupsOpen, setIsEditGroupsOpen] = useState(false);

    const { mutate, data } = useUpdateVariable(structureItem.structureType, structureItem.id || '', item.id, item.name);
    const { mutate: deleteVariable, isLoading: isDeleting } = useDeleteVariable(
        structureItem.structureType,
        () => {
            success('List item deleted.', 'List item was deleted successfully');
            onDeleted();
            setDeleteItemId(undefined);
        },
        (error) => {
            onDeleted(error);
            setDeleteItemId(undefined);
        },
    );

    item.locale = data?.result && data.result.locale ? data.result.locale : item.locale;
    item.groups = data?.result && data.result.groups ? data.result.groups.map((item) => item.name) : item.groups;

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

    const preventClickEventOnModal = useCallback(
        (e: MouseEvent) => {
            if (isEditLocaleOpen || deleteItemId || isEditGroupsOpen) {
                e.preventDefault();
                e.stopPropagation();
            }
        },
        [isEditLocaleOpen, deleteItemId, isEditGroupsOpen],
    );

    return (
        <div
            ref={ref}
            data-handler-id={handlerId}
            onClick={preventClickEventOnModal}
            style={{ opacity: opacity }}
            className={classNames(
                styles.container,
                isDeleting ? styles.itemDisabled : undefined,
                isHovered ? styles.hovered : undefined,
            )}>
            {(isDeleting || disabled) && <div className={styles.disabled} />}

            <div className={styles.checkboxWrapper}>
                <IconGripVertical className={styles.dragAndDropIcon} color="gray" size={18} />

                <Checkbox
                    onClick={(e) => {
                        e.stopPropagation();
                        onChecked(item.id, e.currentTarget.checked);
                    }}
                />
            </div>

            <h2 className={styles.nameRowTitle}>{item.name}</h2>

            <div className={styles.behaviour}>
                <p>{item.behaviour === 'modifiable' ? 'Modifiable' : 'Readonly'}</p>
            </div>

            <div className={styles.behaviour}>
                <span className={styles.localeStrong}>{item.locale}</span>
            </div>

            <Groups groups={item.groups || []} />

            <div className={styles.createdAt}>
                {appDate(item.createdAt)}
            </div>

            <div className={styles.actionRow}>

                {structureItem && (
                    <Tooltip label="Edit">
                        <ActionIcon variant="filled" color="var(--mantine-color-gray-0)" radius="xl" component={Link} to={`${structureItem.navigationUpdatePath}/${structureItem.id}/${item.id}`}>
                            <IconEdit color="var(--mantine-color-gray-9)" size={16} />
                        </ActionIcon>
                    </Tooltip>
                )}

                <Tooltip label="Change locale">
                    <ActionIcon variant="filled" color="var(--mantine-color-gray-0)"  radius="xl"                           onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsEditLocaleOpen(true);
                    }}>
                        <IconLanguage color="var(--mantine-color-gray-9)" size={16} />
                    </ActionIcon>
                </Tooltip>


                <Tooltip label="Change groups">
                    <ActionIcon variant="filled" color="var(--mantine-color-gray-0)" radius="xl"                           onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsEditGroupsOpen(true);
                    }}>
                        <IconRoute color="var(--mantine-color-gray-9)" size={16} />
                    </ActionIcon>
                </Tooltip>


                <Tooltip label="Delete item">
                    <ActionIcon variant="filled" color="var(--mantine-color-red-0)"   radius="xl"                          onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setDeleteItemId(item.id);
                    }}>
                        <IconTrash color="var(--mantine-color-red-9)" size={16} />
                    </ActionIcon>
                </Tooltip>

            </div>

            {structureItem && (
                <DeleteModal
                    message="Are you sure? This action cannot be undone and this item will be permanently deleted."
                    open={Boolean(deleteItemId)}
                    onClose={() => setDeleteItemId(undefined)}
                    onDelete={() => {
                        deleteVariable({
                            name: structureItem.id,
                            itemId: item.id,
                        });
                    }}
                />
            )}

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
                        fields: ['locale'],
                    });
                    setIsEditLocaleOpen(false);
                }}
            />

            {structureItem && (
                <EditGroups
                    itemId={item.id}
                    structureType={structureItem.structureType}
                    structureName={structureItem.id}
                    open={isEditGroupsOpen}
                    onClose={() => setIsEditGroupsOpen(false)}
                    onEdit={(groups) => {
                        mutate({
                            values: {
                                groups: groups,
                            },
                            fields: ['groups'],
                        });

                        setIsEditGroupsOpen(false);
                    }}
                />
            )}
        </div>
    );
}

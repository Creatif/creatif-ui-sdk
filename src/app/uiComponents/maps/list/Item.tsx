import useNotification from '@app/systems/notifications/useNotification';
import DeleteModal from '@app/uiComponents/shared/DeleteModal';
import EditLocaleModal from '@app/uiComponents/shared/modals/EditLocaleModal';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shared/css/Item.module.css';
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
import useUpdateMapVariable from '@app/uiComponents/maps/hooks/useUpdateMapVariable';
import deleteMapItem from '@lib/api/declarations/maps/deleteMapItem';
import type { StructureItem } from '@app/systems/stores/projectMetadataStore';
import { Runtime } from '@app/runtime/Runtime';
interface Props<Value, Metadata> {
    item: PaginatedVariableResult<Value, Metadata>;
    structureItem: StructureItem;
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
    structureItem,
    onDeleted,
    onChecked,
    disabled,
    index,
    onMove,
    onDrop,
    isHovered,
}: Props<Value, Metadata>) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { error: errorNotification, success } = useNotification();

    const [deleteItemId, setDeleteItemId] = useState<string>();
    const [isEditLocaleOpen, setIsEditLocaleOpen] = useState(false);
    const [isEditGroupsOpen, setIsEditGroupsOpen] = useState(false);

    const { mutate, data } = useUpdateMapVariable(structureItem.id || '', item.id, item.name);

    item.locale = data?.result && data.result.locale ? data.result.locale : item.locale;
    item.groups = data?.result && data.result.groups ? data.result.groups : item.groups;

    const ref = useRef<HTMLAnchorElement>(null);
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
        <Link
            to={`${structureItem?.navigationShowPath}/${structureItem.id}/${item.id}`}
            ref={ref}
            data-handler-id={handlerId}
            onClick={preventClickEventOnModal}
            style={{ opacity: opacity }}
            className={classNames(
                styles.item,
                isDeleting ? styles.itemDisabled : undefined,
                isHovered ? styles.hovered : undefined,
            )}>
            {(isDeleting || disabled) && <div className={styles.disabled} />}
            <div className={styles.visibleSectionWrapper}>
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
                        <div className={styles.information}>
                            {item.name.length > 20 && (
                                <Tooltip w={320} transitionProps={{ duration: 200 }} multiline label={item.name}>
                                    <h2 className={styles.nameRowTitle}>{item.name.substring(0, 20)}...</h2>
                                </Tooltip>
                            )}

                            {item.name.length < 20 && <h2 className={styles.nameRowTitle}>{item.name}</h2>}

                            <div className={styles.behaviour}>
                                {item.behaviour === 'modifiable' && (
                                    <IconReplace color="var(--mantine-color-gray-8)" size={14} />
                                )}
                                {item.behaviour === 'readonly' && (
                                    <IconEyeOff color="var(--mantine-color-gray-8)" size={14} />
                                )}
                                <p>{item.behaviour === 'modifiable' ? 'Modifiable' : 'Readonly'}</p>
                            </div>

                            <Groups groups={item.groups || []} />

                            <div className={styles.behaviour}>
                                <span className={styles.localeStrong}>{item.locale}</span>
                            </div>
                        </div>

                        <div className={styles.actionRow}>
                            <Menu position="left">
                                <Menu.Target>
                                    <ActionIcon
                                        className={styles.dropdownIcon}
                                        size={24}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                        }}
                                        variant="white">
                                        <IconDotsVertical />
                                    </ActionIcon>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    {structureItem && (
                                        <Menu.Item
                                            component={Link}
                                            to={`${structureItem.navigationUpdatePath}/${structureItem.id}/${item.id}`}
                                            leftSection={<IconEdit size={16} />}>
                                            Edit
                                        </Menu.Item>
                                    )}

                                    <Menu.Divider />

                                    <Menu.Item
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setIsEditLocaleOpen(true);
                                        }}
                                        leftSection={<IconLanguage size={16} />}>
                                        Edit {item.locale} locale
                                    </Menu.Item>

                                    <Menu.Item
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setIsEditGroupsOpen(true);
                                        }}
                                        leftSection={<IconRoute size={16} />}>
                                        Edit groups
                                    </Menu.Item>

                                    <Menu.Divider />

                                    <Menu.Item
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();
                                            setDeleteItemId(item.id);
                                        }}
                                        leftSection={<IconTrash size={16} color="red" />}>
                                        Delete
                                    </Menu.Item>
                                </Menu.Dropdown>
                            </Menu>
                        </div>
                    </div>

                    <div className={styles.createdAt}>
                        <IconCalendarTime size={16} color="var(--mantine-color-gray-7)" /> {appDate(item.createdAt)}
                    </div>
                </div>

                <div className={styles.menu} />
            </div>

            {structureItem && (
                <DeleteModal
                    message="Are you sure? This action cannot be undone and this item will be permanently deleted."
                    open={Boolean(deleteItemId)}
                    onClose={() => setDeleteItemId(undefined)}
                    onDelete={async () => {
                        setIsDeleting(true);
                        const { error, status } = await deleteMapItem({
                            name: structureItem.id,
                            itemId: item.id,
                            projectId: Runtime.instance.credentials.projectId,
                        });

                        if (error) {
                            errorNotification(
                                'Cannot delete list item',
                                'An error occurred when trying to delete list item. Please, try again later.',
                            );

                            setIsDeleting(false);
                            setDeleteItemId(undefined);

                            return;
                        }

                        if (status === 200) {
                            success('List item deleted.', 'List item was deleted successfully');
                        }

                        setIsDeleting(false);
                        onDeleted();
                        setDeleteItemId(undefined);
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
                    structureType="map"
                    structureName={structureItem.id}
                    open={isEditGroupsOpen}
                    currentGroups={item.groups || []}
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
        </Link>
    );
}

import useNotification from '@app/systems/notifications/useNotification';
import { getOptions } from '@app/systems/stores/options';
import DeleteModal from '@app/uiComponents/lists/list/DeleteModal';
import EditLocaleModal from '@app/uiComponents/shared/EditLocaleModal';
import GroupsPopover from '@app/uiComponents/lists/list/GroupsPopover';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/list/css/Item.module.css';
import { ActionIcon, Menu, Pill } from '@mantine/core';
import {
    IconCalendarTime,
    IconDotsVertical,
    IconEdit,
    IconEyeOff,
    IconLanguage,
    IconReplace,
    IconTrash,
} from '@tabler/icons-react';
import classNames from 'classnames';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { PaginatedVariableResult } from '@root/types/api/list';
import deleteVariable from '@lib/api/declarations/variables/deleteVariable';
import { Initialize } from '@app/initialize';
import useUpdateVariable from '@app/uiComponents/variableForm/hooks/useUpdateVariable';
import appDate from '@lib/helpers/appDate';
interface Props<Value, Metadata> {
    item: PaginatedVariableResult<Value, Metadata>;
    name: string;
    onDeleted: () => void;
}
export default function Item<Value, Metadata>({ item, name, onDeleted }: Props<Value, Metadata>) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { error: errorNotification, success } = useNotification();
    const { store: useOptions } = getOptions(name);

    const [deleteItemId, setDeleteItemId] = useState<string>();
    const [isEditLocaleOpen, setIsEditLocaleOpen] = useState(false);

    const { mutate, data } = useUpdateVariable(name);

    item.locale = data?.result && data?.result.locale ? data?.result.locale : item.locale;

    return (
        <Link
            to={`/variable/show/${item.name}/${item.locale}`}
            className={classNames(styles.item, isDeleting ? styles.itemDisabled : undefined)}>
            {isDeleting && <div className={styles.disabled} />}
            <div className={styles.visibleSectionWrapper}>
                <div className={styles.infoColumn}>
                    <div className={styles.nameRow}>
                        <div className={styles.information}>
                            <h2 className={styles.nameRowTitle}>{item.name}</h2>

                            <div className={styles.behaviour}>
                                {item.behaviour === 'modifiable' && (
                                    <IconReplace className={styles.modifiable} size={14} />
                                )}
                                {item.behaviour === 'readonly' && <IconEyeOff className={styles.readonly} size={16} />}
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

                        <div className={styles.actionRow}>
                            <Menu position="left">
                                <Menu.Target>
                                    <ActionIcon
                                        className={styles.dropdownIcon}
                                        size={24}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        variant="white">
                                        <IconDotsVertical />
                                    </ActionIcon>
                                </Menu.Target>

                                <Menu.Dropdown>
                                    {useOptions && (
                                        <Menu.Item
                                            component={Link}
                                            to={`${useOptions.getState().paths.update}/${item.id}/${item.locale}`}
                                            leftSection={<IconEdit size={16} />}>
                                            Edit
                                        </Menu.Item>
                                    )}

                                    <Menu.Item
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setIsEditLocaleOpen(true);
                                        }}
                                        leftSection={<IconLanguage size={16} />}>
                                        Edit {item.locale} locale
                                    </Menu.Item>

                                    <Menu.Divider />

                                    <Menu.Item
                                        onClick={(e) => {
                                            e.stopPropagation();
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

            <DeleteModal
                message="Are you sure? This action cannot be undone and this item will be permanently deleted."
                open={Boolean(deleteItemId)}
                onClose={() => setDeleteItemId(undefined)}
                onDelete={async () => {
                    setIsDeleting(true);
                    const { error, status } = await deleteVariable({
                        name: name,
                        locale: item.locale,
                        projectId: Initialize.ProjectID(),
                    });

                    if (error) {
                        errorNotification(
                            'Cannot delete item',
                            'An error occurred when trying to delete item. Please, try again later.',
                        );
                    }

                    if (status === 200) {
                        success('Item deleted.', 'Item was deleted successfully');
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
                        projectId: Initialize.ProjectID(),
                        name: item.id,
                        fields: ['locale', 'name'],
                        values: {
                            name: item.name,
                            locale: locale,
                        },
                        locale: item.locale,
                    });
                    setIsEditLocaleOpen(false);
                }}
            />
        </Link>
    );
}

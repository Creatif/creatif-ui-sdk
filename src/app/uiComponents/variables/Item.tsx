import useNotification from '@app/systems/notifications/useNotification';
import { getOptions } from '@app/systems/stores/options';
import DeleteModal from '@app/uiComponents/shared/DeleteModal';
import EditLocaleModal from '@app/uiComponents/shared/modals/EditLocaleModal';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shared/css/Item.module.css';
import { ActionIcon, Menu } from '@mantine/core';
import {
    IconCalendarTime,
    IconDotsVertical,
    IconEdit,
    IconEyeOff,
    IconLanguage,
    IconReplace,
    IconRoute,
    IconTrash,
} from '@tabler/icons-react';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import type { MouseEvent } from 'react';
import { Link } from 'react-router-dom';
import type { PaginatedVariableResult } from '@root/types/api/list';
import deleteVariable from '@lib/api/declarations/variables/deleteVariable';
import { Credentials } from '@app/credentials';
import useUpdateVariable from '@app/uiComponents/variableForm/hooks/useUpdateVariable';
import appDate from '@lib/helpers/appDate';
import EditGroups from '@app/uiComponents/shared/modals/EditGroups';
import Groups from '@app/components/Groups';
interface Props<Value, Metadata> {
    item: PaginatedVariableResult<Value, Metadata>;
    name: string;
    onDeleted: () => void;
}
export default function Item<Value, Metadata>({ item, name, onDeleted }: Props<Value, Metadata>) {
    const [isDeleting, setIsDeleting] = useState(false);
    const { error: errorNotification, success } = useNotification();
    const { store: useOptions } = getOptions(name, 'variable');

    const [deleteItemId, setDeleteItemId] = useState<string>();
    const [isEditLocaleOpen, setIsEditLocaleOpen] = useState(false);
    const [isEditGroupsOpen, setIsEditGroupsOpen] = useState(false);

    const { mutate, data } = useUpdateVariable(name);

    item.locale = data?.result && data?.result.locale ? data?.result.locale : item.locale;
    item.groups = data?.result && data?.result.groups ? data?.result.groups : item.groups;

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
            to={`/variable/show/${item.name}/${item.locale}`}
            onClick={preventClickEventOnModal}
            className={classNames(styles.item, isDeleting ? styles.itemDisabled : undefined)}>
            {isDeleting && <div className={styles.disabled} />}
            <div className={styles.visibleSectionWrapper}>
                <div className={styles.infoColumn}>
                    <div className={styles.nameRow}>
                        <div className={styles.information}>
                            <h2 className={styles.nameRowTitle}>{item.name}</h2>

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
                                    {useOptions && (
                                        <Menu.Item
                                            component={Link}
                                            to={`${useOptions.getState().paths.update}/${item.id}/${item.locale}`}
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

            <DeleteModal
                message="Are you sure? This action cannot be undone and this item will be permanently deleted."
                open={Boolean(deleteItemId)}
                onClose={() => setDeleteItemId(undefined)}
                onDelete={async () => {
                    setIsDeleting(true);
                    const { error, status } = await deleteVariable({
                        name: name,
                        locale: item.locale,
                        projectId: Credentials.ProjectID(),
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
                        projectId: Credentials.ProjectID(),
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

            <EditGroups
                structureType="variable"
                structureName={item.name}
                open={isEditGroupsOpen}
                currentGroups={item.groups || []}
                onClose={() => setIsEditGroupsOpen(false)}
                onEdit={(groups) => {
                    mutate({
                        projectId: Credentials.ProjectID(),
                        name: item.id,
                        fields: ['groups'],
                        values: {
                            groups: groups,
                        },
                        locale: item.locale,
                    });

                    setIsEditGroupsOpen(false);
                }}
            />
        </Link>
    );
}

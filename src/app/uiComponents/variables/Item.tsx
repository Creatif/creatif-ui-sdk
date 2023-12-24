import useNotification from '@app/systems/notifications/useNotification';
import { getOptions } from '@app/systems/stores/options';
import DeleteModal from '@app/uiComponents/lists/list/DeleteModal';
import EditLocaleModal from '@app/uiComponents/shared/EditLocaleModal';
import GroupsPopover from '@app/uiComponents/lists/list/GroupsPopover';
import ItemView from '@app/uiComponents/lists/list/ItemView';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/list/css/Item.module.css';
import { ActionIcon, Button, Pill } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconEdit, IconEyeOff, IconReplace, IconTrash } from '@tabler/icons-react';
import classNames from 'classnames';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { PaginatedVariableResult } from '@root/types/api/list';
import deleteVariable from '@lib/api/declarations/variables/deleteVariable';
import { Initialize } from '@app/initialize';
import useUpdateVariable from '@app/uiComponents/variableForm/hooks/useUpdateVariable';
interface Props<Value, Metadata> {
    item: PaginatedVariableResult<Value, Metadata>;
    name: string;
    onDeleted: () => void;
}
export default function Item<Value, Metadata>({ item, name, onDeleted }: Props<Value, Metadata>) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { error: errorNotification, success } = useNotification();
    const { store: useOptions } = getOptions(name);

    const [deleteItemId, setDeleteItemId] = useState<string>();
    const [isEditLocaleOpen, setIsEditLocaleOpen] = useState(false);

    const { mutate, isLoading, data } = useUpdateVariable(name);

    item.locale = data?.result && data?.result.locale ? data?.result.locale : item.locale;

    return (
        <div className={classNames(styles.item, isDeleting ? styles.itemDisabled : undefined)}>
            {isDeleting && <div className={styles.disabled} />}
            <div onClick={() => setIsExpanded((item) => !item)} className={styles.visibleSectionWrapper}>
                <div className={styles.infoColumn}>
                    <div className={styles.nameRow}>
                        <h2 className={styles.nameRowTitle}>{item.name}</h2>

                        <div className={styles.actionRow}>
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
                                        size={16}
                                    />
                                }
                                size="xs"
                                variant="default"
                                className={styles.locale}>
                                {item.locale} locale
                            </Button>

                            <div className={styles.actionMenu}>
                                {useOptions && <ActionIcon
                                    component={Link}
                                    to={`${useOptions.getState().paths.update}/${item.id}/${item.locale}`}
                                    variant="white">
                                    <IconEdit
                                        className={classNames(styles.actionMenuIcon, styles.actionMenuEdit)}
                                        size={18}
                                    />
                                </ActionIcon>}

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
                            {item.behaviour === 'modifiable' && <IconReplace className={styles.modifiable} size={16} />}
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
                </div>

                <div className={styles.menu} />
            </div>

            <div
                className={classNames(styles.expandedSection, isExpanded ? styles.expandedSectionExpanded : undefined)}>
                <ItemView<Value, Metadata> value={item.value} metadata={item.metadata} />
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
        </div>
    );
}

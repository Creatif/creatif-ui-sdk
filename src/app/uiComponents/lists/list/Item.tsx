import { Initialize } from '@app/initialize';
import useNotification from '@app/systems/notifications/useNotification';
import { getOptions } from '@app/systems/stores/options';
import DeleteModal from '@app/uiComponents/lists/list/DeleteModal';
import EditLocaleModal from '@app/uiComponents/lists/list/EditLocaleModal';
import GroupsPopover from '@app/uiComponents/lists/list/GroupsPopover';
import ItemView from '@app/uiComponents/lists/list/ItemView';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/list/css/Item.module.css';
import deleteListItemByID from '@lib/api/declarations/lists/deleteListItemByID';
import { declarations } from '@lib/http/axios';
import useHttpMutation from '@lib/http/useHttpMutation';
import { ActionIcon, Button, Checkbox, Pill } from '@mantine/core';
import { IconChevronDown, IconChevronRight, IconEdit, IconReplace, IconTrash } from '@tabler/icons-react';
import classNames from 'classnames';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { PaginatedVariableResult, UpdateListItemResult } from '@root/types/api/list';
interface Props<Value, Metadata> {
    item: PaginatedVariableResult<Value, Metadata>;
    listName: string;
    onDeleted: () => void;
    disabled?: boolean;
    onChecked: (itemId: string, checked: boolean) => void;
}
export default function Item<Value, Metadata>({
    item,
    listName,
    onDeleted,
    onChecked,
    disabled,
}: Props<Value, Metadata>) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { error: errorNotification, success } = useNotification();
    const useOptions = getOptions(listName);

    const [deleteItemId, setDeleteItemId] = useState<string>();
    const [isEditLocaleOpen, setIsEditLocaleOpen] = useState(false);
    const { info, error } = useNotification();

    const { mutate, isLoading, data } = useHttpMutation<unknown, UpdateListItemResult>(
        declarations(),
        'post',
        `/list/update-item-by-id/${Initialize.ProjectID()}/${listName}/${item.id}?fields=locale`,
        {
            onSuccess: () => {
                info('Locale changed.', `Locale for structure '${listName}' and item '${item.name}' has been updated.`);
            },
            onError: () => {
                error('Something went wrong.', 'Locale cannot be changed at this moment. Please, try again later.');
            },
        },
        {
            'X-CREATIF-API-KEY': Initialize.ApiKey(),
            'X-CREATIF-PROJECT-ID': Initialize.ProjectID(),
        },
    );

    item.locale = data && data.locale ? data.locale : item.locale;

    return (
        <div className={classNames(styles.item, isDeleting ? styles.itemDisabled : undefined)}>
            {(isDeleting || disabled) && <div className={styles.disabled} />}
            <div onClick={() => setIsExpanded((item) => !item)} className={styles.visibleSectionWrapper}>
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
                                <ActionIcon
                                    component={Link}
                                    to={`${useOptions.getState().paths.update}/${listName}/${item.id}`}
                                    variant="white">
                                    <IconEdit
                                        className={classNames(styles.actionMenuIcon, styles.actionMenuEdit)}
                                        size={18}
                                    />
                                </ActionIcon>

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
                <ItemView<Value, Metadata> value={item.value} metadata={item.metadata} />
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

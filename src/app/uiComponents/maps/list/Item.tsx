import useNotification from '@app/systems/notifications/useNotification';
import { getOptions } from '@app/systems/stores/options';
import useEditLocale from '@app/uiComponents/maps/hooks/useEditLocale';
import DeleteModal from '@app/uiComponents/maps/list/DeleteModal';
import EditLocaleModal from '@app/uiComponents/shared/modals/EditLocaleModal';
import GroupsPopover from '@app/uiComponents/maps/list/GroupsPopover';
import ItemView from '@app/uiComponents/maps/list/ItemView';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/shared/css/Item.module.css';
import { ActionIcon, Button, Checkbox, Loader, Pill } from '@mantine/core';
import {
    IconChevronDown,
    IconChevronRight,
    IconEdit,
    IconGripVertical,
    IconReplace,
    IconTrash,
} from '@tabler/icons-react';
import classNames from 'classnames';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { PaginatedVariableResult } from '@root/types/api/list';
import UIError from '@app/components/UIError';
import useQueryMapVariable from '@app/uiComponents/maps/hooks/useQueryMapVariable';
import deleteMapItem from '@lib/api/declarations/maps/deleteMapItem';
import { Initialize } from '@app/initialize';
interface Props<Value, Metadata> {
    item: PaginatedVariableResult<Value, Metadata>;
    mapName: string;
    onDeleted: () => void;
    disabled?: boolean;
    onChecked: (itemId: string, checked: boolean) => void;
}
export default function Item<Value, Metadata>({
    item,
    mapName,
    onDeleted,
    onChecked,
    disabled,
}: Props<Value, Metadata>) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const { error: errorNotification, success } = useNotification();
    const { store: useOptions } = getOptions(mapName);

    const [deleteItemId, setDeleteItemId] = useState<string>();
    const [isEditLocaleOpen, setIsEditLocaleOpen] = useState(false);
    const {
        isFetching,
        data: queriedItem,
        error: queryError,
    } = useQueryMapVariable<Value, Metadata>(mapName, item.id, isExpanded);

    const { mutate, isLoading, data } = useEditLocale(mapName, item.id, item.name);

    item.locale = data?.result && data.result.locale ? data.result.locale : item.locale;

    return (
        <div className={classNames(styles.item, isDeleting ? styles.itemDisabled : undefined)}>
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
                                        to={`${useOptions.getState().paths.update}/${mapName}/${item.id}`}
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
                    const { error, status } = await deleteMapItem({
                        name: mapName,
                        itemId: item.id,
                        projectId: Initialize.ProjectID(),
                    });

                    if (error) {
                        errorNotification(
                            'Cannot delete map item',
                            'An error occurred when trying to delete map item. Please, try again later.',
                        );
                    }

                    if (status === 200) {
                        success('Map item deleted.', 'Map item was deleted successfully');
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

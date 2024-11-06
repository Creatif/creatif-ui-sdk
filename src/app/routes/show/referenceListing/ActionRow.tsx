import { ActionIcon, Tooltip } from '@mantine/core';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/show/css/row.module.css';
import { Link } from 'react-router-dom';
import { IconEdit, IconEye, IconLanguage, IconRoute } from '@tabler/icons-react';
import type { MouseEvent } from 'react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import type { StructureItem } from '@app/systems/stores/projectMetadataStore';
import type { PaginatedVariableResult } from '@root/types/api/list';
import useUpdateVariable from '@app/uiComponents/lists/hooks/useUpdateVariable';
import EditLocaleModal from '@app/uiComponents/shared/modals/EditLocaleModal';
import EditGroups from '@app/uiComponents/shared/modals/EditGroups';

interface Props<Value, Metadata> {
    structureItem: StructureItem;
    item: PaginatedVariableResult<Value, Metadata>;

    onLocaleChanged: (locale: { itemId: string; locale: string }) => void;
    onGroupsChanged: (groups: { itemId: string; groups: string[] }) => void;
}

export function ActionRow<Value, Metadata>({
    structureItem,
    item,
    onLocaleChanged,
    onGroupsChanged,
}: Props<Value, Metadata>) {
    const [isEditLocaleOpen, setIsEditLocaleOpen] = useState(false);
    const [isEditGroupsOpen, setIsEditGroupsOpen] = useState(false);

    const { mutate, data } = useUpdateVariable(structureItem.structureType, structureItem.id || '', item.id, item.name);

    const locale = data?.result && data.result.locale ? data.result.locale : item.locale;
    const groups = data?.result && data.result.groups ? data.result.groups.map((item) => item.name) : item.groups;

    useEffect(() => {
        if (locale) {
            onLocaleChanged({ itemId: item.id, locale: locale });
        }
    }, [locale]);

    useEffect(() => {
        if (groups) {
            onGroupsChanged({ itemId: item.id, groups: groups });
        }
    }, [groups]);

    const preventClickEventOnModal = useCallback(
        (e: MouseEvent) => {
            if (isEditLocaleOpen || isEditGroupsOpen) {
                e.preventDefault();
                e.stopPropagation();
            }
        },
        [isEditLocaleOpen, isEditGroupsOpen],
    );

    return (
        <div className={styles.root} onClick={preventClickEventOnModal}>
            {structureItem && (
                <Tooltip label="Edit">
                    <ActionIcon
                        classNames={{
                            root: styles.actionIconOverride,
                        }}
                        variant="filled"
                        radius="xl"
                        component={Link}
                        to={`${structureItem.navigationUpdatePath}/${structureItem.id}/${item.id}`}>
                        <IconEdit color="var(--mantine-color-gray-9)" size={16} />
                    </ActionIcon>
                </Tooltip>
            )}

            <Tooltip label="Change locale">
                <ActionIcon
                    variant="filled"
                    classNames={{
                        root: styles.actionIconOverride,
                    }}
                    radius="xl"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsEditLocaleOpen(true);
                    }}>
                    <IconLanguage color="var(--mantine-color-gray-9)" size={16} />
                </ActionIcon>
            </Tooltip>

            <Tooltip label="Change groups">
                <ActionIcon
                    variant="filled"
                    classNames={{
                        root: styles.actionIconOverride,
                    }}
                    radius="xl"
                    onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        setIsEditGroupsOpen(true);
                    }}>
                    <IconRoute color="var(--mantine-color-gray-9)" size={16} />
                </ActionIcon>
            </Tooltip>

            {structureItem && (
                <Tooltip label="View item">
                    <ActionIcon
                        component={Link}
                        to={`${structureItem.navigationShowPath}/${structureItem.id}/${item.id}?activeTab=structure`}
                        variant="filled"
                        classNames={{
                            root: styles.actionIconOverride,
                        }}
                        radius="xl">
                        <IconEye color="var(--mantine-color-gray-9)" size={16} />
                    </ActionIcon>
                </Tooltip>
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

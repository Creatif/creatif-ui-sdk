import EditLocaleModal from '@app/uiComponents/shared/modals/EditLocaleModal';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/css/listGridItem.module.css';
import { ActionIcon, Tooltip } from '@mantine/core';
import { IconEdit, IconEye, IconLanguage, IconRoute } from '@tabler/icons-react';
import classNames from 'classnames';
import { type MouseEvent, useCallback, useRef, useState, memo } from 'react';
import { Link } from 'react-router-dom';
import type { PaginatedVariableResult } from '@root/types/api/list';
import Groups from '@app/components/Groups';
import appDate from '@lib/helpers/appDate';
import EditGroups from '@app/uiComponents/shared/modals/EditGroups';
import type { StructureItem } from '@app/systems/stores/projectMetadataStore';
import useUpdateVariable from '@app/uiComponents/lists/hooks/useUpdateVariable';
interface Props<Value, Metadata> {
    item: PaginatedVariableResult<Value, Metadata>;
    structureItem: StructureItem;
}
function GridItem<Value, Metadata>({ item, structureItem }: Props<Value, Metadata>) {
    const [isEditLocaleOpen, setIsEditLocaleOpen] = useState(false);
    const [isEditGroupsOpen, setIsEditGroupsOpen] = useState(false);

    const { mutate, data } = useUpdateVariable(structureItem.structureType, structureItem.id || '', item.id, item.name);

    item.locale = data?.result && data.result.locale ? data.result.locale : item.locale;
    item.groups = data?.result && data.result.groups ? data.result.groups.map((item) => item.name) : item.groups;

    const ref = useRef<HTMLDivElement>(null);

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
        <div ref={ref} onClick={preventClickEventOnModal} className={classNames(styles.container)}>
            <h2 className={styles.nameRowTitle}>{item.name}</h2>

            <div className={styles.behaviour}>
                <p>{item.behaviour === 'modifiable' ? 'Modifiable' : 'Readonly'}</p>
            </div>

            <div className={styles.behaviour}>
                <span className={styles.localeStrong}>{item.locale}</span>
            </div>

            <Groups groups={item.groups || []} />

            <div className={styles.createdAt}>{appDate(item.createdAt)}</div>

            <div className={styles.actionRow}>
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

                <Tooltip label="View item">
                    <ActionIcon
                        component={Link}
                        to={`${structureItem.navigationShowPath}/${structureItem.id}/${item.id}`}
                        variant="filled"
                        classNames={{
                            root: styles.actionIconOverride,
                        }}
                        radius="xl">
                        <IconEye color="var(--mantine-color-gray-9)" size={16} />
                    </ActionIcon>
                </Tooltip>
            </div>

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

export const Item = memo(GridItem);

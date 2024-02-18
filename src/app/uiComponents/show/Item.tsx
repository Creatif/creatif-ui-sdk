import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import UIError from '@app/components/UIError';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/show/css/item.module.css';
import { ActionIcon, Tabs } from '@mantine/core';
import {
    IconChevronDown,
    IconChevronRight,
    IconClock,
    IconEdit,
    IconLanguage,
    IconStack3,
    IconTrash,
} from '@tabler/icons-react';
import appDate from '@lib/helpers/appDate';
import Loading from '@app/components/Loading';
import type { Column } from '@lib/helpers/useValueFields';
import useValueFields from '@lib/helpers/useValueFields';
import classNames from 'classnames';
import useTabs from '@app/uiComponents/show/shared/useTabs';
import StructureItem from '@app/uiComponents/show/shared/StructureItem';
import Reference from '@app/uiComponents/show/shared/Reference';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import useQueryVariable from '@app/uiComponents/lists/hooks/useQueryVariable';
import type { StructureType } from '@root/types/shell/shell';
import { EditLocaleWrapperModal } from '@app/uiComponents/show/modals/EditLocaleWrapperModal';

function ColumnValue({ values, isInnerRow }: { values: Column[]; isInnerRow: boolean }) {
    const [isInnerExpanded, setIsInnerExpanded] = useState(false);
    const toggleChevron = isInnerExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />;

    return (
        <div className={isInnerRow ? styles.columnSpacing : undefined}>
            {values.map((item, i) => {
                const isNextInnerColumn = values[i + 1] && values[i + 1].innerColumn;

                return (
                    <React.Fragment key={i}>
                        {item.column && (
                            <div
                                className={classNames(
                                    styles.row,
                                    isNextInnerColumn ? styles.hasExpandableRow : undefined,
                                )}>
                                <h2
                                    onClick={() => {
                                        if (isNextInnerColumn) {
                                            setIsInnerExpanded((item) => !item);
                                        }
                                    }}
                                    className={isNextInnerColumn ? styles.expandableHeader : undefined}>
                                    {item.column} {isNextInnerColumn && toggleChevron}
                                </h2>
                                <div className={styles.textValue}>{item.value}</div>
                            </div>
                        )}

                        {item.innerColumn && isInnerExpanded && (
                            <ColumnValue values={item.innerColumn} isInnerRow={true} />
                        )}
                    </React.Fragment>
                );
            })}
        </div>
    );
}

export function Item() {
    const { structureId, itemId, structureType } = useParams();
    const { isFetching, data } = useQueryVariable(
        structureId,
        itemId,
        structureType as StructureType,
        Boolean(structureId && itemId),
    );
    const store = getProjectMetadataStore();
    const structureItem = store.getState().getStructureItemByID(structureId || '');

    const [internalResult, setInternalResult] = useState(data?.result);

    const { tabs, onChange, selected } = useTabs((internalResult && internalResult.references) || []);
    const [isEditLocaleOpen, setIsEditLocaleOpen] = useState(false);
    const values = useValueFields(internalResult?.value);

    useEffect(() => {
        if (data?.result) {
            setInternalResult(data.result);
        }
    }, [data]);

    return (
        <>
            {!structureItem && <UIError title="Route not found">This route does not exist</UIError>}

            {structureItem && (
                <div className={styles.root}>
                    <div className={styles.headerAndActions}>
                        <h2 className={styles.variableName}>{internalResult && internalResult.name}</h2>

                        {internalResult && (
                            <ActionIcon.Group>
                                <ActionIcon
                                    to={`${structureItem.navigationUpdatePath}/${structureItem.id}/${internalResult.id}`}
                                    component={Link}
                                    variant="default">
                                    <IconEdit size={16} />
                                </ActionIcon>

                                <ActionIcon variant="default">
                                    <IconStack3 size={16} />
                                </ActionIcon>

                                <ActionIcon onClick={() => setIsEditLocaleOpen(true)} variant="default">
                                    <IconLanguage size={16} />
                                </ActionIcon>

                                <ActionIcon color="red" variant="filled">
                                    <IconTrash size={16} />
                                </ActionIcon>
                            </ActionIcon.Group>
                        )}
                    </div>

                    {isFetching && (
                        <div className={classNames(styles.loadingRoot)}>
                            <Loading isLoading={isFetching} />
                        </div>
                    )}

                    {internalResult && !isFetching && (
                        <>
                            <p className={styles.createdAt}>
                                <IconClock size={14} color="var(--mantine-color-gray-6)" />
                                {appDate(internalResult.createdAt)}
                            </p>

                            <div className={styles.content}>
                                <Tabs keepMounted={false} variant="outline" value={selected.value} onChange={onChange}>
                                    <Tabs.List>
                                        {tabs.map((t) => (
                                            <Tabs.Tab value={t.value} key={t.value}>
                                                {t.label}
                                            </Tabs.Tab>
                                        ))}
                                    </Tabs.List>

                                    {tabs.map((t) => (
                                        <Tabs.Panel key={t.value} value={t.value}>
                                            {t.value === 'structure' && internalResult && (
                                                <StructureItem variable={internalResult} />
                                            )}
                                            {t.value === 'yourData' && values && (
                                                <div className={styles.contentGrid}>
                                                    <ColumnValue values={values} isInnerRow={false} />
                                                </div>
                                            )}

                                            {t.type === 'reference' && t.reference && internalResult && (
                                                <Reference reference={t.reference} itemId={internalResult.id} />
                                            )}
                                        </Tabs.Panel>
                                    ))}
                                </Tabs>
                            </div>
                        </>
                    )}
                </div>
            )}

            {structureItem && internalResult && (
                <EditLocaleWrapperModal
                    onUpdated={(locale) => {
                        if (internalResult?.locale) {
                            internalResult.locale = locale;
                            setInternalResult({ ...internalResult });
                        }
                    }}
                    isOpen={isEditLocaleOpen}
                    structureItem={structureItem}
                    id={internalResult.id}
                    name={internalResult.name}
                    currentLocale={internalResult.locale}
                    onClose={() => setIsEditLocaleOpen(false)}
                />
            )}
        </>
    );
}

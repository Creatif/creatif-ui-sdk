import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UIError from '@app/components/UIError';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/show/css/item.module.css';
import { ActionIcon, Tabs, Tooltip } from '@mantine/core';
import { IconClock, IconEdit, IconLanguage, IconRoute, IconTrash } from '@tabler/icons-react';
import appDate from '@lib/helpers/appDate';
import Loading from '@app/components/Loading';
import classNames from 'classnames';
import useTabs from '@app/routes/show/shared/useTabs';
import StructureItem from '@app/routes/show/shared/StructureItem';
import Reference from '@app/routes/show/shared/Reference';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import useQueryVariable from '@app/uiComponents/lists/hooks/useQueryVariable';
import type { StructureType } from '@root/types/shell/shell';
import { EditLocaleWrapperModal } from '@app/routes/show/modals/EditLocaleWrapperModal';
import { EditGroupsWrapperModal } from '@app/routes/show/modals/EditGroupsWrapperModal';
import { DeleteItemWrapperModal } from '@app/routes/show/modals/DeleteItemWrapperModal';
import { Runtime } from '@app/systems/runtime/Runtime';
import { treeBuilder } from '@app/routes/show/representation/treeBuilder';
import { Root } from '@app/routes/show/representation/Root';

export default function Item() {
    const { structureId, itemId, structureType } = useParams();
    const { isFetching, data } = useQueryVariable(
        structureId,
        itemId,
        structureType as StructureType,
        Boolean(structureId && itemId),
        'value',
    );
    const navigate = useNavigate();
    const store = getProjectMetadataStore();
    const structureItem = store.getState().getStructureItemByID(structureId || '');

    const [internalResult, setInternalResult] = useState(data?.result);

    const { tabs, onChange, selected } = useTabs((internalResult && internalResult.childStructures) || []);
    const values = useMemo(() => {
        if (!internalResult?.value) return;

        return treeBuilder(internalResult?.value as object);
    }, [internalResult?.value]);

    const [isEditLocaleOpen, setIsEditLocaleOpen] = useState(false);
    const [isEditGroupsOpen, setIsEditGroupsOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

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
                                <Tooltip label="Edit">
                                    <ActionIcon
                                        size={36}
                                        to={`${structureItem.navigationUpdatePath}/${structureItem.id}/${internalResult.id}`}
                                        component={Link}
                                        variant="default">
                                        <IconEdit size={16} />
                                    </ActionIcon>
                                </Tooltip>

                                <Tooltip label="Change groups">
                                    <ActionIcon size={36} onClick={() => setIsEditGroupsOpen(true)} variant="default">
                                        <IconRoute size={16} />
                                    </ActionIcon>
                                </Tooltip>

                                <Tooltip label="Change locale">
                                    <ActionIcon size={36} onClick={() => setIsEditLocaleOpen(true)} variant="default">
                                        <IconLanguage size={16} />
                                    </ActionIcon>
                                </Tooltip>

                                <ActionIcon
                                    size={36}
                                    onClick={() => setIsDeleteModalOpen(true)}
                                    color="red"
                                    variant="filled">
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
                                                    <Root root={values} />
                                                </div>
                                            )}

                                            {/*                                            {t.type === 'reference' && t.reference && internalResult && (
                                                <Reference reference={t.reference} itemId={internalResult.id} />
                                            )}*/}
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

            {structureItem && internalResult && (
                <DeleteItemWrapperModal
                    isOpen={isDeleteModalOpen}
                    structureId={structureItem.id}
                    structureType={structureItem.structureType}
                    itemId={internalResult.id}
                    onClose={() => setIsDeleteModalOpen(false)}
                    onDeleted={() => {
                        navigate(
                            `${Runtime.instance.rootPath()}/${structureItem?.structureType}/${structureItem?.name}/list/${structureItem?.id}`,
                        );
                    }}
                />
            )}

            {structureItem && internalResult && (
                <EditGroupsWrapperModal
                    onUpdated={(groups) => {
                        if (internalResult) {
                            internalResult.groups = groups.map((item) => item.name);
                            setInternalResult({ ...internalResult });
                        }
                    }}
                    isOpen={isEditGroupsOpen}
                    structureItem={structureItem}
                    id={internalResult.id}
                    name={internalResult.name}
                    currentLocale={internalResult.locale}
                    onClose={() => setIsEditGroupsOpen(false)}
                />
            )}
        </>
    );
}

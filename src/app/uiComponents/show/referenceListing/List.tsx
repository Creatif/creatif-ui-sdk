import usePaginateReferences from '@app/uiComponents/show/hooks/usePaginateReferences';
import type { QueryReference } from '@root/types/api/reference';
import React, { useState } from 'react';
import type { Behaviour } from '@root/types/api/shared';
import type { CurrentSortType } from '@root/types/components/components';
import useSearchQuery from '@app/uiComponents/maps/hooks/useSearchQuery';
import ActionSection from '@app/uiComponents/shared/ActionSection';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/maps/list/css/ListTable.module.css';
import { Pagination, Select, Tooltip } from '@mantine/core';
import { IconListDetails, IconTable } from '@tabler/icons-react';
import classNames from 'classnames';
import CenteredError from '@app/components/CenteredError';
import Item from '@app/uiComponents/show/referenceListing/Item';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadata';

interface Props {
    reference: QueryReference;
    structureType: string;
    relationshipType: string;
}

export function List<Value, Metadata>({ reference, structureType, relationshipType }: Props) {
    const { queryParams, setParam } = useSearchQuery();
    const referenceStructureItem = getProjectMetadataStore().getState().getStructureItemByName(reference.structureName);

    const [page, setPage] = useState(queryParams.page);
    const [locales, setLocales] = useState<string[]>(queryParams.locales);
    const [search, setSearch] = useState(queryParams.search);
    const [groups, setGroups] = useState<string[]>(queryParams.groups);
    const [direction, setDirection] = useState<'desc' | 'asc' | undefined>(queryParams.direction);
    const [behaviour, setBehaviour] = useState<Behaviour | undefined>(queryParams.behaviour);
    const [orderBy, setOrderBy] = useState<CurrentSortType>(queryParams.orderBy as CurrentSortType);
    const [limit, setLimit] = useState(queryParams.limit);
    const [fields, setFields] = useState<string[]>(['groups']);

    const { data, error, invalidateQuery, isFetching } = usePaginateReferences({
        parentId: reference.parentId,
        childId: reference.childId,
        childStructureId: reference.childStructureId,
        parentStructureId: reference.parentStructureId,
        relationshipType: relationshipType,
        structureType: structureType,
        page: page,
        locales: locales,
        groups: groups,
        direction: direction,
        behaviour: behaviour,
        limit: limit as string,
        orderBy: orderBy,
        search: search as string,
        fields: fields,
    });

    return (
        <>
            {referenceStructureItem && <ActionSection
                includeCreateButton={false}
                includeHeading={false}
                includeSortBy={['created_at', 'updated_at']}
                structureType={'map'}
                structureItem={referenceStructureItem}
                isLoading={isFetching}
                sortBy={orderBy}
                search={search || ''}
                locales={locales}
                direction={direction}
                behaviour={behaviour}
                groups={groups}
                onDirectionChange={(direction) => {
                    setDirection(direction);
                    setParam('direction', direction as string);
                }}
                onSelectedLocales={(locales) => {
                    setLocales(locales);
                    setParam('locales', locales.join(','));
                }}
                onBehaviourChange={(behaviour) => {
                    setBehaviour(behaviour);
                    setParam('behaviour', behaviour as string);
                }}
                onSortChange={(sortType) => {
                    setOrderBy(sortType);
                    setParam('orderBy', sortType);
                }}
                onSelectedGroups={(groups) => {
                    setGroups(groups);
                    setParam('groups', groups.join(','));
                }}
                onSearch={(text) => {
                    setSearch(text);
                    setParam('search', text);
                }}
            />}

            <div className={contentContainerStyles.root}>
                {data?.result && data.result.data && (
                    <div className={styles.listChoiceHeading}>
                        <p className={styles.totalInfo}>
                            Showing <span>{limit}</span> of <span>{data.result.total}</span> total items
                        </p>

                        <div className={styles.listChoiceListType}>
                            <Tooltip label="List view" position="top-end" arrowOffset={10} arrowSize={4} withArrow>
                                <IconListDetails className={classNames(styles.listChoiceListType_Icon)} size={24} />
                            </Tooltip>

                            <Tooltip label="Table view" position="top-end" arrowOffset={10} arrowSize={4} withArrow>
                                <IconTable
                                    onClick={() => {
                                        setFields([...fields, 'value', 'metadata']);
                                    }}
                                    className={classNames(styles.listChoiceListType_Icon)}
                                    size={24}
                                />
                            </Tooltip>
                        </div>
                    </div>
                )}

                {error && (
                    <div className={styles.skeleton}>
                        <CenteredError title="An error occurred">
                            Something went wrong when trying to fetch items for{' '}
                            <span className={styles.bold}>{reference.structureName}</span>. Please, try again later.
                        </CenteredError>
                    </div>
                )}

                {!isFetching && data?.result && data.result.data && (
                    <div className={styles.container}>
                        {data.result.data.map((item, i) => (
                            <Item mapName={reference.structureName} isHovered={false} key={item.id} item={item} />
                        ))}

                        {data.result.data.length >= parseInt(limit) && (
                            <div className={styles.stickyPagination}>
                                <Pagination
                                    value={page}
                                    onChange={setPage}
                                    radius={20}
                                    boundaries={2}
                                    total={Math.ceil(data.result.total / parseInt(limit))}
                                />
                                <Select
                                    label="TOTAL"
                                    onChange={(l) => {
                                        if (!l) {
                                            setLimit('15');
                                            return;
                                        }

                                        setLimit(l);
                                    }}
                                    value={limit}
                                    placeholder="Limit"
                                    data={['15', '50', '100', '500', '1000']}
                                    styles={{
                                        root: {
                                            width: '100px',
                                        },
                                        label: {
                                            fontSize: '0.7rem',
                                            color: 'var(--mantine-color-gray-6)',
                                        },
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

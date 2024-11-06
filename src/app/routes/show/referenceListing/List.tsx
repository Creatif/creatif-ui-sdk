import usePaginateReferences from '@app/routes/show/hooks/usePaginateReferences';
import type { QueryReference } from '@root/types/api/reference';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ActionSection from '@app/uiComponents/shared/ActionSection';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import { Button, Loader, Table } from '@mantine/core';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import type { StructureType } from '@root/types/shell/shell';
import type { PaginatedVariableResult, PaginationResult } from '@root/types/api/list';
import useSearchQuery from '@app/routes/show/hooks/useSearchQuery';
import { IconMistOff } from '@tabler/icons-react';
import NothingFound from '@app/uiComponents/shared/NothingFound';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/css/ListTable.module.css';
import UIError from '@app/components/UIError';
import Groups from '@app/components/Groups';
import { ActionRow } from '@app/routes/show/referenceListing/ActionRow';
import appDate from '@lib/helpers/appDate';

interface Props {
    reference: QueryReference;
    structureType: StructureType;
    relationshipType: string;
}

function resolveListing<Value, Metadata>(
    results: PaginationResult<Value, Metadata>[] | undefined,
): PaginatedVariableResult<Value, Metadata>[] {
    if (results && results.length > 0) {
        let data: PaginatedVariableResult<Value, Metadata>[] = [];
        for (const page of results) {
            data = [...data, ...page.data];
        }

        return data;
    }

    return [];
}

export function List<Value, Metadata>({ reference, structureType, relationshipType }: Props) {
    const [locale, setLocale] = useState<{ itemId: string; locale: string }>();
    const [groups, setGroups] = useState<{ itemId: string; groups: string[] }>();

    const { queryParams, setParam } = useSearchQuery();
    const pageRef = useRef(1);
    const referenceStructureItem = getProjectMetadataStore()
        .getState()
        .getStructureItemByName(reference.structureName, structureType);

    const { data, error, isFetching, fetchNextPage, isFetchingNextPage, hasNextPage } = usePaginateReferences<
        PaginationResult<Value, Metadata>
    >({
        parentId: reference.parentId,
        childId: reference.childId,
        childStructureId: reference.childStructureId,
        parentStructureId: reference.parentStructureId,
        relationshipType: relationshipType,
        structureType: structureType,
        locales: queryParams.locales,
        groups: queryParams.groups,
        direction: queryParams.direction,
        behaviour: queryParams.behaviour,
        orderBy: queryParams.orderBy,
        search: queryParams.search,
        fields: ['groups'],
    });

    const listing = useMemo(() => resolveListing(data?.pages), [data?.pages]);

    useEffect(() => {
        if (!locale) return;

        for (const item of listing) {
            if (item.id === locale.itemId) {
                item.locale = locale.locale;
            }
        }
    }, [locale, listing]);

    useEffect(() => {
        if (!groups) return;

        for (const item of listing) {
            if (item.id === groups.itemId) {
                item.groups = groups.groups;
            }
        }
    }, [groups, listing]);

    const rows = listing.map((element) => (
        <Table.Tr key={element.id}>
            <Table.Td>{element.name}</Table.Td>
            <Table.Td>{element.behaviour}</Table.Td>
            <Table.Td>{element.locale}</Table.Td>
            <Table.Td>
                <Groups groups={element.groups || []} />
            </Table.Td>
            <Table.Td>{appDate(element.createdAt)}</Table.Td>
            <Table.Td>
                {referenceStructureItem && (
                    <ActionRow
                        onGroupsChanged={(groups) => setGroups(groups)}
                        onLocaleChanged={(locale) => setLocale(locale)}
                        structureItem={referenceStructureItem}
                        item={element}
                    />
                )}
            </Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            {referenceStructureItem && (
                <ActionSection
                    includeCreateButton={false}
                    includeHeading={false}
                    includeSortBy={['created_at', 'updated_at']}
                    structureItem={referenceStructureItem}
                    isLoading={isFetching}
                    sortBy={queryParams.orderBy || 'index'}
                    search={queryParams.search || ''}
                    locales={queryParams.locales}
                    direction={queryParams.direction}
                    behaviour={queryParams.behaviour}
                    groups={queryParams.groups}
                    onDirectionChange={(direction) => {
                        setParam('direction', direction as string);
                    }}
                    onSelectedLocales={(locales) => {
                        setParam('locales', locales.join(','));
                    }}
                    onBehaviourChange={(behaviour) => {
                        setParam('behaviour', behaviour as string);
                    }}
                    onSortChange={(sortType) => {
                        setParam('orderBy', sortType);
                    }}
                    onSelectedGroups={(groups) => {
                        setParam('groups', groups.join(','));
                    }}
                    onSearch={(text) => {
                        setParam('search', text);
                    }}
                />
            )}

            {referenceStructureItem && (
                <div className={contentContainerStyles.root}>
                    <Table.ScrollContainer minWidth={920}>
                        <Table
                            verticalSpacing="md"
                            styles={{
                                th: {
                                    fontWeight: 'bold',
                                },
                            }}>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>NAME</Table.Th>
                                    <Table.Th>BEHAVIOUR</Table.Th>
                                    <Table.Th>LOCALE</Table.Th>
                                    <Table.Th>GROUPS</Table.Th>
                                    <Table.Th>CREATED ON</Table.Th>
                                    <Table.Th>ACTIONS</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>{rows}</Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </div>
            )}

            <div className={contentContainerStyles.root}>
                {error && (
                    <div className={styles.skeleton}>
                        <UIError title="An error occurred">
                            Something went wrong when trying to fetch list {referenceStructureItem?.name}. Please, try
                            again later.
                        </UIError>
                    </div>
                )}

                {!referenceStructureItem && (
                    <div className={styles.skeleton}>
                        <UIError title="Route not found">This route does not seem to exist</UIError>
                    </div>
                )}

                {!isFetching && listing && listing.length === 0 && (
                    <NothingFound
                        createNewPath={
                            (referenceStructureItem &&
                                `${referenceStructureItem.navigationCreatePath}/${referenceStructureItem.id}`) ||
                            ''
                        }
                    />
                )}

                {Boolean(listing.length) && (
                    <div className={styles.pagination}>
                        {hasNextPage && (
                            <Button
                                variant="outline"
                                disabled={isFetchingNextPage}
                                rightSection={isFetchingNextPage ? <Loader size={12} /> : undefined}
                                onClick={() => {
                                    pageRef.current = pageRef.current + 1;
                                    fetchNextPage();
                                }}>
                                LOAD MORE
                            </Button>
                        )}

                        {!hasNextPage && (
                            <p className={styles.paginationEmpty}>
                                <IconMistOff size={16} /> No more items
                            </p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

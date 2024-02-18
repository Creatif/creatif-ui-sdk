import usePaginateReferences from '@app/uiComponents/show/hooks/usePaginateReferences';
import type { QueryReference } from '@root/types/api/reference';
import React from 'react';
import ActionSection from '@app/uiComponents/shared/ActionSection';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/list/css/ListTable.module.css';
import { Button, Loader } from '@mantine/core';
import CenteredError from '@app/components/CenteredError';
import Item from '@app/uiComponents/show/referenceListing/Item';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import type { StructureType } from '@root/types/shell/shell';
import type { PaginatedVariableResult, PaginationResult } from '@root/types/api/list';
import useSearchQuery from '@app/uiComponents/shared/hooks/useSearchQuery';
import { IconMistOff } from '@tabler/icons-react';
import NothingFound from '@app/uiComponents/shared/NothingFound';

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
    const { queryParams, setParam } = useSearchQuery();
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

    const listing = resolveListing(data?.pages);

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

            <div className={contentContainerStyles.root}>
                {error && (
                    <div className={styles.skeleton}>
                        <CenteredError title="An error occurred">
                            Something went wrong when trying to fetch items for{' '}
                            <span className={styles.bold}>{reference.structureName}</span>. Please, try again later.
                        </CenteredError>
                    </div>
                )}

                {!isFetching && data && listing.length === 0 && <NothingFound />}

                {data && listing.length !== 0 && referenceStructureItem && (
                    <div className={styles.container}>
                        {listing.map((item) => (
                            <Item structureItem={referenceStructureItem} isHovered={false} key={item.id} item={item} />
                        ))}

                        {Boolean(listing.length) && (
                            <div className={styles.pagination}>
                                {hasNextPage && (
                                    <Button
                                        variant="outline"
                                        disabled={isFetchingNextPage}
                                        rightSection={isFetchingNextPage ? <Loader size={12} /> : undefined}
                                        onClick={() => {
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
                )}
            </div>
        </>
    );
}

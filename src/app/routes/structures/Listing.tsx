// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import NothingFound from '@app/uiComponents/shared/NothingFound';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/css/ListTable.module.css';
import { Button, Loader } from '@mantine/core';
import React, { useRef } from 'react';
import UIError from '@app/components/UIError';
import { IconInfoCircle, IconMistOff } from '@tabler/icons-react';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import gridStyles from '@app/uiComponents/lists/css/listGrid.module.css';
import { Item as GridItem } from '@app/routes/structures/GridItem';
import useMapPagination from '@app/routes/structures/hooks/useMapPagination';
import type { ListStructure, MapStructure, StructurePaginationResult } from '@root/types/api/structures';
import useListPagination from '@app/routes/structures/hooks/useListPagination';
import ActionSection from '@app/routes/structures/ActionSection';
import type { StructureType } from '@root/types/shell/shell';
import useSearchQuery from '@app/routes/structures/hooks/useSearchQuery';

export interface PaginationDataWithPage extends ListStructure {
    page: number;
}

function resolveListing<Value>(
    structureType: StructureType,
    mapPages: StructurePaginationResult<Value>[] | undefined,
    listPages: StructurePaginationResult<Value>[] | undefined,
    currentPage: number,
): PaginationDataWithPage[] {
    if (structureType === 'map' && mapPages && mapPages.length > 0) {
        let data: PaginationDataWithPage[] = [];
        for (const page of mapPages) {
            data = [...data, ...page.data.map((item) => ({ ...item, page: currentPage }))];
        }

        return data;
    }

    if (structureType === 'list' && listPages && listPages.length > 0) {
        let data: PaginationDataWithPage[] = [];
        for (const page of listPages) {
            data = [...data, ...page.data.map((item) => ({ ...item, page: currentPage }))];
        }

        return data;
    }

    return [];
}

interface Props {
    structureType: StructureType;
}

export function Listing({ structureType }: Props) {
    const { queryParams, setParam } = useSearchQuery('created_at');
    const pageRef = useRef(1);

    const {
        data: mapData,
        error: mapError,
        invalidateQuery: mapInvalidate,
        fetchNextPage: fetchNextMapPage,
        isFetching: isMapFetching,
        hasNextPage: hasNextMapPage,
        isFetchingNextPage: isFetchingNextMapPage,
    } = useMapPagination<StructurePaginationResult<MapStructure>>({
        direction: queryParams.direction,
        orderBy: queryParams.orderBy,
        search: queryParams.search,
        enabled: structureType === 'map',
    });

    const {
        data: listData,
        error: listError,
        invalidateQuery: listInvalidate,
        fetchNextPage: fetchNextListPage,
        isFetching: isListFetching,
        hasNextPage: hasNextListPage,
        isFetchingNextPage: isFetchingNextListPage,
    } = useListPagination<StructurePaginationResult<ListStructure>>({
        direction: queryParams.direction,
        orderBy: queryParams.orderBy,
        search: queryParams.search,
        enabled: structureType === 'list',
    });

    const { data, isFetchingNextPage, hasNextPage, fetchNextPage, error, isFetching } = {
        data: resolveListing(structureType, mapData?.pages, listData?.pages, pageRef.current),
        error: structureType === 'list' ? listError : mapError,
        isFetching: structureType === 'list' ? isListFetching : isMapFetching,
        invalidateQuery: structureType === 'list' ? listInvalidate : mapInvalidate,
        isFetchingNextPage: structureType === 'list' ? isFetchingNextListPage : isFetchingNextMapPage,
        fetchNextPage: structureType === 'list' ? fetchNextListPage : fetchNextMapPage,
        hasNextPage: structureType === 'list' ? hasNextListPage : hasNextMapPage,
    };

    return (
        <>
            <ActionSection
                includeSortBy={['created_at', 'updated_at']}
                title={structureType === 'list' ? 'Lists' : 'Maps'}
                isLoading={isFetching}
                sortBy={queryParams.orderBy || 'created_at'}
                search={queryParams.search || ''}
                direction={queryParams.direction}
                onDirectionChange={(direction) => {
                    setParam('direction', direction as string);
                }}
                onSortChange={(sortType) => {
                    setParam('orderBy', sortType);
                }}
                onSearch={(text) => {
                    setParam('search', text);
                }}
            />

            {data && data.length !== 0 && (
                <div className={gridStyles.container}>
                    <div className={gridStyles.sectionDescription}>
                        <IconInfoCircle size="82px" color="var(--mantine-color-indigo-3)" />
                        <p>
                            When a list or map exists in your code configuration, it is displayed and you can work with
                            it in the app. But when it is not, that means that it exists in the CMS and in the database
                            but you cannot interact with it. The only way to interact with a structure is to enable it
                            in the you code configuration.
                        </p>
                    </div>

                    <div className={gridStyles.root}>
                        <div className={gridStyles.columnGrid}>
                            <p className={gridStyles.column}>NAME</p>
                            <p className={gridStyles.column}>EXISTS IN CONFIG</p>
                            <p className={gridStyles.column}>DATE CREATED</p>
                            <p className={gridStyles.column}>ACTIONS</p>
                        </div>

                        <div className={gridStyles.row}>
                            <>
                                {data.map((item) => (
                                    <GridItem structureType={structureType} key={item.id} item={item} />
                                ))}
                            </>
                        </div>
                    </div>
                </div>
            )}

            <div className={contentContainerStyles.root}>
                {error && (
                    <div className={styles.skeleton}>
                        <UIError title="An error occurred">Something went wrong. Please, try again later.</UIError>
                    </div>
                )}

                {!isFetching && data && data.length === 0 && <NothingFound />}

                {Boolean(data.length) && (
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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import NothingFound from '@app/uiComponents/shared/NothingFound';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/css/ListTable.module.css';
import { Button, Loader, Table } from '@mantine/core';
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

export interface PaginationDataWithPage extends ListStructure, MapStructure {
    page: number;
}

function resolveListing(
    structureType: StructureType,
    mapPages: StructurePaginationResult<MapStructure>[] | undefined,
    listPages: StructurePaginationResult<ListStructure>[] | undefined,
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
        isFetching: isMapFetching,
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
        isFetching: isListFetching,
    } = useListPagination<StructurePaginationResult<ListStructure>>({
        direction: queryParams.direction,
        orderBy: queryParams.orderBy,
        search: queryParams.search,
        enabled: structureType === 'list',
    });

    const { data, error, isFetching, invalidateQuery } = {
        data: resolveListing(structureType, mapData?.pages, listData?.pages, pageRef.current),
        error: structureType === 'list' ? listError : mapError,
        isFetching: structureType === 'list' ? isListFetching : isMapFetching,
        invalidateQuery: structureType === 'list' ? listInvalidate : mapInvalidate,
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

            <div className={gridStyles.sectionDescription}>
                <IconInfoCircle size="82px" color="var(--mantine-color-indigo-3)" />
                <p>
                    When a list or map exists in your code configuration, it is displayed and you can work with it in
                    the app. But when it is not, that means that it exists in the CMS and in the database but you cannot
                    interact with it. The only way to interact with a structure is to enable it in the you code
                    configuration.
                </p>
            </div>

            {data && data.length !== 0 && (
                <div className={gridStyles.container}>
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
                                    <Table.Th>EXISTS IN CONFIG</Table.Th>
                                    <Table.Th>DATE CREATED</Table.Th>
                                    <Table.Th>ACTIONS</Table.Th>
                                </Table.Tr>
                            </Table.Thead>

                            <Table.Tbody>
                                <>
                                    {data.map((item) => (
                                        <GridItem
                                            structureType={structureType}
                                            key={item.id}
                                            item={item}
                                            onStructureRemoved={() => {
                                                invalidateQuery();
                                            }}
                                        />
                                    ))}
                                </>
                            </Table.Tbody>
                        </Table>
                    </Table.ScrollContainer>
                </div>
            )}

            <div className={contentContainerStyles.root}>
                {error && (
                    <div className={styles.skeleton}>
                        <UIError title="An error occurred">Something went wrong. Please, try again later.</UIError>
                    </div>
                )}

                {!isFetching && data && data.length === 0 && <NothingFound />}
            </div>
        </>
    );
}

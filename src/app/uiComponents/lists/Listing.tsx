// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import useDeleteRange from '@app/uiComponents/lists/hooks/useDeleteRange';
import useListVariablesPagination from '@app/uiComponents/lists/hooks/useListVariablesPagination';
import useSearchQuery from '@app/uiComponents/shared/hooks/useSearchQuery';
import ActionSection from '@app/uiComponents/shared/ActionSection';
import DeleteModal from '@app/uiComponents/shared/modals/DeleteModal';
import DraggableList from '@app/uiComponents/shared/listView/DraggableList';
import NothingFound from '@app/uiComponents/shared/NothingFound';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/list/css/ListTable.module.css';
import { Button, Loader } from '@mantine/core';
import React, { useRef, useState } from 'react';
import type { PaginatedVariableResult, PaginationResult } from '@root/types/api/list';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Item from '@app/uiComponents/lists/list/Item';
import rearrange from '@lib/api/declarations/lists/rearrange';
import { useParams } from 'react-router-dom';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import useNotification from '@app/systems/notifications/useNotification';
import UIError from '@app/components/UIError';
import type { StructureType } from '@root/types/shell/shell';
import useMapVariablesPagination from '@app/uiComponents/lists/hooks/useMapVariablesPagination';
import { IconMistOff } from '@tabler/icons-react';

import gridStyles from '@app/uiComponents/lists/css/listGrid.module.css';
import { Item as GridItem } from '@app/uiComponents/lists/gridItem/Item';

export interface PaginationDataWithPage<Value, Metadata> extends PaginatedVariableResult<Value, Metadata> {
    page: number;
}

function resolveListing<Value, Metadata>(
    mapPages: PaginationResult<Value, Metadata>[] | undefined,
    listPages: PaginationResult<Value, Metadata>[] | undefined,
    currentPage: number,
): PaginationDataWithPage<Value, Metadata>[] {
    if (mapPages && mapPages.length > 0) {
        let data: PaginationDataWithPage<Value, Metadata>[] = [];
        for (const page of mapPages) {
            data = [...data, ...page.data.map((item) => ({ ...item, page: currentPage }))];
        }

        return data;
    }

    if (listPages && listPages.length > 0) {
        let data: PaginationDataWithPage<Value, Metadata>[] = [];
        for (const page of listPages) {
            data = [...data, ...page.data.map((item) => ({ ...item, page: currentPage }))];
        }

        return data;
    }

    return [];
}

export function Listing<Value, Metadata>() {
    const { queryParams, setParam } = useSearchQuery();
    const { structureId, structureType } = useParams();
    const structureItem = getProjectMetadataStore()
        .getState()
        .getStructureItemByID(structureId || '');

    const pageRef = useRef(1);
    const { error: errorNotification, success: successNotification } = useNotification();

    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
    const [areItemsDeleting, setAreItemsDeleting] = useState(false);

    const {
        data: mapData,
        error: mapError,
        invalidateQuery: mapInvalidate,
        fetchNextPage: fetchNextMapPage,
        isFetching: isMapFetching,
        hasNextPage: hasNextMapPage,
        isFetchingNextPage: isFetchingNextMapPage,
    } = useMapVariablesPagination<PaginationResult<Value, Metadata>>({
        name: structureItem?.id || '',
        locales: queryParams.locales,
        groups: queryParams.groups,
        direction: queryParams.direction,
        behaviour: queryParams.behaviour,
        orderBy: queryParams.orderBy,
        search: queryParams.search,
        fields: ['groups'],
        enabled: Boolean(structureItem) && structureType === 'map',
    });

    const {
        data: listData,
        error: listError,
        invalidateQuery: listInvalidate,
        fetchNextPage: fetchNextListPage,
        isFetching: isListFetching,
        hasNextPage: hasNextListPage,
        isFetchingNextPage: isFetchingNextListPage,
    } = useListVariablesPagination<PaginationResult<Value, Metadata>>({
        name: structureItem?.id || '',
        locales: queryParams.locales,
        groups: queryParams.groups,
        direction: queryParams.direction,
        behaviour: queryParams.behaviour,
        orderBy: queryParams.orderBy,
        search: queryParams.search,
        fields: ['groups'],
        enabled: Boolean(structureItem) && structureType === 'list',
    });

    const { data, isFetchingNextPage, hasNextPage, fetchNextPage, error, invalidateQuery, isFetching } = {
        data: resolveListing<Value, Metadata>(mapData?.pages, listData?.pages, pageRef.current),
        error: structureType === 'list' ? listError : mapError,
        isFetching: structureType === 'list' ? isListFetching : isMapFetching,
        invalidateQuery: structureType === 'list' ? listInvalidate : mapInvalidate,
        isFetchingNextPage: structureType === 'list' ? isFetchingNextListPage : isFetchingNextMapPage,
        fetchNextPage: structureType === 'list' ? fetchNextListPage : fetchNextMapPage,
        hasNextPage: structureType === 'list' ? hasNextListPage : hasNextMapPage,
    };

    const { mutate: deleteItemsByRange, invalidateQueries } = useDeleteRange(
        structureType as StructureType,
        () => {
            setAreItemsDeleting(false);
            setCheckedItems([]);
            if (structureItem) {
                invalidateQueries(structureItem.id);
            }
            successNotification('Action is a success', 'All selected items were deleted.');
        },
        () => {
            setAreItemsDeleting(false);
            errorNotification('Something wrong', 'An error occurred. Please, try again later.');
        },
    );

    return (
        <>
            {structureItem && structureType && (
                <ActionSection
                    includeSortBy={['created_at', 'updated_at', 'index']}
                    isLoading={isFetching}
                    sortBy={queryParams.orderBy || 'index'}
                    locales={queryParams.locales}
                    search={queryParams.search || ''}
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
                    structureItem={structureItem}
                    onSearch={(text) => {
                        setParam('search', text);
                    }}
                />
            )}

            {structureItem && <div className={gridStyles.container}>
                <div className={gridStyles.root}>
                    <p className={gridStyles.column}></p>
                    <p className={gridStyles.column}>NAME</p>
                    <p className={gridStyles.column}>BEHAVIOUR</p>
                    <p className={gridStyles.column}>LOCALE</p>
                    <p className={gridStyles.column}>GROUPS</p>
                    <p className={gridStyles.column}>CREATED ON</p>
                    <p className={gridStyles.column}>ACTIONS</p>


                    <div className={gridStyles.row}>
                        <DndProvider backend={HTML5Backend}>
                            <DraggableList<Value, Metadata>
                                data={data}
                                structureItem={structureItem}
                                structureType={structureType as StructureType}
                                onRearrange={rearrange}
                                renderItems={(onDrop, onMove, list, hoveredId, movingSource, movingDestination) => (
                                    <>
                                        {list.map((item, i) => (
                                            <GridItem
                                                onMove={onMove}
                                                onDrop={onDrop}
                                                isHovered={item.id === hoveredId}
                                                onChecked={(itemId, checked) => {
                                                    const idx = checkedItems.findIndex((item) => item === itemId);
                                                    if (idx !== -1 && !checked) {
                                                        checkedItems.splice(idx, 1);
                                                        setCheckedItems([...checkedItems]);
                                                        return;
                                                    }

                                                    if (checked) {
                                                        setCheckedItems([...checkedItems, itemId]);
                                                    }
                                                }}
                                                onDeleted={(error) => {
                                                    if (!error) {
                                                        invalidateQuery();
                                                        return;
                                                    }

                                                    if (error && error.error && error.error.data['isParent']) {
                                                        errorNotification(
                                                            'Item is a parent reference',
                                                            'This item is a reference to another item(s). If you wish to delete this item, you must delete the items where you used it as a reference first.',
                                                            15000,
                                                        );

                                                        return;
                                                    }
                                                }}
                                                disabled={Boolean(
                                                    (areItemsDeleting && checkedItems.includes(item.id)) ||
                                                    (movingSource && movingSource === item.id) ||
                                                    (movingDestination && movingDestination === item.id),
                                                )}
                                                key={item.id}
                                                index={i}
                                                item={item}
                                                structureItem={structureItem}
                                            />
                                        ))}
                                    </>
                                )}
                            />
                        </DndProvider>
                    </div>
                </div>
            </div>}


            <div className={contentContainerStyles.root}>
                {checkedItems.length > 0 && (
                    <div className={styles.selectedItemsContainer}>
                        <p>
                            <span>{checkedItems.length}</span> selected
                        </p>
                        <Button
                            loading={areItemsDeleting}
                            onClick={() => setIsDeleteAllModalOpen(true)}
                            color="red"
                            variant="outline"
                            size="xs">
                            Delete selected
                        </Button>
                    </div>
                )}

                {error && (
                    <div className={styles.skeleton}>
                        <UIError title="An error occurred">
                            Something went wrong when trying to fetch list {structureItem?.name}. Please, try again
                            later.
                        </UIError>
                    </div>
                )}

                {!structureItem && (
                    <div className={styles.skeleton}>
                        <UIError title="Route not found">This route does not seem to exist</UIError>
                    </div>
                )}

                {!isFetching && data && data.length === 0 && (
                    <NothingFound
                        createNewPath={
                            (structureItem && `${structureItem.navigationCreatePath}/${structureItem.id}`) || ''
                        }
                    />
                )}

                {data && data.length !== 0 && structureItem && structureType && (
                    <div className={styles.container}>
                        <DndProvider backend={HTML5Backend}>
                            <DraggableList<Value, Metadata>
                                data={data}
                                structureItem={structureItem}
                                structureType={structureType as StructureType}
                                onRearrange={rearrange}
                                renderItems={(onDrop, onMove, list, hoveredId, movingSource, movingDestination) => (
                                    <>
                                        {list.map((item, i) => (
                                            <Item
                                                onMove={onMove}
                                                onDrop={onDrop}
                                                isHovered={item.id === hoveredId}
                                                onChecked={(itemId, checked) => {
                                                    const idx = checkedItems.findIndex((item) => item === itemId);
                                                    if (idx !== -1 && !checked) {
                                                        checkedItems.splice(idx, 1);
                                                        setCheckedItems([...checkedItems]);
                                                        return;
                                                    }

                                                        if (checked) {
                                                            setCheckedItems([...checkedItems, itemId]);
                                                        }
                                                    }}
                                                    onDeleted={(error) => {
                                                        if (!error) {
                                                            invalidateQuery();
                                                            return;
                                                        }

                                                    if (error && error.error && error.error.data['isParent']) {
                                                        errorNotification(
                                                            'Item is a parent reference',
                                                            'This item is a reference to another item(s). If you wish to delete this item, you must delete the items where you used it as a reference first.',
                                                            15000,
                                                        );

                                                        return;
                                                    }
                                                }}
                                                disabled={Boolean(
                                                    (areItemsDeleting && checkedItems.includes(item.id)) ||
                                                        (movingSource && movingSource === item.id) ||
                                                        (movingDestination && movingDestination === item.id),
                                                )}
                                                key={item.id}
                                                index={i}
                                                item={item}
                                                structureItem={structureItem}
                                            />
                                        ))}
                                    </>
                                )}
                            />
                        </DndProvider>

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

                        {checkedItems.length > 0 && (
                            <div className={styles.stickyFooter}>
                                <div className={styles.selectedItemsContainer}>
                                    <p>
                                        <span>{checkedItems.length}</span> selected
                                    </p>
                                    <Button
                                        loading={areItemsDeleting}
                                        onClick={() => setIsDeleteAllModalOpen(true)}
                                        color="red"
                                        variant="outline"
                                        size="xs">
                                        Delete selected
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {structureItem && structureType && (
                <DeleteModal
                    open={isDeleteAllModalOpen}
                    message="Are you sure? This action cannot be undone and these items will be deleted permanently!"
                    onClose={() => setIsDeleteAllModalOpen(false)}
                    onDelete={() => {
                        setAreItemsDeleting(true);
                        setIsDeleteAllModalOpen(false);
                        deleteItemsByRange({
                            items: checkedItems,
                            name: structureItem.id,
                        });
                    }}
                />
            )}
        </>
    );
}

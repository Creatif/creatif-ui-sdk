// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import useDeleteRange from '@app/uiComponents/lists/hooks/useDeleteRange';
import useSearchQuery from '@app/uiComponents/shared/hooks/useSearchQuery';
import ActionSection from '@app/uiComponents/shared/ActionSection';
import DeleteModal from '@app/uiComponents/shared/modals/DeleteModal';
import DraggableList from '@app/uiComponents/shared/listView/DraggableList';
import NothingFound from '@app/uiComponents/shared/NothingFound';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/css/ListTable.module.css';
import { Button, Checkbox, Pagination, Table } from '@mantine/core';
import type { MouseEvent } from 'react';
import React, { useCallback, useRef, useState } from 'react';
import type { PaginationResult } from '@root/types/api/list';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import rearrange from '@lib/api/declarations/lists/rearrange';
import { useParams } from 'react-router-dom';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import useNotification from '@app/systems/notifications/useNotification';
import UIError from '@app/components/UIError';
import type { StructureType } from '@root/types/shell/shell';
import { Item as GridItem } from '@app/uiComponents/lists/gridItem/Item';
import type { ApiError } from '@lib/http/apiError';
import { useMapVariablePagination } from '@app/uiComponents/lists/hooks/useMapVariablePagination';
import { useListVariablePagination } from '@app/uiComponents/lists/hooks/useListVariablePagination';

const LIMIT = 25;

export default function Listing<Value, Metadata>() {
    const { queryParams, setParam } = useSearchQuery();
    const { structureId, structureType } = useParams();
    const structureItem = getProjectMetadataStore()
        .getState()
        .getStructureItemByID(structureId || '');

    const checkedRef = useRef(false);
    const { error: errorNotification, success: successNotification } = useNotification();
    const [page, setPage] = useState(1);

    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
    const [areItemsDeleting, setAreItemsDeleting] = useState(false);

    const {
        data: mapData,
        error: mapError,
        invalidateQuery: mapInvalidate,
        isFetching: isMapFetching,
    } = useMapVariablePagination<PaginationResult<Value, Metadata>>({
        name: structureItem?.id || '',
        limit: LIMIT,
        page: page,
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
        isFetching: isListFetching,
    } = useListVariablePagination<PaginationResult<Value, Metadata>>({
        name: structureItem?.id || '',
        limit: LIMIT,
        page: page,
        locales: queryParams.locales,
        groups: queryParams.groups,
        direction: queryParams.direction,
        behaviour: queryParams.behaviour,
        orderBy: queryParams.orderBy,
        search: queryParams.search,
        fields: ['groups'],
        enabled: Boolean(structureItem) && structureType === 'list',
    });

    const { data, error, invalidateQuery, isFetching } = {
        data: mapData ? mapData : listData,
        error: structureType === 'list' ? listError : mapError,
        isFetching: structureType === 'list' ? isListFetching : isMapFetching,
        invalidateQuery: structureType === 'list' ? listInvalidate : mapInvalidate,
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

    const onChecked = useCallback(
        (itemId: string, checked: boolean) => {
            const idx = checkedItems.findIndex((item) => item === itemId);
            if (idx !== -1 && !checked) {
                checkedItems.splice(idx, 1);
                setCheckedItems([...checkedItems]);
                return;
            }

            if (checked) {
                setCheckedItems([...checkedItems, itemId]);
            }
        },
        [checkedItems],
    );

    const onDeleted = useCallback((error?: ApiError) => {
        if (!error) {
            invalidateQuery();
            return;
        }

        console.log(error);

        if (error && error.error && error.error.data['isParent']) {
            errorNotification(
                'Item is a parent connection',
                'This item is a connection to another item(s). If you wish to delete this item, you must delete the items where you used it as a connection first.',
                15000,
            );

            return;
        }
    }, []);

    const onCheckAll = useCallback(
        (e: MouseEvent) => {
            e.stopPropagation();
            if (!checkedRef.current) {
                setCheckedItems([]);
                return;
            }

            if (!data) return;

            setCheckedItems(data.data.map((item) => item.id));
        },
        [data, checkedItems],
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

            {data && data.data.length !== 0 && structureItem && structureType && (
                <div className={contentContainerStyles.root}>
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
                                    <Table.Th>
                                        <Checkbox
                                            onClick={(e) => {
                                                checkedRef.current = !checkedRef.current;
                                                onCheckAll(e);
                                            }}
                                        />
                                    </Table.Th>
                                    <Table.Th>NAME</Table.Th>
                                    <Table.Th>BEHAVIOUR</Table.Th>
                                    <Table.Th>LOCALE</Table.Th>
                                    <Table.Th>GROUPS</Table.Th>
                                    <Table.Th>CREATED ON</Table.Th>
                                    <Table.Th>ACTIONS</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <DndProvider backend={HTML5Backend}>
                                <DraggableList<Value, Metadata>
                                    data={data.data}
                                    sortingDirection={queryParams.direction}
                                    structureItem={structureItem}
                                    structureType={structureType as StructureType}
                                    onRearrange={rearrange}
                                    renderItems={(onDrop, onMove, list, hoveredId, movingSource, movingDestination) => (
                                        <Table.Tbody>
                                            {list.map((item, i) => (
                                                <GridItem
                                                    onMove={onMove}
                                                    onDrop={onDrop}
                                                    isHovered={item.id === hoveredId}
                                                    onChecked={onChecked}
                                                    onDeleted={onDeleted}
                                                    checked={checkedItems.includes(item.id)}
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
                                        </Table.Tbody>
                                    )}
                                />
                            </DndProvider>
                        </Table>
                    </Table.ScrollContainer>
                </div>
            )}

            {data && data.total > LIMIT && (
                <div className={styles.pagination}>
                    <Pagination total={data.total} radius="xl" value={page} onChange={setPage} />
                </div>
            )}

            <div className={contentContainerStyles.root}>
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

                {!isFetching && data && data.data.length === 0 && (
                    <NothingFound
                        createNewPath={
                            (structureItem && `${structureItem.navigationCreatePath}/${structureItem.id}`) || ''
                        }
                    />
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

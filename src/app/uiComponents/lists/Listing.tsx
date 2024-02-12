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
import { Button, Pagination, Select } from '@mantine/core';
import React, { useState } from 'react';
import type { PaginationResult } from '@root/types/api/list';
import type { TryResult } from '@root/types/shared';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Item from '@app/uiComponents/lists/list/Item';
import rearrange from '@lib/api/declarations/lists/rearrange';
import { useParams } from 'react-router-dom';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import useNotification from '@app/systems/notifications/useNotification';
import UIError from '@app/components/UIError';
import useMapVariablesPagination from '@app/uiComponents/lists/hooks/useMapVariablesPagination';
import type { StructureType } from '@root/types/shell/shell';
export function Listing<Value, Metadata>() {
    const { queryParams, setParam } = useSearchQuery();
    const { structureId, structureType } = useParams();
    const structureItem = getProjectMetadataStore()
        .getState()
        .getStructureItemByID(structureId || '');

    const { error: errorNotification, success: successNotification } = useNotification();

    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
    const [areItemsDeleting, setAreItemsDeleting] = useState(false);

    const {
        data: listData,
        error: listError,
        invalidateQuery: listInvalidate,
        isFetching: listIsFetching,
    } = useListVariablesPagination<TryResult<PaginationResult<Value, Metadata>>>({
        name: structureItem?.id || '',
        page: queryParams.page,
        locales: queryParams.locales,
        groups: queryParams.groups,
        direction: queryParams.direction,
        behaviour: queryParams.behaviour,
        limit: queryParams.limit,
        orderBy: queryParams.orderBy,
        search: queryParams.search,
        fields: ['groups'],
        enabled: Boolean(structureItem) && structureType === 'list',
    });

    const {
        data: mapData,
        error: mapError,
        invalidateQuery: mapInvalidate,
        isFetching: mapIsFetching,
    } = useMapVariablesPagination<TryResult<PaginationResult<Value, Metadata>>>({
        name: structureItem?.id || '',
        page: queryParams.page,
        locales: queryParams.locales,
        groups: queryParams.groups,
        direction: queryParams.direction,
        behaviour: queryParams.behaviour,
        limit: queryParams.limit,
        orderBy: queryParams.orderBy,
        search: queryParams.search,
        fields: ['groups'],
        enabled: Boolean(structureItem) && structureType === 'map',
    });

    const { data, error, invalidateQuery, isFetching } = {
        data: structureType === 'list' ? listData : mapData,
        error: structureType === 'list' ? listError : mapError,
        invalidateQuery: structureType === 'list' ? listInvalidate : mapInvalidate,
        isFetching: structureType === 'list' ? listIsFetching : mapIsFetching,
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

            <div className={contentContainerStyles.root}>
                {data?.result && data.result.total > 0 && (
                    <div className={styles.listChoiceHeading}>
                        <p className={styles.totalInfo}>
                            Showing <span>{queryParams.limit}</span> of <span>{data.result.total}</span> total items
                        </p>
                    </div>
                )}

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

                {data?.result && data.result.total === 0 && (
                    <NothingFound
                        createNewPath={
                            (structureItem && `${structureItem.navigationCreatePath}/${structureItem.id}`) || ''
                        }
                    />
                )}

                {!isFetching && data?.result && data.result.total !== 0 && structureItem && structureType && (
                    <div className={styles.container}>
                        {queryParams.listingType === 'list' && (
                            <DndProvider backend={HTML5Backend}>
                                <DraggableList<Value, Metadata>
                                    data={data.result}
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
                        )}

                        {Boolean(data.result.data.length) && (
                            <div className={styles.stickyPagination}>
                                <Pagination
                                    value={queryParams.page}
                                    onChange={(page) => {
                                        setParam('page', page + '');
                                    }}
                                    radius={20}
                                    boundaries={2}
                                    total={Math.ceil(data.result.total / parseInt(queryParams.limit))}
                                />
                                <Select
                                    label="TOTAL"
                                    onChange={(l) => {
                                        if (!l) {
                                            setParam('limit', '15');
                                            return;
                                        }

                                        setParam('limit', l);
                                    }}
                                    value={queryParams.limit}
                                    placeholder="Limit"
                                    data={['15', '50', '100']}
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

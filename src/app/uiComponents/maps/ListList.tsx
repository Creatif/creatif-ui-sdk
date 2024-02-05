import CenteredError from '@app/components/CenteredError';
import useNotification from '@app/systems/notifications/useNotification';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import useDeleteRange from '@app/uiComponents/maps/hooks/useDeleteRange';
import useHttpPaginationQuery from '@app/uiComponents/maps/hooks/useHttpPaginationQuery';
import useSearchQuery from '@app/uiComponents/maps/hooks/useSearchQuery';
import ActionSection from '@app/uiComponents/shared/ActionSection';
import DeleteModal from '@app/uiComponents/maps/list/DeleteModal';
import NothingFound from '@app/uiComponents/shared/NothingFound';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/maps/list/css/ListTable.module.css';
import MainTableView from '@app/uiComponents/maps/table/MainTableView';
import { Button, Pagination, Select, Tooltip } from '@mantine/core';
import { IconListDetails, IconTable } from '@tabler/icons-react';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import type { PaginationResult } from '@root/types/api/list';
import type { Behaviour } from '@root/types/api/shared';
import type { CurrentSortType } from '@root/types/components/components';
import type { TryResult } from '@root/types/shared';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import DraggableList from '@app/uiComponents/shared/listView/DraggableList';
import rearrange from '@lib/api/declarations/lists/rearrange';
import Item from '@app/uiComponents/maps/list/Item';
import { getProjectMetadataStore } from '@app/systems/stores/projectMetadataStore';
import { useParams } from 'react-router-dom';
import UIError from '@app/components/UIError';
interface Props {
    mapName: string;
}
export function ListList<Value, Metadata>({ mapName }: Props) {
    const { queryParams, setParam } = useSearchQuery();
    const { structureId } = useParams();
    const structureItem = getProjectMetadataStore()
        .getState()
        .getStructureItemByID(structureId || '');

    const { error: errorNotification, success: successNotification } = useNotification();

    const [page, setPage] = useState(queryParams.page);
    const [locales, setLocales] = useState<string[]>(queryParams.locales);
    const [search, setSearch] = useState(queryParams.search);
    const [groups, setGroups] = useState<string[]>(queryParams.groups);
    const [direction, setDirection] = useState<'desc' | 'asc' | undefined>(queryParams.direction);
    const [behaviour, setBehaviour] = useState<Behaviour | undefined>(queryParams.behaviour);
    const [orderBy, setOrderBy] = useState<CurrentSortType>(queryParams.orderBy as CurrentSortType);
    const [limit, setLimit] = useState(queryParams.limit);
    const [fields, setFields] = useState<string[]>(['groups']);

    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
    const [areItemsDeleting, setAreItemsDeleting] = useState(false);
    const [isListView, setIsListView] = useState(true);

    const [isNotFoundError, setIsNotFoundError] = useState(false);

    useEffect(() => {
        if (!structureItem) {
            setIsNotFoundError(true);
        }
    }, [structureItem]);

    const { data, error, invalidateQuery, isFetching } = useHttpPaginationQuery<
        TryResult<PaginationResult<Value, Metadata>>
    >({
        listName: structureItem?.id || '',
        page: page,
        locales: locales,
        groups: groups,
        direction: direction,
        behaviour: behaviour,
        limit: limit as string,
        orderBy: orderBy,
        search: search as string,
        fields: fields,
        enabled: Boolean(structureItem),
    });

    const { mutate: deleteItemsByRange, invalidateQueries } = useDeleteRange(
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
            {structureItem && (
                <ActionSection
                    includeSortBy={['created_at', 'updated_at']}
                    structureType={'map'}
                    isLoading={isFetching}
                    structureItem={structureItem}
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
                />
            )}

            <div className={contentContainerStyles.root}>
                {data?.result && data.result.total > 0 && (
                    <div className={styles.listChoiceHeading}>
                        <p className={styles.totalInfo}>
                            Showing <span>{limit}</span> of <span>{data.result.total}</span> total items
                        </p>

                        <div className={styles.listChoiceListType}>
                            <Tooltip label="List view" position="top-end" arrowOffset={10} arrowSize={4} withArrow>
                                <IconListDetails
                                    onClick={() => setIsListView(true)}
                                    className={classNames(
                                        styles.listChoiceListType_Icon,
                                        isListView ? styles.listChoiceListType_Icon_Highlighted : undefined,
                                    )}
                                    size={24}
                                />
                            </Tooltip>

                            <Tooltip label="Table view" position="top-end" arrowOffset={10} arrowSize={4} withArrow>
                                <IconTable
                                    onClick={() => {
                                        setFields([...fields, 'value', 'metadata']);
                                        setIsListView(false);
                                    }}
                                    className={classNames(
                                        styles.listChoiceListType_Icon,
                                        !isListView ? styles.listChoiceListType_Icon_Highlighted : undefined,
                                    )}
                                    size={24}
                                />
                            </Tooltip>
                        </div>
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
                        <CenteredError title="An error occurred">
                            Something went wrong when trying to fetch items for{' '}
                            <span className={styles.bold}>{mapName}</span>. Please, try again later.
                        </CenteredError>
                    </div>
                )}

                {isNotFoundError && (
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

                {!isFetching && data?.result && data.result.total !== 0 && structureItem && (
                    <div className={styles.container}>
                        {isListView && (
                            <DndProvider backend={HTML5Backend}>
                                <DraggableList<Value, Metadata>
                                    data={data.result}
                                    structureItem={structureItem}
                                    structureType="map"
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
                                                    onDeleted={() => invalidateQuery()}
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

                        {!isListView && <MainTableView<Value, Metadata> data={data.result} isFetching={isFetching} />}

                        {Boolean(data.result.data.length) && (
                            <div className={styles.stickyPagination}>
                                <Pagination
                                    value={page}
                                    onChange={(page) => {
                                        setPage(page);
                                        setParam('page', page+'');
                                    }}
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

            {structureItem && (
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

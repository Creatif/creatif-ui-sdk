import CenteredError from '@app/components/CenteredError';
import useNotification from '@app/systems/notifications/useNotification';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import useDeleteRange from '@app/uiComponents/lists/hooks/useDeleteRange';
import useHttpPaginationQuery from '@app/uiComponents/lists/hooks/useHttpPaginationQuery';
import useSearchQuery from '@app/uiComponents/lists/hooks/useSearchQuery';
import ActionSection from '@app/uiComponents/shared/ActionSection';
import DeleteModal from '@app/uiComponents/lists/list/DeleteModal';
import MainListView from '@app/uiComponents/lists/list/MainListView';
import NothingFound from '@app/uiComponents/lists/list/NothingFound';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/list/css/ListTable.module.css';
import MainTableView from '@app/uiComponents/lists/table/MainTableView';
import { Button, Pagination, Select } from '@mantine/core';
import { IconListDetails, IconTable } from '@tabler/icons-react';
import classNames from 'classnames';
import { useState } from 'react';
import type { PaginationResult } from '@root/types/api/list';
import type { Behaviour } from '@root/types/api/shared';
import type { CurrentSortType } from '@root/types/components/components';
import type { TryResult } from '@root/types/shared';
interface Props {
    listName: string;
}
export function ListList<Value, Metadata>({ listName }: Props) {
    const { queryParams, setParam } = useSearchQuery();
    const { error: errorNotification, success: successNotification } = useNotification();

    const [page, setPage] = useState(queryParams.page);
    const [locales, setLocales] = useState<string[]>(queryParams.locales);
    const [search, setSearch] = useState(queryParams.search);
    const [groups, setGroups] = useState<string[]>(queryParams.groups);
    const [direction, setDirection] = useState<'desc' | 'asc' | undefined>(queryParams.direction);
    const [behaviour, setBehaviour] = useState<Behaviour | undefined>(queryParams.behaviour);
    const [orderBy, setOrderBy] = useState<CurrentSortType>(queryParams.orderBy as CurrentSortType);
    const [limit, setLimit] = useState(queryParams.limit);

    const [checkedItems, setCheckedItems] = useState<string[]>([]);
    const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);
    const [areItemsDeleting, setAreItemsDeleting] = useState(false);
    const [isListView, setIsListView] = useState(true);

    const { data, error, invalidateEntireQuery, isFetching } = useHttpPaginationQuery<
        TryResult<PaginationResult<Value, Metadata>>
    >({
        listName: listName,
        page: page,
        locales: locales,
        groups: groups,
        direction: direction,
        behaviour: behaviour,
        limit: limit as string,
        orderBy: orderBy,
        search: search as string,
        fields: ['groups'],
    });

    const { mutate: deleteItemsByRange, invalidateQueries } = useDeleteRange(
        () => {
            setAreItemsDeleting(false);
            setCheckedItems([]);
            invalidateQueries(listName);
            successNotification('Action is a success', 'All selected items were deleted.');
        },
        () => {
            setAreItemsDeleting(false);
            errorNotification('Something wrong', 'An error occurred. Please, try again later.');
        },
    );

    return (
        <>
            <ActionSection
                includeSortBy={['created_at', 'updated_at', 'index']}
                structureType={'list'}
                isLoading={isFetching}
                sortBy={orderBy}
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
                structureName={listName}
                onSearch={(text) => {
                    setSearch(text);
                    setParam('search', text);
                }}
            />

            <div className={contentContainerStyles.root}>
                {data?.result && data.result.total > 0 && (
                    <div className={styles.listChoiceHeading}>
                        <p className={styles.totalInfo}>
                            Showing <span>{limit}</span> of <span>{data.result.total}</span> total items
                        </p>

                        <div className={styles.listChoiceListType}>
                            <IconListDetails
                                onClick={() => setIsListView(true)}
                                className={classNames(
                                    styles.listChoiceListType_Icon,
                                    isListView ? styles.listChoiceListType_Icon_Highlighted : undefined,
                                )}
                                size={20}
                            />

                            <IconTable
                                onClick={() => setIsListView(false)}
                                className={classNames(
                                    styles.listChoiceListType_Icon,
                                    !isListView ? styles.listChoiceListType_Icon_Highlighted : undefined,
                                )}
                                size={20}
                            />
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
                            Something went wrong when trying to fetch list {listName}. Please, try again later.
                        </CenteredError>
                    </div>
                )}

                {data?.result && data.result.total === 0 && <NothingFound structureName={listName} />}

                {!isFetching && data?.result && data.result.total !== 0 && (
                    <div className={styles.container}>
                        {isListView && (
                            <MainListView<Value, Metadata>
                                data={data.result}
                                listName={listName}
                                onDeleted={() => invalidateEntireQuery()}
                                disabled={{
                                    areItemsDeleting: areItemsDeleting,
                                    checkedItems: checkedItems,
                                }}
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
                            />
                        )}

                        {!isListView && <MainTableView<Value, Metadata> data={data.result} />}

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

            <DeleteModal
                open={isDeleteAllModalOpen}
                message="Are you sure? This action cannot be undone and these items will be deleted permanently!"
                onClose={() => setIsDeleteAllModalOpen(false)}
                onDelete={() => {
                    setAreItemsDeleting(true);
                    setIsDeleteAllModalOpen(false);
                    deleteItemsByRange({
                        items: checkedItems,
                        name: listName,
                    });
                }}
            />
        </>
    );
}

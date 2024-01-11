import CenteredError from '@app/components/CenteredError';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import contentContainerStyles from '@app/uiComponents/css/ContentContainer.module.css';
import useHttpPaginationQuery from '@app/uiComponents/variables/hooks/useHttpPaginationQuery';
import useSearchQuery from '@app/uiComponents/lists/hooks/useSearchQuery';
import ActionSection from '@app/uiComponents/shared/ActionSection';
import MainListView from '@app/uiComponents/variables/MainListView';
import NothingFound from '@app/uiComponents/lists/list/NothingFound';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/uiComponents/lists/list/css/ListTable.module.css';
import MainTableView from '@app/uiComponents/lists/table/MainTableView';
import { Pagination, Select, Tooltip } from '@mantine/core';
import { IconListDetails, IconTable } from '@tabler/icons-react';
import classNames from 'classnames';
import { useState } from 'react';
import type { PaginationResult } from '@root/types/api/list';
import type { Behaviour } from '@root/types/api/shared';
import type { CurrentSortType } from '@root/types/components/components';
import type { TryResult } from '@root/types/shared';
import { getOptions } from '@app/systems/stores/options';
import RuntimeErrorModal from '@app/uiComponents/shared/RuntimeErrorModal';
interface Props {
    name: string;
}
export function ListList<Value, Metadata>({ name }: Props) {
    const { queryParams, setParam } = useSearchQuery('created_at');
    const { error: runtimeError } = getOptions(name);

    const [page, setPage] = useState(queryParams.page);
    const [locales, setLocales] = useState<string[]>(queryParams.locales);
    const [search, setSearch] = useState(queryParams.search);
    const [groups, setGroups] = useState<string[]>(queryParams.groups);
    const [direction, setDirection] = useState<'desc' | 'asc' | undefined>(queryParams.direction);
    const [behaviour, setBehaviour] = useState<Behaviour | undefined>(queryParams.behaviour);
    const [orderBy, setOrderBy] = useState<CurrentSortType>(queryParams.orderBy as CurrentSortType);
    const [limit, setLimit] = useState(queryParams.limit);

    const { data, error, invalidateEntireQuery, isFetching } = useHttpPaginationQuery<
        TryResult<PaginationResult<Value, Metadata>>
    >({
        name: name,
        page: page,
        groups: groups,
        direction: direction,
        behaviour: behaviour,
        limit: limit as string,
        orderBy: orderBy,
        search: search as string,
        locales: locales,
    });

    return (
        <>
            <ActionSection
                structureType="variable"
                includeSortBy={['created_at', 'updated_at']}
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
                structureName={name}
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
                            <Tooltip label="List view" position="top-end" arrowOffset={10} arrowSize={4} withArrow>
                                <IconListDetails
                                    onClick={() => setParam('listingType', 'list')}
                                    className={classNames(
                                        styles.listChoiceListType_Icon,
                                        queryParams.listingType === 'list' ? styles.listChoiceListType_Icon_Highlighted : undefined,
                                    )}
                                    size={24}
                                />
                            </Tooltip>

                            <Tooltip label="Table view" position="top-end" arrowOffset={10} arrowSize={4} withArrow>
                                <IconTable
                                    onClick={() => {
                                        setParam('listingType', 'table');
                                    }}
                                    className={classNames(
                                        styles.listChoiceListType_Icon,
                                        queryParams.listingType === 'table' ? styles.listChoiceListType_Icon_Highlighted : undefined,
                                    )}
                                    size={24}
                                />
                            </Tooltip>
                        </div>
                    </div>
                )}

                {error && (
                    <div className={styles.skeleton}>
                        <CenteredError title="An error occurred">
                            Something went wrong when trying to fetch list {name}. Please, try again later.
                        </CenteredError>
                    </div>
                )}

                {data?.result && data.result.total === 0 && <NothingFound structureName={name} />}

                {!isFetching && data?.result && data.result.total !== 0 && !runtimeError && (
                    <div className={styles.container}>
                        {queryParams.listingType === 'list' && (
                            <MainListView<Value, Metadata>
                                data={data.result}
                                name={name}
                                onDeleted={() => invalidateEntireQuery()}
                            />
                        )}

                        {queryParams.listingType === 'table' && <MainTableView<Value, Metadata> data={data.result} />}

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

            <RuntimeErrorModal open={Boolean(runtimeError)} error={runtimeError} />
        </>
    );
}

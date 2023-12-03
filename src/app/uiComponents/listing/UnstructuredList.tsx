import CenteredError from '@app/components/CenteredError';
import ActionSection from '@app/uiComponents/listing/ActionSection';
import Item from '@app/uiComponents/listing/Item';
import NothingFound from '@app/uiComponents/listing/NothingFound';
import useHttpPaginationQuery from '@app/uiComponents/listing/hooks/useHttpPaginationQuery';
import useSearchQuery from '@app/uiComponents/listing/hooks/useSearchQuery';
import {Pagination, Select} from '@mantine/core';
import { useState } from 'react';
import contentContainerStyles from '../css/ContentContainer.module.css';
import styles from './css/ListTable.module.css';
import type {CurrentSortType} from '@app/uiComponents/listing/types/components';
import type {PaginationResult} from '@lib/api/declarations/types/listTypes';
import type {Behaviour} from '@lib/api/declarations/types/sharedTypes';
interface Props {
  listName: string;
}
export default function UnstructuredList<Value, Metadata>({ listName }: Props) {
	const {queryParams, setParam} = useSearchQuery();
	
	const [page, setPage] = useState(queryParams.page);
	const [search, setSearch] = useState(queryParams.search);
	const [groups, setGroups] = useState<string[]>(queryParams.groups);
	const [direction, setDirection] = useState<'desc' | 'asc' | undefined>(queryParams.direction);
	const [behaviour, setBehaviour] = useState<Behaviour | undefined>(queryParams.behaviour);
	const [orderBy, setOrderBy] = useState<CurrentSortType>(queryParams.orderBy);
	const [limit, setLimit] = useState(queryParams.limit);

	const {data, error, invalidateEntireQuery} = useHttpPaginationQuery<PaginationResult<Value, Metadata>>({
		listName: listName,
		page: page,
		locale: 'hrv',
		groups: groups,
		direction: direction,
		behaviour: behaviour,
		limit: limit as string,
		orderBy: orderBy,
		search: search as string,
	});

	return (
		<>
			<ActionSection
				sortBy={orderBy}
				direction={direction}
				behaviour={behaviour}
				groups={groups}
				onDirectionChange={(direction) => {
					setDirection(direction);
					setParam('direction', direction as string);
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

				{data && data.total > 0 && <p className={styles.totalInfo}>Showing <span>{limit}</span> of <span>{data.total}</span> total items</p>}

				{error && <div className={styles.skeleton}>
					<CenteredError title="An error occurred">
						Something went wrong when trying to fetch list {listName}. Please, try again later.
					</CenteredError>
				</div>}

				{data && data.total === 0 && <NothingFound structureName={listName} />}

				{data && data.total !== 0 && (
					<div className={styles.container}>
						{data.data.map((item) => (
							<Item onDeleted={() => {
								invalidateEntireQuery();
							}} key={item.id} item={item} listName={listName} />
						))}

						<div className={styles.stickyPagination}>
							<Pagination value={page} onChange={setPage} radius={20} boundaries={2} total={Math.ceil(data.total / limit)} />
							<Select label="TOTAL" onChange={(l) => {
								if (!l) {
									setLimit('15');
									return;
								}

								setLimit(l);
							}} value={limit} placeholder="Limit" data={['15', '50', '100', '500', '1000']} styles={{
								root: {
									width: '100px',
								},
								label: {
									fontSize: '0.7rem',
									color: 'var(--mantine-color-gray-6)'
								}
							}} />
						</div>
					</div>
				)}
			</div>
		</>
	);
}

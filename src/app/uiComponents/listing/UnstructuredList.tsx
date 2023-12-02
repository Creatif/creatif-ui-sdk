import CenteredError from '@app/components/CenteredError';
import Loading from '@app/components/Loading';
import ActionSection from '@app/uiComponents/listing/ActionSection';
import Item from '@app/uiComponents/listing/Item';
import useHttpPaginationQuery from '@app/uiComponents/listing/hooks/useHttpPaginationQuery';
import {Alert, Button, Drawer, LoadingOverlay, Pagination, TextInput} from '@mantine/core';
import {IconAdjustments, IconError404, IconSearch} from '@tabler/icons-react';
import { useState } from 'react';
import styles from './css/ListTable.module.css';
import type {CurrentSortType} from '@app/uiComponents/listing/types/components';
import type {PaginationResult} from '@lib/api/declarations/types/listTypes';
import type {Behaviour} from '@lib/api/declarations/types/sharedTypes';
interface Props {
  listName: string;
}
export default function UnstructuredList<Value, Metadata>({ listName }: Props) {
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');
	const [groups, setGroups] = useState<string[]>([]);
	const [behaviour, setBehaviour] = useState<Behaviour | undefined>();
	const [orderBy, setOrderBy] = useState<CurrentSortType | ''>('index');

	const limit = 15;

	const {data, error, invalidateQuery} = useHttpPaginationQuery<PaginationResult<Value, Metadata>>({
		listName: listName,
		page: page,
		locale: 'hrv',
		groups: groups,
		direction: 'desc',
		behaviour: behaviour,
		limit: limit,
		orderBy: orderBy,
		search: search,
	});

	return (
		<>
			<ActionSection onBehaviourChange={setBehaviour} onSortChange={(sortType) => setOrderBy(sortType)} onSelectedGroups={setGroups} structureName={listName} onSearch={(text) => {
				setSearch(text);
			}} />

			<div className={styles.root}>
				{error && <div className={styles.skeleton}>
					<CenteredError title="An error occurred">
						Something went wrong when trying to fetch list {listName}. Please, try again later.
					</CenteredError>
				</div>}

				{data && data.total === 0 && <p className={styles.nothingFound}>
					NOTHING FOUND
				</p>}

				{data && data.total !== 0 && (
					<div className={styles.container}>
						{data.data.map((item) => (
							<Item onDeleted={() => {
								invalidateQuery(listName, page, limit);
							}} key={item.id} item={item} listName={listName} />
						))}

						<div className={styles.stickyPagination}>
							<Pagination value={page} onChange={setPage} radius={20} boundaries={2} total={Math.ceil(data.total / limit)} />
						</div>
					</div>
				)}
			</div>
		</>
	);
}

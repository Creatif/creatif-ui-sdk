import CenteredError from '@app/components/CenteredError';
import Loading from '@app/components/Loading';
import Item from '@app/uiComponents/listing/Item';
import useHttpPaginationQuery from '@app/uiComponents/listing/hooks/useHttpPaginationQuery';
import { useState } from 'react';
import styles from './css/ListTable.module.css';
import type {PaginationResult} from '@lib/api/declarations/types/listTypes';
interface Props {
  listName: string;
}
export default function UnstructuredList<Value, Metadata>({ listName }: Props) {
	const [page] = useState(1);
	const limit = 15;

	const {isFetching, data, error, invalidateQuery} = useHttpPaginationQuery<PaginationResult<Value, Metadata>>({
		listName: listName,
		page: page,
		locale: 'hrv',
		limit: limit,
	});

	return (
		<>
			{isFetching && (
				<div className={styles.skeleton}>
					<Loading isLoading={true} />
				</div>
			)}

			{error && <div className={styles.skeleton}>
				<CenteredError title="An error occurred">
					Something went wrong when trying to fetch list {listName}. Please, try again later.
				</CenteredError>
			</div>}

			{!isFetching && data && (
				<div className={styles.container}>
					{data.data.map((item) => (
						<Item onDeleted={() => {
							invalidateQuery(listName, page, limit);
						}} key={item.id} item={item} listName={listName} />
					))}
				</div>
			)}
		</>
	);
}

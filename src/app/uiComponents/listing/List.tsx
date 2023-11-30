import Loading from '@app/components/Loading';
import {paginateListItems} from '@lib/api/declarations/lists/paginateListItems';
import {getProjectMetadata} from '@lib/api/project/getProjectMetadata';
import {Pill} from '@mantine/core';
import {IconChevronRight, IconDots, IconPlus, IconReplace, IconWorld} from '@tabler/icons-react';
import {useEffect, useState} from 'react';
import styles from './css/ListTable.module.css';
import type {PaginatedVariableResult} from '@lib/api/declarations/types/listTypes';
interface Props {
    listName: string;
}
export default function List({listName}: Props) {
	const [items, setItems] = useState<PaginatedVariableResult<any, any>[]>([]);
	const [isFetching, setIsFetching] = useState(true);
	const [page, setPage] = useState(1);
	const limit = 15;



	useEffect(() => {
		paginateListItems<any, any>({
			name: listName,
			page: page,
			limit: limit,
		}).then(({result}) => {
			if (result) {
				setItems(result.data);
				setIsFetching(false);
			}
		});
	}, [page]);

	return <>
		{isFetching && <div className={styles.skeleton}>
			<Loading isLoading={true} />
		</div>}

		{!isFetching && <div className={styles.container}>
			{items.map(item => <div className={styles.item}>
				<div className={styles.infoColumn}>
					<h2 className={styles.name}>
						<span>{item.name}</span>
						<span className={styles.locale}>
							<IconWorld size={20} />
							{item.locale}
						</span>
					</h2>

					<div className={styles.information}>
						<div className={styles.behaviour}>
							<IconReplace className={item.behaviour === 'modifiable' ? styles.modifiable : styles.readonly} size={20} />
							<p>{item.behaviour === 'modifiable' ? 'Modifiable' : 'Readonly'}</p>
						</div>

						{item.groups && <div className={styles.groups}>
							{item.groups.slice(0, 3).map(item => <Pill style={{
								backgroundColor: 'var(--mantine-color-blue-0)',
							}}>{item}</Pill>)}
							{item.groups.length > 3 && <p className={styles.groupsSize}><IconPlus size={10} />{item.groups.length - 3} more</p>}
						</div>}
					</div>
				</div>

				<div className={styles.menu}>
					<IconChevronRight className={styles.dropdownIcon} />
				</div>
			</div>)}
		</div>}
	</>;
}
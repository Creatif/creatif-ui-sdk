import { Initialize } from '@app/initialize';
import { queryConstructor } from '@lib/api/declarations/queryConstructor';
import { declarations } from '@lib/http/axios';
import useHttpQuery from '@lib/http/useHttpQuery';
import { useQueryClient } from 'react-query';
import type { Behaviour } from '@lib/api/declarations/types/sharedTypes';
interface Props {
  listName: string;
  locale?: string;
  limit?: string;
  page?: number;
  behaviour?: Behaviour | undefined;
  groups?: string[];
  orderBy?: string;
  search?: string;
  direction?: 'desc' | 'asc';
}
export default function useHttpPaginationQuery<Response>({
	listName,
	search = '',
	limit = '15',
	page = 1,
	groups = [],
	orderBy = 'created_at',
	direction = 'desc',
	behaviour = undefined,
	locale = '',
}: Props) {
	const queryClient = useQueryClient();

	return {
		...useHttpQuery<Response>(
			declarations(),
			[
				listName,
				{
					page: page,
					limit: limit,
					groups: groups,
					behaviour: behaviour,
					orderBy: orderBy,
					locale: locale,
					direction: direction,
					search: search,
				},
			],
			`/lists/${Initialize.ProjectID()}/${listName}${queryConstructor(
				page,
				limit,
				groups,
				orderBy,
				direction,
				search,
				behaviour,
				locale,
			)}`,
		),
		invalidateQuery(
			listName: string,
			page = 1,
			limit = '15',
			groups: string[] = [],
			orderBy = 'created_at',
			direction = 'desc',
			locale = '',
		) {
			queryClient.invalidateQueries([
				listName,
				{
					page: page,
					limit: limit,
					groups: groups,
					behaviour: behaviour,
					orderBy: orderBy,
					direction: direction,
					search: search,
					locale: locale,
				},
			]);
		},
		invalidateEntireQuery() {
			queryClient.invalidateQueries(listName);
		},
	};
}

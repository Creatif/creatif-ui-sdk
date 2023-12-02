import {Initialize} from '@app/initialize';
import {queryConstructor} from '@lib/api/declarations/queryConstructor';
import {declarations} from '@lib/http/axios';
import useHttpQuery from '@lib/http/useHttpQuery';
import {useQueryClient} from 'react-query';
interface Props {
    listName: string;
    locale?: string;
    limit?: number;
    page?: number;
    groups?: string[];
    orderBy?: string;
    direction?: 'desc' | 'asc';
}
export default function useHttpPaginationQuery<Response>({listName, limit = 15, page = 1, groups = [], orderBy = 'created_at', direction = 'desc', locale}: Props) {
	const queryClient = useQueryClient();

	return {
		...useHttpQuery<Response>(
			declarations(),
			[listName, {
				page: page,
				limit: limit,
				groups: groups,
				orderBy: orderBy,
				direction: direction,
			}],
			`/lists/${Initialize.ProjectID()}/${locale ? locale : Initialize.Locale()}/${listName}${queryConstructor(page, limit, groups, orderBy, direction)}`,
		),
		invalidateQuery(listName: string, page = 1, limit = 15, groups = [], orderBy = 'created_at', direction = 'desc') {
			queryClient.invalidateQueries([listName, {
				page: page,
				limit: limit,
				groups: groups,
				orderBy: orderBy,
				direction: direction,
			}]);
		}
	};
}
import { useSearchParams } from 'react-router-dom';
import type { CurrentSortType } from '@app/uiComponents/listing/types/components';
import type { Behaviour } from '@lib/api/declarations/types/sharedTypes';

class QueryParams {
	public readonly page: number = 1;
	public readonly groups: string[] = [];
	public readonly direction: 'desc' | 'asc' | undefined = 'desc';
	public readonly behaviour: Behaviour | undefined = undefined;
	public readonly orderBy: CurrentSortType = 'index';
	constructor(
    private readonly hiddenPage: string | null,
    readonly limit: string | null,
    private readonly hiddenDirection: string | null,
    private readonly hiddenOrderBy: string | null,
    private readonly hiddenGroups: string | null,
    private readonly hiddenBehaviour: string | null,
    readonly search: string | null,
	) {
		if (!hiddenPage) {
			this.page = 1;
		} else {
			const p = parseInt(hiddenPage);
			if (isNaN(p)) {
				this.page = 1;
			}

			if (!p) {
				this.page = 1;
			}
		}

		if (!hiddenGroups) {
			this.groups = [];
		} else if (hiddenGroups) {
			this.groups = hiddenGroups.split(',');
		}

		if (!limit) {
			this.limit = '15';
		}

		if (this.hiddenDirection !== 'desc' && this.hiddenDirection !== 'asc') {
			this.direction = 'desc';
		} else {
			this.direction = hiddenDirection as 'desc' | 'asc' | undefined;
		}

		if (
			this.hiddenBehaviour !== 'modifiable' &&
      this.hiddenBehaviour !== 'readonly'
		) {
			this.behaviour = undefined;
		} else {
			this.behaviour = hiddenBehaviour as Behaviour | undefined;
		}
	}
}
export default function useSearchQuery() {
	const [params, setParams] = useSearchParams();

	const q = new QueryParams(
		params.get('page'),
		params.get('limit'),
		params.get('direction'),
		params.get('orderBy'),
		params.get('groups'),
		params.get('behaviour'),
		params.get('search'),
	);
	return {
		queryParams: q,
		setParam: (key: string, value: string) => {
			setParams({
				page: q.page + '',
				limit: q.limit + '',
				groups: Array.isArray(q.groups) ? q.groups.join(',') : '',
				direction: q.direction ? q.direction : '',
				orderBy: q.orderBy,
				behaviour: q.behaviour ? q.behaviour : '',
				search: q.search ? q.search : '',
				[key]: value,
			});
		},
	};
}

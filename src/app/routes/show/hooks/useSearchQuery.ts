import { useSearchParams } from 'react-router-dom';
import type { CurrentSortType } from '@root/types/components/components';
import type { Behaviour } from '@root/types/api/shared';

class QueryParams {
    public readonly page: string = '1';
    public readonly groups: string[] = [];
    public readonly direction: 'desc' | 'asc' | undefined = 'desc';
    public readonly behaviour: Behaviour | undefined = undefined;
    public readonly orderBy: CurrentSortType | undefined = undefined;
    public readonly locales: string[] = [];

    constructor(
        private readonly hiddenPage: string | null,
        private readonly hiddenLocales: string | undefined,
        private readonly hiddenDirection: string | undefined,
        private readonly hiddenOrderBy: CurrentSortType | undefined,
        private readonly hiddenGroups: string | undefined,
        private readonly hiddenBehaviour: string | undefined,
        readonly search: string | undefined,
        readonly activeTab: string,
    ) {
        if (this.hiddenPage) {
            this.page = this.hiddenPage + '';
        }

        if (!hiddenGroups) {
            this.groups = [];
        } else if (hiddenGroups) {
            this.groups = hiddenGroups.split(',');
        }

        if (this.hiddenDirection !== 'desc' && this.hiddenDirection !== 'asc') {
            this.direction = 'desc';
        } else {
            this.direction = hiddenDirection as 'desc' | 'asc' | undefined;
        }

        if (this.hiddenBehaviour !== 'modifiable' && this.hiddenBehaviour !== 'readonly') {
            this.behaviour = undefined;
        } else {
            this.behaviour = hiddenBehaviour as Behaviour | undefined;
        }

        if (!search) {
            this.search = '';
        }

        if (!hiddenLocales) {
            this.locales = [];
        } else if (hiddenLocales) {
            this.locales = hiddenLocales.split(',');
        }

        this.orderBy = hiddenOrderBy;
    }
}
export default function useSearchQuery(orderBy: CurrentSortType = 'created_at') {
    const [params, setParams] = useSearchParams();

    const q = new QueryParams(
        params.get('page'),
        params.get('locales') || '',
        params.get('direction') || 'desc',
        (params.get('orderBy') as CurrentSortType | undefined) || orderBy,
        params.get('groups') || '',
        params.get('behaviour') || '',
        params.get('search') || '',
        params.get('activeTab') || 'structure',
    );

    return {
        queryParams: q,
        setParam: (key: string, value: string) => {
            setParams({
                ...params,
                page: q.page,
                locales: Array.isArray(q.locales) ? q.locales.join(',') : '',
                groups: Array.isArray(q.groups) ? q.groups.join(',') : '',
                direction: q.direction ? q.direction : '',
                orderBy: q.orderBy || orderBy,
                behaviour: q.behaviour ? q.behaviour : '',
                search: q.search ? q.search : '',
                activeTab: q.activeTab ? q.activeTab : 'structure',
                [key]: value,
            });
        },
    };
}

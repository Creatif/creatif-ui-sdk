import { useSearchParams } from 'react-router-dom';
import type { CurrentSortType } from '@root/types/components/components';

class QueryParams {
    public readonly direction: 'desc' | 'asc' | undefined = 'desc';
    public readonly orderBy: CurrentSortType | undefined = undefined;
    constructor(
        private readonly hiddenDirection: string | undefined,
        private readonly hiddenOrderBy: CurrentSortType | undefined,
        readonly search: string | undefined,
    ) {
        if (this.hiddenDirection !== 'desc' && this.hiddenDirection !== 'asc') {
            this.direction = 'desc';
        } else {
            this.direction = hiddenDirection as 'desc' | 'asc' | undefined;
        }

        if (!search) {
            this.search = '';
        }

        this.orderBy = hiddenOrderBy;
    }
}
export default function useSearchQuery(orderBy: CurrentSortType = 'index') {
    const [params, setParams] = useSearchParams();

    const q = new QueryParams(
        params.get('direction') || 'desc',
        (params.get('orderBy') as CurrentSortType | undefined) || orderBy,
        params.get('search') || '',
    );

    return {
        queryParams: q,
        setParam: (key: string, value: string) => {
            setParams({
                ...params,
                direction: q.direction ? q.direction : '',
                orderBy: q.orderBy || orderBy,
                search: q.search ? q.search : '',
                [key]: value,
            });
        },
    };
}

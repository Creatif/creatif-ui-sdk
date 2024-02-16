import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useInfiniteQuery, useQuery, useQueryClient } from 'react-query';
import type { Behaviour } from '@root/types/api/shared';
import paginateMapVariables from '@lib/api/declarations/maps/paginateMapVariables';
import type { ApiError } from '@lib/http/apiError';
import { Runtime } from '@app/runtime/Runtime';
interface Props {
    name: string;
    locales?: string[];
    limit?: string;
    page?: number;
    behaviour?: Behaviour | undefined;
    groups?: string[];
    orderBy?: string;
    search?: string;
    direction?: 'desc' | 'asc';
    fields?: string[];
    enabled?: boolean;
}
export default function useMapVariablesPagination<Response>({
    name,
    search = '',
    limit = '15',
    groups = [],
    orderBy = 'created_at',
    direction = 'desc',
    behaviour = undefined,
    locales = [],
    page = 1,
    fields = [],
    enabled = true,
}: Props) {
    const queryClient = useQueryClient();
    const key = [name, limit, groups, behaviour, orderBy, locales, direction, search, fields];

    async function fetchListing({ page = 1 }) {
        const fetchFn = throwIfHttpFails(() =>
            paginateMapVariables({
                name: name,
                projectId: Runtime.instance.credentials.projectId,
                page,
                limit,
                groups,
                orderBy,
                direction,
                search,
                behaviour,
                locales,
                fields,
            }),
        );

        const response = await fetchFn();

        return response.result.data;
    }

    return {
        ...useInfiniteQuery<unknown, ApiError, Response>(key, fetchListing, {
            enabled,
            getNextPageParam: (lastPage) => 5,
            retry: 1,
            staleTime: Infinity,
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        }),
        invalidateQuery() {
            queryClient.invalidateQueries(key);
        },
    };
}

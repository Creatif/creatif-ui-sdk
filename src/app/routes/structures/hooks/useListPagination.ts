import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import type { Behaviour } from '@root/types/api/shared';
import type { ApiError } from '@lib/http/apiError';
import { Runtime } from '@app/systems/runtime/Runtime';
import type { PaginationResult } from '@root/types/api/list';
import paginateLists from '@lib/api/structures/paginateLists';
interface Props {
    limit?: string;
    orderBy?: string;
    search?: string;
    direction?: 'desc' | 'asc';
    enabled?: boolean;
}
export default function useListPagination<Response>({
    search = '',
    limit = '25',
    orderBy = 'created_at',
    direction = 'desc',
    enabled = true,
}: Props) {
    const queryClient = useQueryClient();
    const key = ['list', limit, orderBy, direction, search];

    async function fetchPage({ pageParam = 1 }) {
        const response = await throwIfHttpFails(() =>
            paginateLists({
                projectId: Runtime.instance.currentProjectCache.getProject().id,
                page: pageParam,
                limit,
                orderBy,
                direction,
                search,
            }),
        );

        if (response.result) {
            return response.result;
        }

        return undefined;
    }

    return {
        ...useInfiniteQuery<unknown, ApiError, Response>(key, fetchPage, {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            getNextPageParam: (
                lastPage: PaginationResult<Response, unknown>,
                allPages: PaginationResult<Response, unknown>[],
            ) => {
                for (const page of allPages) {
                    if (page?.data.length === 0) {
                        return undefined;
                    }
                }

                return lastPage.page + 1;
            },
            enabled,
            retry: 3,
            refetchOnWindowFocus: false,
            keepPreviousData: false,
            staleTime: -1,
        }),
        invalidateQuery() {
            queryClient.invalidateQueries(key);
        },
    };
}

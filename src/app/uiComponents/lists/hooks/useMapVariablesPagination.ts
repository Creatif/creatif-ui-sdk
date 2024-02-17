import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import type { Behaviour } from '@root/types/api/shared';
import paginateMapVariables from '@lib/api/declarations/maps/paginateMapVariables';
import type { ApiError } from '@lib/http/apiError';
import { Runtime } from '@app/runtime/Runtime';
import type { PaginationResult } from '@root/types/api/list';
interface Props {
    name: string;
    locales?: string[];
    limit?: string;
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
    limit = '100',
    groups = [],
    orderBy = 'created_at',
    direction = 'desc',
    behaviour = undefined,
    locales = [],
    fields = [],
    enabled = true,
}: Props) {
    const queryClient = useQueryClient();
    const key = [name, limit, groups, behaviour, orderBy, locales, direction, search, fields];

    async function fetchPage({ pageParam = 1 }) {
        const fn = throwIfHttpFails(() =>
            paginateMapVariables({
                name: name,
                projectId: Runtime.instance.credentials.projectId,
                page: pageParam,
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

        const response = await fn();
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
            retry: 1,
            refetchOnWindowFocus: false,
        }),
        invalidateQuery() {
            queryClient.invalidateQueries(key);
        },
    };
}

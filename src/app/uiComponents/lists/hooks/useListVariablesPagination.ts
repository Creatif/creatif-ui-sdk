import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useQuery, useQueryClient } from 'react-query';
import type { Behaviour } from '@root/types/api/shared';
import paginateList from '@lib/api/declarations/lists/paginateList';
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
export default function useListVariablesPagination<Response>({
    name,
    search = '',
    limit = '15',
    page = 1,
    groups = [],
    orderBy = 'created_at',
    direction = 'desc',
    behaviour = undefined,
    locales = [],
    fields = [],
    enabled = true,
}: Props) {
    const queryClient = useQueryClient();

    const key = [name, page, limit, groups, behaviour, orderBy, locales, direction, search, fields];

    return {
        ...useQuery<unknown, ApiError, Response>(
            key,
            throwIfHttpFails(() =>
                paginateList({
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
            ),
            {
                retry: 1,
                enabled,
                staleTime: Infinity,
                keepPreviousData: true,
                refetchOnWindowFocus: false,
            },
        ),
        invalidateQuery() {
            queryClient.invalidateQueries(key);
        },
    };
}

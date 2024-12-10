import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useQuery, useQueryClient } from 'react-query';
import type { Behaviour } from '@root/types/api/shared';
import type { ApiError } from '@lib/http/apiError';
import { Runtime } from '@app/systems/runtime/Runtime';
import paginateListVariables from '@lib/api/declarations/lists/paginateListVariables';
interface Props {
    name: string;
    locales?: string[];
    limit?: number;
    page?: number;
    behaviour?: Behaviour | undefined;
    groups?: string[];
    orderBy?: string;
    search?: string;
    direction?: 'desc' | 'asc';
    fields?: string[];
    enabled?: boolean;
}
export function useListVariablePagination<Response>({
    name,
    search = '',
    page = 1,
    limit = 25,
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
            async () => {
                const response = await throwIfHttpFails(() =>
                    paginateListVariables({
                        name: name,
                        projectId: Runtime.instance.currentProjectCache.getProject().id,
                        page: page,
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

                if (response.result) {
                    return response.result;
                }

                return undefined;
            },
            {
                enabled,
                retry: 1,
                refetchOnWindowFocus: false,
                keepPreviousData: true,
                staleTime: Infinity,
            },
        ),
        invalidateQuery() {
            queryClient.invalidateQueries(key);
        },
    };
}

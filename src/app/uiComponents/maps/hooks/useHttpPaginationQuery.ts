import { Credentials } from '@app/credentials';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useQuery, useQueryClient } from 'react-query';
import type { Behaviour } from '@root/types/api/shared';
import paginateMapVariables from '@lib/api/declarations/maps/paginateMapVariables';
import type { ApiError } from '@lib/http/apiError';
interface Props {
    listName: string;
    locales?: string[];
    limit?: string;
    page?: number;
    behaviour?: Behaviour | undefined;
    groups?: string[];
    orderBy?: string;
    search?: string;
    direction?: 'desc' | 'asc';
    fields?: string[];
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
    locales = [],
    fields = [],
}: Props) {
    const queryClient = useQueryClient();
    const key = [listName, page, limit, groups, behaviour, orderBy, locales, direction, search, fields];

    return {
        ...useQuery<unknown, ApiError, Response>(
            key,
            throwIfHttpFails(() =>
                paginateMapVariables({
                    name: listName,
                    projectId: Credentials.ProjectID(),
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

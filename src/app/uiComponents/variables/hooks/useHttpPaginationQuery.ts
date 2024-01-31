import { Credentials } from '@app/credentials';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useQuery, useQueryClient } from 'react-query';
import type { Behaviour } from '@root/types/api/shared';
import paginateVariables from '@lib/api/declarations/variables/paginateVariables';
import type { CurrentSortType } from '@root/types/components/components';
import type { ApiError } from '@lib/http/apiError';
interface Props {
    name: string;
    locales?: string[];
    limit?: string;
    page?: number;
    behaviour?: Behaviour | undefined;
    groups?: string[];
    orderBy?: CurrentSortType;
    search?: string;
    direction?: 'desc' | 'asc';
    fields?: string[];
}
export default function useHttpPaginationQuery<Response>({
    name,
    search = '',
    limit = '15',
    page = 1,
    groups = [],
    orderBy = 'created_at',
    direction = 'desc',
    behaviour = undefined,
    locales = [],
}: Props) {
    const queryClient = useQueryClient();
    const key = [name, page, limit, groups, behaviour, orderBy, direction, search, locales];

    return {
        ...useQuery<unknown, ApiError, Response>(
            key,
            throwIfHttpFails(() =>
                paginateVariables({
                    name: name,
                    projectId: Credentials.ProjectID(),
                    page,
                    limit,
                    groups,
                    orderBy,
                    direction,
                    search,
                    behaviour,
                    locales,
                }),
            ),
            {
                retry: 1,
                keepPreviousData: true,
                refetchOnWindowFocus: false,
            },
        ),
        invalidateQuery() {
            queryClient.invalidateQueries(key);
        },
    };
}

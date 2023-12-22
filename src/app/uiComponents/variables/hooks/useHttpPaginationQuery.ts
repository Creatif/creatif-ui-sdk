import { Initialize } from '@app/initialize';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import useHttpQuery from '@lib/http/useHttpQuery';
import { useQueryClient } from 'react-query';
import type { Behaviour } from '@root/types/api/shared';
import paginateVariables from '@lib/api/declarations/variables/paginateVariables';
import type { CurrentSortType } from '@root/types/components/components';
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

    return {
        ...useHttpQuery<Response>(
            [
                name,
                {
                    page: page,
                    limit: limit,
                    groups: groups,
                    behaviour: behaviour,
                    orderBy: orderBy,
                    direction: direction,
                    search: search,
                    locales: locales,
                },
            ],
            throwIfHttpFails(() =>
                paginateVariables({
                    name: name,
                    projectId: Initialize.ProjectID(),
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
        ),
        invalidateQuery(
            name: string,
            page = 1,
            limit = '15',
            groups: string[] = [],
            orderBy = 'created_at',
            direction = 'desc',
        ) {
            queryClient.invalidateQueries([
                name,
                {
                    page: page,
                    limit: limit,
                    groups: groups,
                    behaviour: behaviour,
                    orderBy: orderBy,
                    direction: direction,
                    search: search,
                },
            ]);
        },
        invalidateEntireQuery() {
            queryClient.invalidateQueries(name);
        },
    };
}

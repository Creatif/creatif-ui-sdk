import { Initialize } from '@app/initialize';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import useHttpQuery from '@lib/http/useHttpQuery';
import { useQueryClient } from 'react-query';
import type { Behaviour } from '@root/types/api/shared';
import paginateList from '@lib/api/declarations/lists/paginateList';
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

    return {
        ...useHttpQuery<Response>(
            [
                listName,
                {
                    page: page,
                    limit: limit,
                    groups: groups,
                    behaviour: behaviour,
                    orderBy: orderBy,
                    locale: locales,
                    direction: direction,
                    search: search,
                    fields: fields,
                },
            ],
            throwIfHttpFails(() =>
                paginateList({
                    name: listName,
                    projectId: Initialize.ProjectID(),
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
        ),
        invalidateQuery(
            listName: string,
            page = 1,
            limit = '15',
            groups: string[] = [],
            orderBy = 'created_at',
            direction = 'desc',
            locales: string[] = [],
        ) {
            queryClient.invalidateQueries([
                listName,
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
            ]);
        },
        invalidateEntireQuery() {
            queryClient.invalidateQueries(listName);
        },
    };
}

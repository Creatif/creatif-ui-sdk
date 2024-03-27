import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useInfiniteQuery, useQueryClient } from 'react-query';
import type { Behaviour } from '@root/types/api/shared';
import type { ApiError } from '@lib/http/apiError';
import paginateReferences from '@lib/api/declarations/references/paginateMapVariables';
import { Runtime } from '@app/runtime/Runtime';
import type { PaginationResult } from '@root/types/api/list';
interface Props {
    parentId: string;
    childId: string;
    childStructureId: string;
    parentStructureId: string;
    structureType: string;
    relationshipType: string;
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
export default function usePaginateReferences<Response>({
    parentId,
    childId,
    structureType,
    relationshipType,
    childStructureId,
    parentStructureId,
    search = '',
    limit = '25',
    page = 1,
    groups = [],
    orderBy = 'created_at',
    direction = 'desc',
    behaviour = undefined,
    locales = [],
    fields = [],
}: Props) {
    const queryClient = useQueryClient();
    const key = [
        parentId,
        childId,
        structureType,
        relationshipType,
        page,
        limit,
        groups,
        behaviour,
        orderBy,
        locales,
        direction,
        search,
        fields,
    ];

    async function fetchPage({ pageParam = 1 }) {
        const { result } = await throwIfHttpFails(() =>
            paginateReferences({
                parentId,
                childId,
                structureType,
                relationshipType,
                parentStructureId,
                childStructureId,
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

        if (result) {
            return result;
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

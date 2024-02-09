import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useQuery, useQueryClient } from 'react-query';
import type { Behaviour } from '@root/types/api/shared';
import type { ApiError } from '@lib/http/apiError';
import paginateReferences from '@lib/api/declarations/references/paginateMapVariables';
import { Runtime } from '@app/runtime/Runtime';
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

    return {
        ...useQuery<unknown, ApiError, Response>(
            key,
            throwIfHttpFails(() =>
                paginateReferences({
                    parentId,
                    childId,
                    structureType,
                    relationshipType,
                    parentStructureId,
                    childStructureId,
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

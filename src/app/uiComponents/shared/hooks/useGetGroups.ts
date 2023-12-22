import { Initialize } from '@app/initialize';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useQuery, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { TryResult } from '@root/types/shared';
import getGroups from '@lib/api/declarations/shared/getGroups';
export default function useGetGroups(structureType: string, structureId: string) {
    const queryClient = useQueryClient();
    const key = `get_groups_${structureType}_${structureId}`;
    return {
        ...useQuery<TryResult<string[]>, ApiError>(
            key,
            async () => {
                const fn = throwIfHttpFails<string[]>(() =>
                    getGroups({
                        structureType: structureType,
                        structureId: structureId,
                        projectId: Initialize.ProjectID(),
                    }),
                );

                return await fn();
            },
            {
                retry: 1,
                staleTime: Infinity,
                refetchOnWindowFocus: false,
            },
        ),
        invalidateQueries: () => {
            queryClient.invalidateQueries(key);
        },
    };
}

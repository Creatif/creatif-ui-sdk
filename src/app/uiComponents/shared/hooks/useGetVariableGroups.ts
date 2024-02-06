import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useQuery, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { TryResult } from '@root/types/shared';
import { Runtime } from '@app/runtime/Runtime';
import getVariableGroups from '@lib/api/declarations/shared/getVariableGroups';
export default function useGetVariableGroups(
    structureType: string,
    structureId: string,
    itemId: string,
    enabled?: boolean,
) {
    const queryClient = useQueryClient();
    const key = ['get_groups', structureType, structureId];
    return {
        ...useQuery<TryResult<string[]>, ApiError>(
            key,
            async () => {
                const fn = throwIfHttpFails<string[]>(() =>
                    getVariableGroups({
                        structureType: structureType,
                        structureId: structureId,
                        itemId: itemId,
                        projectId: Runtime.instance.credentials.projectId,
                    }),
                );

                return await fn();
            },
            {
                enabled: typeof enabled === 'boolean' ? enabled : true,
                retry: 1,
                refetchOnWindowFocus: false,
            },
        ),
        invalidateQueries: () => {
            queryClient.invalidateQueries(key);
        },
    };
}

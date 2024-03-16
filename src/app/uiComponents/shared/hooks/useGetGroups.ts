import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useQuery, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { TryResult } from '@root/types/shared';
import { Runtime } from '@app/runtime/Runtime';
import { getGroups } from '@lib/api/groups/getGroups';
import type { Group } from '@root/types/api/groups';
export default function useGetGroups(enabled?: boolean) {
    const queryClient = useQueryClient();
    const key = ['get_all_groups'];
    return {
        ...useQuery<TryResult<Group[]>, ApiError>(
            key,
            async () =>
                await throwIfHttpFails<Group[]>(() =>
                    getGroups({
                        projectId: Runtime.instance.credentials.projectId,
                    }),
                ),
            {
                enabled: typeof enabled === 'boolean' ? enabled : true,
                retry: 1,
                refetchOnWindowFocus: false,
                keepPreviousData: true,
            },
        ),
        invalidateQueries: () => {
            queryClient.invalidateQueries(key);
        },
    };
}

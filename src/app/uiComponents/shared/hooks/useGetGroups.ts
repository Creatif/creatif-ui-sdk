import { throwIfHttpFails } from '@lib/http/tryHttp';
import { useQuery, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { TryResult } from '@root/types/shared';
import { Runtime } from '@app/runtime/Runtime';
import { getGroups } from '@lib/api/groups/getGroups';
export default function useGetGroups(enabled?: boolean) {
    const queryClient = useQueryClient();
    const key = ['get_all_groups'];
    return {
        ...useQuery<TryResult<string[]>, ApiError>(
            key,
            async () => {
                const fn = throwIfHttpFails<string[]>(() =>
                    getGroups({
                        projectId: Runtime.instance.credentials.projectId,
                    }),
                );

                return await fn();
            },
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

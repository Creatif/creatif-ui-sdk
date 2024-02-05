import { useQuery, useQueryClient } from 'react-query';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { Runtime } from '@app/runtime/Runtime';
import { getGroups } from '@lib/api/groups/getGroups';
import type { ApiError } from '@lib/http/apiError';

export function useGetGroups<Response>() {
    const queryClient = useQueryClient();
    const key = ['get_groups'];

    return {
        ...useQuery<unknown, ApiError, Response>(
            key,
            throwIfHttpFails(() => {
                return getGroups({
                    projectId: Runtime.instance.credentials.projectId,
                });
            }),
            {
                retry: 1,
                enabled: true,
                keepPreviousData: true,
                refetchOnWindowFocus: false,
                refetchOnReconnect: true,
            },
        ),
        invalidateQuery: () => {
            queryClient.invalidateQueries(key);
        },
    };
}
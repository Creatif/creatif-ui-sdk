import { Initialize } from '@app/initialize';
import { throwIfHttpFails } from '@lib/http/tryHttp';
import { type QueryKey, useMutation, useQueryClient } from 'react-query';
import type { ApiError } from '@lib/http/apiError';
import type { TryResult } from '@root/types/shared';
import getGroups from '@lib/api/declarations/lists/getGroups';
export default function useGetGroups() {
    const queryClient = useQueryClient();
    return {
        ...useMutation<TryResult<string[]>, ApiError, { name: string }>(async (body: { name: string }) => {
            const fn = throwIfHttpFails<string[]>(() =>
                getGroups({
                    name: body.name,
                    projectId: Initialize.ProjectID(),
                }),
            );

            return await fn();
        }),
        invalidateQueries: (key: QueryKey) => {
            queryClient.invalidateQueries(key);
        },
    };
}

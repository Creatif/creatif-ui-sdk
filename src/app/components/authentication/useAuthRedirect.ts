import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import adminExists from '@lib/api/auth/adminExists';
import { useEffect } from 'react';

export function useAuthRedirect(route: string, condFn: (isFetching: boolean, exists: boolean) => boolean) {
    const navigate = useNavigate();
    const { isFetching, data } = useQuery('admin_exists', adminExists, {
        refetchOnWindowFocus: false,
        staleTime: -1,
        retry: 3,
    });

    const exists = Boolean(data?.result);

    useEffect(() => {
        if (condFn(isFetching, exists)) {
            navigate(route);
        }
    }, [isFetching, exists]);

    return !isFetching && exists;
}

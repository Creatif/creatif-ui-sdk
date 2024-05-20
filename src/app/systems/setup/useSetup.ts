import { useQuery } from 'react-query';
import adminExists from '@lib/api/auth/adminExists';
import { useEffect, useState } from 'react';

export function useSetup() {
    const [inProgress, setInProgress] = useState(false);
    const [error, setError] = useState(false);

    const [doesAdminExist, setAdminExists] = useState(false);

    const {
        isFetching: isAdminExistsFetching,
        data: adminExistsData,
        error: adminExistsError,
    } = useQuery('admin_exists', adminExists, {
        refetchOnWindowFocus: false,
        staleTime: -1,
        retry: 3,
    });

    useEffect(() => {
        if (isAdminExistsFetching) return;

        if (adminExistsError) {
            setError(true);
            setInProgress(false);
            return;
        }

        if (adminExistsData && adminExistsData.result) {
            setAdminExists(true);
        }

        setInProgress(false);
    }, [isAdminExistsFetching, adminExistsData, adminExistsError]);

    return { doesAdminExist, error, inProgress };
}

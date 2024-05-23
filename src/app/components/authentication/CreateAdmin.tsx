// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/css/authentication/wrapper.module.css';
import { AdminWizard } from '@app/components/authentication/AdminWizard';
import { useQuery } from 'react-query';
import adminExists from '@lib/api/auth/adminExists';
import UIError from '@app/components/UIError';
import type { ApiError } from '@lib/http/apiError';
import type { TryResult } from '@root/types/shared';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '@app/components/Loading';

export default function CreateAdmin() {
    const navigate = useNavigate();

    const {
        isFetching: isAdminExistsFetching,
        data: adminExistsData,
        error: adminExistsError,
    } = useQuery<unknown, ApiError, TryResult<boolean>>('admin_exists', adminExists, {
        refetchOnWindowFocus: false,
        staleTime: -1,
        retry: 3,
    });

    useEffect(() => {
        if (isAdminExistsFetching) return;

        if (adminExistsData?.result) {
            navigate('/login');
        }
    }, [isAdminExistsFetching, adminExistsData]);

    return (
        <div className={styles.root}>
            <div className={styles.centerRoot}>
                <Loading isLoading={isAdminExistsFetching} />

                {adminExistsError && <UIError title="Something went wrong. Please, try again later." />}

                {!isAdminExistsFetching && adminExistsData && !adminExistsData.result && (
                    <div className={styles.root}>
                        <AdminWizard />

                        {adminExistsError && <UIError title="Could not determine weather admin exists or not" />}
                    </div>
                )}
            </div>
        </div>
    );
}

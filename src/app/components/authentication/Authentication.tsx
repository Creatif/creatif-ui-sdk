// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/css/authentication/wrapper.module.css';
import { AdminWizard } from '@app/components/authentication/AdminWizard';
import { useQuery } from 'react-query';
import adminExists from '@lib/api/auth/adminExists';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function Authentication() {
    const navigate = useNavigate();
    const { isFetching, data } = useQuery(['admin_exists'], adminExists, {
        refetchOnWindowFocus: false,
        staleTime: -1,
        retry: 3,
    });

    const exists = Boolean(data?.result);

    useEffect(() => {
        if (!isFetching && exists) {
            navigate('/login');
        }
    }, [isFetching, exists]);

    return (
        <div className={styles.root}>
            <div className={styles.centerRoot}>{!isFetching && !exists && <AdminWizard />}</div>
        </div>
    );
}

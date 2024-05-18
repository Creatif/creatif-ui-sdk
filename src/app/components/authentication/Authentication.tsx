// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/css/authentication/wrapper.module.css';
import { AdminWizard } from '@app/components/authentication/AdminWizard';
import { useAuthRedirect } from '@app/components/authentication/useAuthRedirect';
export default function Authentication() {
    const safeToShow = useAuthRedirect('/login', (isFetching, exists) => !isFetching && exists);

    return (
        <div className={styles.root}>
            <div className={styles.centerRoot}>{!safeToShow && <AdminWizard />}</div>
        </div>
    );
}

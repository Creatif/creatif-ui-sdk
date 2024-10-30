// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/dashboard/css/structure.module.css';
import type { DashboardVersion } from '@root/types/api/stats';
import appDate from '@lib/helpers/appDate';

interface Props {
    version: DashboardVersion;
}

export function Item({ version }: Props) {
    return (
        <div className={styles.root}>
            <div>
                <h2 className={styles.header}>
                    <span className={styles.structureName}>{version.name}</span>
                </h2>
                <span className={styles.createdAt}>Created at: {appDate(version.createdAt)}</span>
            </div>
        </div>
    );
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/dashboard/css/resent.module.css';
import { RecentItem } from '@app/routes/dashboard/recent/RecentItem';

export function ResentMain() {
    return (
        <div className={styles.root}>
            <h1 className={styles.itemHeading}>Recent activity</h1>

            <div>
                <RecentItem />
                <RecentItem />
                <RecentItem />
                <RecentItem />
                <RecentItem />
                <RecentItem />
                <RecentItem />
                <RecentItem />
                <RecentItem />
                <RecentItem />
            </div>
        </div>
    );
}

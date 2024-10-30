// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/dashboard/css/resent.module.css';
import { IconArrowNarrowRight } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import type { Activity, ActivityTypes } from '@root/types/api/activity';

interface Props {
    activity: Activity<ActivityTypes>;
}

export function RecentItem({ activity }: Props) {
    return (
        <Link to={activity.data.path} className={styles.itemRoot}>
            <p>{activity.data.title}</p>
            <IconArrowNarrowRight />
        </Link>
    );
}

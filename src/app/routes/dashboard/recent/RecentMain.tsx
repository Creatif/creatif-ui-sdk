// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import styles from '@app/routes/dashboard/css/resent.module.css';
import { RecentItem } from '@app/routes/dashboard/recent/RecentItem';
import { useQuery } from 'react-query';
import type { Result } from '@root/types/api/publicApi/Http';
import type { ApiError } from '@lib/http/apiError';
import { Runtime } from '@app/systems/runtime/Runtime';
import { getActivities } from '@lib/api/activity/getActivities';
import type { Activity, ActivityTypes } from '@root/types/api/activity';
import UIError from '@app/components/UIError';

export function ResentMain() {
    const { data, error, isLoading } = useQuery<Result<Activity<ActivityTypes>[]>, ApiError>(
        'get_all_activities',
        async () => {
            const { result, error } = await getActivities(Runtime.instance.currentProjectCache.getProject().id);
            if (error) {
                throw error;
            }

            return { result, error };
        },
        {
            staleTime: -1,
        },
    );

    let activities: Activity<ActivityTypes>[] = [];
    if (!isLoading && data && data.result) {
        activities = data.result;
    }

    return (
        <div className={styles.root}>
            <h1 className={styles.itemHeading}>Recent activity</h1>

            {error && (
                <UIError title="We could not load recent activities. Please, refresh your browser or try again later." />
            )}

            <div>
                {activities.map((t) => (
                    <RecentItem key={t.id} activity={t} />
                ))}
            </div>
        </div>
    );
}

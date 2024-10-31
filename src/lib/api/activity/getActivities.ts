import { app } from '@lib/http/fetchInstance';
import { throwIfHttpFails, tryHttp } from '@lib/http/tryHttp';
import type { Activity, ActivityTypes } from '@root/types/api/activity';

export async function getActivities(projectId: string) {
    return throwIfHttpFails(() =>
        tryHttp<Activity<ActivityTypes>[]>(app(), 'get', `/activity/${projectId}`, undefined),
    );
}

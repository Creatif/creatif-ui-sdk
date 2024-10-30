import { app } from '@lib/http/fetchInstance';
import { throwIfHttpFails, tryHttp } from '@lib/http/tryHttp';
import type { Activity } from '@root/types/api/activity';

export async function getActivities(projectId: string) {
    return throwIfHttpFails(() => tryHttp<Activity[]>(app(), 'get', `/activity/${projectId}`, undefined));
}

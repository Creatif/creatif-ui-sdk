import { app } from '@lib/http/fetchInstance';
import { throwIfHttpFails, tryHttp } from '@lib/http/tryHttp';
import type { DashboardStat } from '@root/types/api/stats';

export async function getDashboardStats(projectId: string) {
    return throwIfHttpFails(() => tryHttp<DashboardStat>(app(), 'get', `/stats/dashboard/${projectId}`, undefined));
}

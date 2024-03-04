import { publicApi } from '@lib/http/fetchInstance';
import { throwIfHttpFails, tryHttp } from '@lib/http/tryHttp';
import type { Version, VersionBlueprint } from '@root/types/api/public';
export async function getVersions(blueprint: VersionBlueprint) {
    return throwIfHttpFails(() => tryHttp<Version[]>(publicApi(), 'get', `/versions/${blueprint.projectId}`));
}

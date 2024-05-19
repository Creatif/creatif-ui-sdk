import { app } from '@lib/http/fetchInstance';
import { throwIfHttpFails, tryHttp } from '@lib/http/tryHttp';
import type { Project } from '@root/types/api/project';

export async function getProject(projectId: string) {
    return throwIfHttpFails(() => tryHttp<Project>(app(), 'get', `/project/single/${projectId}`, undefined));
}

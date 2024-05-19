import { app } from '@lib/http/fetchInstance';
import { throwIfHttpFails, tryHttp } from '@lib/http/tryHttp';
import type { CreateProjectBlueprint, Project } from '@root/types/api/project';

export default function createProject(blueprint: CreateProjectBlueprint) {
    return throwIfHttpFails(() =>
        tryHttp<Project>(app(), 'put', '/project', {
            name: blueprint.name,
        }),
    );
}

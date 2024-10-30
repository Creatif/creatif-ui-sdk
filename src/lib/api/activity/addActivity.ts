import { app } from '@lib/http/fetchInstance';
import { throwIfHttpFails, tryHttp } from '@lib/http/tryHttp';
import type { ActivityRequestBlueprint } from '@root/types/api/activity';

export default function addActivity(blueprint: ActivityRequestBlueprint) {
    return throwIfHttpFails(() =>
        tryHttp(app(), 'put', '/activity', {
            projectId: blueprint.projectId,
            data: blueprint.data,
        }),
    );
}

import { app } from '@lib/http/fetchInstance';
import { tryHttp } from '@lib/http/tryHttp';
import type { AuthCheckBlueprint } from '@root/types/api/auth';
export default function authCheck(blueprint: AuthCheckBlueprint) {
    return tryHttp(app(), 'post', '/auth/api-check', undefined, {
        'X-CREATIF-API-KEY': blueprint.apiKey,
        'X-CREATIF-PROJECT-ID': blueprint.projectId,
    });
}

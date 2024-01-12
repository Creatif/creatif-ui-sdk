import type { RearrangeBlueprint } from '@root/types/api/list';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import { declarations } from '@lib/http/fetchInstance';
export default function rearrange(blueprint: RearrangeBlueprint, structureType: 'list' | 'map') {
    return tryHttp<number>(
        declarations(),
        'post',
        `/${structureType}/rearrange/${blueprint.projectId}/${blueprint.name}/${blueprint.source}/${blueprint.destination}`,
        null,
        authHeaders(),
    );
}

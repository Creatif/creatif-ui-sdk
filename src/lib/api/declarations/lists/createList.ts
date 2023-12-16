import type { CreatedList, CreateListBlueprint } from '@root/types/api/list';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import { declarations } from '@lib/http/fetchInstance';
import { Initialize } from '@app/initialize';
export default function createList(blueprint: CreateListBlueprint) {
    return tryHttp<CreatedList>(
        declarations(),
        'put',
        `/list/${blueprint.projectId}/${blueprint.locale ? blueprint.locale : Initialize.Locale()}`,
        {
            name: blueprint.name,
        },
        authHeaders(),
    );
}

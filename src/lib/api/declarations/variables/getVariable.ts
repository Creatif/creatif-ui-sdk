import { Initialize } from '@app/initialize';
import { declarations } from '@lib/http/fetchInstance';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import type { GetVariableBlueprint, GetVariableResponse } from '@root/types/api/variable';

export default function getVariable(blueprint: GetVariableBlueprint) {
    return tryHttp<GetVariableResponse>(
        declarations(),
        'get',
        `/variable/${blueprint.projectId}/${blueprint.name}/${
            blueprint.locale ? blueprint.locale : Initialize.Locale()
        }`,
        null,
        authHeaders(),
    );
}

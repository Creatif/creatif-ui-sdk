import { Credentials } from '@app/credentials';
import { declarations } from '@lib/http/fetchInstance';
import { tryHttp } from '@lib/http/tryHttp';
import type { GetVariableBlueprint, GetVariableResponse } from '@root/types/api/variable';

export default function getVariable<Value = unknown, Metadata = unknown>(blueprint: GetVariableBlueprint) {
    return tryHttp<GetVariableResponse<Value, Metadata>>(
        declarations(),
        'get',
        `/variable/${blueprint.projectId}/${blueprint.name}/${
            blueprint.locale ? blueprint.locale : Credentials.Locale()
        }`,
        null,
    );
}

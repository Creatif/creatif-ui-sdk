import { Credentials } from '@app/credentials';
import { declarations } from '@lib/http/fetchInstance';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import type { DeleteVariableBlueprint } from '@root/types/api/variable';
export default function deleteVariable(blueprint: DeleteVariableBlueprint) {
    return tryHttp<null>(
        declarations(),
        'delete',
        `/variable/${blueprint.projectId}/${blueprint.locale ? blueprint.locale : Credentials.Locale()}/${
            blueprint.name
        }`,
        null,
        authHeaders(),
    );
}

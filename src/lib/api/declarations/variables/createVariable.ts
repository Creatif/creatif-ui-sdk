import { declarations } from '@lib/http/fetchInstance';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import { exists } from '@lib/validation/exists';
import type { CreatedVariable, CreateVariableBlueprint } from '@root/types/api/variable';
import { Runtime } from '@app/runtime/Runtime';
export async function createVariable<Value, Metadata>(blueprint: CreateVariableBlueprint) {
    return tryHttp<CreatedVariable<Value, Metadata>>(
        declarations(),
        'put',
        `/variable/${blueprint.projectId}/${
            blueprint.locale ? blueprint.locale : Runtime.instance.currentLocaleStorage.getLocale()
        }`,
        {
            name: blueprint.name,
            behaviour: blueprint.behaviour,
            groups: blueprint.groups,
            metadata: !exists('metadata', blueprint.metadata) ? JSON.stringify(blueprint.metadata) : null,
            value: !exists('value', blueprint.value) ? JSON.stringify(blueprint.value) : null,
        },
        authHeaders(),
    );
}

import { Initialize } from '@app/initialize';
import { declarations } from '@lib/http/axios';
import { tryPut } from '@lib/http/tryPut';
import { exists } from '@lib/validation/exists';
import type { CreatedVariable, CreateVariableBlueprint } from '@root/types/api/variable';
export async function createVariable<Value, Metadata>(blueprint: CreateVariableBlueprint) {
    return tryPut<CreatedVariable<Value, Metadata>, CreateVariableBlueprint>(
        declarations(),
        `/variable/${Initialize.ProjectID()}/${blueprint.locale ? blueprint.locale : Initialize.Locale()}`,
        {
            name: blueprint.name,
            behaviour: blueprint.behaviour,
            groups: blueprint.groups,
            metadata: !exists('metadata', blueprint.metadata) ? JSON.stringify(blueprint.metadata) : null,
            value: !exists('value', blueprint.value) ? JSON.stringify(blueprint.value) : null,
        },
        {
            'X-CREATIF-API-KEY': Initialize.ApiKey(),
            'X-CREATIF-PROJECT-ID': Initialize.ProjectID(),
        },
    );
}

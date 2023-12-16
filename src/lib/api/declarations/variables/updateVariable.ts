import { Initialize } from '@app/initialize';
import { declarations } from '@lib/http/fetchInstance';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import type { UpdateableVariableValuesBlueprint, UpdateVariableBlueprint } from '@root/types/api/variable';
export default function updateVariable(blueprint: UpdateVariableBlueprint) {
    const values: UpdateableVariableValuesBlueprint<unknown, unknown> = {};

    for (const field of blueprint.fields) {
        if (field === 'name') {
            values.name = blueprint.values.name;
        }

        if (field === 'value') {
            values.value = blueprint.values.value ? JSON.stringify(blueprint.values.value) : null;
        }

        if (field === 'metadata') {
            values.metadata = blueprint.values.metadata ? JSON.stringify(blueprint.values.metadata) : null;
        }

        if (field === 'groups') {
            values.groups = blueprint.values.groups;
        }

        if (field === 'behaviour') {
            values.behaviour = blueprint.values.behaviour;
        }
    }

    return tryHttp<unknown, UpdateVariableBlueprint>(
        declarations(),
        'post',
        `/variable/${Initialize.ProjectID()}`,
        {
            name: blueprint.name,
            locale: blueprint.locale ? blueprint.locale : Initialize.Locale(),
            fields: blueprint.fields,
            values: values,
        },
        authHeaders(),
    );
}

import { Initialize } from '@app/initialize';
import { declarations } from '@lib/http/axios';
import { tryPost } from '@lib/http/tryPost';
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

    return tryPost<unknown, UpdateVariableBlueprint>(
        declarations(),
        `/variable/${Initialize.ProjectID()}`,
        {
            name: blueprint.name,
            locale: blueprint.locale ? blueprint.locale : Initialize.Locale(),
            fields: blueprint.fields,
            values: values,
        },
        {
            'X-CREATIF-API-KEY': Initialize.ApiKey(),
            'X-CREATIF-PROJECT-ID': Initialize.ProjectID(),
        },
    );
}

import { declarations } from '@lib/http/fetchInstance';
import { tryHttp } from '@lib/http/tryHttp';
import type {
    CreatedVariable,
    UpdateableVariableValuesBlueprint,
    UpdateVariableBlueprint,
} from '@root/types/api/variable';
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

        if (field === 'locale') {
            // TODO: this should be removed when creating proper API SDK authentication
            if (!blueprint.values.locale) throw new Error('Updating locale not specified');
            values.locale = blueprint.values.locale;
        }
    }

    return tryHttp<CreatedVariable>(declarations(), 'post', `/variable/${blueprint.projectId}`, {
        name: blueprint.name,
        locale: blueprint.locale,
        fields: blueprint.fields,
        values: values,
    });
}

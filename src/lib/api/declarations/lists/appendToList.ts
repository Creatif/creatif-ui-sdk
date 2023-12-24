import { Initialize } from '@app/initialize';
import { declarations } from '@lib/http/fetchInstance';
import { authHeaders, tryHttp } from '@lib/http/tryHttp';
import type { AppendToListBlueprint } from '@root/types/api/list';

export async function appendToList(blueprint: AppendToListBlueprint) {
    return tryHttp(
        declarations(),
        'put',
        `/list/append/${blueprint.projectId}`,
        {
            name: blueprint.name,
            variables: blueprint.variables.map((item) => {
                if (item.value) {
                    item.value = JSON.stringify(item.value);
                }

                if (item.metadata) {
                    item.metadata = JSON.stringify(item.metadata);
                }

                if (!item.locale) {
                    item.locale = Initialize.Locale();
                }

                return item;
            }),
        },
        authHeaders(),
    );
}

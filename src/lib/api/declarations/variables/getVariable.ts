import { Initialize } from '@app/initialize';
import { declarations } from '@lib/http/axios';
import { tryGet } from '@lib/http/tryGet';
import type { GetVariableBlueprint } from '@root/types/api/variable';

export default function getVariable<Response>(blueprint: GetVariableBlueprint) {
    return tryGet<Response>(
        declarations(),
        `/variable/${Initialize.ProjectID()}/${blueprint.name}/${
            blueprint.locale ? blueprint.locale : Initialize.Locale()
        }`,
        {
            'X-CREATIF-API-KEY': Initialize.ApiKey(),
            'X-CREATIF-PROJECT-ID': Initialize.ProjectID(),
        },
    );
}

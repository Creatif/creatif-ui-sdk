import { tryHttp } from '@lib/publicApi/lib/http/tryHttp';
import { Result } from '@root/types/api/publicApi/Http';
import { determineResult } from '@lib/publicApi/app/determineResult';
import { Routes } from '@lib/publicApi/lib/http/routes';
import { Version } from '@root/types/api/publicApi/Version';

export async function getVersions(): Promise<Result<Version[]>> {
    const httpResult = await tryHttp<Version[]>('get', `${Routes.GET_VERSIONS}`, null, {});

    return determineResult<Version[]>(httpResult);
}

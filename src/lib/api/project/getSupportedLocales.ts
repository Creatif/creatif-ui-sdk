import { app } from '@lib/http/fetchInstance';
import { tryHttp } from '@lib/http/tryHttp';
export async function getSupportedLocales() {
    return await tryHttp<Locale[]>(app(), 'get', '/supported-locales');
}

import { app } from '@lib/http/fetchInstance';
import { tryHttp } from '@lib/http/tryHttp';
import type { Locale } from '@lib/api/project/types/SupportedLocales';
export async function getSupportedLocales() {
    return await tryHttp<Locale[]>(app(), 'get', '/supported-locales');
}

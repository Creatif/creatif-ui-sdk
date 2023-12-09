import { app } from '@lib/http/axios';
import { tryGet } from '@lib/http/tryGet';
export async function getSupportedLocales() {
	return await tryGet<Locale[]>(app(), '/supported-locales');
}

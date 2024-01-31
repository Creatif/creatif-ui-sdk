import type { Locale } from '@lib/api/project/types/SupportedLocales';
import { getSupportedLocales } from '@lib/api/project/getSupportedLocales';
import { ApiError } from '@lib/http/apiError';

export default class LocalesCache {
    private readonly locales: Locale[];
    private static readonly key = 'creatif-locales-cache';
    constructor(locales: Locale[]) {
        this.locales = locales;

        const s = localStorage.getItem(LocalesCache.key);

        if (!s) {
            localStorage.setItem(LocalesCache.key, JSON.stringify(locales));
            return;
        }

        this.locales = JSON.parse(s) as Locale[];
    }

    static isLoaded() {
        return Object.keys(localStorage).includes(LocalesCache.key);
    }

    static createInstanceWithExistingCache() {
        const s = JSON.parse(localStorage.getItem(LocalesCache.key) as string) as Locale[];
        return new LocalesCache(s);
    }
    getLocales() {
        return this.locales;
    }
}

export async function createLocalesCache(): Promise<{createdCache?: LocalesCache; error?: ApiError}> {
    if (!LocalesCache.isLoaded()) {
        const { result: locales, error } = await getSupportedLocales();

        if (Array.isArray(locales)) {
            return {createdCache: new LocalesCache(locales)};
        }

        if (error) {
            return {error: error};
        }
    }

    return {createdCache: LocalesCache.createInstanceWithExistingCache()};
}

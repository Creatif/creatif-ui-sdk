import type { Locale } from '@lib/api/project/types/SupportedLocales';

export default class LocalesCache {
    public static instance: LocalesCache;
    private storage: Locale[] | undefined = undefined;
    private static key = 'creatif-locales-cache';
    private constructor(storage?: Locale[]) {
        this.storage = storage;
    }
    static init(locales?: Locale[]) {
        const s = localStorage.getItem(LocalesCache.key);
        if (!s && locales) {
            localStorage.setItem(LocalesCache.key, JSON.stringify(locales));
            LocalesCache.instance = new LocalesCache(locales);
            return;
        }

        if (s) {
            LocalesCache.instance = new LocalesCache(JSON.parse(s) as Locale[]);
        } else {
            LocalesCache.instance = new LocalesCache();
        }
    }
    static isLoaded() {
        return Boolean(localStorage.getItem(LocalesCache.key));
    }
    getLocales() {
        return this.storage;
    }

    hasLocales(): boolean {
        return Boolean(this.storage);
    }
}

import type { ExtractedConfig } from '@root/types/api/project';

export default class CurrentConfigCache {
    private config: ExtractedConfig[];
    private static readonly key = 'creatif-config-cache';
    constructor(config: ExtractedConfig[]) {
        this.config = config;

        localStorage.setItem(CurrentConfigCache.key, JSON.stringify(config));

        this.config = config;
    }

    static isLoaded() {
        return Object.keys(localStorage).includes(CurrentConfigCache.key);
    }

    static createInstanceWithExistingCache() {
        const s = JSON.parse(localStorage.getItem(CurrentConfigCache.key) as string) as ExtractedConfig[];
        return new CurrentConfigCache(s);
    }
    getCachedConfig() {
        return this.config;
    }

    updateConfig(config: ExtractedConfig[]) {
        localStorage.setItem(CurrentConfigCache.key, JSON.stringify(config));
        this.config = config;
    }
}

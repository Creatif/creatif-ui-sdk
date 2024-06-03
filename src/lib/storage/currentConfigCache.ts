import type { ExtractedConfig, Project } from '@root/types/api/project';

export default class CurrentConfigCache {
    private readonly config: ExtractedConfig[];
    private static readonly key = 'creatif-config-cache';
    constructor(project: ExtractedConfig[]) {
        this.config = project;

        localStorage.setItem(CurrentConfigCache.key, JSON.stringify(project));

        this.config = project;
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
}
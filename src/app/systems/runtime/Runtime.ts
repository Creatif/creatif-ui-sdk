import type CurrentLocaleStorage from '@lib/storage/currentLocaleStorage';
import type LocalesCache from '@lib/storage/localesCache';
import type CurrentProjectCache from '@lib/storage/currentProjectCache';

export class Runtime {
    public static instance: Runtime;

    constructor(
        public currentProjectCache: CurrentProjectCache,
        public readonly currentLocaleStorage: CurrentLocaleStorage,
        public readonly localesCache: LocalesCache,
    ) {}

    rootPath() {
        return `/dashboard/${this.currentProjectCache.getProject().id}`;
    }

    updateProjectCache(projectCache: CurrentProjectCache) {
        this.currentProjectCache = projectCache;
    }

    static init(runtime: Runtime) {
        Runtime.instance = runtime;
    }
}

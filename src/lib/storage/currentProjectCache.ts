import type { Project } from '@root/types/api/project';

export default class CurrentProjectCache {
    private readonly project: Project;
    private static readonly key = 'creatif-current-project';
    constructor(project: Project) {
        this.project = project;

        localStorage.setItem(CurrentProjectCache.key, JSON.stringify(project));

        this.project = project;
    }

    static isLoaded() {
        return Object.keys(localStorage).includes(CurrentProjectCache.key);
    }

    static createInstanceWithExistingCache() {
        const s = JSON.parse(localStorage.getItem(CurrentProjectCache.key) as string) as Project;
        return new CurrentProjectCache(s);
    }
    getProject() {
        return this.project;
    }
}

export function createProjectCache(project: Project): CurrentProjectCache {
    if (!CurrentProjectCache.isLoaded()) {
        return new CurrentProjectCache(project);
    }

    return CurrentProjectCache.createInstanceWithExistingCache();
}

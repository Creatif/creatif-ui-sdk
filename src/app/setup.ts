import { getProjectMetadata } from '@lib/api/project/getProjectMetadata';
import type LocalesCache from '@lib/storage/localesCache';
import { createLocalesCache } from '@lib/storage/localesCache';
import type { ProjectMetadata } from '@lib/api/project/types/ProjectMetadata';

interface StageError {
    type: string;
    message: string;
}

interface StageStorage<T> {
    getStorage(key: string): T | undefined;
    addItem(key: string, item: T): void;
}

interface Stage {
    run(): Promise<void>;
    getErrors(): StageError[];
    getStorage(): StageStorage<unknown>;

    isRecoverable?: boolean;
}

class Storage<T> implements StageStorage<T> {
    private readonly items: Record<string, T> = {};

    getStorage(key: string): T | undefined {
        return this.items[key];
    }

    addItem(key: string, item: T) {
        this.items[key] = item;
    }
}

class RemoveAppCacheStage implements Stage {
    public readonly isRecoverable = false;
    constructor(private readonly projectId: string) {}
    async run() {
        const lsKeys = Object.keys(localStorage);
        const incomingKey = `creatif-${this.projectId}`;
        // filter out the keys that are not project key
        const possibleAppKeys = lsKeys.filter((item) => new RegExp('creatif-').test(item));
        // if this is a different app key, remove all creatif keys since they will be recreated later
        if (!possibleAppKeys.includes(incomingKey)) {
            console.info('Removing previous app LS keys. They will be recreated.');
            for (const lsKey of lsKeys) {
                if (new RegExp('creatif-').test(lsKey)) {
                    localStorage.removeItem(lsKey);
                }
            }
        }
    }

    getErrors(): StageError[] {
        return [];
    }

    getStorage(): StageStorage<unknown> {
        return new Storage<unknown>();
    }
}

class GetProjectMetadataStage implements Stage {
    public readonly isRecoverable = false;
    private readonly stageStorage = new Storage<ProjectMetadata>();

    constructor(
        private readonly apiKey: string,
        private readonly projectId: string,
        private readonly stageErrors: StageError[] = [],
    ) {}

    async run() {
        const { result: projectMetadata, error } = await getProjectMetadata({
            apiKey: this.apiKey,
            projectId: this.projectId,
        });

        if (error) {
            this.stageErrors.push({
                type: 'projectMetadata',
                message: 'Project metadata failed to load',
            });

            return;
        }

        if (projectMetadata) {
            this.stageStorage.addItem('projectMetadata', projectMetadata);
        }
    }

    getErrors(): StageError[] {
        return this.stageErrors;
    }

    getStorage(): StageStorage<ProjectMetadata> {
        return this.stageStorage;
    }
}

class CreateLocalesStage implements Stage {
    public readonly isRecoverable = false;
    private readonly stageStorage = new Storage<LocalesCache>();

    constructor(private readonly stageErrors: StageError[] = []) {}

    async run() {
        const { createdCache, error } = await createLocalesCache();

        if (error) {
            this.stageErrors.push({
                type: 'locales',
                message: 'Locales failed to cache.',
            });

            return;
        }

        if (createdCache) {
            this.stageStorage.addItem('locales', createdCache);
        }
    }

    getErrors(): StageError[] {
        return this.stageErrors;
    }

    getStorage(): StageStorage<LocalesCache> {
        return this.stageStorage;
    }
}

export class Setup {
    constructor(
        private readonly stages: Stage[],
        private stageErrors: StageError[] = [],
    ) {}

    async run() {
        for (const stage of this.stages) {
            await stage.run();

            if (stage.getErrors().length !== 0) {
                if (!stage.isRecoverable) {
                    this.stageErrors = [...this.stageErrors, ...stage.getErrors()];
                    break;
                }
            }
        }
    }

    getErrors(): StageError[] {
        return this.stageErrors;
    }

    getStorage<T>(key: string): T | undefined {
        for (const stage of this.stages) {
            const item = stage.getStorage().getStorage(key) as T;
            if (item) return item;
        }

        return undefined;
    }
}

export function createSetup(apiKey: string, projectId: string): Setup {
    return new Setup([
        new RemoveAppCacheStage(projectId),
        new GetProjectMetadataStage(apiKey, projectId),
        new CreateLocalesStage(),
    ]);
}

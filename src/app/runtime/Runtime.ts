import type { Credentials } from '@app/credentials';
import type CurrentLocaleStorage from '@lib/storage/currentLocaleStorage';
import type LocalesCache from '@lib/storage/localesCache';

export class Runtime {
    public static instance: Runtime;

    constructor(
        public readonly credentials: Credentials,
        public readonly currentLocaleStorage: CurrentLocaleStorage,
        public readonly localesCache: LocalesCache
    ) {}

    static init(runtime: Runtime) {
        Runtime.instance = runtime;
    }
}
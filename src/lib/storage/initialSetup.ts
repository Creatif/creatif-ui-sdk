interface InitialSetupStorage {
    maps: { [key: string]: boolean };
    lists: { [key: string]: boolean };
}

export default class InitialSetup {
    public static instance: InitialSetup;
    private storage: InitialSetupStorage;
    private static key = 'creatif-initial-setup';
    private constructor(storage: InitialSetupStorage) {
        this.storage = storage;
    }
    static init(item: InitialSetupStorage) {
        localStorage.setItem(
            InitialSetup.key,
            JSON.stringify({
                maps: item.maps,
                lists: item.lists,
            }),
        );

        InitialSetup.instance = new InitialSetup(item);
    }

    lists() {
        return this.storage.lists || {};
    }

    maps() {
        return this.storage.maps || {};
    }

    markListDone(name: string) {
        if (!this.storage)
            throw new Error('Invalid usage of InitialSetup storage. storage is undefined. This is definitely a bug.');

        this.storage.lists[name] = true;
        this.persist();
    }

    markMapDone(name: string) {
        if (!this.storage)
            throw new Error('Invalid usage of InitialSetup storage. storage is undefined. This is definitely a bug.');

        this.storage.maps[name] = true;

        this.persist();
    }

    private persist() {
        localStorage.setItem(InitialSetup.key, JSON.stringify(this.storage));
    }
}

import CurrentLocaleStorage from '@lib/storage/currentLocaleStorage';

export class Initialize {
    private static apiKey: string;
    private static projectId: string;
    static init(apiKey: string, projectId: string) {
        Initialize.apiKey = apiKey;
        Initialize.projectId = projectId;
    }
    static ApiKey(): string {
        return Initialize.apiKey;
    }
    static ProjectID(): string {
        return Initialize.projectId;
    }
    static Locale(): string {
        return CurrentLocaleStorage.instance.getLocale();
    }
    static changeLocale(locale: string) {
        CurrentLocaleStorage.instance.setLocale(locale);
    }
}

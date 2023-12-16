export class Initialize {
    private static apiKey: string;
    private static projectId: string;
    private static locale: string;
    static init(apiKey: string, projectId: string, locale: string) {
        Initialize.apiKey = apiKey;
        Initialize.projectId = projectId;
        Initialize.locale = locale;
    }
    static ApiKey(): string {
        return Initialize.apiKey;
    }
    static ProjectID(): string {
        return Initialize.projectId;
    }
    static Locale(): string {
        return Initialize.locale;
    }

    static changeLocale(locale: string) {
        Initialize.locale = locale;
    }
}

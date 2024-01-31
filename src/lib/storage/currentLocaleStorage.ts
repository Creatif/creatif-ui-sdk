export default class CurrentLocaleStorage {
    private currentLocale: string;
    private key = 'creatif-current-locale';
    constructor(locale: string) {
        this.currentLocale = locale;

        if (!localStorage.getItem(this.key)) {
            localStorage.setItem(this.key, locale);
        }
    }

    getLocale() {
        return this.currentLocale;
    }

    setLocale(locale: string) {
        this.currentLocale = locale;
        this.persist();
    }

    private persist() {
        localStorage.setItem(this.key, this.currentLocale);
    }
}

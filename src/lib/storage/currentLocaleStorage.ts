export default class CurrentLocaleStorage {
    private key = 'creatif-current-locale';
    constructor(private currentLocale: string) {
        if (localStorage.getItem(this.key)) {
            this.currentLocale = localStorage.getItem(this.key) as string;
        }

        if (!localStorage.getItem(this.key)) {
            localStorage.setItem(this.key, currentLocale);
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

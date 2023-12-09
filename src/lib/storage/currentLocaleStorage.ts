export default class CurrentLocaleStorage {
	public static instance: CurrentLocaleStorage;
	private storage: string;
	private static key = 'creatif-current-locale';
	private constructor(storage: string) {
		this.storage = storage;
	}
	static init(locale: string) {
		if (!localStorage.getItem(CurrentLocaleStorage.key)) {
			localStorage.setItem(CurrentLocaleStorage.key, locale);
			CurrentLocaleStorage.instance = new CurrentLocaleStorage(locale);
			return;
		}

		CurrentLocaleStorage.instance = new CurrentLocaleStorage(localStorage.getItem(CurrentLocaleStorage.key) as string);
	}
	getLocale() {
		return this.storage;
	}
	setLocale(locale: string) {
		this.storage = locale;
		this.persist();
	}
	private persist() {
		localStorage.setItem(CurrentLocaleStorage.key, this.storage);
	}
}

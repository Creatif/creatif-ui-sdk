export class Initialize {
	private static apiKey: string;
	private static projectId: string;
	static init(apiKey: string, projectId: string) {
		Initialize.apiKey = apiKey;
		Initialize.projectId = projectId;
	}
	ApiKey(): string {
		return Initialize.apiKey;
	}
	ProjectID(): string {
		return Initialize.projectId;
	}
}
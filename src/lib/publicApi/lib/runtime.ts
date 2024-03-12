export class Runtime {
    public static instance: Runtime;
    private readonly url = 'http://localhost:3002/api/v1/public';

    private constructor(public readonly projectId: string) {}

    static init(projectId: string) {
        Runtime.instance = new Runtime(projectId);
    }

    baseUrl(): string {
        return `${this.url}/${Runtime.instance.projectId}`;
    }
}

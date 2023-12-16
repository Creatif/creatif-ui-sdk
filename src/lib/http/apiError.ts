export interface APIError {
    data: Record<string, string>;
}
export class ApiError extends Error {
    constructor(
        message: string,
        public error: APIError,
        public status: number,
    ) {
        super();
    }
}

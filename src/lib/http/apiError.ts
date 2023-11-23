import type { APIError } from '@root/types/app';

export class ApiError extends Error {
	constructor(
		message: string,
    public error: APIError | null,
	) {
		super();
	}
}

export class ValidationError extends Error {
    constructor(message, errors, status) {
        super(message);

        this.errors = errors;
        this.status = status;
    }
}

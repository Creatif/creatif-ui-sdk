import type { FieldErrors } from 'react-hook-form';

export function getFirstError(errors: FieldErrors, field: string) {
    const fieldError = errors[field];
    if (!fieldError) return undefined;

    if (fieldError.message && typeof fieldError?.message === 'string') {
        return fieldError.message;
    }

    return 'This field is invalid.';
}

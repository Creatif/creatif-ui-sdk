import ucFirst from '@lib/helpers/ucFirst';
import { useFormState } from 'react-hook-form';

export default function useFirstError(name: string): string | boolean {
    const { errors } = useFormState();
    const fieldError = errors[name];
    if (!fieldError) return false;

    if (fieldError.message && typeof fieldError?.message === 'string') {
        return fieldError.message;
    }

    return `${ucFirst(name)} field is invalid.`;
}

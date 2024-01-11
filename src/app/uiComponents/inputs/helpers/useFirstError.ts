import ucFirst from '@lib/helpers/ucFirst';
import { useFormState } from 'react-hook-form';

export default function useFirstError(name: string): string | undefined {
    const { errors } = useFormState();
    const fieldError = errors[name];
    if (!fieldError) return undefined;

    if (fieldError.message && typeof fieldError?.message === 'string') {
        return fieldError.message;
    }

    return `${ucFirst(name)} field is invalid.`;
}

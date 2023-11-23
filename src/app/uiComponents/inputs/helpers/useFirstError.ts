import {useFormState} from 'react-hook-form';

export default function useFirstError(name: string): string | boolean {
	const {errors} = useFormState();
	const fieldError = errors[name];
	if (!fieldError) return false;

	if (typeof fieldError?.message === 'string') {
		return fieldError.message;
	}

	try {
		if (fieldError?.message && typeof fieldError?.message !== 'string') {
			return fieldError.message.toString();
		}
	} catch (e) {
		return true;
	}

	return true;
}
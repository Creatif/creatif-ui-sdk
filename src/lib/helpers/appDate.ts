import { format } from 'date-fns';
export default function appDate(date: string | Date | undefined | null) {
	if (!date) {
		return '';
	}

	const d = typeof date === 'string' ? new Date(date) : date;

	return format(d, 'do MMMM, yyyy');
}

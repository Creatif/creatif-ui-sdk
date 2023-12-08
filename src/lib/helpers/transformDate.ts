import format from 'date-fns/format';
export default function transformDate(
	date: string | Date | undefined | null,
	dateFormat = 'do MMMM, yyyy',
) {
	if (!date) {
		return '';
	}

	const d = typeof date === 'string' ? new Date(date) : date;

	return format(d, dateFormat);
}

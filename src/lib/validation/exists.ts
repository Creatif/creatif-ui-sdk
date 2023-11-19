export function exists(name: string, value: unknown) {
	if (typeof value === 'undefined' || value === null) {
		return `'${name}' is required.`;
	}
}

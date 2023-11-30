export function queryConstructor(page = 1, limit = 15, groups: string[] = [], orderBy = 'created_at', direction = 'desc') {
	let base = `?page=${page}&orderBy=${orderBy}&direction=${direction}&limit=${limit}`;

	if (groups.length > 0) {
		const newGroups: string[] = [];
		for (const group of groups) {
			newGroups.push(group.trim());
		}

		base += '&groups=' + newGroups.join(',');
	}

	return base;
}

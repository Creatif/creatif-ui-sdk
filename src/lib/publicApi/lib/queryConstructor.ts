export function queryConstructor(
    page = 1,
    groups: string[] = [],
    orderBy = 'created_at',
    direction = 'desc',
    search = '',
    locales: string[] = [],
) {
    let base = `?page=${page}&orderBy=${orderBy}&direction=${direction}&search=${search}`;

    if (groups.length > 0) {
        const newGroups: string[] = [];
        for (const group of groups) {
            newGroups.push(group.trim());
        }

        base += '&groups=' + newGroups.join(',');
    }

    if (locales.length > 0) {
        const newLocales: string[] = [];
        for (const locale of locales) {
            newLocales.push(locale.trim());
        }

        base += '&locales=' + newLocales.join(',');
    }

    return base;
}

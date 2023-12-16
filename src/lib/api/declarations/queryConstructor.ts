export function queryConstructor(
    page = 1,
    limit = '15',
    groups: string[] = [],
    orderBy = 'created_at',
    direction = 'desc',
    search = '',
    behaviour = '',
    locales: string[] = [],
    fields: string[] = [],
) {
    let base = `?page=${page}&orderBy=${orderBy}&direction=${direction}&limit=${limit}&search=${search}&behaviour=${behaviour}`;

    if (groups.length > 0) {
        const newGroups: string[] = [];
        for (const group of groups) {
            newGroups.push(group.trim());
        }

        base += '&groups=' + newGroups.join(',');
    }

    if (fields.length > 0) {
        const newFields: string[] = [];
        for (const field of fields) {
            newFields.push(field.trim());
        }

        base += '&fields=' + newFields.join(',');
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

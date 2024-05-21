export function queryConstructor(page = 1, limit = '15', orderBy = 'created_at', direction = 'desc', search = '') {
    return `?page=${page}&orderBy=${orderBy}&direction=${direction}&limit=${limit}&search=${search}`;
}

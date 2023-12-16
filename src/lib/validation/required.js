export function required(name, value) {
    if (typeof value === 'undefined' || value === null) {
        return `'${name}' is required.`;
    }

    if (!value) {
        return `'${name}' is required.`;
    }
}

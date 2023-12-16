export function handleErrors(possibleErrors) {
    const keys = Object.keys(possibleErrors);
    const errors = {};
    for (const key of keys) {
        const value = possibleErrors[key];

        if (value) {
            errors[key] = value;
        }
    }

    return Object.keys(errors).length ? errors : undefined;
}

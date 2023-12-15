import type { BeforeSaveFn, BeforeSaveReturnType } from '@root/types/forms/forms';
import type { BaseSyntheticEvent } from 'react';

export function wrappedBeforeSave<T>(
    values: T,
    event: BaseSyntheticEvent | undefined,
    fn?: BeforeSaveFn<T>,
): Promise<BeforeSaveReturnType> {
    if (!fn) {
        return Promise.resolve({
            value: values,
            metadata: null,
        });
    }

    return Promise.resolve(fn(values, event));
}

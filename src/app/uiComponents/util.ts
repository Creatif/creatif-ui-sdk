import type { BeforeSaveFn } from '@root/types/forms/forms';
import type { BaseSyntheticEvent } from 'react';

export async function wrappedBeforeSave<T>(values: T, event: BaseSyntheticEvent | undefined, fn?: BeforeSaveFn<T>) {
    if (fn) {
        fn(values, event);
    }
}

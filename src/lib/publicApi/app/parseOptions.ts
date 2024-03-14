import type { Options } from '@root/types/api/publicApi/Shared';

export function parseOptions(options: Options | undefined) {
    if (!options) return '';

    let base = '?options=';
    if ('valueOnly' in options) {
        const valueOnly = options.valueOnly;

        base += `valueOnly:${valueOnly ? 'true' : 'false'}`;
    }

    return base;
}

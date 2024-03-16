import type { Options } from '@root/types/api/publicApi/Shared';

function parseOptions(base: string, options: Options): string {
    if (!base) {
        base = '?options=';
    }

    if ('valueOnly' in options) {
        const valueOnly = options.valueOnly;

        base += `valueOnly:${valueOnly ? 'true' : 'false'}`;
    }

    return base;
}

function parseLocale(base: string, locale: string): string {
    if (!base) {
        base = '?';
    }

    base += `locale=${locale}`;

    return base;
}

export function parseQuery(options: Options | undefined, locale: string | undefined) {
    let base = '';
    const parsers = [];

    if (options) {
        parsers.push((base: string) => parseOptions(base, options));
    }

    if (locale) {
        parsers.push((base: string) => parseLocale(base, locale));
    }

    if (parsers.length === 0) return base;

    for (const parser of parsers) {
        base = parser(base) + '&';
    }

    return base.substring(0, base.length - 1);
}

import useNotification from '@app/systems/notifications/useNotification';
import type { Behaviour } from '@root/types/api/shared';
import type { Bindings } from '@root/types/forms/forms';
import type { FieldValues } from 'react-hook-form';
function resolveBindings<T extends FieldValues>(values: T, bindings: Bindings<T>, t: keyof Bindings<T>) {
    if (!bindings[t]) return false;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof bindings[t] === 'string' && !values[bindings[t]]) return false;

    let name = '';
    if (typeof bindings[t] === 'string') {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        return values[bindings[t]];
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    name = bindings[t](values);
    if (!name) return false;

    return name;
}

export default function useResolveBindings() {
    const { error: notificationError } = useNotification();

    return <T extends FieldValues>(value: T, bindings?: Bindings<T>) => {
        if (!bindings) {
            return {
                locale: '',
                groups: [],
                behaviour: 'modifiable' as Behaviour,
            };
        }

        const locale = resolveBindings(value, bindings, 'locale');
        if (bindings.locale && !locale) {
            notificationError(
                'Cannot determine groups binding',
                'Locale binding cannot be determined. If a field name is provided, be sure that it exists as a field in your form. If a function is provided, be sure to return either a string or Array<string>',
            );
            return;
        }

        const g = resolveBindings(value, bindings, 'groups');
        if (bindings.groups && !g) {
            notificationError(
                'Cannot determine groups binding',
                'Groups binding cannot be determined. If a field name is provided, be sure that it exists as a field in your form. If a function is provided, be sure to return either a string or Array<string>',
            );
            return;
        }

        let groups: string[] = [];
        if (typeof g === 'string') {
            groups.push(g);
        } else if (Array.isArray(g)) {
            groups = [...groups, ...g];
        }

        const b = resolveBindings(value, bindings, 'behaviour');
        if (bindings.behaviour && !b) {
            notificationError(
                'Cannot determine behaviour binding',
                'Behaviour binding cannot be determined. If a field name is provided, be sure that it exists as a field in your form. If a function is provided, be sure to return either a string',
            );
            return;
        }

        let behaviour: Behaviour = 'modifiable';
        if (b) {
            behaviour = b;
        }

        return { locale, groups, behaviour };
    };
}

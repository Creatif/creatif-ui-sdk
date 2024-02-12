import useNotification from '@app/systems/notifications/useNotification';
import type { Behaviour } from '@root/types/api/shared';
import type { Bindings } from '@root/types/forms/forms';
import type { FieldValues } from 'react-hook-form';
import { Runtime } from '@app/runtime/Runtime';
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
                name: '',
                groups: [],
                locale: '',
                behaviour: undefined,
            };
        }

        console.log(value, bindings);
        const locale = resolveBindings(value, bindings, 'creatif_locale');
        if (!bindings.locale && !locale) {
            notificationError(
                'Error choosing a locale',
                'Locale binding cannot be determined. If a form field is not provided, <string>',
            );
            return;
        }

        const name = resolveBindings<T>(value, bindings, 'name');
        if (!name) {
            notificationError(
                'Cannot determine name binding',
                'You haven\'t provided any binding for the name of the variable. Add the \'binding\' property to your form.',
            );
            return;
        }

        const g = resolveBindings(value, bindings, 'creatif_groups');
        if (!bindings.groups && !g) {
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

        const b = resolveBindings(value, bindings, 'creatif_behaviour');
        if (!bindings.behaviour && !b) {
            notificationError(
                'Cannot determine behaviour binding',
                'Behaviour binding cannot be determined. If a field name is provided, be sure that it exists as a field in your form. If a function is provided, be sure to return either a string',
            );
            return;
        }

        let behaviour: Behaviour | undefined = undefined;
        if (b) {
            behaviour = b;
        }

        return { name, groups, behaviour };
    };
}

export function chooseLocale(fieldLocale: string, bindingLocale: string | undefined): string {
    if (bindingLocale) return bindingLocale;
    if (fieldLocale) return fieldLocale;
    return Runtime.instance.currentLocaleStorage.getLocale();
}

export function chooseGroups(fieldGroups: string[], bindingGroups: string[]): string[] | null {
    if (bindingGroups.length !== 0) return bindingGroups;
    if (fieldGroups.length !== 0) return fieldGroups;
    return null;
}

export function chooseBehaviour(field: Behaviour | undefined, binding: Behaviour | undefined): Behaviour {
    if (binding) return binding;
    if (field) return field;
    return 'modifiable';
}

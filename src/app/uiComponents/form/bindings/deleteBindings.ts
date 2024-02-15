import { behaviourField, groupsField, localeField } from '@app/uiComponents/form/bindings/bindingResolver';

export default function deleteBindings<Value>(
    value: Value,
) {
    if (value && typeof value === 'object') {
        if (Object.hasOwn(value, localeField)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            delete value[localeField];
        }

        if (Object.hasOwn(value as object, groupsField)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            delete value[groupsField];
        }

        if (Object.hasOwn(value, behaviourField)) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            delete value[behaviourField];
        }
    }
}

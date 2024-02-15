import type { BindedValues, Bindings } from '@root/types/forms/forms';
import { NameBindingResolver } from '@app/uiComponents/form/bindings/NameBindingResolver';
import { GroupsBindingResolver } from '@app/uiComponents/form/bindings/GroupsBindingResolver';
import { LocaleBindingResolver } from '@app/uiComponents/form/bindings/LocaleBindingResolver';
import { BehaviourBindingResolver } from '@app/uiComponents/form/bindings/BehaviourBindingResolver';

export const behaviourField = 'creatif_behaviour';
export const localeField = 'creatif_locale';
export const groupsField = 'creatif_groups';

export function resolveBindings<Value>(values: Value, binding: Bindings<Value>): BindedValues {
    return {
        name: (new NameBindingResolver(values, binding.name)).resolve(),
        groups: (new GroupsBindingResolver(values, binding.groups)).resolve(),
        locale: (new LocaleBindingResolver(values, binding.locale)).resolve(),
        behaviour: (new BehaviourBindingResolver(values, binding.behaviour)).resolve(),
    }
}
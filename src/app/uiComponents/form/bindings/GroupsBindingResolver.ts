import type { GroupBinding } from '@root/types/forms/forms';
import { groupsField } from '@app/uiComponents/form/bindings/bindingResolver';

export class GroupsBindingResolver<Value> {
    private readonly key = groupsField;
    constructor(
        private values: Value,
        private bindFn: GroupBinding<Value> | undefined,
    ) {}

    resolve(): string[] | null {
        if (this.bindFn) {
            return this.bindFn(this.values);
        }

        if (!this.bindFn) {
            if (
                this.values &&
                typeof this.values === 'object' &&
                this.key in this.values &&
                Array.isArray(this.values[this.key]) &&
                (this.values[this.key] as unknown[]).every((t) => typeof t === 'string')
            ) {
                return this.values[this.key] as string[];
            }
        }

        return null;
    }
}

import type { NameBinding } from '@root/types/forms/forms';

export class NameBindingResolver<Value> {
    constructor(
        private values: Value,
        private bindFn: NameBinding<Value>,
    ) {}

    resolve(): string | undefined {
        if (!this.bindFn) return undefined;

        return this.bindFn(this.values);
    }
}

import type { LocaleBinding } from '@root/types/forms/forms';
import { localeField } from '@app/uiComponents/form/bindings/bindingResolver';

interface CastType {
    [key: string]: unknown;
}

export class LocaleBindingResolver<Value> {
    private key = localeField;
    constructor(private values: Value, private bindFn: LocaleBinding<Value> | undefined) {}

    resolve(): string {
        if (this.bindFn) {
            return this.bindFn(this.values);
        }

        if (!this.bindFn) {
            if (this.values && typeof this.values === 'object' && this.key in this.values && typeof (this.values as CastType)[this.key] === 'string') {
                return (this.values as CastType)[this.key] as string;
            }
        }

        return 'eng';
    }
}